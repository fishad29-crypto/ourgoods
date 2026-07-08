@php $popupIsCombo = ($product->combo_deal && $product->comboDeals->count() > 0); @endphp
<div class="modal-body px-4 py-5 c-scrollbar-light">
    <div class="row">
        <!-- Product Image gallery -->
        <div class="col-lg-6">
            <div class="row gutters-10 flex-row-reverse">
                @php
                    $photos = explode(',',$product->photos);
                @endphp
                <div class="col">
                    <div class="aiz-carousel product-gallery" data-nav-for='.product-gallery-thumb' data-fade='true' data-auto-height='true'>
                        @foreach ($photos as $key => $photo)
                        <div class="carousel-box img-zoom rounded-0">
                            <img class="img-fluid lazyload"
                                src="{{ static_asset('assets/img/placeholder.jpg') }}"
                                data-src="{{ uploaded_asset($photo) }}"
                                onerror="this.onerror=null;this.src='{{ static_asset('assets/img/placeholder.jpg') }}';">
                        </div>
                        @endforeach
                        @foreach ($product->stocks as $key => $stock)
                            @if ($stock->image != null)
                                <div class="carousel-box img-zoom rounded-0">
                                    <img class="img-fluid lazyload"
                                        src="{{ static_asset('assets/img/placeholder.jpg') }}"
                                        data-src="{{ uploaded_asset($stock->image) }}"
                                        onerror="this.onerror=null;this.src='{{ static_asset('assets/img/placeholder.jpg') }}';">
                                </div>
                            @endif
                        @endforeach
                    </div>
                </div>
                <div class="col-auto w-90px">
                    <div class="aiz-carousel carousel-thumb product-gallery-thumb" data-items='5' data-nav-for='.product-gallery' data-vertical='true' data-focus-select='true'>
                        @foreach ($photos as $key => $photo)
                        <div class="carousel-box c-pointer border rounded-0">
                            <img class="lazyload mw-100 size-60px mx-auto"
                                src="{{ static_asset('assets/img/placeholder.jpg') }}"
                                data-src="{{ uploaded_asset($photo) }}"
                                onerror="this.onerror=null;this.src='{{ static_asset('assets/img/placeholder.jpg') }}';">
                        </div>
                        @endforeach
                        @foreach ($product->stocks as $key => $stock)
                            @if ($stock->image != null)
                                <div class="carousel-box c-pointer border rounded-0" data-variation="{{ $stock->variant }}">
                                    <img class="lazyload mw-100 size-50px mx-auto"
                                        src="{{ static_asset('assets/img/placeholder.jpg') }}"
                                        data-src="{{ uploaded_asset($stock->image) }}"
                                        onerror="this.onerror=null;this.src='{{ static_asset('assets/img/placeholder.jpg') }}';">
                                </div>
                            @endif
                        @endforeach
                    </div>
                </div>
            </div>
        </div>

        <!-- Product Info -->
        <div class="col-lg-6">
            <div class="text-left">
                <!-- Product name -->
                <h2 class="mb-2 fs-16 fw-700 text-dark">
                    {{  $product->getTranslation('name')  }}
                </h2>

                <!-- Product Price & Club Point -->
                @if($popupIsCombo)
                    @php
                        $maxComboTier = $product->comboDeals->sortByDesc('min_qty')->first();
                        $comboPerPc = round($maxComboTier->price / $maxComboTier->min_qty);
                    @endphp
                    <div class="row no-gutters mt-3">
                        <div class="col-3">
                            <div class="text-secondary fs-14 fw-400">{{ translate('Price')}}</div>
                        </div>
                        <div class="col-9">
                            <div>
                                <strong class="fs-16 fw-700 text-primary">
                                    {{ get_system_default_currency()->symbol }}{{ number_format($comboPerPc, 0) }}
                                </strong>
                                <del class="fs-14 opacity-60 ml-2">
                                    {{ home_price($product) }}
                                </del>
                                @if($product->unit != null)
                                    <span class="opacity-70 ml-1">/{{ $product->getTranslation('unit') }}</span>
                                @endif
                            </div>
                        </div>
                    </div>
                @elseif(home_price($product) != home_discounted_price($product))
                    <div class="row no-gutters mt-3">
                        <div class="col-3">
                            <div class="text-secondary fs-14 fw-400">{{ translate('Price')}}</div>
                        </div>
                        <div class="col-9">
                            <div class="">
                                <strong class="fs-16 fw-700 text-primary">
                                    {{ home_discounted_price($product) }}
                                </strong>
                                <del class="fs-14 opacity-60 ml-2">
                                    {{ home_price($product) }}
                                </del>
                                @if($product->unit != null)
                                    <span class="opacity-70 ml-1">/{{ $product->getTranslation('unit') }}</span>
                                @endif
                                @if(discount_in_percentage($product) > 0)
                                    <span class="bg-primary ml-2 fs-11 fw-700 text-white w-35px text-center px-2" style="padding-top:2px;padding-bottom:2px;">-{{discount_in_percentage($product)}}%</span>
                                @endif
                            </div>

                            <!-- Club Point -->
                            @if (addon_is_activated('club_point') && $product->earn_point > 0)
                            <div class="mt-2 bg-secondary-base d-flex justify-content-center align-items-center px-3 py-1" style="width: fit-content;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                                    <g id="Group_23922" data-name="Group 23922" transform="translate(-973 -633)">
                                      <circle id="Ellipse_39" data-name="Ellipse 39" cx="6" cy="6" r="6" transform="translate(973 633)" fill="#fff"/>
                                      <g id="Group_23920" data-name="Group 23920" transform="translate(973 633)">
                                        <path id="Path_28698" data-name="Path 28698" d="M7.667,3H4.333L3,5,6,9,9,5Z" transform="translate(0 0)" fill="#f3af3d"/>
                                        <path id="Path_28699" data-name="Path 28699" d="M5.33,3h-1L3,5,6,9,4.331,5Z" transform="translate(0 0)" fill="#f3af3d" opacity="0.5"/>
                                        <path id="Path_28700" data-name="Path 28700" d="M12.666,3h1L15,5,12,9l1.664-4Z" transform="translate(-5.995 0)" fill="#f3af3d"/>
                                      </g>
                                    </g>
                                </svg>
                                <small class="fs-11 fw-500 text-white ml-2">{{  translate('Club Point') }}: {{ $product->earn_point }}</small>
                            </div>
                            @endif
                        </div>
                    </div>
                @else
                    <div class="row no-gutters mt-3">
                        <div class="col-3">
                            <div class="text-secondary fs-14 fw-400">{{ translate('Price')}}</div>
                        </div>
                        <div class="col-9">
                            <div class="">
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
                <form id="option-choice-form">
                    @csrf
                    <input type="hidden" name="id" value="{{ $product->id }}">
                    @if($popupIsCombo)
                        <input type="hidden" name="is_combo" id="combo_is_combo" value="0">
                        <input type="hidden" name="combo_price" id="combo_price_input" value="">
                        <input type="hidden" name="combo_colors" id="combo_colors_input" value="">
                        @if ($product->colors && count(json_decode($product->colors)) > 0)
                            <input type="hidden" name="color" value="{{ get_single_color_name(json_decode($product->colors)[0]) }}">
                        @endif
                    @endif
                    
                    @if($product->digital !=1)
                        <!-- Product Choice options -->
                        @if ($product->choice_options != null)
                            @foreach (json_decode($product->choice_options) as $key => $choice)

                                <div class="row no-gutters mt-3">
                                    <div class="col-3">
                                        <div class="text-secondary fs-14 fw-400 mt-2 ">{{ get_single_attribute_name($choice->attribute_id) }}</div>
                                    </div>
                                    <div class="col-9">
                                        <div class="aiz-radio-inline">
                                            @foreach ($choice->values as $key => $value)
                                            <label class="aiz-megabox pl-0 mr-2 mb-0">
                                                <input
                                                    type="radio"
                                                    name="attribute_id_{{ $choice->attribute_id }}"
                                                    value="{{ $value }}"
                                                    @if($key == 0) checked @endif
                                                >
                                                <span class="aiz-megabox-elem rounded-0 d-flex align-items-center justify-content-center py-1 px-3">
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
                        @if($popupIsCombo)
                            @php $popupComboDeals = $product->comboDeals; @endphp
                            <div class="mt-3 mb-2 border rounded-2 overflow-hidden"
                                 id="popup-combo-deal-box"
                                 data-tiers="{{ $popupComboDeals->map(fn($t) => ['qty'=>$t->min_qty,'price'=>$t->price])->toJson() }}"
                                 data-has-colors="{{ ($product->colors && count(json_decode($product->colors)) > 0) ? 1 : 0 }}">
                                <div class="d-flex align-items-center px-3 py-2" style="background:linear-gradient(135deg,#0080fe 0%,#0056b3 100%)">
                                    <span class="fs-13 fw-bold text-white">🎁 {{ translate('Combo Deal') }}</span>
                                </div>
                                <div class="px-3 py-2 d-flex flex-wrap" style="gap:6px">
                                    @foreach($popupComboDeals as $i => $tier)
                                    <div class="popup-combo-tier-pill border rounded-2 px-2 py-1 text-center cursor-pointer"
                                         data-qty="{{ $tier->min_qty }}" data-price="{{ $tier->price }}"
                                         style="min-width:80px;cursor:pointer;{{ $i==$popupComboDeals->count()-1 ? 'border-color:#0080fe;background:#f0f8ff;' : 'border-color:#dee2e6;' }}"
                                         onclick="popupSelectComboPill(this, {{ $tier->min_qty }}, {{ $tier->price }})">
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
                            <div class="row no-gutters mt-3">
                                <div class="col-3">
                                    <div class="text-secondary fs-14 fw-400 mt-2">
                                        {{ translate('Color')}}
                                        @if($popupIsCombo)
                                            <br><span class="fs-11 text-blue" id="popup-combo-color-hint" style="display:none">{{ translate('Select') }} <span id="popup-combo-color-limit">1</span> {{ translate('color(s)') }} — <span id="popup-combo-color-selected">0</span> {{ translate('selected') }}</span>
                                        @endif
                                    </div>
                                </div>
                                <div class="col-9">
                                    @if($popupIsCombo)
                                    {{-- COMBO: multi-select with per-color qty --}}
                                    <div class="d-flex flex-wrap" id="popup-combo-color-wrap" style="gap:4px">
                                        @foreach (json_decode($product->colors) as $key => $color)
                                        @php $cName = get_single_color_name($color); @endphp
                                        <div class="aiz-megabox rounded-1 bg-white mb-1 d-inline-block position-relative"
                                             data-color="{{ $cName }}" data-hex="{{ $color }}"
                                             style="vertical-align:top;">
                                            <input type="checkbox" class="popup-combo-cb" value="{{ $cName }}">
                                            <div class="d-flex align-items-center aiz-megabox-elem px-10px cursor-pointer"
                                                 onclick="popupComboColorToggle(this.parentElement)">
                                                <span class="d-inline-block rounded-circle" style="width:15px;height:15px;background:{{ $color }};"></span>
                                                <span class="fs-12 text-dark pl-1 pr-1">{{ $cName }}</span>
                                            </div>
                                            <div class="popup-combo-qty-wrap d-none" style="padding:3px 6px 5px;">
                                                <div class="d-flex align-items-center justify-content-center" style="gap:0;">
                                                    <button type="button" class="btn btn-sm p-0 border-0 lh-1" style="width:20px;height:20px;font-size:14px;font-weight:700;background:#f0f0f0;border-radius:4px;color:#333;" onclick="popupComboColorQty(this.closest('.aiz-megabox'),-1)">−</button>
                                                    <span class="popup-combo-qty-val fw-700 fs-12 text-center" style="min-width:20px;">1</span>
                                                    <button type="button" class="btn btn-sm p-0 border-0 lh-1" style="width:20px;height:20px;font-size:14px;font-weight:700;background:#f0f0f0;border-radius:4px;color:#333;" onclick="popupComboColorQty(this.closest('.aiz-megabox'),1)">+</button>
                                                </div>
                                            </div>
                                        </div>
                                        @endforeach
                                    </div>
                                    @else
                                    {{-- NORMAL: radio color --}}
                                    <div class="aiz-radio-inline">
                                        @foreach (json_decode($product->colors) as $key => $color)
                                        <label class="aiz-megabox pl-0 mr-2 mb-0" data-toggle="tooltip" data-title="{{ get_single_color_name($color) }}">
                                            <input type="radio" name="color" value="{{ get_single_color_name($color) }}" @if($key == 0) checked @endif>
                                            <span class="aiz-megabox-elem rounded-0 d-flex align-items-center justify-content-center p-1">
                                                <span class="size-25px d-inline-block rounded" style="background: {{ $color }};"></span>
                                            </span>
                                        </label>
                                        @endforeach
                                    </div>
                                    @endif
                                </div>
                            </div>
                        @endif

                        <!-- Quantity -->
                        <div class="row no-gutters mt-3">
                            <div class="col-3">
                                <div class="text-secondary fs-14 fw-400 mt-2">{{ translate('Quantity')}}</div>
                            </div>
                            <div class="col-9">
                                <div class="product-quantity d-flex align-items-center">
                                    <div class="row no-gutters align-items-center aiz-plus-minus mr-3" style="width: 130px;">
                                        <button class="btn col-auto btn-icon btn-sm btn-light rounded-0" type="button" data-type="minus" data-field="quantity" disabled="">
                                            <i class="las la-minus"></i>
                                        </button>
                                        @php $popupDefaultQty = $popupIsCombo ? $product->comboDeals->sortByDesc('min_qty')->first()->min_qty : $product->min_qty; @endphp
                                        <input type="number" name="quantity" class="col border-0 text-center flex-grow-1 fs-16 input-number" placeholder="1" value="{{ $popupDefaultQty }}" min="{{ $product->min_qty }}" max="10" lang="en">
                                        <button class="btn col-auto btn-icon btn-sm btn-light rounded-0" type="button" data-type="plus" data-field="quantity">
                                            <i class="las la-plus"></i>
                                        </button>
                                    </div>
                                    <div class="avialable-amount opacity-60">
                                        @if($product->stock_visibility_state == 'quantity')
                                        (<span id="available-quantity">{{ $qty }}</span> {{ translate('available')}})
                                        @elseif($product->stock_visibility_state == 'text' && $qty >= 1)
                                            (<span id="available-quantity">{{ translate('In Stock') }}</span>)
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                    @else
                        <!-- Quantity -->
                        <input type="hidden" name="quantity" value="1">
                    @endif
                    
                    <!-- Total Price -->
                    <div class="row no-gutters mt-3 pb-3 d-none" id="chosen_price_div">
                        <div class="col-3">
                            <div class="text-secondary fs-14 fw-400 mt-1">{{ translate('Total Price')}}</div>
                        </div>
                        <div class="col-9">
                            <div class="product-price">
                                <strong id="chosen_price" class="fs-20 fw-700 text-primary">

                                </strong>
                            </div>
                        </div>
                    </div>

                </form>

                <!-- Add to cart -->
                <div class="mt-3">
                    @if ($product->digital == 1)
                        <button type="button" class="btn btn-primary rounded-0 buy-now fw-600 add-to-cart" 
                            @if (Auth::check() || get_Setting('guest_checkout_activation') == 1) onclick="addToCart()" @else onclick="showLoginModal()" @endif
                        >
                            <i class="la la-shopping-cart"></i>
                            <span class="d-none d-md-inline-block">{{ translate('Add to cart')}}</span>
                        </button>
                    @elseif($qty > 0)
                        @if ($product->external_link != null)
                            <a type="button" class="btn btn-soft-primary rounded-0 mr-2 add-to-cart fw-600" href="{{ $product->external_link }}">
                                <i class="las la-share"></i>
                                <span class="d-none d-md-inline-block">{{ translate($product->external_link_btn)}}</span>
                            </a>
                        @else
                            <button type="button" class="btn btn-primary rounded-0 buy-now fw-600 add-to-cart" 
                                @if (Auth::check() || get_Setting('guest_checkout_activation') == 1) onclick="addToCart()" @else onclick="showLoginModal()" @endif
                            >
                                <i class="la la-shopping-cart"></i>
                                <span class="d-none d-md-inline-block">{{ translate('Add to cart')}}</span>
                            </button>
                        @endif
                    @endif
                    <button type="button" class="btn btn-secondary rounded-0 out-of-stock fw-600 d-none" disabled>
                        <i class="la la-cart-arrow-down"></i>{{ translate('Out of Stock')}}
                    </button>
                </div>

            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    $('#option-choice-form input').on('change', function () {
        getVariantPrice();
    });

    // ===== COMBO DEAL JS FOR POPUP =====
    (function() {
        var box = document.getElementById('popup-combo-deal-box');
        if (!box) return;
        var tiers = JSON.parse(box.dataset.tiers || '[]');
        var hasColors = parseInt(box.dataset.hasColors || 0);
        tiers.sort(function(a,b){ return parseInt(a.qty) - parseInt(b.qty); });
        var colorCounts = {};
        var sym = '{{ get_system_default_currency()->symbol }}';

        function fmt(n) { return sym + Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

        function calcPrice(qty) {
            qty = parseInt(qty) || 1;
            var best = null;
            for (var i = 0; i < tiers.length; i++) { if (parseInt(tiers[i].qty) <= qty) best = tiers[i]; }
            if (!best) return { isCombo: false };
            var tq = parseInt(best.qty), tp = parseFloat(best.price);
            if (tq === qty) return { isCombo: true, tier: best, total: tp };
            return { isCombo: true, tier: best, total: Math.round(tp/tq * qty * 100)/100 };
        }

        function applyCombo(qty) {
            var r = calcPrice(qty);
            if (!r.isCombo) return;
            var el = document.getElementById('chosen_price');
            if (el) { el.textContent = fmt(r.total); }
            var div = document.getElementById('chosen_price_div');
            if (div) div.classList.remove('d-none');
        }

        function updateForm(qty) {
            var r = calcPrice(qty);
            var ic = document.getElementById('combo_is_combo');
            var cp = document.getElementById('combo_price_input');
            if (!ic) return;
            ic.value = r.isCombo ? 1 : 0;
            cp.value = r.isCombo ? r.total : '';
        }

        function highlightPills(qty) {
            var r = calcPrice(qty);
            document.querySelectorAll('.popup-combo-tier-pill').forEach(function(p) {
                var active = r.tier && parseInt(p.dataset.qty) === parseInt(r.tier.qty);
                p.style.borderColor = active ? '#0080fe' : '#dee2e6';
                p.style.background = active ? '#f0f8ff' : '#fff';
            });
        }

        function onQtyChange(qty) {
            qty = parseInt(qty) || 1;
            var r = calcPrice(qty);
            if (r.isCombo) applyCombo(qty);
            updateForm(qty);
            highlightPills(qty);
            updateColorLimit(qty);
            enforceColorLimit(qty);
        }

        window.popupSelectComboPill = function(el, qty) {
            var qi = document.querySelector('#option-choice-form input[name=quantity]');
            if (qi) qi.value = qty;
            onQtyChange(qty);
        };

        // Color helpers
        function getLimit() { var qi = document.querySelector('#option-choice-form input[name=quantity]'); return parseInt(qi?qi.value:1)||1; }
        function getTotal() { var t=0; for(var k in colorCounts) t+=colorCounts[k]; return t; }
        function findHighest(exclude) { var mn=null,mc=0; for(var k in colorCounts){if(k===exclude)continue;if(colorCounts[k]>mc){mc=colorCounts[k];mn=k;}} return mn; }

        function updateColorLimit(qty) {
            var h = document.getElementById('popup-combo-color-hint');
            var l = document.getElementById('popup-combo-color-limit');
            if (h) { h.style.display = 'inline'; if (l) l.textContent = qty; }
            syncAllPopupColors();
        }
        function enforceColorLimit(nq) {
            while(getTotal()>nq){ var hi=findHighest(null); if(!hi)break; colorCounts[hi]--; if(colorCounts[hi]<=0)delete colorCounts[hi]; }
            syncAllPopupColors();
        }
        function syncPopupColor(cn) {
            var box = document.querySelector('#popup-combo-color-wrap .aiz-megabox[data-color="'+cn+'"]'); if(!box) return;
            var c=colorCounts[cn]||0, cb=box.querySelector('.popup-combo-cb'), qw=box.querySelector('.popup-combo-qty-wrap'), qv=box.querySelector('.popup-combo-qty-val');
            if(c>0){ if(cb)cb.checked=true; if(qw)qw.classList.remove('d-none'); if(qv)qv.textContent=c; }
            else { if(cb)cb.checked=false; if(qw)qw.classList.add('d-none'); if(qv)qv.textContent='0'; }
        }
        function syncAllPopupColors() {
            document.querySelectorAll('#popup-combo-color-wrap .aiz-megabox[data-color]').forEach(function(b){syncPopupColor(b.dataset.color);});
            var t=getTotal(); var el=document.getElementById('popup-combo-color-selected'); if(el) el.textContent=t;
            var colors=[]; for(var n in colorCounts){for(var i=0;i<colorCounts[n];i++)colors.push(n);}
            var inp=document.getElementById('combo_colors_input'); if(inp) inp.value=JSON.stringify(colors);
        }
        window.popupComboColorToggle = function(box) {
            if(!hasColors) return; var cn=box.dataset.color, curr=colorCounts[cn]||0, limit=getLimit();
            if(curr>0){ delete colorCounts[cn]; syncAllPopupColors(); return; }
            if(getTotal()>=limit){ var hi=findHighest(cn); if(hi){colorCounts[hi]--;if(colorCounts[hi]<=0)delete colorCounts[hi];}else return; }
            colorCounts[cn]=1; syncAllPopupColors();
        };
        window.popupComboColorQty = function(box, delta) {
            if(!hasColors) return; var cn=box.dataset.color, curr=colorCounts[cn]||0, nv=curr+delta, limit=getLimit();
            if(nv<=0){ delete colorCounts[cn]; syncAllPopupColors(); return; }
            if(delta>0 && getTotal()>=limit){ var hi=findHighest(cn); if(hi){colorCounts[hi]--;if(colorCounts[hi]<=0)delete colorCounts[hi];}else return; }
            colorCounts[cn]=nv; syncAllPopupColors();
        };

        // Validate before cart
        function validateColors() {
            var ic = document.getElementById('combo_is_combo');
            if (!ic || parseInt(ic.value)!==1 || !hasColors) return true;
            var qi = document.querySelector('#option-choice-form input[name=quantity]');
            var qty = parseInt(qi?qi.value:1)||1, t=0;
            for(var k in colorCounts) t+=colorCounts[k];
            if(t<qty){alert('Please select '+qty+' color(s). You selected '+t+'.'); return false;}
            return true;
        }
        var origAdd = window.addToCart;
        window.addToCart = function(){ if(!validateColors()) return; if(typeof origAdd==='function') origAdd.apply(this,arguments); };
        var origBuy = window.buyNow;
        window.buyNow = function(){ if(!validateColors()) return; if(typeof origBuy==='function') origBuy.apply(this,arguments); };

        // Listen qty changes
        document.addEventListener('click', function(e) {
            var btn = e.target.closest('[data-type="plus"],[data-type="minus"]');
            if (!btn) return;
            setTimeout(function() {
                var qi = document.querySelector('#option-choice-form input[name=quantity]');
                onQtyChange(parseInt(qi?qi.value:1)||1);
            }, 30);
        });

        // After getVariantPrice AJAX
        $(document).ajaxComplete(function() {
            var qi = document.querySelector('#option-choice-form input[name=quantity]');
            var qty = parseInt(qi?qi.value:1)||1;
            var r = calcPrice(qty);
            if (r.isCombo) applyCombo(qty);
        });

        // Init
        var qi = document.querySelector('#option-choice-form input[name=quantity]');
        if (qi) onQtyChange(parseInt(qi.value)||1);
    })();
</script>
