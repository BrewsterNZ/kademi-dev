(function ($) {
    var KEYMAP = {
        ENTER: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40
    };


    var EcomSearch = function (input, options) {
        flog('[EcomSearch]', input, options);

        this.input = $(input)
        this.options = $.extend({}, EcomSearch.DEFAULTS, options);
        this.init();
    };

    EcomSearch.version = '1.0.0';

    EcomSearch.DEFAULTS = {
        renderNoSuggestion: function () {
            return '<li class="no-result text-muted">No results found</li>';
        },
        onSelectSuggestion: function (suggestion) {
            flog(this, suggestion);
        },
        searchInFocus: false
    };

    EcomSearch.prototype.init = function () {
        flog('[EcomSearch] Initializing...');

        var self = this;

        self.input.attr('autocomplete', 'off');
        self.input.wrap('<div class="ecom-search-wrapper"></div>');
        self.input.after(
            '<ul class="dropdown-menu ecom-search-suggestions" style="display: none;" tabindex="-1"></ul>'
        );
        self.input.attr('tabindex', '-1').addClass('ecom-search-input');
        self.suggestionsList = self.input.siblings('.ecom-search-suggestions');

        var timer;
        self.input.on({
            input: function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.search(self.input.val());
                }, 250);
            },
            keydown: function (e) {
                switch (e.keyCode) {
                    case KEYMAP.ESC:
                        self.suggestionsList.css('display', 'none');
                        break;

                    case KEYMAP.UP:
                    case KEYMAP.DOWN:
                        e.preventDefault();

                        var suggestions = self.suggestionsList.find('.ecom-search-suggestion');
                        var suggestionsLength = suggestions.length;
                        var actived = suggestions.filter('.active');
                        var index;

                        if (actived.length === 0) {
                            index = e.keyCode === KEYMAP.UP ? suggestionsLength - 1 : 0;
                        } else {
                            var activeIndex = actived.index();
                            if (e.keyCode === KEYMAP.UP) {
                                index = activeIndex === 0 ? suggestionsLength - 1 : activeIndex - 1;
                            } else {
                                index = activeIndex === suggestionsLength - 1 ? 0 : activeIndex + 1;
                            }
                        }
                        actived.removeClass('active');
                        suggestions.eq(index).addClass('active');

                        break;

                    case KEYMAP.ENTER:
                            e.preventDefault();
                            window.location.href = self.options.url + '?q=' + self.input.val();
                        

                        break;

                    default:
                    // Do nothing
                }
            },
            blur: function () {
                setTimeout(function () {
                    self.suggestionsList.css('display', 'none');
                }, 250);
            }
        });

        if (self.options.searchInFocus) {
            self.input.on('focus', function () {
                self.search(self.input.val());
            });
        }

        self.suggestionsList.on({
            mouseenter: function () {
                self.suggestionsList.find('.ecom-search-suggestion.active').removeClass('active');
                $(this).addClass('active');
            },
            mouseleave: function () {
                $(this).removeClass('active');
            },
            click: function (e) {
                e.preventDefault();

                var suggestion = $(this);

                if (typeof self.options.onSelectSuggestion === 'function') {
                    self.options.onSelectSuggestion.call(self.input, suggestion);
                }

                window.location.href = suggestion.find('a').attr('href');
                self.suggestionsList.css('display', 'none');
            }
        }, '.ecom-search-suggestion');

        flog('[EcomSearch] Initialized');
    };

    EcomSearch.prototype.search = function (query) {
        flog('[EcomSearch] Search: ' + query);

        var self = this;

        var showNoResult = function () {
            self.suggestionsList.html(self.options.renderNoSuggestion());
        };

        $.ajax({
            type: 'get',
            dataType: 'html',
            url: self.options.url,
            data: {
                suggestions : query
            },
            success: function (resp) {
                flog('[EcomSearch] Get response from server', resp);

                if (resp) {
                    self.suggestionsList.html(resp);
                } else {
                    showNoResult();
                }

                self.suggestionsList.css('display', 'block');
            },

            error: function (jqXhr, status, error) {
                flog('[EcomSearch] Get error response from server', jqXhr, status, error);
                self.suggestionsList.html(self.options.renderNoSuggestion());
                self.suggestionsList.css('display', 'block');
            }
        });
    };

    $.fn.ecomSearch = function (options) {
        return this.each(function () {
            var input = $(this)
            var data = input.data('ecomSearch');

            if (!data) {
                input.data('ecomSearch', (data = new EcomSearch(input, options)));
            }

            if (typeof options == 'string') {
                data[options].apply(input, Array.prototype.slice.call(arguments, 1));
            }
        })
    };

    $.fn.ecomSearch.constructor = EcomSearch;

})(jQuery);