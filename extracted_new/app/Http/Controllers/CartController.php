<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Carrier;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Cart;
use App\Models\Country;
use App\Services\FacebookConversionService;
use Auth;
use App\Utility\CartUtility;
use Session;
use Cookie;

class CartController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->user() != null) {
            $user_id = Auth::user()->id;
            if ($request->session()->get('temp_user_id')) {
                Cart::where('temp_user_id', $request->session()->get('temp_user_id'))
                    ->update(
                        [
                            'user_id' => $user_id,
                            'temp_user_id' => null
                        ]
                    );

                Session::forget('temp_user_id');
            }
            $carts = Cart::where('user_id', $user_id)->get();
        } else {
            $temp_user_id = $request->session()->get('temp_user_id');
            $carts = ($temp_user_id != null) ? Cart::where('temp_user_id', $temp_user_id)->get() : [];
        }
        if (count($carts) > 0) {
            $carts->toQuery()->update(['shipping_cost' => 0]);
            $carts = $carts->fresh();
        }

        return view('frontend.view_cart', compact('carts'));
    }

    public function showCartModal(Request $request)
    {
        $product = Product::find($request->id);
        return view('frontend.partials.cart.addToCart', compact('product'));
    }

    public function selectVariantCanvas(Request $request)
    {
        $product = Product::find($request->id);
        return view('frontend.partials.cart.selectVariantCanvas', compact('product'));
    }


    public function showCartModalAuction(Request $request)
    {
        $product = Product::find($request->id);
        return view('auction.frontend.addToCartAuction', compact('product'));
    }

    public function addToCart(Request $request)
    {
        $authUser = auth()->user();
        if($authUser != null) {
            $user_id = $authUser->id;
            $data['user_id'] = $user_id;
            $carts = Cart::where('user_id', $user_id)->get();
        } else {
            if($request->session()->get('temp_user_id')) {
                $temp_user_id = $request->session()->get('temp_user_id');
            } else {
                $temp_user_id = bin2hex(random_bytes(10));
                $request->session()->put('temp_user_id', $temp_user_id);
            }
            $data['temp_user_id'] = $temp_user_id;
            $carts = Cart::where('temp_user_id', $temp_user_id)->get();
        }

        $check_auction_in_cart = CartUtility::check_auction_in_cart($carts);
        $product = Product::find($request->id);
        $carts = array();

        if($check_auction_in_cart && $product->auction_product == 0) {
            return array(
                'status' => 0,
                'cart_count' => count($carts),
                'modal_view' => view('frontend.partials.cart.removeAuctionProductFromCart')->render(),
                'nav_cart_view' => view('frontend.partials.cart.cart')->render(),
            );
        }

        $quantity = $request['quantity'];

        if ($quantity < $product->min_qty) {
            return array(
                'status' => 0,
                'cart_count' => count($carts),
                'modal_view' => view('frontend.partials.minQtyNotSatisfied', ['min_qty' => $product->min_qty])->render(),
                'nav_cart_view' => view('frontend.partials.cart.cart')->render(),
            );
        }

        // ===== COMBO DEAL LOGIC =====
        $isCombo      = $request->input('is_combo', 0);
        $comboPrice   = $request->input('combo_price', null);
        $comboColors  = $request->input('combo_colors', null);

        //check the color enabled or disabled for the product
        $str = CartUtility::create_cart_variant($product, $request->all());

        // For combo: use a unique variation key so it is a separate cart line
        if ($isCombo) {
            $str = 'combo_' . $quantity . ($str ? '_' . $str : '');
        }

        $product_stock = $product->stocks->where('variant', $isCombo ? ltrim(str_replace('combo_'.$quantity.'_', '', $str), '_') : $str)->first()
                       ?? $product->stocks->first();

        if($authUser != null) {
            $user_id = $authUser->id;
            $cart = Cart::firstOrNew([
                'variation'  => $str,
                'user_id'    => $user_id,
                'product_id' => $request['id']
            ]);
        } else {
            $temp_user_id = $request->session()->get('temp_user_id');
            $cart = Cart::firstOrNew([
                'variation'   => $str,
                'temp_user_id'=> $temp_user_id,
                'product_id'  => $request['id']
            ]);
        }

        if ($cart->exists && $product->digital == 0) {
            if ($product->auction_product == 1 && ($cart->product_id == $product->id)) {
                return array(
                    'status' => 0,
                    'cart_count' => count($carts),
                    'modal_view' => view('frontend.partials.cart.auctionProductAlredayAddedCart')->render(),
                    'nav_cart_view' => view('frontend.partials.cart.cart')->render(),
                );
            }
            if ($product_stock && $product_stock->qty < $cart->quantity + $request['quantity']) {
                return array(
                    'status' => 0,
                    'cart_count' => count($carts),
                    'modal_view' => view('frontend.partials.outOfStockCart')->render(),
                    'nav_cart_view' => view('frontend.partials.cart.cart')->render(),
                );
            }
            $quantity = $cart->quantity + $request['quantity'];
        }

        // Price calculation
        if ($isCombo && $comboPrice !== null) {
            // Combo price is total for the entire combo quantity
            $price = round(floatval($comboPrice) / intval($request['quantity']), 2);
        } else {
            $price = CartUtility::get_price($product, $product_stock, $request->quantity);
        }

        $tax = CartUtility::tax_calculation($product, $price);

        CartUtility::save_cart_data($cart, $product, $price, $tax, $quantity);

        // Save combo_colors if combo
        if ($isCombo && $comboColors !== null) {
            $cart->combo_colors = $comboColors;
            $cart->save();
        }

        if(get_setting('facebook_pixel_capi') == 1){
            $eventId = 'atc_' . $cart->id . '_' . time();
            $fb = new FacebookConversionService();
            $fb->sendAddToCart($product, $price, $eventId);
        }

        if($authUser != null) {
            $user_id = $authUser->id;
            $carts = Cart::where('user_id', $user_id)->get();
        } else {
            $temp_user_id = $request->session()->get('temp_user_id');
            $carts = Cart::where('temp_user_id', $temp_user_id)->get();
        }

        return array(
            'status' => 1,
            'cart_count' => count($carts),
            'modal_view' => view('frontend.partials.cart.addedToCart', compact('product', 'cart'))->render(),
            'nav_cart_view' => view('frontend.partials.cart.cart')->render(),
        );
    }

    //removes from Cart
    public function removeFromCart(Request $request)
    {
        Cart::destroy($request->id);
        $authUser = auth()->user();
        if ($authUser != null) {
            $user_id = $authUser->id;
            $carts = Cart::where('user_id', $user_id)->get();
        } else {
            $temp_user_id = $request->session()->get('temp_user_id');
            $carts = Cart::where('temp_user_id', $temp_user_id)->get();
        }

        return array(
            'cart_count' => count($carts),
            'cart_view' => view('frontend.partials.cart.cart_details', compact('carts'))->render(),
            'nav_cart_view' => view('frontend.partials.cart.cart')->render(),
        );
    }

    //updated the quantity for a cart item
    public function updateQuantity(Request $request)
    {
        $cartItem = Cart::findOrFail($request->id);

        if ($cartItem['id'] == $request->id) {
            $product = Product::find($cartItem['product_id']);
            $isComboItem = preg_match('/^combo_\d+/', $cartItem['variation'] ?? '');

            // Strip combo prefix from variation for stock lookup
            $variantStr = $cartItem['variation'];
            if (preg_match('/^combo_\d+_(.+)$/', $variantStr, $m)) {
                $variantStr = $m[1];
            }
            $product_stock = $product->stocks->where('variant', $variantStr)->first()
                           ?? $product->stocks->first();
            $stockQty = $product_stock ? $product_stock->qty : 0;

            // Update quantity if within stock limits
            if ($stockQty >= $request->quantity && $request->quantity >= $product->min_qty) {
                $cartItem['quantity'] = $request->quantity;
            }

            if ($isComboItem && $product->combo_deal) {
                // ── COMBO: recalculate price based on new qty ──
                // Same logic as JS calcPrice(): find best tier where min_qty <= newQty
                $newQty = $cartItem['quantity'];
                $bestTier = $product->getComboPrice($newQty);

                if ($bestTier) {
                    // perUnit = tier_price / tier_min_qty (matches JS calcPrice)
                    $price = round($bestTier->price / $bestTier->min_qty, 2);
                } else {
                    // No combo tier (e.g. qty=1) → regular discounted price
                    $price = $product_stock ? $product_stock->price : 0;
                    if ($product->discount_start_date == null ||
                        (strtotime(date('d-m-Y H:i:s')) >= $product->discount_start_date &&
                         strtotime(date('d-m-Y H:i:s')) <= $product->discount_end_date)) {
                        if ($product->discount_type == 'percent') {
                            $price -= ($price * $product->discount) / 100;
                        } elseif ($product->discount_type == 'amount') {
                            $price -= $product->discount;
                        }
                    }
                }

                // Trim combo colors if qty decreased (don't add new colors on increase)
                $comboColors = json_decode($cartItem->combo_colors ?? '[]', true);
                if (is_array($comboColors) && count($comboColors) > $newQty) {
                    $comboColors = array_slice($comboColors, 0, $newQty);
                    $cartItem->combo_colors = json_encode($comboColors);
                }

                // Update variation key to reflect new qty
                $cartItem['variation'] = 'combo_' . $newQty . '_' . $variantStr;

            } else {
                // Non-combo: regular price calculation
                $price = $product_stock ? $product_stock->price : 0;
                if ($product->discount_start_date == null ||
                    (strtotime(date('d-m-Y H:i:s')) >= $product->discount_start_date &&
                     strtotime(date('d-m-Y H:i:s')) <= $product->discount_end_date)) {
                    if ($product->discount_type == 'percent') {
                        $price -= ($price * $product->discount) / 100;
                    } elseif ($product->discount_type == 'amount') {
                        $price -= $product->discount;
                    }
                }

                if ($product->wholesale_product && $product_stock) {
                    $wholesalePrice = $product_stock->wholesalePrices->where('min_qty', '<=', $request->quantity)->where('max_qty', '>=', $request->quantity)->first();
                    if ($wholesalePrice) {
                        $price = $wholesalePrice->price;
                    }
                }
            }

            $cartItem['price'] = $price;
            $cartItem->save();
        }

        if (auth()->user() != null) {
            $user_id = Auth::user()->id;
            $carts = Cart::where('user_id', $user_id)->get();
        } else {
            $temp_user_id = $request->session()->get('temp_user_id');
            $carts = Cart::where('temp_user_id', $temp_user_id)->get();
        }

        return array(
            'cart_count' => count($carts),
            'cart_view' => view('frontend.partials.cart.cart_details', compact('carts'))->render(),
            'nav_cart_view' => view('frontend.partials.cart.cart')->render(),
        );
    }

    public function updateCartStatus(Request $request)
    {
        $product_ids = $request->product_id;

        if (auth()->user() != null) {
            $user_id = Auth::user()->id;
            $carts = Cart::where('user_id', $user_id)->get();
        } else {
            $temp_user_id = $request->session()->get('temp_user_id');
            $carts = Cart::where('temp_user_id', $temp_user_id)->get();
        }

        $coupon_applied = $carts->toQuery()->where('coupon_applied', 1)->first();
        if($coupon_applied != null){
            $owner_id = $coupon_applied->owner_id;
            $coupon_code = $coupon_applied->coupon_code;
            $user_carts = $carts->toQuery()->where('owner_id', $owner_id)->get();
            $coupon_discount = $user_carts->toQuery()->sum('discount');
            $user_carts->toQuery()->update(
                [
                    'discount' => 0.00,
                    'coupon_code' => '',
                    'coupon_applied' => 0
                ]
            );
        }

        $carts->toQuery()->update(['status' => 0]);
        if($product_ids != null){
            if($coupon_applied != null){
                $active_user_carts = $user_carts->toQuery()->whereIn('product_id', $product_ids)->get();
                if (count($active_user_carts) > 0) {
                    $active_user_carts->toQuery()->update(
                        [
                            'discount' => $coupon_discount / count($active_user_carts),
                            'coupon_code' => $coupon_code,
                            'coupon_applied' => 1
                        ]
                    );
                }
            }

            $carts->toQuery()->whereIn('product_id', $product_ids)->update(['status' => 1]);
        }
        $carts = $carts->fresh();

        return view('frontend.partials.cart.cart_details', compact('carts'))->render();
    }
}
