@php $canvasIsCombo = ($product->combo_deal && $product->comboDeals->count() > 0); @endphp
<div class="border-bottom pb-15px px-30px">
    <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
            <h6 class="d-flex align-items-center fs-16 fw-700 text-dark mr-2 mt-0 mb-0 p-0"
                title="{{ $product->getTranslation('name') }}">
                <span class="text-truncate-1  mr-2">{{ $product->getTranslation('name') }}</span>
            </h6>
        </div>
        <button onclick="closeOffcanvas()" class="border-0 p-0 bg-transparent">
            <i class="la la-close fs-24 text-gray hov-text-blue has-transition"></i>
        </button>
    </div>
</div>
<div class="right-offcanvas-body position-absolute h-100 px-30px pt-1">
    <form id="option-choice-form">
        @csrf
        <div class="row">
            <!-- Product Image gallery -->
            <div class="col-12">
                <div class="w-100 h-300px overflow-hidden rounded-2">
                    <img src="{{ get_image($product->thumbnail) }}" class="img-fit w-100 h-100" alt="{{ $product->getTranslation('name') }}">
                </div>
            
            </div>

            <!-- Product Info -->
            <div class="col-12">
                <div class="text-left">
                    <!-- Product Price & Club Point -->
                    @if ($canvasIsCombo)
                        @php
                            $maxComboTier = $product->comboDeals->sortByDesc('min_qty')->first();
                            $comboPerPc = round($maxComboTier->price / $maxComboTier->min_qty);
                        @endphp
                        <div class="row no-gutters mt-3">
                            <div class="col-12 mb-1">
                                <div class="text-secondary fs-16 fw-600">{{ translate('Pricing') }}</div>
                            </div>
                            <div class="col-12">
                                <div class="bg-light rounded-2 px-20px py-20px">
                                    <strong class="fs-16 fw-700 text-primary">
                                        {{ get_system_default_currency()->symbol }}{{ number_format($comboPerPc, 0) }}
                                    </strong>
                                    <del class="fs-14 opacity-60 ml-2">
                                        {{ home_price($product) }}
                                    </del>
                                    @if ($product->unit != null)
                                        <span class="opacity-70 ml-1">/{{ $product->getTranslation('unit') }}</span>
                                    @endif
                                    <span class="fs-11 fw-600 text-success ml-2 border border-success rounded px-1">for {{ $maxComboTier->min_qty }} pcs combo</span>
                                </div>
                            </div>
                        </div>
                    @elseif (home_price($product) != home_discounted_price($product))
                        <div class="row no-gutters mt-3">
                            <div class="col-12 mb-1">
                                <div class="text-secondary fs-16 fw-600">{{ translate('Pricing') }}</div>
                            </div>
                            <div class="col-12">
                                <div class="bg-light rounded-2 px-20px py-20px">
                                    <div class="">
                                        <strong class="fs-16 fw-700 text-primary">
                                            {{ home_discounted_price($product) }}
                                        </strong>
                                        <del class="fs-14 opacity-60 ml-2">
                                            {{ home_price($product) }}
                                        </del>
                                        @if ($product->unit != null)
                                            <span class="opacity-70 ml-1">/{{ $product->getTranslation('unit') }}</span>
                                        @endif
                                    </div>


                                    <div class="d-flex align-items-center mt-2">
                                        @if (discount_in_percentage($product) > 0)
                                        <span
                                                class="fs-12 fw-bold text-white py-1 py-md-2 px-10px discount-badge rounded-1"
                                                style="padding-top:2px;padding-bottom:2px;">-{{ discount_in_percentage($product) }}%</span>
                                        @endif

                                        <!-- Club Point -->
                                        @if (addon_is_activated('club_point') && $product->earn_point > 0)
                                            <div class="ml-1 d-flex justify-content-center align-items-center opacity-80 py-1 py-md-2 px-10px bg-soft-light rounded-1">
                                                <span class="fs-12 fw-bold text-orange text-uppercase">{{ translate('Club Point') }}:
                                                    {{ $product->earn_point }}</span>
                                            </div>
                                        @endif
                                    </div>

                                </div>
                            </div>
                        </div>
                    @else
                        <div class="row no-gutters mt-3">
                            <div class="col-12 mb-1">
                                <div class="text-secondary fs-16 fw-600">{{ translate('Pricing') }}</div>
                            </div>
                            <div class="col-12">
                                <div class="bg-light rounded-2 px-20px py-20px">
                                    <strong class="fs-16 fw-700 text-primary">
                                        {{ home_discounted_price($product) }}
                                    </strong>
                                    @if ($product->unit != null)
                                        <span class="opacity-70">/{{ $product->unit }}</span>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @endif

                    @php
                        $qty = 0;
                        foreach ($product->stocks as $key => $stock) {
                            $qty += $stock->qty;
                        }
                    @endphp

                    <!-- Product Choice options form -->
                    <div class="d-flex align-items-center justify-content-between mt-3 mb-1">
                        <div class="d-inline-flex align-items-center">
                            <h5 class="fs-16 fw-600 text-secondary mr-2 mb-0">{{ translate('Variation') }}</h5>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                                    width="20px" fill="#9d9da6">
                                    <path
                                        d="M454-298h52v-230h-52v230Zm25.79-290.46q11.94 0 20.23-8.08 8.29-8.08 8.29-20.02t-8.08-20.23q-8.08-8.28-20.02-8.28T459.98-637q-8.29 8.08-8.29 20.02t8.08 20.23q8.08 8.29 20.02 8.29Zm.55 472.46q-75.11 0-141.48-28.42-66.37-28.42-116.18-78.21-49.81-49.79-78.25-116.09Q116-405.01 116-480.39q0-75.38 28.42-141.25t78.21-115.68q49.79-49.81 116.09-78.25Q405.01-844 480.39-844q75.38 0 141.25 28.42t115.68 78.21q49.81 49.79 78.25 115.85Q844-555.45 844-480.34q0 75.11-28.42 141.48-28.42 66.37-78.21 116.18-49.79 49.81-115.85 78.25Q555.45-116 480.34-116Zm-.34-52q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z">
                                    </path>
                                </svg>
                            </span>
                        </div>
                        @php
                            $sizeChartId = ($product->main_category && $product->main_category->sizeChart) ? $product->main_category->sizeChart->id : 0;
                            $sizeChartName = ($product->main_category && $product->main_category->sizeChart) ? $product->main_category->sizeChart->name : null;
                        @endphp
                        @if($sizeChartId != 0)
                        <div>
                            <button type="button" onclick='showSizeChartDetail({{ $sizeChartId }}, "{{ $sizeChartName }}")' 
                                class="fs-14 fw-400 text-blue border-0 bg-transparent d-flex align-items-center hov-opacity-80 has-transition">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15.99" height="16"
                                        viewBox="0 0 15.99 16">
                                        <path id="_4" data-name="4"
                                            d="M17.988,5.988,14.676,2.675a1.17,1.17,0,0,0-.831-.345h0a1.17,1.17,0,0,0-.825.345l-.825.825h0L10.954,4.741h0L9.713,5.982h0L8.472,7.217h0L7.232,8.469h0L5.991,9.71h0L4.75,10.95h0L3.51,12.191h0l-.831.831a1.17,1.17,0,0,0,0,1.65l3.312,3.312a1.159,1.159,0,0,0,1.65,0L17.988,7.638A1.17,1.17,0,0,0,17.988,5.988ZM6.822,17.16,3.5,13.841l.392-.41,1.241,1.241a.586.586,0,1,0,.831-.825L4.745,12.607l.416-.416L6.4,13.432a.586.586,0,0,0,.831-.825L5.991,11.366l.41-.416,2.072,2.072a.586.586,0,0,0,.825-.831L7.232,10.125l.41-.416L8.888,10.95a.583.583,0,1,0,.825-.825L8.472,8.884l.416-.416L10.129,9.71a.585.585,0,1,0,.825-.825L9.713,7.638l.416-.41,2.066,2.066a.586.586,0,1,0,.831-.825L10.954,6.4l.416-.416L12.61,7.228a.586.586,0,0,0,.825-.831L12.194,5.157l.416-.416,1.235,1.247a.586.586,0,1,0,.825-.831L13.435,3.893l.41-.392,3.318,3.318Z"
                                            transform="translate(-2.338 -2.33)" fill="#0080ff"></path>
                                    </svg>
                                </span>
                                <span class="pl-1">{{translate('Size Guide')}}</span>
                            </button>
                        </div>
                        @endif
                    </div>
                    
                    <input type="hidden" name="id" value="{{ $product->id }}">
                    @if($canvasIsCombo)
                        <input type="hidden" name="is_combo" id="combo_is_combo" value="0">
                        <input type="hidden" name="combo_price" id="combo_price_input" value="">
                        <input type="hidden" name="combo_colors" id="combo_colors_input" value="">
                        @if ($product->colors && count(json_decode($product->colors)) > 0)
                            <input type="hidden" name="color" value="{{ get_single_color_name(json_decode($product->colors)[0]) }}">
                        @endif
                    @endif
                    <div class="border rounded-2 border-soft-light px-20px py-10px">
                        @if ($product->digital != 1)
                            <!-- Product Choice options -->
                            @if ($product->choice_options != null)
                                @foreach (json_decode($product->choice_options) as $key => $choice)
                                    <div class="row no-gutters border-bottom-dashed border-soft-light py-2">
                                        <div class="col-12">
                                            <div class="text-dark fs-14 fw-700">
                                                {{ get_single_attribute_name($choice->attribute_id) }}</div>
                                        </div>
                                        <div class="col-12">
                                            <div class="aiz-radio-inline">
                                                @foreach ($choice->values as $key => $value)
                                                    <label class="aiz-megabox pl-0 mr-2 my-1">
                                                        <input type="radio"
                                                            name="attribute_id_{{ $choice->attribute_id }}"
                                                            value="{{ $value }}"
                                                            @if ($key == 0) checked @endif>
                                                        <span
                                                            class="aiz-megabox-elem rounded-0 d-flex align-items-center justify-content-center py-1 px-3 rounded-1">
                                                            {{ $value }}
                                                        </span>
                                                    </label>
                                                @endforeach
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            @endif

                            {{-- COMBO TIER PILLS --}}
                            @if($canvasIsCombo)
                                @php $canvasComboDeals = $product->comboDeals; @endphp
                                <div class="mt-2 mb-2 border rounded-2 overflow-hidden"
                                     id="canvas-combo-deal-box"
                                     data-tiers="{{ $canvasComboDeals->map(fn($t) => ['qty'=>$t->min_qty,'price'=>$t->price])->toJson() }}"
                                     data-has-colors="{{ ($product->colors && count(json_decode($product->colors)) > 0) ? 1 : 0 }}">
                                    <div class="d-flex align-items-center px-3 py-2" style="background:linear-gradient(135deg,#0080fe 0%,#0056b3 100%)">
                                        <span class="fs-13 fw-bold text-white">🎁 {{ translate('Combo Deal') }}</span>
                                    </div>
                                    <div class="px-3 py-2 d-flex flex-wrap" style="gap:6px">
                                        @foreach($canvasComboDeals as $i => $tier)
                                        <div class="canvas-combo-tier-pill border rounded-2 px-2 py-1 text-center cursor-pointer"
                                             data-qty="{{ $tier->min_qty }}" data-price="{{ $tier->price }}"
                                             style="min-width:80px;cursor:pointer;{{ $i==$canvasComboDeals->count()-1 ? 'border-color:#0080fe;background:#f0f8ff;' : 'border-color:#dee2e6;' }}"
                                             onclick="canvasSelectComboPill(this, {{ $tier->min_qty }}, {{ $tier->price }})">
                                            <div class="fs-14 fw-bold text-dark">{{ get_system_default_currency()->symbol }}{{ number_format($tier->price, 0) }}</div>
                                            <div class="fs-11 text-gray">{{ $tier->min_qty }} {{ translate('pcs') }}</div>
                                            @php $per = round($tier->price / $tier->min_qty, 0); @endphp
                                            <div class="fs-10 text-blue">≈ {{ get_system_default_currency()->symbol }}{{ number_format($per, 0) }}/{{ translate('pc') }}</div>
                                        </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endif

                            <!-- Color -->
                            @if ($product->colors && count(json_decode($product->colors)) > 0)
                                <div class="row no-gutters py-2">
                                    <div class="col-12 mb-1">
                                        <div class="text-dark fs-14 fw-700">{{ translate('Color') }}
                                            @if($canvasIsCombo)
                                                <span class="fs-11 text-blue fw-400 ml-2" id="canvas-combo-color-hint" style="display:none">{{ translate('Select') }} <span id="canvas-combo-color-limit">1</span> {{ translate('color(s)') }} — <span id="canvas-combo-color-selected">0</span> {{ translate('selected') }}</span>
                                            @endif
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        @if($canvasIsCombo)
                                        {{-- COMBO: multi-select with per-color qty --}}
                                        <div class="d-flex flex-wrap" id="canvas-combo-color-wrap" style="gap:4px">
                                            @foreach (json_decode($product->colors) as $key => $color)
                                            @php $cName = get_single_color_name($color); @endphp
                                            <div class="aiz-megabox rounded-1 bg-white mb-1 d-inline-block position-relative"
                                                 data-color="{{ $cName }}" data-hex="{{ $color }}"
                                                 style="vertical-align:top;">
                                                <input type="checkbox" class="canvas-combo-cb" value="{{ $cName }}">
                                                <div class="d-flex align-items-center aiz-megabox-elem px-10px cursor-pointer"
                                                     onclick="canvasComboColorToggle(this.parentElement)">
                                                    <span class="d-inline-block rounded-circle" style="width:15px;height:15px;background:{{ $color }};"></span>
                                                    <span class="fs-12 text-dark pl-1 pr-1">{{ $cName }}</span>
                                                </div>
                                                <div class="canvas-combo-qty-wrap d-none" style="padding:3px 6px 5px;">
                                                    <div class="d-flex align-items-center justify-content-center" style="gap:0;">
                                                        <button type="button" class="btn btn-sm p-0 border-0 lh-1" style="width:20px;height:20px;font-size:14px;font-weight:700;background:#f0f0f0;border-radius:4px;color:#333;" onclick="canvasComboColorQty(this.closest('.aiz-megabox'),-1)">−</button>
                                                        <span class="canvas-combo-qty-val fw-700 fs-12 text-center" style="min-width:20px;">1</span>
                                                        <button type="button" class="btn btn-sm p-0 border-0 lh-1" style="width:20px;height:20px;font-size:14px;font-weight:700;background:#f0f0f0;border-radius:4px;color:#333;" onclick="canvasComboColorQty(this.closest('.aiz-megabox'),1)">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                            @endforeach
                                        </div>
                                        @else
                                        {{-- NORMAL: radio --}}
                                        <div class="aiz-radio-inline">
                                            @foreach (json_decode($product->colors) as $key => $color)
                                                <label class="aiz-megabox pl-0 mr-2 mb-0" data-toggle="tooltip" data-title="{{ get_single_color_name($color) }}">
                                                    <input type="radio" name="color" value="{{ get_single_color_name($color) }}" @if ($key == 0) checked @endif>
                                                    <span class="aiz-megabox-elem rounded-0 d-flex align-items-center justify-content-center p-1 rounded-1">
                                                        <span class="size-25px d-inline-block rounded" style="background: {{ $color }};"></span>
                                                    </span>
                                                </label>
                                            @endforeach
                                        </div>
                                        @endif
                                    </div>
                                </div>
                            @endif
                    </div>  
                    @else
                    <!-- Quantity -->
                    <input type="hidden" name="quantity" value="1">
                    @endif
                    
                </div>
            </div>
        </div>

        <div class="border-dashed border-1  border-soft-light rounded-2 overflow-hidden mt-4 mb-1 px-20px pt-15px pb-20px">
            <div class="pb-10px">
                <div>
                    <div class="d-flex flex-wrap align-items-center mb-2 mb-md-0">
                        <!-- Total Price -->
                        <div class="no-gutters mr-1 mb-2" id="chosen_price_div">
                            <div class="product-price">
                                <strong id="chosen_price" class="fs-24 fw-bold">$0.00</strong>
                            </div>

                        </div>
                    </div>
                    @if ($product->digital ==0)
                    @php
                        $qty = 0;
                        foreach ($product->stocks as $key => $stock) {
                            $qty += $stock->qty;
                        }
                    @endphp
                    <div class="d-flex flex-column">
                        <p class="m-0 fs-14 fw-semibold text-blue opacity-80">
                            @if ($product->stock_visibility_state == 'quantity')
                                <span id="available-quantity">{{ $qty }}</span> {{translate('Available')}}
                            @elseif($product->stock_visibility_state == 'text' && $qty >= 1)
                                <span id="available-quantity">{{translate('In Stock')}}</span>
                            @endif
                        </p>
                        
                        <p class="m-0 fs-14 fw-400 text-gray">{{translate('Minimum order qty')}} <span class="text-dark fw-700">{{ $product->min_qty }}</span></p>
                    </div>
                    @endif
                </div>

                <div class="mt-2">
                    <!--Quantity-->
                    <div class="d-flex align-items-center flex-wrap">
                        <span class="fs-14 fw-400 text-gray pr-20px">{{ translate('QTY') }}</span>
                        <div class="d-flex align-items-center aiz-plus-minus border border  border-soft-light rounded-1">
                            <!--Decrement-->
                            <button type="button" data-type="minus" data-field="quantity" disabled="disabled"
                                class="inc-btn bg-transparent ml-2 border-0 w-30px h-35px rounded-circle  d-flex align-items-center justify-content-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="1" viewBox="0 0 12 1">
                                    <g id="Group_38869" data-name="Group 38869" transform="translate(-1120.5 -819.5)">
                                        <rect id="Rectangle_16983" data-name="Rectangle 16983" width="1" height="12"
                                            transform="translate(1132.5 819.5) rotate(90)" fill="#9d9da6"></rect>
                                    </g>
                                </svg>
                            </button>
                            @php $defaultQty = $canvasIsCombo ? $product->comboDeals->sortByDesc('min_qty')->first()->min_qty : 1; @endphp
                            <input type="number" value="{{ $defaultQty }}" name="quantity" min="1" placeholder="1"
                                max="10" lang="en"
                                class="fs-16 text-dark fw-600 text-center w-40px h-100 mt-1 border-0 mx-2 input-number">
                            <!--Incrrement-->
                            <button type="button" data-type="plus" data-field="quantity"
                                class="dec-btn bg-transparent mr-2 border-0 w-30px h-35px rounded-circle d-flex align-items-center justify-content-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                                    <g id="Group_38868" data-name="Group 38868" transform="translate(-1124.5 -814)">
                                        <rect id="Rectangle_16982" data-name="Rectangle 16982" width="1" height="12"
                                            transform="translate(1130 814)" fill="#9d9da6"></rect>
                                        <rect id="Rectangle_16983" data-name="Rectangle 16983" width="1" height="12"
                                            transform="translate(1136.5 819.5) rotate(90)" fill="#9d9da6"></rect>
                                    </g>
                                </svg>

                            </button>
                        </div>
                    </div>

                     @if (get_setting('whatsapp_order') == 1)
                        @php
                            $storeName = env('APP_NAME');
                            $productTitle = $product->getTranslation('name');
                            $productUrl = URL::to('/product') . '/' . $product->slug;
                            $template = get_setting('order_messege_template');
                            $message = str_replace(
                                ['[[storeName]]', '[[productTitle]]', '[[productUrl]]'],
                                [$storeName, $productTitle, $productUrl],
                                $template
                            );
                            $whatsappNumber = preg_replace('/[^0-9]/', '', env('WHATSAPP_NUMBER'));
                            $whatsappUrl = "https://wa.me/{$whatsappNumber}?text=" . urlencode($message);
                        @endphp
                        @if (($product->added_by == 'seller' && get_setting('whatsapp_order_seller_prods') == 1) || ($product->added_by == 'admin'))

                        <div class="order-via-whatsapp mt-2">
                            <a href="{{ $whatsappUrl }}" target="_blank"class="d-inline-flex align-items-center  animate-underline-green has-transition">
                                <i class="lab la-whatsapp fs-20"></i>
                                <span class="fs-14 fw-400 pl-1">{{ translate('Order Via WhatsApp') }}</span>
                            </a>
                        </div>
                        @endif
                    @endif      
                </div>
            </div>

            <div class="selected-variations border-top-dashed pt-10px">
                <p class="mb-2 fs-14 fw-semibold text-dark d-flex align-items-center">
                    <span class="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path id="_48116925ae3a82eb626852f6dfabe743" data-name="48116925ae3a82eb626852f6dfabe743"
                                d="M56,48a8,8,0,1,0,8,8A8,8,0,0,0,56,48ZM54.765,58.835a.53.53,0,0,1-.338.169.555.555,0,0,1-.342-.173l-2.154-2.154.685-.685,1.815,1.815,4.8-4.835.673.7Z"
                                transform="translate(-48 -48)" fill="#007bff"></path>
                        </svg>
                    </span>
                    <span class="d-block mt-1 ml-2">{{translate('Selected Product Summery')}}</span>
                </p>
                <span class="fs-14 fw-400 text-gray">{{ strlen($product->getTranslation('name')) > 120 ? substr($product->getTranslation('name'), 0, 120).'...': $product->getTranslation('name')}} - <span id="selected_variant"></span></span>
            </div>
        </div>
    </form>

    <div class="pb-5 mb-5"></div>


