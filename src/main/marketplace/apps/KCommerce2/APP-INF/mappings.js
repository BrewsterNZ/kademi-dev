
// this is for when a product is accessed directly under a store url, ie without a category
var productInStoreMapping = controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .title(function (page) {
            return "TODO";
        })
        // .seoContent('_genDealSeoContent')
        .defaultView(views.templateView('/theme/apps/KCommerce2/viewProduct.html'))
        .pathSegmentResolver('productInStore', 'resolveProduct');


var categoryMapping = controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .title(function (page) {
            return "TODO";
        })
        // .seoContent('_genDealSeoContent')
        //.defaultView(views.templateView('/theme/apps/KCommerce2/viewCategory.html'))
        .addMethod('GET', 'doEcomSearch', 'q')
        .addMethod('GET', 'doSuggestionList', 'suggestions')
        .addMethod('GET', 'doEcomList')

        .pathSegmentResolver('category', 'resolveCategory');

var cartMapping = controllerMappings
        .websiteController()
        .pathSegmentName('cart')
        .enabled(true)
        .isPublic(true)
        .defaultView(views.templateView('/theme/apps/KCommerce2/storeCheckout.html'))
        .postPriviledge('READ_CONTENT')
        .addMethod('POST', 'setCartItem', 'quantity')
        .addMethod('POST', 'removeCartItem', 'removeLineId')
        .addMethod('POST', 'setCartItemQuantity', 'newQuantity')
        .addMethod('POST', 'checkout', 'processCartId')
        .addMethod('POST', 'applyPromoCodes', 'promoCodes')
        .addMethod('POST', 'createAccount', 'kcom2Firstname')
        .addMethod('POST', 'findProfile', 'findProfileEmail')
        .addMethod('POST', 'saveAddress', 'addressLine1')
        .addMethod('POST', 'saveShippingProfider', 'shippingProviderId')
;




controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        // .mountRepository(g._config.REPO_NAME)
        .pathSegmentResolver('store', 'resolveStoreName')
        .title(function (page) {
            return "TODO";
        })
        // .seoContent('_genDealSeoContent')
        .postPriviledge('READ_CONTENT')
        .child(productInStoreMapping)
        .child(categoryMapping)
        .child(cartMapping)
        .addMethod('GET', 'doEcomSearch', 'q')
        .addMethod('GET', 'doSuggestionList', 'suggestions')
        .addMethod('GET', 'doEcomList')
        .build();

function doSuggestionList(page, params) {
    var query = params.suggestions;
    log.info("doSuggestionList: {}", query);
    var store = page.attributes.store;
    var searchResults = productInCategorySearch(store, page.attributes.category, query); // aggregation to find top cats with matching products
    page.attributes.suggestionList = searchResults; // make available to templates
    return views.templateView("KCommerce2/suggestionList");
}

function doEcomSearch(page, params) {
    var query = params.q;
    if (formatter.isEmpty(query)) {
        return doEcomList(page, params);
    }
    log.info("doEcomSearch: {} from {} size {}", query, params.from, params.size);
    var store = page.attributes.store;
    var attributePairs = findAttsInParams(params);
    var searchResults = productSearch(store, page.attributes.category, query, attributePairs, params.pfrom, params.psize);
    page.attributes.searchResults = searchResults; // make available to templates
    page.attributes.categories = listCategories(store, page.attributes.category);
    findAttributes(page, store, searchResults);
    return views.templateView("KCommerce2/searchResults");
}

function doEcomList(page, params) {
    log.info("doEcomList:");
    var store = page.attributes.store;
    var attributePairs = findAttsInParams(params);
    var searchResults = productSearch(store, page.attributes.category, null, attributePairs, params.pfrom, params.psize);
    //log.info("searchResults: " + searchResults);
    page.attributes.searchResults = searchResults; // make available to templates
    page.attributes.categories = listCategories(store, page.attributes.category);
    findAttributes(page, store, searchResults);

    if (page.attributes.category) {
        return views.templateView("KCommerce2/viewCategory");
    } else {
        return views.templateView("KCommerce2/viewStore");
    }
}

/**
 * Look for request params with the same name as attribute names,
 * and build a list of their names and values
 *
 * @param {type} params
 * @returns {undefined}
 */
