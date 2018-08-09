(function ($) {
    $(function () {
        var components = $('.salesLeaderboardWeb');

        if (components.length > 0) {
            $(document.body).on('pageDateChanged', function () {
                components.reloadFragment({
                    whenComplete: function (resp) {
                        debugger;
                        var list = resp.find('.salesLeaderboardWeb');
                        components.each(function (index) {
                            var item = $(this);
                            item.html($(list[index]).html());
                        })
                    }
                });
            });
        }
    });

})(jQuery);