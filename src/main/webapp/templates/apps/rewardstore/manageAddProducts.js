(function ($) {
    function initAddProducts() {
        flog('add prods', $('#addProducts'));
        $('#addSelected').click(function (e) {
            e.preventDefault();
            Msg.info('Adding selected', 'manageAddProducts');
            var checks = $('#products-list').find('input:checked');
            var ids = [];
            checks.each(function (count, item) {
                ids.push($(item).data('pid'));
            });

            updateProductSelected(ids.join(','));
        });

        $('.addAllMatched').click(function (e) {
            e.preventDefault();
            Kalert.confirm('This will add all products matching the current criteria to the reward store. Do you want to proceed?', 'Yes', function () {
                $.ajax({
                    url: window.location,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        addAllMatched: true
                    },
                    success: function (data, textStatus, jqXHR) {
                        window.location.reload();
                    },
                    error: function () {
                        Msg.error('Oh No! Something went wrong!', 'manageAddProducts');
                    }
                });
            });

        });
    }

    function updateCategory() {
        var txtQuery = $('#product-query');
        var cbbCategory = $('select.category');

        var query = (txtQuery.val() || '').replace(/\s*([^\s]+\s?)\s*/g, '$1').trim();
        if (query) {
            query = query.split(' ');

            var selectedCategories = [];
            $.each(query, function (i, value) {
                if (value.indexOf('category:') === 0) {
                    selectedCategories.push(value.replace('category:', ''));
                }
            });
            cbbCategory.selectpicker('val', selectedCategories);
        }
    }

    function initSearchProduct() {
        var txtQuery = $('#product-query');
        var cbbCategory = $('select.category');
        updateCategory();

        txtQuery.keyup(function () {
            typewatch(function () {
                updateCategory();
                doProductSearch();
            }, 500);
        });

        cbbCategory.on('change', function (e) {
            var query = (txtQuery.val() || '').replace(/\s*([^\s]+\s?)\s*/g, '$1').trim();
            var newQuery = [];
            if (query) {
                query = query.split(' ');

                $.each(query, function (i, value) {
                    if (value.indexOf('category:') === -1) {
                        newQuery.push(value);
                    }
                });
            }

            var selectCategories = cbbCategory.val() || [];
            $.each(selectCategories, function (i, value) {
                newQuery.push('category:' + value);
            });

            txtQuery.val(newQuery.join(' '));

            doProductSearch();
        });

        $(document.body).on('change', '#search-library', function (e) {
            doProductSearch();
        });
    }

    function initSortable() {
        $(document.body).on('click', '.sort-field', function (e) {
            e.preventDefault();
            var a = $(e.target);
            var uri = URI(window.location);
            var field = a.attr('id');

            var dir = 'asc';
            if (field == getSearchValue(window.location.search, 'sortfield')
                && 'asc' == getSearchValue(window.location.search, 'sortdir')) {
                dir = 'desc';
            }
            uri.setSearch('sortfield', field);
            uri.setSearch('sortdir', dir);

            window.history.pushState('', '', uri.toString());

            doProductSearch();
        });
    }

    function doProductSearch() {
        flog('doProductSearch');
        var query = $('#product-query').val();
        var orgId = $('#search-library').val();

        flog('doSearch', query, orgId);
        var uri = new URI(window.location.pathname);
        uri.setSearch('addProducts', "");
        uri.setSearch('q', query);
        uri.setSearch('l', orgId);

        var sortfield = getSearchValue(window.location.search, 'sortfield');
        var sortdir = getSearchValue(window.location.search, 'sortdir');

        if (sortfield && sortdir) {
            uri.setSearch('sortfield', sortfield);
            uri.setSearch('sortdir', sortdir);
        }
        var newUrl = uri.toString();

        window.history.replaceState('', '', newUrl);
        $.ajax({
            type: 'GET',
            url: newUrl,
            success: function (data) {
                var fragment = $(data).find('#searchResults');
                $('#searchResults').replaceWith(fragment);
            },
            error: function (resp) {
                Msg.error('An error occured doing the search. Please check your internet connection and try again', 'manageAddProducts');
            }
        });
    }

    function initSelectPicker() {
        $('.selectpicker').each(function () {
            var selectpicker = $(this);
            flog("initSelectPicker", selectpicker);

            selectpicker.selectpicker({
                liveSearch: true,
                noneSelectedText: "Category",
                style: 'btn btn-sm btn-default'
            });

            if (selectpicker.hasClass('category') ) {
                selectpicker.ajaxSelectPicker({
                    ajax: {
                        url: '/categories/',
                        type: 'POST',
                        dataType: 'json',
                        data: function () {
                            var params = {
                                search: '{{{q}}}'
                            };

                            return params;
                        }
                    },
                    cache: false,
                    preserveSelected: true,
                    preserveSelectedPosition: 'before',
                    emptyRequest: true,
                    clearOnEmpty : false,
                    minLength : 0,

                    preprocessData: function (resp) {
                        flog("Search resp");
                        var categories = [];
                        if (resp && resp.status) {
                            $.each(resp.data, function (i, n) {
                                categories.push({
                                    'value': n.name,
                                    'text': n.title,
                                    'data': {'subtext': n.parentTitle},
                                    'disabled': false
                                });
                            });
                        }

                        return categories;
                    },
                    locale: {
                        statusInitialized: 'Search to see more...'
                    }
                });

            }
        });
    }

    function updateProductSelected(productIds) {
        var data = {};
        data['addProductIds'] = productIds;

        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            datatype: 'json',
            data: data,
            success: function (response) {
                flog('response', response, response.status);
                if (response.status) {
                    Msg.info(response.messages[0], 'manageAddProducts');
                    window.location.reload();
                } else {
                    Msg.error('There was an error changing the product status', 'manageAddProducts');
                }
            },
            error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
                flog('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
                Msg.error('There was an error changing the product inclusion status', 'manageAddProducts');
            }
        });
    }

    function getSearchValue(search, key) {
        if (search.charAt(0) == '?') {
            search = search.substr(1);
        }
        parts = search.split('&');
        if (parts) {
            for (var i = 0; i < parts.length; i++) {
                entry = parts[i].split('=');
                if (entry && key == entry[0]) {
                    return entry[1];
                }
            }
        }
        return '';
    }

    // Run init methods
    $(function () {
        initAddProducts();
        initSortable();
        initSelectPicker();
        initSearchProduct();
    });
})(jQuery);