function findAttsInParams(params) {
    var cm = services.catalogManager;
    var allAttNames = cm.attributeNames();
    var atts = [];
    for( var i=0; i<allAttNames.length; i++) {
        var attName = allAttNames[i].object1;
        var attValue = params.get(attName);
        log.info("findAttsInParams: {} {}", attName, attValue);
        if( !formatter.isEmpty(attValue) ) {
            atts.push({
                "name" : attName,
                "value" : attValue
            });
        }
    }
    return atts;
}

function findAttributes(page, store, searchResults) {
    var minPrice = searchResults.aggregations.asMap.minPrice.value;
    var maxPrice = searchResults.aggregations.asMap.maxPrice.value;
    var attNameBuckets = searchResults.aggregations.asMap.attNames.buckets;
    page.attributes.attributesSummary = findAttributesQuery(store, page.attributes.category, null, minPrice, maxPrice, 5, attNameBuckets);
}

function checkout(page, params, files, form) {
    var processCartId = form.longParam("processCartId");
    log.info('kcom2 checkout checkout', processCartId);
    var totalAmountFromForm = form.bigDecimalParam("cartTotal");
    var paymentProviderId = form.rawParam("paymentProvider");

    var checkoutItems = services.cartManager.checkoutItems;

    if (checkoutItems == null) {
        return views.jsonView(false, "No cart");
    }
    if (checkoutItems.cartId != processCartId) {
        return views.jsonView(false, "Cart is invalid, please refresh your page");
    }
    if (!checkoutItems.totalCost.equals(totalAmountFromForm)) {
        return views.jsonView(false, "The item prices have changed, please refresh your page. " + totalAmountFromForm + " was submitted, current price is " + checkoutItems.totalCost);
    }
    var paymentResult;
    transactionManager.runInTransaction(function () {
        var customerGroup = services.cartManager.getOrCreateCustomerGroup("customers"); // todo move to setting
        var purchaser = services.cartManager.getOrCreatePurchaser(form, customerGroup);
        paymentResult = services.cartManager.doProcessCart(form, checkoutItems, purchaser, paymentProviderId);
    });
    if (paymentResult.paymentCompleted) {
        return views.jsonView(true, "Payment completed");
    } else {
        if (paymentResult.nextHref != null) {
            return views.jsonView(true, "Payment pending", paymentResult.nextHref);
        } else {
            return views.jsonView(false, "Payment failed: " + paymentResult.resultMessage);
        }
    }
}

function saveAddress(page, params, files, form) {
    log.info("saveAddress: form={}", form);
    transactionManager.runInTransaction(function () {
        var cart = services.cartManager.shoppingCart(false);
        cart.addressLine1 = form.cleanedParam("addressLine1");
        cart.addressLine2 = form.cleanedParam("addressLine2");
        cart.addressState = form.cleanedParam("state");
        cart.country = form.cleanedParam("country");
        cart.postcode = form.cleanedParam("postcode");
        services.criteriaBuilders.getBuilder("cart").save(cart);
    });
    return views.jsonView(true, "Updated cart ");
}

function saveShippingProfider(page, params, files, form) {
    log.info("saveAddress: form={}", form);
    transactionManager.runInTransaction(function () {
        var cart = services.cartManager.shoppingCart(false);
        cart.shippingProviderId = form.cleanedParam("shippingProviderId");
        services.criteriaBuilders.getBuilder("cart").save(cart);
    });
    return views.jsonView(true, "Updated shipping provider");
}

function setCartItemQuantity(page, params, files, form) {
    log.info("setCartItem: form={}", form);
    var newQuantity = form.bigDecimalParam("newQuantity");
    var changeItemId = form.longParam("changeItemId");
    var cart = services.cartManager.shoppingCart(false);
    var item = cart.item(changeItemId);
    item.quantity = newQuantity;
    transactionManager.runInTransaction(function () {
        services.criteriaBuilders.getBuilder("productOrder").save(item);
    });
    return views.jsonView(true, "Updated " + item.productSku.title + " to quantity " + item.quantity);
}

function setCartItem(page, params, files, form) {
    log.info("setCartItem: form={}", form);
    var quantity = form.integerParam("quantity");
    var skuId = form.longParam("skuId");
    var sku = services.criteriaBuilders.get("productSku").eq("id", skuId).executeSingle();
    var store = page.attributes.store;

    var cart = services.cartManager.shoppingCart(true);
    services.cartManager.addOrUpdateItem(cart, sku, quantity, store, true);
    return views.jsonView(true, "Added " + sku.title);
}

