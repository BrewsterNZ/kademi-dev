$(function () {
    function initToggleWishList() {
        $(document).on('click', '.btnToggleWishList, .btn-remove-wishlist', function (e) {
            e.preventDefault();

            var product = $(this).attr('href');
            var store = $(this).attr('data-store');
            var path = $(this).attr('data-path');
            var on = $(this).attr('data-on');
            var off = $(this).attr('data-off');
            var btn = $(this);
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/wishlist/',
                data: {
                    store: store,
                    path: path,
                    product: product,
                    toggleWishList: true
                },
                success: function (resp) {
                    if (resp && resp.status){
                        if (btn.hasClass('btn-remove-wishlist')){
                            btn.closest('.product-item').remove();
                            Msg.success('Removed from wish list');
                            return;
                        }

                        btn.find('i').toggleClass(on);
                        btn.find('i').toggleClass(off);

                        if (btn.find('i').hasClass(on)){
                            Msg.success('Added to wish list');
                            btn.attr('title', 'Remove from wishlist')
                        }

                        if (btn.find('i').hasClass(off)){
                            Msg.success('Removed from wish list');
                            btn.attr('title', 'Add to wishlist')
                        }
                    }
                },
                error: function () {
                    Msg.warning('There was an error occurred. Please try again later');
                }
            })
        })
    }

    initToggleWishList();
});