</div>

<div class="w-100 px-30px  position-absolute bottom-0 bg-white right-offcavas-footer pt-20px pb-20px border-top border-soft-light" style="box-shadow: none!important;">
    <div class="d-flex flex-wrap flex-md-nowrap align-items-center mb-2">
        <button type="button" @if (Auth::check() || get_Setting('guest_checkout_activation')==1) onclick="buyNow()" @else onclick="showLoginModal()" @endif class="text-white border-0 rounded-1 fs-14 fw-bold bg-black hov-opacity-70 has-transition py-15px px-20px w-100 mb-2 mb-md-0 mr-0 mr-md-2 buy-now">{{ translate('Buy Now') }}</button>
        <button id="added_to_cart_btn" type="button" @if (Auth::check() || get_Setting('guest_checkout_activation') == 1) onclick="addToCart()" @else onclick="showLoginModal()" @endif class="text-blue border-0 rounded-1 fs-14 fw-bold bg-soft-blue hov-bg-blue hov-text-white py-15px px-20px w-100 add-to-cart">{{ translate('Add to cart') }} <span id="add_to_cart_count"></span></button>
    </div>
    <div class="">
        <button type="button" class="out-of-stock fw-600 d-none text-white bg-light bg-soft-white border-0 rounded-1 fs-14 fw-bold hov-opacity-70 has-transition py-15px px-20px w-100" disabled>
                <i class="la la-cart-arrow-down"></i> {{ translate('Out of Stock') }}
        </button>
    </div>
    <div class="text-right">
        <a href="{{route('product', $product->slug)}}" class="fs-14 fw-400 text-gray hov-text-blue animate-underline-blue has-transition border-0 py-1">
            <span>{{translate('Go to Product details page')}}</span>
            <i class="las la-angle-right ml-1"></i>
        </a>
    </div>
