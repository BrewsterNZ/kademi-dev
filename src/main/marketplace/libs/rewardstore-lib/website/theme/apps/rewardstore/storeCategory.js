(function ($, window) {
    var startFrom = 12;
    var currentURI = new URI(window.location.href);
    
    $(function () {
        var shouldLoadMore = $('.shouldLoadMore').length > 0;
        var shouldInit = $('.rewardStoreCategoryProductsComponent').length > 0;
        
        if (!$(document.body).hasClass('content-editor-page') && shouldInit) {
            initPointsRanges();
            initCategories();
            initProductSearch();
            initSortBy();
            initLoadMore();
            
            if (!shouldLoadMore) {
                $(window).scroll(function () {
                    var infiniteLoader = $('#infiniteLoader');
                    if (!infiniteLoader.hasClass('limited') && infiniteLoader.is(':hidden') && ($(window).scrollTop() + 100) >= $(document).height() - $(window).height()) {
                        doPaginate();
                    }
                });
            }
        }
    });
    
    function initLoadMore() {
        $(document.body).on('click', '.btn-load-more', function (e) {
            e.preventDefault();
            doPaginate();
        });
    }
    
    function initProductSearch() {
        var timer;
        $('#omniSearchInput[data-type=RewardProducts]').on('input', function () {
            var input = $(this);
            
            clearTimeout(timer);
            timer = setTimeout(function () {
                var newUrl = new URI(window.location.href);
                newUrl.setSearch('q', input.val().trim());
                window.history.pushState("", document.title, newUrl.toString());
                doProductSearch();
            }, 300);
        });
    }
    
    function initPointsRanges() {
        flog('initPointsRanges');
        
        var uriSearch = currentURI.search(true);
        var startPrice = uriSearch.startPrice;
        var endPrice = uriSearch.endPrice;
        var pointRangeItems = $('.pointsRangeList a.list-group-item');
        pointRangeItems.filter('[data-startprice="' + startPrice + '"][data-endprice="' + endPrice + '"]').addClass('selected');
        
        pointRangeItems.on('click', function (e) {
            e.preventDefault();
            
            var item = $(this);
            var newUrl = new URI(window.location.href);
            newUrl.removeSearch('startPrice');
            newUrl.removeSearch('endPrice');
            
            if (item.hasClass('selected')) {
                item.removeClass('selected');
            } else {
                pointRangeItems.filter('.selected').removeClass('selected');
                item.addClass('selected');
                newUrl.addSearch('startPrice', item.attr('data-startprice'));
                newUrl.addSearch('endPrice', item.attr('data-endprice'));
            }
            
            window.history.pushState("", document.title, newUrl.toString());
            doProductSearch();
        });
    }
    
    function initCategories() {
        flog('initCategories');
        var categoryItems = $('.rewardStoreCategoriesList a.list-group-item');
        categoryItems.filter('[href=' + window.location.pathName + ']').addClass('selected');
        categoryItems.on('click', function (e) {
            e.preventDefault();
            var item = $(this);
            var newUrl = "";
            if (item.hasClass('selected')) {
                item.removeClass('selected');
                newUrl = item.attr('href').split('/').slice(0, 2).join('/') + window.location.search;
            } else {
                categoryItems.filter('.selected').removeClass('selected');
                item.addClass('selected');
                newUrl = item.attr('href') + window.location.search;
            }
            
            window.history.pushState("", "", newUrl);
            doProductSearch();
        });
    }
    
    function doProductSearch() {
        flog('doProductSearch')
        $("#products-list").html('');
        showProductLoading();
        
        $.ajax({
            type: 'GET',
            url: window.location.href,
            success: function (data) {
                var fragmentProducts = $(data).find('#products-list');
                var fragmentTools = $(data).find('#products-list-tools');
                $('#products-list').replaceWith(fragmentProducts);
                $('#products-list-tools').replaceWith(fragmentTools);
                dotdotdotProduct();
                startFrom = 12;
            },
            error: function (resp) {
                Msg.error("An error occurred doing the product search. Please check your internet connection and try again");
            }
        });
    }
    
    function doPaginate() {
        var newUrl = new URI(window.location.href);
        newUrl.addSearch('fromRange', startFrom);
        showProductLoading();
        
        $.ajax({
            type: 'GET',
            url: newUrl.toString(),
            success: function (data) {
                flog("success");
                var products = $(data).find('#products-list').find('.product-item');
                var fragmentTools = $(data).find('#products-list-tools');
                
                $('#products-list-tools').replaceWith(fragmentTools);
                
                if (products.length > 0) {
                    $("#products-list .row").append(products);
                    startFrom = startFrom + 12;
                    dotdotdotProduct();
                }
            },
            error: function (resp) {
                Msg.error("An error occured doing the product search. Please check your internet connection and try again");
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
    
    function showProductLoading() {
        $('#infiniteLoader').show();
        $('.btn-load-more-wrapper').hide();
    }
    
})(jQuery, window);