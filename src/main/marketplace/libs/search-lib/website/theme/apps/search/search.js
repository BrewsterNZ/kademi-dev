;(function ($) {
    $(function () {
        var inputs = $('input[name=omni]');
            if( inputs.length > 0 ) {
            var txtKeyword = inputs.omniSearch({
                overrideEnterButton: false,
                searchInFocus: true
            });

            txtKeyword.closest('form').on('submit', function (e) {
                var keyword = txtKeyword.val().trim();

                if (!keyword) {
                    e.preventDefault();
                }
            });
        }
    });

})(jQuery);