</div>

<script type="text/javascript">
    $('#option-choice-form input').on('change', function() {
        getVariantPrice();
    });

    // ===== COMBO DEAL JS FOR CANVAS =====
    (function() {
        var box = document.getElementById('canvas-combo-deal-box');
        if (!box) return;
        var tiers = JSON.parse(box.dataset.tiers || '[]');
        var hasColors = parseInt(box.dataset.hasColors || 0);
        tiers.sort(function(a,b){ return parseInt(a.qty) - parseInt(b.qty); });
        var colorCounts = {};
        var sym = '{{ get_system_default_currency()->symbol }}';

        function fmt(n) { return sym + Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
        function calcPrice(qty) {
            qty = parseInt(qty)||1; var best=null;
            for(var i=0;i<tiers.length;i++){if(parseInt(tiers[i].qty)<=qty)best=tiers[i];}
            if(!best) return {isCombo:false};
            var tq=parseInt(best.qty),tp=parseFloat(best.price);
            if(tq===qty) return {isCombo:true,tier:best,total:tp};
            return {isCombo:true,tier:best,total:Math.round(tp/tq*qty*100)/100};
        }
        function applyCombo(qty) {
            var r=calcPrice(qty); if(!r.isCombo) return;
            var el=document.getElementById('chosen_price'); if(el) el.textContent=fmt(r.total);
        }
        function updateForm(qty) {
            var r=calcPrice(qty),ic=document.getElementById('combo_is_combo'),cp=document.getElementById('combo_price_input');
            if(!ic) return; ic.value=r.isCombo?1:0; cp.value=r.isCombo?r.total:'';
        }
        function highlightPills(qty) {
            var r=calcPrice(qty);
            document.querySelectorAll('.canvas-combo-tier-pill').forEach(function(p){
                var a=r.tier&&parseInt(p.dataset.qty)===parseInt(r.tier.qty);
                p.style.borderColor=a?'#0080fe':'#dee2e6'; p.style.background=a?'#f0f8ff':'#fff';
            });
        }
        function onQtyChange(qty) {
            qty=parseInt(qty)||1; var r=calcPrice(qty);
            if(r.isCombo) applyCombo(qty); updateForm(qty); highlightPills(qty); updateColorLimit(qty); enforceColorLimit(qty);
        }
        window.canvasSelectComboPill = function(el,qty) {
            var qi=document.querySelector('#option-choice-form input[name=quantity]'); if(qi) qi.value=qty; onQtyChange(qty);
        };
        function getLimit() { var qi=document.querySelector('#option-choice-form input[name=quantity]'); return parseInt(qi?qi.value:1)||1; }
        function getTotal() { var t=0; for(var k in colorCounts) t+=colorCounts[k]; return t; }
        function findHighest(exclude) { var mn=null,mc=0; for(var k in colorCounts){if(k===exclude)continue;if(colorCounts[k]>mc){mc=colorCounts[k];mn=k;}} return mn; }

        function updateColorLimit(qty) {
            var h=document.getElementById('canvas-combo-color-hint'),l=document.getElementById('canvas-combo-color-limit');
            if(h){h.style.display='inline';if(l)l.textContent=qty;} syncAllCanvasColors();
        }
        function enforceColorLimit(nq) {
            while(getTotal()>nq){ var hi=findHighest(null); if(!hi)break; colorCounts[hi]--; if(colorCounts[hi]<=0)delete colorCounts[hi]; }
            syncAllCanvasColors();
        }
        function syncCanvasColor(cn) {
            var box=document.querySelector('#canvas-combo-color-wrap .aiz-megabox[data-color="'+cn+'"]'); if(!box)return;
            var c=colorCounts[cn]||0,cb=box.querySelector('.canvas-combo-cb'),qw=box.querySelector('.canvas-combo-qty-wrap'),qv=box.querySelector('.canvas-combo-qty-val');
            if(c>0){if(cb)cb.checked=true;if(qw)qw.classList.remove('d-none');if(qv)qv.textContent=c;}
            else{if(cb)cb.checked=false;if(qw)qw.classList.add('d-none');if(qv)qv.textContent='0';}
        }
        function syncAllCanvasColors() {
            document.querySelectorAll('#canvas-combo-color-wrap .aiz-megabox[data-color]').forEach(function(b){syncCanvasColor(b.dataset.color);});
            var t=getTotal(); var el=document.getElementById('canvas-combo-color-selected'); if(el) el.textContent=t;
            var colors=[]; for(var n in colorCounts){for(var i=0;i<colorCounts[n];i++)colors.push(n);}
            var inp=document.getElementById('combo_colors_input'); if(inp) inp.value=JSON.stringify(colors);
        }
        window.canvasComboColorToggle = function(box) {
            if(!hasColors)return; var cn=box.dataset.color,curr=colorCounts[cn]||0,limit=getLimit();
            if(curr>0){delete colorCounts[cn];syncAllCanvasColors();return;}
            if(getTotal()>=limit){var hi=findHighest(cn);if(hi){colorCounts[hi]--;if(colorCounts[hi]<=0)delete colorCounts[hi];}else return;}
            colorCounts[cn]=1; syncAllCanvasColors();
        };
        window.canvasComboColorQty = function(box, delta) {
            if(!hasColors)return; var cn=box.dataset.color,curr=colorCounts[cn]||0,nv=curr+delta,limit=getLimit();
            if(nv<=0){delete colorCounts[cn];syncAllCanvasColors();return;}
            if(delta>0&&getTotal()>=limit){var hi=findHighest(cn);if(hi){colorCounts[hi]--;if(colorCounts[hi]<=0)delete colorCounts[hi];}else return;}
            colorCounts[cn]=nv; syncAllCanvasColors();
        };
        function validateColors() {
            var ic=document.getElementById('combo_is_combo');
            if(!ic||parseInt(ic.value)!==1||!hasColors) return true;
            var qi=document.querySelector('#option-choice-form input[name=quantity]'),qty=parseInt(qi?qi.value:1)||1,t=0;
            for(var k in colorCounts)t+=colorCounts[k];
            if(t<qty){alert('Please select '+qty+' color(s). You selected '+t+'.');return false;}
            return true;
        }
        var origAdd=window.addToCart;
        window.addToCart=function(){if(!validateColors())return;if(typeof origAdd==='function')origAdd.apply(this,arguments);};
        var origBuy=window.buyNow;
        window.buyNow=function(){if(!validateColors())return;if(typeof origBuy==='function')origBuy.apply(this,arguments);};
        document.addEventListener('click',function(e){var btn=e.target.closest('[data-type="plus"],[data-type="minus"]');if(!btn)return;setTimeout(function(){var qi=document.querySelector('#option-choice-form input[name=quantity]');onQtyChange(parseInt(qi?qi.value:1)||1);},30);});
        $(document).ajaxComplete(function(){var qi=document.querySelector('#option-choice-form input[name=quantity]');var qty=parseInt(qi?qi.value:1)||1;var r=calcPrice(qty);if(r.isCombo)applyCombo(qty);});
        var qi=document.querySelector('#option-choice-form input[name=quantity]');if(qi)onQtyChange(parseInt(qi.value)||1);
    })();
</script>
