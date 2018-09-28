/**
 * Created by Anh on 8/22/2016.
 */
var startFrom = 12;
var currentURI = new URI(window.location.href);

$(function () {
    function initPriceRanges() {
        flog('initPriceRanges');

        var uriSearch = currentURI.search(true);
        var startPrice = uriSearch.startPrice;
        var endPrice = uriSearch.endPrice;
        var pointRangeItems = $('.facetSearchTerm a.list-group-item');
        pointRangeItems.filter('[data-startprice="' + startPrice + '"][data-endprice="' + endPrice + '"]').addClass('selected');

        pointRangeItems.on('click', function (e) {
            e.preventDefault();

            var item = $(this);

            if (item.hasClass('selected')) {
                item.removeClass('selected');
            } else {
                item.addClass('selected');
            }

            doProductSearch();
        });
    }


    function initCategories() {
        flog('initCategories');
//        var categoryItems = $('.ecomStoreCategoriesList a.list-group-item');
//        categoryItems.filter('[href='+window.location.pathName+']').addClass('selected');
//        categoryItems.on('click', function (e) {
//            e.preventDefault();
//            var item = $(this);
//            var newUrl = "";
//            if (item.hasClass('selected')){
//                item.removeClass('selected');
//                newUrl = item.attr('href').split('/').slice(0,2).join('/') + window.location.search;
//            } else {
//                categoryItems.filter('.selected').removeClass('selected');
//                item.addClass('selected');
//                newUrl = item.attr('href') + window.location.search;
//            }
//
//            window.history.pushState("", "", newUrl);
//            doProductSearch();
//        });
    }


    function doProductSearch() {
        flog('doProductSearch1')
        $(".products-list").html('');
        var inifiniteLoader = $('#inifiniteLoader');
        inifiniteLoader.show();

        var newUrl = new URI(window.location.pathname);

        var input = $(".ecom-search-input");
        newUrl.setSearch('q', input.val().trim());

        var attrNameMap = {};
        var startPriceMap = [];
        var endPriceMap = [];
        $('.facetSearchTerm a.list-group-item.selected').each(function(i, n) {
            var item = $(n);
            var startprice = item.data('startprice');
            if( !isEmpty(startprice)) {
                startPriceMap.push(startprice);

            }
            var endprice = item.data('endprice');
            if( !isEmpty(endprice)) {
                endPriceMap.push(endprice);
            }
            var attName = item.data("attname");
            if( !isEmpty(attName)) {
                var attVal = item.data("attvalue");
                if (attrNameMap[attName] && Array.isArray(attrNameMap[attName])){
                    attrNameMap[attName].push(attVal);
                } else {
                    attrNameMap[attName] = [attVal];
                }
            }
        });

        newUrl.setSearch('startPrice', startPriceMap);
        newUrl.setSearch('endPrice', endPriceMap);
        for (var key in attrNameMap){
            newUrl.setSearch(key, attrNameMap[key]);
        }

        window.history.pushState("", document.title, newUrl.toString());

        flog("doing search1", window.location.href);

        $.ajax({
            type: 'GET',
            url: newUrl.toString(),
            success: function (data) {
                flog("success");
                var breadcrumb = $(data).find(".breadcrumb");
                $(".breadcrumb").replaceWith(breadcrumb);

                var fragment = $(data).find(".products-list");
                if (fragment.length > 0) {
                    $(".products-list").replaceWith(fragment);
                } else {
                    $(".products-list").empty();
                    $(".products-list").append("<p>Sorry, we couldnt find any products for you</p>");
                }

                $('.product-title').dotdotdot({
                    height: 55
                });

                $('.product-content').dotdotdot({
                    height: 60
                });
                startFrom = 12;
                inifiniteLoader.removeClass('limited').hide();
            },
            error: function (resp) {
                inifiniteLoader.removeClass('limited').hide();
                Msg.error("An error occurred doing the product search. Please check your internet connection and try again");
            }
        });
    }

    function doPaginate() {
        var newUrl = new URI(window.location.href);
        newUrl.addSearch('pageFrom', startFrom);
        var inifiniteLoader = $('#inifiniteLoader');
        inifiniteLoader.show();

        $.ajax({
            type: 'GET',
            url: newUrl.toString(),
            success: function (data) {
                var kcom2ProductListHolder = $(data).find('.kcom2ProductListHolder');
                var products = kcom2ProductListHolder.find('.product-item');

                if (products.length > 0) {
                    $('.kcom2ProductListHolder').find('.products-list').append(products);
                    startFrom = startFrom + 12;
                } else {
                    inifiniteLoader.addClass('limited');
                }

                inifiniteLoader.hide();
            },
            error: function (resp) {
                Msg.error("An error occured doing the product search. Please check your internet connection and try again");
                inifiniteLoader.hide();
            }
        });
    }

    function initSortBy() {
        flog('initSortBy');

        var urlSort = $('.productSortDropdown');
        var sortByItems = urlSort.find('li');
        var newUrl = new URI(window.location.href);
        var queries = newUrl.search(true);
        if (queries.sort && queries.asc) {
            sortByItems.removeClass('active');
            var text = sortByItems.find('a[data-sort=' + queries.sort + '][data-asc=' + queries.asc + ']').parent().addClass('active').text();
            urlSort.find('.selected-text').text(text);
        }

        sortByItems.on('click', 'a', function (e) {
            e.preventDefault();
            var sort = $(this).attr('data-sort');
            var asc = $(this).attr('data-asc');
            var newUrl = new URI(window.location.href);
            newUrl.setSearch('sort', sort);
            newUrl.setSearch('asc', asc);
            $(this).parent().addClass('active').siblings('li').removeClass('active');
            urlSort.find('.selected-text').text($(this).text());
            window.history.pushState("", document.title, newUrl.toString());
            doProductSearch();
        });
    }

    var init = function () {
        var shouldLoadMore = $('.shouldLoadMore').length > 0;
        var $ecomStoreCategoriesList = $('.ecomStoreCategoriesList');
        var shouldInit = $ecomStoreCategoriesList.length > 0;
        var isReadyInitEvent = $ecomStoreCategoriesList.data('ready-init-event');
        if (!window.contentEditing && shouldInit && !isReadyInitEvent) {
            $ecomStoreCategoriesList.data('ready-init-event', true);
            initPriceRanges();
            initCategories();
            initSortBy();
            if (!shouldLoadMore) {
                $(window).scroll(function () {
                    if (!$('#inifiniteLoader').hasClass('limited') && $('#inifiniteLoader').is(':hidden') && $(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
                        doPaginate();
                    }
                });
            }

        }
    };

    init();

});
