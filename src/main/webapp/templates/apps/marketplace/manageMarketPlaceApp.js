function initMarketPlaceApp() {
    initSubmitReview();
    initInstallApp();
    initMasonryAdapter();
}

function initMasonryAdapter() {
    flog('initMasonryAdapter');
    
    var screenshotSwitcher = $('a[href=#screenshots]');
    
    screenshotSwitcher.on('shown.bs.tab', function () {
        if (!screenshotSwitcher.attr('data-masonry-adapted')) {
            $('.masonry-panel').masonry('layout');
            screenshotSwitcher.attr('data-masonry-adapted', 'true');
        }
    });
}

function initSubmitReview() {
    $('#reviewForm').forms({
        onSuccess: function (resp) {
            $('#app-reviews-list').reloadFragment({
                url: window.location.href
            });
        }
    });
}

function initInstallApp() {
    $(document.body).on('click', '.btn-install-app', function (e) {
        e.preventDefault();
        
        var btn = $(this);
        var title = btn.data('title');
        var websiteName = btn.data('websitename');
        var websiteBranch = btn.data('websitebranch');

        btn.find('.fa').addClass('fa-cog fa-spin').removeClass('fa-cloud-download');
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                installItem: true,
                websiteName: websiteName,
                websiteBranch: websiteBranch
            },
            dataType: 'json',
            success: function (data) {
                flog("success", data);
                if (data.status) {
                    Msg.success('Successfully installed ' + title);
                    window.location.reload();
                } else {
                    Msg.warning('There was a problem installing ' + title + ". " + data.messages)
                    btn.find('.fa').removeClass('fa-cog fa-spin').addClass('fa-cloud-download');
                }
            },
            error: function (resp) {
                Msg.error("An error occured doing the publish. Please check your internet connection and try again");
                btn.find('.fa').removeClass('fa-cog fa-spin').addClass('fa-cloud-download');
            }
        });
    });
}

var __slice = [].slice;
(function (e, t) {
    var n;
    n = function () {
        function t(t, n) {
            var r, i, s, o = this;
            this.options = e.extend({}, this.defaults, n);
            this.$el = t;
            s = this.defaults;
            for (r in s) {
                i = s[r];
                if (this.$el.data(r) != null) {
                    this.options[r] = this.$el.data(r)
                }
            }
            this.createStars();
            this.syncRating();
            this.$el.on("mouseover.starrr", "span", function (e) {
                return o.syncRating(o.$el.find("span").index(e.currentTarget) + 1)
            });
            this.$el.on("mouseout.starrr", function () {
                return o.syncRating()
            });
            this.$el.on("click.starrr", "span", function (e) {
                return o.setRating(o.$el.find("span").index(e.currentTarget) + 1)
            });
            this.$el.on("starrr:change", this.options.change)
        }
        
        t.prototype.defaults = {
            rating: void 0,
            numStars: 5,
            change: function (e, t) {
            }
        };
        t.prototype.createStars = function () {
            var e, t, n;
            n = [];
            for (e = 1, t = this.options.numStars; 1 <= t ? e <= t : e >= t; 1 <= t ? e++ : e--) {
                n.push(this.$el.append("<span class='fa fa-star-o'></span>"))
            }
            return n
        };
        t.prototype.setRating = function (e) {
            if (this.options.rating === e) {
                e = void 0
            }
            this.options.rating = e;
            this.syncRating();
            return this.$el.trigger("starrr:change", e)
        };
        t.prototype.syncRating = function (e) {
            var t, n, r, i;
            e || (e = this.options.rating);
            if (e) {
                for (t = n = 0, i = e - 1; 0 <= i ? n <= i : n >= i; t = 0 <= i ? ++n : --n) {
                    this.$el.find("span").eq(t).removeClass("fa-star-o").addClass("fa-star")
                }
            }
            if (e && e < 5) {
                for (t = r = e; e <= 4 ? r <= 4 : r >= 4; t = e <= 4 ? ++r : --r) {
                    this.$el.find("span").eq(t).removeClass("fa-star").addClass("fa-star-o")
                }
            }
            if (!e) {
                return this.$el.find("span").removeClass("fa-star").addClass("fa-star-o")
            }
        };
        return t
    }();
    return e.fn.extend({
        starrr: function () {
            var t, r;
            r = arguments[0], t = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            return this.each(function () {
                var i;
                i = e(this).data("star-rating");
                if (!i) {
                    e(this).data("star-rating", i = new n(e(this), r))
                }
                if (typeof r === "string") {
                    return i[r].apply(i, t)
                }
            })
        }
    })
})(window.jQuery, window);

$(function () {
    $(".starrr").starrr();
    $('#new-review').autogrow();
    var ratingsField = $('#ratings-hidden');
    $('.starrr').on('starrr:change', function (e, value) {
        ratingsField.val(value);
    });
});