function removeCartItem(page, params, files, form) {
    log.info("removeCartItem: form={}", form);
    var lineId = form.rawParam("removeLineId");
    var didRemove;
    transactionManager.runInTransaction(function () {
        didRemove = services.cartManager.removeItem(lineId);
    });

    if (didRemove) {
        return views.jsonView(true, "Removed " + lineId);
    } else {
        return views.jsonView(true, "Didnt find to remove " + lineId);
    }

}

function applyPromoCodes(page, params, files, form) {
    log.info("applyPromoCodes:");
    var promoCodes = form.rawParam("promoCodes");

    var jsonResult;
    transactionManager.runInTransaction(function () {
        var codesArr = formatter.splitByAnything(promoCodes);
        var codesList = formatter.newArrayList(codesArr);
        if( formatter.isEmpty(codesList)) {
            jsonResult = views.jsonView(false, "Please enter promotion or voucher codes");
        } else {
            var cart = services.cartManager.shoppingCart(true);
            var store = page.attributes.store;
            services.cartManager.applyPromoCodes(cart, store, codesList);
            jsonResult = views.jsonView(true, "Applied codes " + promoCodes);
        }
    });

    return jsonResult;
}

function resolveStoreName(rf, groupName, groupVal) {
    var store = services.criteriaBuilders.get("ecommerceStore")
            .eq("name", groupVal)
            .eq("website", rf.website)
            .executeSingle();
    if( store !== null) {
        log.info("resolveStoreName: found store: {}", store.name);
    }
    return store;
}

function resolveProduct(rf, groupName, groupVal, mapOfGroups) {
    var store = mapOfGroups.get("store");
    // First try the webname
    var productInEcom = services.criteriaBuilders.get("productInEComStore")
            .join("product", "p")
            .eq("p.webName", groupVal)
            .eq("store", store)
            .executeSingle();

    if( productInEcom !== null ) {
        log.info("found product from webName");
    }

    if (productInEcom === null) {
        // Didnt find webname, so try product name
        productInEcom = services.criteriaBuilders.get("productInEComStore")
                .join("product", "p")
                .eq("p.name", groupVal)
                .eq("store", store)
                .executeSingle();
    }

    if (productInEcom === null) {
        // Still nuttin, try using the segment as a product ID
        var id = formatter.toLong(groupVal, true);
        if (id !== null) {
            productInEcom = services.criteriaBuilders.get("productInEComStore")
                    .join("product", "p")
                    .eq("p.id", id)
                    .eq("store", store)
                    .executeSingle();
        }
    }

    if( productInEcom !== null) {
        var product = productInEcom.product;
        log.info("resolveProduct: found product: id={} name={} webname={} from search={}", product.id, product.name, product.webName, groupVal);
    }
    return productInEcom;
}


function resolveCategory(rf, groupName, groupVal, mapOfGroups) {
    // we might want to use this later
    var store = mapOfGroups.get("store");

    var category = services.criteriaBuilders.get("category")
            .eq("name", groupVal)
            .executeSingle();
    if( category !== null) {
        log.info("resolveCategory: found category: {}", category.name);
    }
    return category;
}

function findProfile(page, params) {
    log.info('findProfile {} {}', page, params);
    if (params.findProfileEmail){
        var ur = applications.userApp.findUserResource(params.findProfileEmail);
        if (ur && ur.hasPassword){
            return views.jsonView(true, "Profile with password exists");
        } else {
            return views.jsonView(false, "No profile found");
        }
    }
}

function createAccount(page, params) {
    log.info('findProfile {} {}', page, params);
    var rootOrg = page.find('/').organisation;
    var orgData = page.find('/').orgData;
    if (params.kcom2Firstname && params.kcom2Email && params.kcom2Password){
        var p = securityManager.createProfile(rootOrg, params.kcom2Email, params.kcom2Firstname, params.kcom2Password);
        orgData.createMembership(p.name, p.email, orgData, "ecommerce-users");
        return views.jsonView(true, "Profile created");
    } else {
        return views.jsonView(false, "Fields are missing");
    }
}