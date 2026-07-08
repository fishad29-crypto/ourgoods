@extends('frontend.layouts.app')

@section('meta_title'){{ $detailedProduct->meta_title }}@stop

@section('meta_description'){{ $detailedProduct->meta_description }}@stop

@section('meta_keywords'){{ $detailedProduct->tags }},{{ $detailedProduct->meta_keywords }}@stop

@section('meta')
    @php
        $availability = "out of stock";
        $qty = 0;
        if($detailedProduct->variant_product) {
            foreach ($detailedProduct->stocks as $key => $stock) {
                $qty += $stock->qty;
            }
        }
        else {
            $qty = optional($detailedProduct->stocks->first())->qty;
        }
        if($qty > 0){
            $availability = "in stock";
        }
    @endphp
    <!-- Schema.org markup for Google+ -->
    <meta itemprop="name" content="{{ $detailedProduct->meta_title }}">
    <meta itemprop="description" content="{{ $detailedProduct->meta_description }}">
    <meta itemprop="image" content="{{ uploaded_asset($detailedProduct->meta_img) }}">

    <!-- Twitter Card data -->
    <meta name="twitter:card" content="product">
    <meta name="twitter:site" content="@publisher_handle">
    <meta name="twitter:title" content="{{ $detailedProduct->meta_title }}">
    <meta name="twitter:description" content="{{ $detailedProduct->meta_description }}">
    <meta name="twitter:creator" content="@author_handle">
    <meta name="twitter:image" content="{{ uploaded_asset($detailedProduct->meta_img) }}">
    <meta name="twitter:data1" content="{{ single_price($detailedProduct->unit_price) }}">
    <meta name="twitter:label1" content="Price">

    <!-- Open Graph data -->
    <meta property="og:title" content="{{ $detailedProduct->meta_title }}" />
    <meta property="og:type" content="og:product" />
    <meta property="og:url" content="{{ route('product', $detailedProduct->slug) }}" />
    <meta property="og:image" content="{{ uploaded_asset($detailedProduct->meta_img) }}" />
    <meta property="og:description" content="{{ $detailedProduct->meta_description }}" />
    <meta property="og:site_name" content="{{ get_setting('meta_title') }}" />
    <meta property="og:price:amount" content="{{ single_price($detailedProduct->unit_price) }}" />
    <meta property="product:brand" content="{{ $detailedProduct->brand ? $detailedProduct->brand->name : env('APP_NAME') }}">
    <meta property="product:availability" content="{{ $availability }}">
    <meta property="product:condition" content="new">
    <meta property="product:price:amount" content="{{ number_format($detailedProduct->unit_price, 2) }}">
    <meta property="product:retailer_item_id" content="{{ $detailedProduct->slug }}">
    <meta property="product:price:currency"
        content="{{ get_system_default_currency()->code }}" />
    <meta property="fb:app_id" content="{{ env('FACEBOOK_PIXEL_ID') }}">
@endsection


@section('content')
    <div class="product-details">
        <!--PRODUCT DETAILS TOP SECTION START-->
        <div class="container">
            <div class="pt-30px pb-6">
                <div class="row">
                    <!--LEFT SIDE SLIDER-->
                    <div class="col-sm-12 col-lg-6">
                        <div class="product-slider-wrapper mb-2rem mb-lg-0">
                            <!--BREADCRUMB-->
                            <ul class="breadcrumb bg-transparent pt-0 px-0 pb-10px d-flex align-items-center">
                                <li class="fs-12 fw-400 has-transition opacity-50 hov-opacity-100">
                                    <a class="text-reset" href="{{ route('home') }}">{{ translate('Home') }}</a>
                                </li>
                                @if($detailedProduct->main_category)
                                <i class="las la-angle-right fs-12 fw-600 text-gray hide_cat1"></i>
                                <li class="fs-12 fw-400 has-transition opacity-50 hov-opacity-100">
                                    <a class="text-reset" href="{{route('products.category', $detailedProduct->main_category->slug)}}">{{translate($detailedProduct->main_category->name)}}</a>
                                </li>
                                @endif
                                <i class="las la-angle-right fs-12 fw-600 text-gray hide_cat1"></i>
                                <li class="fs-12 fw-400 has-transition  text-reset">
                                    {{ strlen($detailedProduct->getTranslation('name')) > 50
                                        ? substr($detailedProduct->getTranslation('name'), 0, 50).'...'
                                        : $detailedProduct->getTranslation('name')
                                    }}
                                </li>
                            </ul>
                            @include('frontend.product_details.image_gallery')
                        </div>
                    </div>
                    <!--RIGHT SIDE-->
                     @include('frontend.product_details.details')
                </div>
            </div>
        </div>
        <!--PRODUCT DETAILS TOP SECTION END-->


        <!-- ======== PRODUCT DETAILS NAV TAB START ======== -->
        <div id="smart-bar-trigger"></div>
        <div class="product-details-nav-tab mb-5">
            <div class="nav-tab-header bg-white">
                <div class="container mb-32px">
                    <div class="tab-scroll-wrapper">
                        <ul id="tabLinks" class="m-0 p-0 d-flex position-relative" type="none">
                            <li class="mr-2rem"><a href="#description"
                                    class="nav-link d-inline-block px-0 pt-20px pb-20px fs-16 fw-700 text-gray hov-text-dark has-transition">{{translate('Description')}}</a>
                            </li>
                            @if($detailedProduct->auction_product != 1)
                            <li class="mr-2rem"><a href="#relatedProduct"
                                    class="nav-link d-inline-block px-0 pt-20px pb-20px fs-16 fw-700 text-gray hov-text-dark has-transition">{{translate('Related Products')}}</a></li>
                            @endif
                            <li class="mr-2rem"><a href="#reviewsRatings"
                                    class="nav-link d-inline-block px-0 pt-20px pb-20px fs-16 fw-700 text-gray hov-text-dark has-transition">{{translate('Reviews & Ratings')}}</a></li>
                            @if(get_setting('product_query_activation') == 1)
                            <li class="mr-2rem"><a href="#product_query"
                                    class="nav-link d-inline-block px-0 pt-20px pb-20px fs-16 fw-700 text-gray hov-text-dark has-transition">{{translate('Product Queries')}} ({{ count($detailedProduct->product_queries) }})</a></li>
                            @endif
                            @if($detailedProduct->auction_product != 1)
                            <li class="mr-2rem"><a href="#frequentlyBought"
                                    class="nav-link d-inline-block px-0 pt-20px pb-20px fs-16 fw-700 text-gray hov-text-dark has-transition">{{translate('Frequently Bought')}}</a></li>
                            <li class="mr-2rem"><a href="#fromThisSeller"
                                    class="nav-link d-inline-block px-0 pt-20px pb-20px fs-16 fw-700 text-gray hov-text-dark has-transition">{{translate('More from this Seller')}}</a></li>
                            @endif
                            <span class="tab-underline"></span>
                        </ul>
                    </div>
                </div>
            </div>


            <div class="container d-flex flex-column">
                <!--DESCRIPTION SECTION START-->
                <section id="description">
                    <div class="py-30px px-30px border  bg-white border-light-gray rounded-2">
                        <div class="mw-100 overflow-hidden text-left aiz-editor-data">
                            <?php echo $detailedProduct->getTranslation('description'); ?>
                        </div>
                    </div>
                </section>
                <!--DESCRIPTION SECTION END-->

                @if($detailedProduct->auction_product != 1)
                <!--RELATED PRODUCTS SECTION START-->
                <section id="relatedProduct">
                    @include('frontend.product_details.related_products')
                </section>
                <!--RELATED PRODUCTS SECTION END-->
                @endif

                <!--REVIEWS & RATINGS SECTION START-->
                @include('frontend.product_details.review_section')
               <!--REVIEWS & RATINGS SECTION END-->

                @if(get_setting('product_query_activation') == 1)
                <!--PRODUCT QUERIES START-->
                <section id="product_query">
                   @include('frontend.product_details.product_queries')
                </section>
                <!--PRODUCT QUERIES END-->
                @endif


                @if($detailedProduct->auction_product != 1)
                <!--FREQUENT BOUGTH TOGETHER START-->
                <section id="frequentlyBought">
                    @include('frontend.product_details.frequently_bought_together')
                </section>
                <!--FREQUENT BOUGTH TOGETHER END-->

                <!--FROM THIS SELLER START-->
                <section id="fromThisSeller">
                    @include('frontend.product_details.from_this_seller_products')
                </section>
                <!--FROM THIS SELLER END-->
                @endif
            </div>
        </div>
        <!-- ======== PRODUCT DETAILS NAV TAB END ======== -->
    </div>
    @if ($detailedProduct->auction_product != 1)
    @include('frontend.smart_bar')
    @endif
@endsection

@section('modal')

    @include('frontend.partials.image_viewer')

    {{-- ===== COMBO DEAL MODAL ===== --}}
    @if($detailedProduct->combo_deal && $detailedProduct->comboDeals->count() > 0)
    <div class="modal fade" id="combo_modal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width:500px" role="document">
            <div class="modal-content rounded-2 overflow-hidden">
                <div class="modal-header border-0 pb-0" style="background:linear-gradient(135deg,#0080fe 0%,#0056b3 100%)">
                    <h5 class="modal-title fw-bold text-white fs-16">🎁 {{ translate('Combo Deal — Pick Your Colors') }}</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close" style="opacity:1">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-4">
                    <div class="mb-3 p-3 rounded-2" style="background:#f0f8ff;border:1px solid #bee3f8">
                        <div class="fs-14 fw-bold text-dark" id="combo-modal-summary">Loading...</div>
                        <div class="fs-12 text-gray mt-1">{{ translate('Select a color for each slot below') }}</div>
                    </div>
                    <div id="combo-color-slots"></div>
                    <div class="mt-3 p-3 rounded-2 d-flex align-items-center justify-content-between" style="background:#f8f9fa;border:1px dashed #dee2e6">
                        <span class="fs-14 fw-bold text-dark">{{ translate('Combo Total') }}:</span>
                        <span class="fs-20 fw-bold text-blue" id="combo-total-display">—</span>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ translate('Cancel') }}</button>
                    <button type="button" class="btn fw-bold text-white border-0 px-4"
                            id="combo-confirm-btn"
                            onclick="confirmComboCart()"
                            style="background:linear-gradient(135deg,#0080fe,#0056b3)">
                        🛒 {{ translate('Add Combo to Cart') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif
    {{-- ===== COMBO DEAL MODAL END ===== --}}

    <!-- Image Modal -->
    <div class="modal fade" id="image_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-zoom product-modal" id="modal-size" role="document">
            <div class="modal-content position-relative">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="p-4">
                    <div class="size-300px size-lg-450px">
                        <img class="img-fit h-100 lazyload"
                            src="{{ static_asset('assets/img/placeholder.jpg') }}"
                            data-src=""
                            onerror="this.onerror=null;this.src='{{ static_asset('assets/img/placeholder.jpg') }}';">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Chat Modal -->
    <div class="modal fade" id="chat_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-zoom product-modal" id="modal-size" role="document">
            <div class="modal-content position-relative">
                <div class="modal-header">
                    <h5 class="modal-title fw-600 h5">{{ translate('Any query about this product') }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form class="" action="{{ route('conversations.store') }}" method="POST"
                    enctype="multipart/form-data">
                    @csrf
                    <input type="hidden" name="product_id" value="{{ $detailedProduct->id }}">
                    <div class="modal-body gry-bg px-3 pt-3">
                        <div class="form-group">
                            <input type="text" class="form-control mb-3 rounded-1" name="title"
                                value="{{ $detailedProduct->name }}" placeholder="{{ translate('Product Name') }}"
                                required>
                        </div>
                        <div class="form-group">
                            <textarea class="form-control rounded-1" rows="8" name="message" required
                                placeholder="{{ translate('Your Question') }}">{{ route('product', $detailedProduct->slug) }}</textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary fw-600 rounded-1"
                            data-dismiss="modal">{{ translate('Cancel') }}</button>
                        <button type="submit" class="btn btn-primary fw-600 rounded-1 w-100px">{{ translate('Send') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Bid Modal -->
    @if($detailedProduct->auction_product == 1)
        @php 
            $highest_bid = $detailedProduct->bids->max('amount');
            $min_bid_amount = $highest_bid != null ? $highest_bid+1 : $detailedProduct->starting_bid;
            $gst_rate = gst_applicable_product_rate($detailedProduct->id);
        @endphp
        <div class="modal fade" id="bid_for_detail_product" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ translate('Bid For Product') }} <small>({{ translate('Min Bid Amount: ').$min_bid_amount }})</small> </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal" action="{{ route('auction_product_bids.store') }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            <input type="hidden" name="product_id" value="{{ $detailedProduct->id }}">
                            <div class="form-group">
                                <label class="form-label">
                                    {{translate('Place Bid Price')}}
                                    <span class="text-danger">*</span>
                                </label>
                                <div class="form-group">
                                    <input type="number" step="0.01" class="form-control form-control-sm" name="amount" min="{{ $min_bid_amount }}" placeholder="{{ translate('Enter Amount') }}" required>
                                    @if($gst_rate != null)
                                        <small class="text-danger">{{ translate('An') }} {{ $gst_rate }}% {{ translate('GST will be applied if you win the bid and proceed with the purchase') }}</small>
                                    @endif
                                </div>
                            </div>
                            <div class="form-group text-right">
                                <button type="submit" class="btn btn-sm btn-primary transition-3d-hover mr-1">{{ translate('Submit') }}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    @endif
    
    <!-- Product Review Modal -->
    <div class="modal fade" id="product-review-modal">
        <div class="modal-dialog">
            <div class="modal-content" id="product-review-modal-content">

            </div>
        </div>
    </div>

    <!-- Size chart show Modal -->
    @include('modals.size_chart_show_modal')

    <!-- Product Warranty Modal -->
    <div class="modal fade" id="warranty-note-modal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title h6">{{ translate('Warranty Note') }}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body c-scrollbar-light">
                    @if($detailedProduct->warranty_note_id != null && $detailedProduct->warrantyNote != null)
                        <p>{{ $detailedProduct->warrantyNote->getTranslation('description') }}</p>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Product Refund Modal -->
    <div class="modal fade" id="refund-note-modal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title h6">{{ translate('Refund Note') }}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body c-scrollbar-light">
                    @if($detailedProduct->refund_note_id != null && $detailedProduct->refundNote != null)
                        <p>{{ $detailedProduct->refundNote->getTranslation('description') }}</p>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Product Shipping Modal -->
    <div class="modal fade" id="shipping-note-modal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title h6">{{ translate('Shipping Note') }}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body c-scrollbar-light">
                    @if($detailedProduct->shipping_note_id != null && $detailedProduct->shippingNote != null)
                        <p>{{ $detailedProduct->shippingNote->getTranslation('description') }}</p>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Product COD Modal -->
    <div class="modal fade" id="cod-note-modal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title h6">{{ translate('Delivery Note') }}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body c-scrollbar-light">
                    @if($detailedProduct->delivery_note_id != null && $detailedProduct->codNote != null)
                        <p>{{ $detailedProduct->codNote->getTranslation('description') }}</p>
                    @endif
                </div>
            </div>
        </div>
    </div>

   <!-- Product Share Modal -->
    <div class="modal fade" id="social-share-modal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header flex-column pb-0 border-0">
                    <div class="w-80px h-80px rounded-circle bg-light border border-white border-width-3 link-circle-box d-flex align-items-center justify-content-center"> 
                        <i class="las la-link fs-28"></i>
                    </div>
                    <button type="button" class="close fs-10 w-25px h-25px rounded-circle bg-white hov-bg-soft-light has-transition d-flex align-items-center justify-content-center mr-1 mb-1" data-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body c-scrollbar-light">
                    <div class="col-12 col-lg-10 col-xl-8 mx-auto text-center">
                        <h4 class="fs-20 fw-700 text-dark">{{translate('Share with Friends')}}</h4>
                        <span class="fs-14 text-gray fw-400">{{translate('Trading is more effective when you share products with friends!')}}</span>
                    </div>
                    <div class="my-4 my-lg-5">
                        <h5 class="fs-16 fw-600 text-dark">{{translate('Share you link')}}</h5>
                        <div class="py-3 px-3 bg-light rounded-2 border-0 d-flex align-items-center justify-content-between share-link">
                            <span class="fs-14 text-gray fw-400 flex-grow-1 text-truncate-1 has-transition">{{route('product', $detailedProduct->slug)}}</span>
                            <button type="button" id="link-cpurl-btn" data-attrcpy="{{ translate('Copied') }}" data-url="{{route('product', $detailedProduct->slug)}}" onclick="CopyToClipboard(this)" class="border-0 bg-transparent flex-shrink-0 copy-link-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13.6" height="16" viewBox="0 0 13.6 16">
                                    <path id="Path_45213" data-name="Path 45213" d="M124.8-867.2a1.541,1.541,0,0,1-1.13-.47,1.541,1.541,0,0,1-.47-1.13v-9.6a1.541,1.541,0,0,1,.47-1.13,1.541,1.541,0,0,1,1.13-.47H132a1.541,1.541,0,0,1,1.13.47,1.541,1.541,0,0,1,.47,1.13v9.6a1.541,1.541,0,0,1-.47,1.13,1.541,1.541,0,0,1-1.13.47Zm0-1.6H132v-9.6h-7.2Zm-3.2,4.8a1.541,1.541,0,0,1-1.13-.47,1.541,1.541,0,0,1-.47-1.13v-11.2h1.6v11.2h8.8v1.6Zm3.2-4.8v0Z" transform="translate(-120 880)" fill="#919199"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                     <div class="pb-3">
                        <h5 class="fs-16 fw-600 text-dark">{{translate('Share to')}}</h5>
                        <div class="aiz-share text-center"></div>
                     </div>
                </div>
            </div>
        </div>
    </div>
@endsection




@section('script')
   <!-- ======================== Message Seller Start ================== -->
    <script>

        function show_chat_modal() {
            @if (Auth::check())
                $('#chat_modal').modal('show');
            @else
                $('#login_modal').modal('show');
            @endif
        }
    </script>
    
   <!-- ======================== Message Seller End ================== -->

   <!-- ======================== Product Variant Height Controll Start ================== -->
    <script type="text/javascript">
        $(document).on('click', '#toggleHeight', function () {

            var $btn = $(this);
            var $variant = $btn.closest('.product-variant');
            var $text = $btn.find('.toggle-text');
            var isCollapsed = $variant.hasClass('collapsed');

            // Toggle state
            $variant.toggleClass('collapsed');

            // Change text (HTML allowed)
            $text.html(
                isCollapsed
                    ? $btn.data('less') + ' <i class="las la-angle-up ms-1"></i>'
                    : $btn.data('more') + ' <i class="las la-angle-down ms-1"></i>'
            );

        });
    </script>

    <!-- ======================== Product Variant Height Controll End ================== -->

    <!-- ======================== Product Swipper Slide Start ================== -->
    <script type="text/javascript">
        document.addEventListener("DOMContentLoaded", function () {
            /*------ Thumbnails Swiper ------*/
            var thumbSwiper = new Swiper(".thumb-slider", {
                direction: "vertical",
                slidesPerView: 5,
                spaceBetween: 16,
                watchSlidesProgress: true,

                breakpoints: {
                    0: {
                        direction: "horizontal",
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    768: {
                        direction: "vertical",
                        slidesPerView: 5,
                    }
                }
            });

            /*------ Product Main Swiper Slide ------ */
            var mainSwiper = new Swiper(".main-slider", {
                spaceBetween: 10,
                thumbs: {
                    swiper: thumbSwiper
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }
            });

            /*------ Manual Scroll Thumbnail Slider Buttons ------ */
           const thumbBtnUp = document.querySelector(".thumb-btn-up");
            const thumbBtnDown = document.querySelector(".thumb-btn-down");

            if (thumbBtnUp && thumbBtnDown) {

                thumbBtnUp.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    thumbSwiper.slidePrev();
                });

                thumbBtnDown.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    thumbSwiper.slideNext();
                });

                function updateThumbButtons(swiper) {
                    thumbBtnUp.classList.toggle("disabled", swiper.isBeginning);
                    thumbBtnDown.classList.toggle("disabled", swiper.isEnd);
                }

                updateThumbButtons(thumbSwiper);

                thumbSwiper.on("slideChange", function () {
                    updateThumbButtons(this);
                });

                thumbSwiper.on("reachBeginning", function () {
                    updateThumbButtons(this);
                });

                thumbSwiper.on("reachEnd", function () {
                    updateThumbButtons(this);
                });
            }

        });
    </script>
    <!-- ======================== Product Swipper Slide End ================== -->

    <!-- ======================== Color Image Gallery Switch Start ================== -->
    <script type="text/javascript">
        document.addEventListener("DOMContentLoaded", function () {
            var galleryWrapper = document.getElementById('product-gallery-wrapper');
            if (!galleryWrapper) return;

            var colorImagesMap = {};
            try {
                colorImagesMap = JSON.parse(galleryWrapper.getAttribute('data-color-images') || '{}');
            } catch(e) {}

            var hasColorImages = Object.keys(colorImagesMap).some(function(key) {
                return colorImagesMap[key] && colorImagesMap[key].trim() !== '';
            });
            if (!hasColorImages) return;

            var mainSlider = document.querySelector('.main-slider');
            if (!mainSlider) return;

            // Wait for swiper to initialize
            var checkSwiper = setInterval(function() {
                if (mainSlider.swiper) {
                    clearInterval(checkSwiper);
                    initColorGallery();
                }
            }, 100);

            function initColorGallery() {
                var swiper = mainSlider.swiper;

                // Save all original slides HTML
                var originalSlidesHTML = [];
                swiper.slides.forEach(function(slide) {
                    originalSlidesHTML.push(slide.outerHTML);
                });

                var urlCache = {};
                var isShowingColorImages = false;

                function swapToColorImage(hex) {
                    var imageIdsStr = '';
                    if (hex && colorImagesMap[hex]) {
                        imageIdsStr = colorImagesMap[hex];
                    }
                    if (!imageIdsStr && hex) {
                        var up = hex.toUpperCase();
                        Object.keys(colorImagesMap).forEach(function(k) {
                            if (k.toUpperCase() === up) imageIdsStr = colorImagesMap[k];
                        });
                    }
                    if (!imageIdsStr || !imageIdsStr.trim()) {
                        restoreOriginal();
                        return;
                    }
                    var ids = imageIdsStr.split(',').map(function(s){return s.trim();}).filter(Boolean);
                    if (ids.length === 0) { restoreOriginal(); return; }

                    var cacheKey = ids.join(',');
                    if (urlCache[cacheKey]) {
                        applyColorSlides(urlCache[cacheKey]);
                        return;
                    }

                    $.post('{{ url("/aiz-uploader/get_file_by_ids") }}', {
                        _token: '{{ csrf_token() }}',
                        ids: cacheKey
                    }, function(data) {
                        var urls = [];
                        if (Array.isArray(data)) {
                            data.forEach(function(file) {
                                if (file && file.file_name) urls.push(file.file_name);
                            });
                        }
                        if (urls.length === 0) {
                            restoreOriginal();
                            return;
                        }
                        urlCache[cacheKey] = urls;
                        applyColorSlides(urls);
                    }, 'json');
                }

                function applyColorSlides(urls) {
                    // Remove all current slides
                    swiper.removeAllSlides();

                    // Add new slides for each color image
                    var newSlides = [];
                    urls.forEach(function(url) {
                        newSlides.push(
                            '<div class="swiper-slide overflow-hidden rounded-corner-8px" style="background:#f5f5f5;">' +
                                '<img src="' + url + '" class="img-fluid h-100 w-100 object-fit-contain object-position-center" alt="Color Image">' +
                            '</div>'
                        );
                    });
                    swiper.appendSlide(newSlides);
                    swiper.slideTo(0, 0);
                    swiper.update();
                    isShowingColorImages = true;
                }

                function restoreOriginal() {
                    if (!isShowingColorImages) return;
                    // Remove color slides and restore originals
                    swiper.removeAllSlides();
                    swiper.appendSlide(originalSlidesHTML);
                    swiper.slideTo(0, 0);
                    swiper.update();
                    isShowingColorImages = false;
                }

                // Click on any thumbnail → restore original images
                $(document).on('click', '.thumb-slider .swiper-slide', function() {
                    if (isShowingColorImages) {
                        restoreOriginal();
                    }
                });

                // Use 'click' on label so already-checked default color also works
                $(document).on('click', 'label[data-color-hex], [data-hex]', function() {
                    var hex = $(this).attr('data-color-hex') || $(this).attr('data-hex') || '';
                    if (hex) {
                        swapToColorImage(hex);
                    }
                });

            }
        });
    </script>
    <!-- ======================== Color Image Gallery Switch End ================== -->


    <!-- ======================== Flash Sale Timer Start ================== -->
    <script type="text/javascript">
        

        function startSimpleCountdown(endDate, countdownEl) {
            // Select flashBox once here so the update function can see it
            const flashBox = document.getElementById("flashSaleBox");

            function update() {
                const now = new Date();
                const diff = endDate - now;

                if (diff > 0) {
                    const totalSeconds = Math.floor(diff / 1000);
                    const days = Math.floor(totalSeconds / (60 * 60 * 24));
                    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
                    const mins = Math.floor((totalSeconds % (60 * 60)) / 60);
                    const secs = totalSeconds % 60;
                    countdownEl.innerHTML = `${days}D : ${hours}H : ${mins}M : ${secs}S`;
                } else {
                    countdownEl.innerHTML = "Expired";
                    if (flashBox) {
                        flashBox.classList.add("expired");
                        flashBox.style.animation = "none";
                    }
                    clearInterval(timer);
                }
            }

            update();
            const timer = setInterval(update, 1000);
        }

        document.addEventListener("DOMContentLoaded", function() {
            const countdownEl = document.querySelector('.flashSaleCountdown');
            
            if (countdownEl && countdownEl.dataset.endDate) {
                const endDateStr = countdownEl.dataset.endDate;
                const parsedEndDate = isNaN(endDateStr) 
                    ? new Date(endDateStr.replace(/-/g, '/')) 
                    : new Date(parseInt(endDateStr) * 1000);

                startSimpleCountdown(parsedEndDate, countdownEl);
            }
        });
                </script>
    <!-- ======================== Flash Sale Timer End ================== -->

    <!-- ======================== Product Details Nav Tab Start ================== -->
    <script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function () {
        const navLinks = document.querySelectorAll("#tabLinks .nav-link");
        const underline = document.querySelector(".tab-underline");
        const tabWrapper = document.querySelector(".tab-scroll-wrapper");
        const sections = document.querySelectorAll("section");

        function moveUnderline(activeLink) {
            const rect = activeLink.getBoundingClientRect();
            const parentRect = activeLink.parentElement.parentElement.getBoundingClientRect();

            underline.style.width = rect.width + "px";
            underline.style.left = (rect.left - parentRect.left) + "px";

            // Auto scroll to keep active tab in view
            tabWrapper.scrollTo({
                left: activeLink.offsetLeft - 50,
                behavior: "smooth"
            });
        }

        // Smooth scroll on click
        navLinks.forEach(function(link) {
            link.addEventListener("click", function(e) {
                e.preventDefault();

                const href = this.getAttribute("href");
                const target = document.querySelector(href);

                if (!target) return;

                const targetOffset =
                    target.getBoundingClientRect().top + window.pageYOffset - 150;

                window.scrollTo({
                    top: targetOffset,
                    behavior: "smooth"
                });

                moveUnderline(this);
            });
        });


        // Scrollspy
        window.addEventListener("scroll", () => {
            const scrollPos = window.scrollY + 120;

            sections.forEach(sec => {
                const top = sec.offsetTop;
                const bottom = top + sec.offsetHeight;

                // if current scroll inside this section
                if (scrollPos >= top && scrollPos < bottom) {
                    const activeLink = document.querySelector(`a[href="#${sec.id}"]`);
                    if (activeLink) moveUnderline(activeLink);
                }
            });
        });


        // initial underline
        window.addEventListener("load", () => {
            moveUnderline(navLinks[0]);
        });
     });
    </script>

    <!-- ======================== Product Details Nav Tab End ================== -->

    <!-- ======================== Filter Rating Selector Start ================== -->
    <script type="text/javascript">
       $(document).on('click', '.rating-point', function (e) {
            if ($(e.target).is('input')) {
                return;
            }
            $('.rating-point').removeClass('active');
            $(this).addClass('active');
            let val = $(this).find('input').val();
            $(this).find('input').prop('checked', true);
            getReviews(0, val);
        });
        
    </script>
    <!-- ======================== Filter Rating Selector End ================== -->

   <script type="text/javascript">
        $(document).ready(function() {
            getVariantPrice();
        });

        function CopyToClipboard(e) {
            var url = $(e).data('url');
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(url).select();
            try {
                document.execCommand("copy");
                AIZ.plugins.notify('success', '{{ translate('Link copied to clipboard') }}');
                //reset temp input value
            } catch (err) {
                AIZ.plugins.notify('danger', '{{ translate('Oops, unable to copy') }}');
            }
            $temp.remove();
        }


        function SKUCopyToClipboard() {
            // Directly get the text currently shown in the SKU span
            var skuText = $('#variant_sku').text().trim();

            if (skuText === "") {
                AIZ.plugins.notify('warning', 'No SKU to copy');
                return;
            }

            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(skuText).select();

            try {
                document.execCommand("copy");
                AIZ.plugins.notify('success', '{{ translate('SKU copied to clipboard') }}');
            } catch (err) {
                AIZ.plugins.notify('danger', '{{ translate('Oops, unable to copy') }}');
            }
            
            $temp.remove();
        }

        function show_chat_modal() {
            @if (Auth::check())
                $('#chat_modal').modal('show');
            @else
                $('#login_modal').modal('show');
            @endif
        }

        // Pagination using ajax
        $(window).on('hashchange', function() {
            if(window.history.pushState) {
                window.history.pushState('', '/', window.location.pathname);
            } else {
                window.location.hash = '';
            }
        });

        $(document).ready(function() {
            $(document).on('click', '.product-queries-pagination .pagination a', function(e) {
                getPaginateData($(this).attr('href').split('page=')[1], 'query', 'queries-area');
                e.preventDefault();
            });
        });

        $(document).ready(function() {
            $(document).on('click', '.product-reviews-pagination .pagination a', function(e) {
                getPaginateData($(this).attr('href').split('page=')[1], 'review', 'reviews-area');
                e.preventDefault();
            });
        });

        function getPaginateData(page, type, section) {
            $.ajax({
                url: '?page=' + page,
                dataType: 'json',
                data: {type: type},
            }).done(function(data) {
                $('.'+section).html(data);
                location.hash = page;
            }).fail(function() {
                alert('Something went worng! Data could not be loaded.');
            });
        }


        $(document).on('click', '.see-more-btn', function () {
            getReviews(1, null);
        });
        // Pagination end

        function reviewBySort() {
            getReviews();
        }

        function reviewByImages(){
            getReviews(null, null, 1);
        }


        function getReviews(seemore= false, rating = null, images= null) {
            let sortBy = $('#sortBy').val();
            let limit = parseInt($('.see-more-btn').attr('data-limit')) || 0;
            if (seemore) {
                limit += 3;
            }
            if(images!= null){
                rating =null;
                sortBy = images;
            }
            if (rating == null) {
                $('.rating-point').removeClass('active');
            }
            const loaderHtml = `
                <div class="h-500px w-100 d-flex justify-content-center align-items-center loader-wrapper">
                    <div class="footable-loader" style="height: 100vh !important;">
                        <span class="fooicon fooicon-loader"></span>
                    </div>
                </div>`;
            //alert(limit);
            $('.reviews-area').html(loaderHtml);
            $.ajax({
                url: `{{ route('products.reviews') }}`,
                method: 'GET',
                data: {
                    slug: '{{ $detailedProduct->slug }}',
                    limit: limit,
                    sort_by: sortBy,
                    rating: rating,
                    images: images
                },
                beforeSend: function () {
                    // Show loader
                    $('.reviews-area').html(loaderHtml);
                },
                success: function (res) {

                    // Remove loader
                    $('.reviews-area').empty();

                    if (res.html && res.html.trim() !== '') {
                        $('.reviews-area').append(res.html);
                        $('#see-more-btn').attr('data-limit', limit);
                    }

                    // Hide button if no more reviews
                    if (!res.has_more) {
                        $('#seeMoreReviews').hide();
                    }
                },
                error: function () {
                    $('.reviews-area').html('<p class="text-danger text-center">Failed to load reviews.</p>');
                }
            });
        }


    //    document.addEventListener('click', function(e) {
    //         const label = e.target.closest('.rating-point-select');
    //         if (!label) return;
    //         if (label.dataset.listenerAdded === 'true') return;
    //         label.dataset.listenerAdded = 'true';
    //         document.querySelectorAll('.rating-point-select')
    //             .forEach(l => l.classList.remove('active', 'border-primary'));
    //         label.classList.add('active', 'border-primary');
    //         const rating = label.dataset.value;
    //         getReviews(0, rating);
    //     });


        function showImage(photo) {
            $('#image_modal img').attr('src', photo);
            $('#image_modal img').attr('data-src', photo);
            $('#image_modal').modal('show');
        }

        function bid_modal(){
            @if (isCustomer() || isSeller())
                $('#bid_for_detail_product').modal('show');
          	@elseif (isAdmin())
                AIZ.plugins.notify('warning', '{{ translate("Sorry, Only customers & Sellers can Bid.") }}');
            @else
                $('#login_modal').modal('show');
            @endif
        }

        function product_review(product_id,order_id) {
            @if (isCustomer())
                @if ($review_status == 1)
                    $.post('{{ route('product_review_modal') }}', {
                        _token: '{{ @csrf_token() }}',
                        product_id: product_id,
                        order_id: order_id
                    }, function(data) {
                        $('#product-review-modal-content').html(data);
                        $('#product-review-modal').modal('show', {
                            backdrop: 'static'
                        });
                        AIZ.extra.inputRating();
                    });
                @else
                    AIZ.plugins.notify('warning', '{{ translate("Sorry, You need to buy this product to give review.") }}');
                @endif
            @elseif (Auth::check() && !isCustomer())
                AIZ.plugins.notify('warning', '{{ translate("Sorry, Only customers can give review.") }}');
            @else
                $('#login_modal').modal('show');
            @endif
        }

        function showSizeChartDetail(id, name){
            $('#size-chart-show-modal .modal-title').html('');
            $('#size-chart-show-modal .modal-body').html('');
            if (id == 0) {
                AIZ.plugins.notify('warning', '{{ translate("Sorry, There is no size guide found for this product.") }}');
                return false;
            }
            $.ajax({
                type: "GET",
                url: "{{ route('size-charts-show', '') }}/"+id,
                data: {},
                success: function(data) {
                    $('#size-chart-show-modal .modal-title').html(name);
                    $('#size-chart-show-modal .modal-body').html(data);
                    $('#size-chart-show-modal').modal('show');
                }
            });
        }

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function updateViewerCount() {
            const countElement = document.querySelector('#live-product-viewing-visitors .count');
            const min = parseInt(`{{ get_setting('min_custom_product_visitors') }}`);
            const max = parseInt(`{{ get_setting('max_custom_product_visitors') }}`);
            const randomNumber = getRandomNumber(min, max);
            countElement.textContent = randomNumber;
            const randomTime = getRandomNumber(5000, 10000);
            setTimeout(updateViewerCount, randomTime);
        }
        
    </script>
    @if(get_setting('show_custom_product_visitors')==1)
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            updateViewerCount();
            getReviews();
        });
    </script>
    @endif
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            getReviews();
        });
    </script>
    <!-- ======================== Custom Viewer End  ================== -->

    @if($detailedProduct->combo_deal && $detailedProduct->comboDeals->count() > 0)
    <script>
    // ===================== COMBO DEAL JS (v4 — ajaxComplete, no flicker) =====================
    (function() {
        var comboDealBox = document.getElementById('combo-deal-box');
        if (!comboDealBox) return;

        var tiers     = JSON.parse(comboDealBox.dataset.tiers || '[]');
        var hasColors = parseInt(comboDealBox.dataset.hasColors || 0);

        tiers.sort(function(a,b){ return parseInt(a.qty) - parseInt(b.qty); });

        var comboColorCounts = {};

        function fmt(amount) {
            return '{{ get_system_default_currency()->symbol }}' +
                Math.round(parseFloat(amount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        // ── Pricing: find best combo tier for qty ─────────────────────
        function calcPrice(qty) {
            qty = parseInt(qty) || 1;
            var best = null;
            for (var i = 0; i < tiers.length; i++) {
                if (parseInt(tiers[i].qty) <= qty) best = tiers[i];
            }
            if (!best) return { isCombo: false, tier: null, total: 0 };
            var tierQty   = parseInt(best.qty);
            var tierPrice = parseFloat(best.price);
            if (tierQty === qty) return { isCombo: true, tier: best, total: tierPrice };
            // qty > tier: per-unit of best tier × qty
            var perUnit = tierPrice / tierQty;
            return { isCombo: true, tier: best, total: Math.round(perUnit * qty * 100) / 100 };
        }

        // ── Write combo prices to DOM ─────────────────────────────────
        // TOP (#product-base-price) = STATIC (blade-rendered max combo per-piece)
        // BOTTOM (#chosen_price)    = DYNAMIC total price
        function applyComboPrice(qty) {
            var result = calcPrice(qty);
            if (!result.isCombo) return false;

            // DO NOT touch #product-base-price — it stays static (max combo per-piece)

            // BOTTOM: #chosen_price → TOTAL price (dynamic)
            var chosenPrice = document.getElementById('chosen_price');
            if (chosenPrice) {
                var div = document.getElementById('chosen_price_div');
                if (div) div.style.display = 'block';
                chosenPrice.textContent = fmt(result.total);
            }
            return true;
        }

        function highlightTierPill(activeQty) {
            document.querySelectorAll('.combo-tier-pill').forEach(function(p) {
                var isActive = parseInt(p.dataset.qty) === activeQty;
                p.style.borderColor = isActive ? '#0080fe' : '#dee2e6';
                p.style.background  = isActive ? '#f0f8ff' : '#fff';
            });
        }

        function updateStatusBadge(qty) {
            var result = calcPrice(qty);
            var badge  = document.getElementById('combo-status-badge');
            var txtEl  = document.getElementById('combo-status-text');
            if (!badge) return;
            if (result.isCombo) {
                badge.style.display = 'block';
                if (txtEl) txtEl.textContent = '🎁 Combo Deal Applied — ' + qty + ' pcs = ' + fmt(result.total);
            } else {
                badge.style.display = 'none';
            }
        }

        function updateFormFields(qty) {
            var result        = calcPrice(qty);
            var isComboInput  = document.getElementById('combo_is_combo');
            var comboPriceInp = document.getElementById('combo_price_input');
            if (!isComboInput) return;
            isComboInput.value  = result.isCombo ? 1 : 0;
            comboPriceInp.value = result.isCombo ? result.total : '';
        }

        // ── MAIN: called on every qty change ──────────────────────────
        function onQtyChange(qty) {
            qty = parseInt(qty) || 1;
            var result = calcPrice(qty);

            // Set price (combo or let default stay)
            if (result.isCombo) {
                applyComboPrice(qty);
            }
            // else: default system price stays (from getVariantPrice AJAX or blade)

            updateStatusBadge(qty);
            updateFormFields(qty);

            if (result.tier) {
                highlightTierPill(parseInt(result.tier.qty));
            } else {
                document.querySelectorAll('.combo-tier-pill').forEach(function(p){
                    p.style.borderColor = '#dee2e6';
                    p.style.background  = '#fff';
                });
            }

            updateColorLimit(qty);
            enforceColorLimit(qty);

            var countEl = document.getElementById('add_to_cart_count');
            if (countEl) countEl.textContent = '(' + String(qty).padStart(2,'0') + ')';
        }

        // ── Pill click ────────────────────────────────────────────────
        window.selectComboPill = function(el, qty, price) {
            var qtyInput = document.querySelector('input[name="quantity"]');
            if (qtyInput) qtyInput.value = qty;
            onQtyChange(qty);
        };

        // ── AJAX COMPLETE HOOK: re-apply combo after getVariantPrice ──
        // getVariantPrice() AJAX updates price in its success callback.
        // ajaxComplete fires AFTER success, in the same JS task, BEFORE
        // the browser paints → we override the price → user never sees
        // the wrong value. Zero flicker.
        $(document).ajaxComplete(function(event, xhr, settings) {
            var qtyInput = document.querySelector('input[name="quantity"]');
            var qty      = parseInt(qtyInput ? qtyInput.value : 1) || 1;
            var result   = calcPrice(qty);
            if (result.isCombo) {
                applyComboPrice(qty);
            }
            // Always restore #product-base-price to static max combo per-piece
            if (tiers.length > 0) {
                var maxTier = tiers[tiers.length - 1];
                var staticPerPc = Math.round(parseFloat(maxTier.price) / parseInt(maxTier.qty));
                var basePriceEl = document.getElementById('product-base-price');
                if (basePriceEl) {
                    var unitSpan = basePriceEl.querySelector('span.opacity-70');
                    basePriceEl.innerHTML = '<span class="combo-price-label">' + fmt(staticPerPc) + '</span>' +
                        (unitSpan ? unitSpan.outerHTML : '');
                }
            }
        });

        // ── Listen to qty +/- ─────────────────────────────────────────
        function listenQtyChanges() {
            var qtyInput = document.querySelector('input[name="quantity"]');
            if (!qtyInput) return;

            // React AFTER AIZ updates the input value
            document.addEventListener('click', function(e) {
                var btn = e.target.closest('[data-type="plus"],[data-type="minus"]');
                if (!btn) return;
                setTimeout(function() {
                    onQtyChange(parseInt(qtyInput.value) || 1);
                }, 30);
            });

            qtyInput.addEventListener('change', function() {
                onQtyChange(parseInt(this.value) || 1);
            });
        }

        // ── Color helpers ─────────────────────────────────────────────
        function getComboLimit() {
            var qtyInput = document.querySelector('input[name="quantity"]');
            return parseInt(qtyInput ? qtyInput.value : 1) || 1;
        }
        function getComboTotal() {
            var t = 0; for (var k in comboColorCounts) t += comboColorCounts[k]; return t;
        }

        function updateColorLimit(qty) {
            var hint    = document.getElementById('combo-color-hint');
            var limitEl = document.getElementById('combo-color-limit');
            if (hint) {
                hint.style.display = 'inline';
                if (limitEl) limitEl.textContent = qty;
            }
            syncAllColorUI();
        }

        // Sync a single color's UI with its count
        function syncColorUI(colorName) {
            var box = document.querySelector('#combo-color-wrapper .aiz-megabox[data-color="' + colorName + '"]');
            if (!box) return;
            var count    = comboColorCounts[colorName] || 0;
            var checkbox = box.querySelector('.combo-color-checkbox');
            var qtyWrap  = box.querySelector('.combo-color-qty-wrap');
            var qtyVal   = box.querySelector('.combo-color-qty-val');

            if (count > 0) {
                if (checkbox) checkbox.checked = true;
                if (qtyWrap) qtyWrap.classList.remove('d-none');
                if (qtyVal) qtyVal.textContent = count;
            } else {
                if (checkbox) checkbox.checked = false;
                if (qtyWrap) qtyWrap.classList.add('d-none');
                if (qtyVal) qtyVal.textContent = '0';
            }
        }

        // Sync ALL colors + update hidden inputs
        function syncAllColorUI() {
            var allBoxes = document.querySelectorAll('#combo-color-wrapper .aiz-megabox[data-color]');
            allBoxes.forEach(function(box) { syncColorUI(box.dataset.color); });

            // Update selected count display
            var total = getComboTotal();
            var el = document.getElementById('combo-color-selected-count');
            if (el) el.textContent = total;

            // Update hidden input with color array
            var colors = [];
            for (var name in comboColorCounts) {
                for (var i = 0; i < comboColorCounts[name]; i++) colors.push(name);
            }
            var inp = document.getElementById('combo_colors_input');
            if (inp) inp.value = JSON.stringify(colors);
        }

        // Find the color with the highest count (for auto-reduce)
        function findHighestCountColor(excludeName) {
            var maxName = null, maxCount = 0;
            for (var k in comboColorCounts) {
                if (k === excludeName) continue;
                if (comboColorCounts[k] > maxCount) { maxCount = comboColorCounts[k]; maxName = k; }
            }
            return maxName;
        }

        function enforceColorLimit(newQty) {
            while (getComboTotal() > newQty) {
                var highest = findHighestCountColor(null);
                if (!highest) break;
                comboColorCounts[highest]--;
                if (comboColorCounts[highest] <= 0) delete comboColorCounts[highest];
            }
            syncAllColorUI();
        }

        // ── Click on the color name/circle to toggle select/deselect ──
        window.comboColorToggle = function(box) {
            if (!hasColors) return;
            var colorName = box.dataset.color;
            var curr      = comboColorCounts[colorName] || 0;
            var limit     = getComboLimit();

            if (curr > 0) {
                // Deselect this color entirely
                delete comboColorCounts[colorName];
                syncAllColorUI();
                return;
            }

            // Select with qty=1
            var total = getComboTotal();
            if (total >= limit) {
                // Auto-reduce the highest-count color to make room
                var highest = findHighestCountColor(colorName);
                if (highest) {
                    comboColorCounts[highest]--;
                    if (comboColorCounts[highest] <= 0) delete comboColorCounts[highest];
                } else {
                    return; // cannot add
                }
            }
            comboColorCounts[colorName] = 1;
            syncAllColorUI();
        };

        // ── +/- buttons for per-color quantity ────────────────────────
        window.comboColorQty = function(box, delta) {
            if (!hasColors) return;
            var colorName = box.dataset.color;
            var curr      = comboColorCounts[colorName] || 0;
            var limit     = getComboLimit();
            var newVal    = curr + delta;

            if (newVal <= 0) {
                // Deselect
                delete comboColorCounts[colorName];
                syncAllColorUI();
                return;
            }

            if (delta > 0) {
                var total = getComboTotal();
                if (total >= limit) {
                    // Auto-reduce another color to make room
                    var highest = findHighestCountColor(colorName);
                    if (highest) {
                        comboColorCounts[highest]--;
                        if (comboColorCounts[highest] <= 0) delete comboColorCounts[highest];
                    } else {
                        return; // all other colors at 0, can't add more
                    }
                }
            }

            comboColorCounts[colorName] = newVal;
            syncAllColorUI();
        };

        // ── Validate colors before cart ────────────────────────────────
        function validateComboColors() {
            var isComboInp = document.getElementById('combo_is_combo');
            if (!isComboInp || parseInt(isComboInp.value) !== 1 || !hasColors) return true;
            var qtyInput = document.querySelector('input[name="quantity"]');
            var qty      = parseInt(qtyInput ? qtyInput.value : 1) || 1;
            var total    = 0;
            for (var k in comboColorCounts) total += comboColorCounts[k];
            if (total < qty) {
                var msg = 'Please select ' + qty + ' color(s). You selected ' + total + '.';
                if (typeof AIZ !== 'undefined' && AIZ.plugins && AIZ.plugins.toastr) {
                    AIZ.plugins.toastr('warning', msg);
                } else { alert(msg); }
                return false;
            }
            return true;
        }

        var origAddToCart = window.addToCart;
        window.addToCart = function() {
            if (!validateComboColors()) return;
            if (typeof origAddToCart === 'function') origAddToCart.apply(this, arguments);
        };
        var origBuyNow = window.buyNow;
        window.buyNow = function() {
            if (!validateComboColors()) return;
            if (typeof origBuyNow === 'function') origBuyNow.apply(this, arguments);
        };

        // ── Init ──────────────────────────────────────────────────────
        document.addEventListener('DOMContentLoaded', function() {
            listenQtyChanges();

            if (tiers.length > 0) {
                var highestTier = tiers[tiers.length - 1];
                var qtyInput = document.querySelector('input[name="quantity"]');
                if (qtyInput) qtyInput.value = parseInt(highestTier.qty);
                onQtyChange(parseInt(highestTier.qty));
            }
        });

    })();
    </script>
    @endif
    <!-- ======================== Combo Deal JS End ================== -->
@endsection
