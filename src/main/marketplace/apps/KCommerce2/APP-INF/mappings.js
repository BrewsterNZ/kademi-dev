
// this is for when a product is accessed directly under a store url, ie without a category
var productInStoreMapping = controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .title(function (page) {
            return page.attributes.productInStore.product.title;
        })
        // .seoContent('_genDealSeoContent')
        .defaultView(views.templateView('/theme/apps/KCommerce2/viewProduct.html'))
        .addMethod('GET', 'doAfterAddToCartSuggestionsModal', 'afterAddToCart')
        .pathSegmentResolver('productInStore', 'resolveProduct');


var categoryMapping = controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .title(function (page) {
            return page.attributes.category.title;
        })
        // .seoContent('_genDealSeoContent')
        //.defaultView(views.templateView('/theme/apps/KCommerce2/viewCategory.html'))
        .addMethod('GET', 'doEcomSearch', 'q')
        .addMethod('GET', 'doSuggestionList', 'suggestions')
        .addMethod('GET', 'doEcomList')
        .pathSegmentResolver('category', 'resolveCategory');

// BM: cats needs to be recursive
categoryMapping.child(categoryMapping);

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
        .addMethod('POST', 'setCartPointsAllocation', 'newPointsAllocation')
        .addMethod('POST', 'checkout', 'processCartId')
        .addMethod('POST', 'pointsCheckout', 'pointsCheckoutCartId')
        .addMethod('POST', 'applyPromoCodes', 'promoCodes')
        .addMethod('POST', 'createAccount', 'kcom2Firstname')
        .addMethod('POST', 'findProfile', 'findProfileEmail')
        .addMethod('GET', 'getAddresses', 'getAddresses')
        .addMethod('POST', 'saveAddress', 'addressLine1')
        .addMethod('POST', 'saveShippingProfider', 'shippingProviderId');


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
    //log.info("doSuggestionList: {}", query);
    var store = page.attributes.store;
    var searchResults = productInCategorySearch(store, page.attributes.category, query); // aggregation to find top cats with matching products
    page.attributes.suggestionList = searchResults; // make available to templates
    return views.templateView("KCommerce2/suggestionList");
}

function doAfterAddToCartSuggestionsModal(page, params) {
    return views.templateView("KCommerce2/afterAddToCart");
}


function doEcomSearch(page, params) {
    var query = params.q;
    if (formatter.isEmpty(query)) {
        return doEcomList(page, params);
    }
    return views.templateView("KCommerce2/searchResults");
}


function doEcomList(page, params) {
    if (page.attributes.category) {
        return views.templateView("KCommerce2/viewCategory");
    } else {
        return views.templateView("KCommerce2/viewStore");
    }
}

/**
 * For matched brands from search results, lookup the domain objects and return in a list
 *
 * @param {type} store
 * @param {type} searchResults
 * @returns {undefined}
 */
function listBrands(store, searchResults) {
    if( store == null || searchResults == null ) {
        return null;
    }
    var brandBuckets = searchResults.aggregations.asMap.brands.buckets;
    var brandsList = formatter.newArrayList();
    //log.info("listBrands: brandBuckets={}", brandBuckets);
    formatter.foreach(brandBuckets, function(brandBucket){
        var brandId = brandBucket.key;
        //log.info("listBrands: brandId={}", brandId);
        var brandCat = services.criteriaBuilders.getBuilder("category").get(brandId);
        //log.info("listBrands: brand={}", brandCat);
        if( brandCat != null ) {
            brandsList.add(brandCat);
        }
    });
    return brandsList;
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
        //log.info("findAttsInParams: {} {}", attName, attValue);
        if( !formatter.isEmpty(attValue) ) {
            atts.push({
                "name" : attName,
                "value" : attValue
            });
        }
    }
    return atts;
}

function findBrandsInParams(params) {
    var brands = formatter.newArrayList();
    var idsList = formatter.toList(formatter.split(params.brandId));
    formatter.foreach(idsList, function(sId) {
        // log.info("findBrandsInParams: id={}", sId);
        var id = formatter.toLong(sId);
        if( id != null ) {
            var cat = services.criteriaBuilders.get("category").eq("id", id).executeSingle();
            if( cat != null ) {
                brands.add(cat);
            }
        }
    });
    return brands;
}

function findPriceRanges(params) {
    var priceRanges = [];
    var startPriceList = formatter.toList(formatter.split(params.startPrice));
    var endPriceList = formatter.toList(formatter.split(params.endPrice));
    var currIdx = -1;
    formatter.foreach(startPriceList, function(sStartPrice) {
        // log.info("findPriceRanges: startPrice={}", sStartPrice);
        currIdx ++;
        var startPrice = formatter.toLong(sStartPrice);
        if (endPriceList[currIdx] && !isNaN(endPriceList[currIdx])){
            var endPrice = formatter.toLong(endPriceList[currIdx]);
            priceRanges.push({startPrice: startPrice, endPrice: endPrice});
        }
    });
    return priceRanges;
}

function findOtherCatsInParams(params) {
    var otherCats = formatter.newArrayList();
    var idsList = formatter.toList(formatter.split(params.otherCatIds));
    formatter.foreach(idsList, function(sId) {
        var id = formatter.toLong(sId);
        if( id != null ) {
            var cat = services.criteriaBuilders.get("category").eq("id", id).executeSingle();
            if( cat != null ) {
                otherCats.add(cat);
            }
        }
    });
    return otherCats;
}

function findAttributes(page, store, searchResults) {
    var minPrice = searchResults.aggregations.asMap.minPrice.value;
    var maxPrice = searchResults.aggregations.asMap.maxPrice.value;
    var attNameBuckets = searchResults.aggregations.asMap.attNames.buckets;
    page.attributes.attributesSummary = findAttributesQuery(store, page.attributes.category, null, minPrice, maxPrice, 5, attNameBuckets);
}

function pointsCheckout(page, params, files, form) {
    var processCartId = form.longParam("pointsCheckoutCartId");
    var pointsBucket = form.rawParam("pointsBucket");

    log.info('kcom2 checkout pointsonlycheckout processCartId={} pointsBucket={}', processCartId, pointsBucket);

    var totalAmountFromForm = form.bigDecimalParam("cartTotal");

    var checkoutItems = services.cartManager.checkoutItems;

    if (checkoutItems == null) {
        return views.jsonView(false, "No cart");
    }
    if (formatter.cleanString(checkoutItems.cartId) != formatter.cleanString(processCartId)) {
        log.info('checkoutItems.cartId={} processCartId={}', checkoutItems.cartId, processCartId);
        return views.jsonView(false, "Cart is invalid, please refresh your page");
    }

    if (!checkoutItems.totalCost.equals(totalAmountFromForm)) {
        return views.jsonView(false, "The item prices have changed, please refresh your page. " + totalAmountFromForm + " was submitted, current price is " + checkoutItems.totalCost);
    }

    var profile = securityManager.currentUser.thisProfile;
    var store = page.attributes.store;

    if (!pointsBucket) {
        return views.jsonView(false, "Unable to checkout using points");
    }

    var reward = services.pointsManager.findPointsBucket(pointsBucket);
    var balance = services.pointsManager.pointsBalance(reward, profile);
    if (balance < checkoutItems.totalCost) {
        return views.jsonView(false, "There isn't enough points available for this purhcase");
    }

    transactionManager.runInTransaction(function () {

        var cart = checkoutItems.cart;

        var pointsRequest = services.pointsManager.newPointsRequest(profile, 0 - checkoutItems.totalCost);
        pointsRequest.reward = reward;

        var pointsTxn = services.pointsManager.processPointsRequest(pointsRequest);
        var pointsUsed = pointsTxn.numPoints;

        if (pointsUsed < checkoutItems.totalCost) {
            return views.jsonView(false, "There was an error deducting the points from your account");
        }

        services.cartManager.placeOrder(cart, store);
    });
    return views.jsonView(true, "Payment completed");
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
    if (formatter.cleanString(checkoutItems.cartId) != formatter.cleanString(processCartId)) {
        log.info('checkoutItems.cartId={} processCartId={}', checkoutItems.cartId, processCartId);
        return views.jsonView(false, "Cart is invalid, please refresh your page");
    }
    if (!checkoutItems.totalCost.equals(totalAmountFromForm)) {
        return views.jsonView(false, "The item prices have changed, please refresh your page. " + totalAmountFromForm + " was submitted, current price is " + checkoutItems.totalCost);
    }

    var paymentResult;
    transactionManager.runInTransaction(function () {
        var customerGroup = services.cartManager.getOrCreateCustomerGroup("customers"); // todo move to setting
        var purchaser = services.cartManager.getOrCreatePurchaser(form, customerGroup);

        var cart = checkoutItems.cart;

        // https://github.com/Kademi/kademi-dev/issues/6194
        // Must not databind to the cart, because eway fields will overwrite cart fields
        //form.databind(cart);

        var useBillingAddress = form.booleanParam("useBillingAddress");
        var addressBuilder = services.criteriaBuilders.getBuilder("address");
        var billingAddress = addressBuilder.instantiate();
        if( useBillingAddress ) {
            form.databind(billingAddress, "billing");
        } else {
            billingAddress.copyFrom( cart.shippingAddress );
        }
        addressBuilder.save(billingAddress);
        cart.billingAddress = billingAddress;

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
        cart.firstName = form.cleanedParam("firstName");
        cart.surName = form.cleanedParam("surName");
        cart.phone = form.cleanedParam("phone");

        cart.addressLine1 = form.cleanedParam("addressLine1");
        cart.addressLine2 = form.cleanedParam("addressLine2");
        cart.addressState = form.cleanedParam("addressState");
        cart.country = form.cleanedParam("country");
        cart.city = form.cleanedParam("city");
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

function setCartPointsAllocation(page, params, files, form) {
    log.info("setCartPointsAllocation: form={}", form);
    var newPointsAllocation = form.bigDecimalParam("newPointsAllocation");
    var selectedPointsBucketId = form.longParam("selectedPointsBucket");
    var pointsBucket = services.promotionsManager.findPointsBucket(selectedPointsBucketId);
    var result;
    transactionManager.runInTransaction(function () {
        var items = services.cartManager.checkoutItems;
        if( items == null ) {
            result = views.jsonView(false, "There is no current shopping cart");
        } else {
            var cart = items.cart;
            if( newPointsAllocation > items.totalCost ) {
                newPointsAllocation = items.totalCost;
            }
            cart.numPoints = newPointsAllocation;
            if (!cart.selectedPointsBucket) {
                cart.selectedPointsBucket = pointsBucket;
            }
            services.criteriaBuilders.getBuilder("cart").save(cart);
            result = views.jsonView(true, "Updated points allocation to " + newPointsAllocation);
        }
    });
    return result;
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
    var promoCodes = form.rawParam("promoCodes");
    log.info("applyPromoCodes: {}", promoCodes);

    var jsonResult;
    transactionManager.runInTransaction(function () {
        var codesArr = formatter.splitByAnything(promoCodes);
        var codesList = formatter.newArrayList(codesArr);
        if( formatter.isEmpty(codesList)) {
            jsonResult = views.jsonView(false, "Please enter promotion or voucher codes");
        } else {
            var cart = services.cartManager.shoppingCart(true);
            var store = page.attributes.store;
            var promoCodeResults = services.cartManager.applyPromoCodes(cart, store, codesList);

            // check to see there is at least one successful result
            var appliedOk = false;
            formatter.foreach(promoCodeResults, function(res) {
                if( res.successful ) {
                    appliedOk = true;
                }
            });

            if( appliedOk ) {
                jsonResult = views.jsonView(true, "Applied codes " + promoCodes);
            } else {
                log.warn("applyPromoCodes: no valid codes found");
                jsonResult = views.jsonView(false, "Couldnt find any valid codes" + promoCodes);
            }
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
    var jsonResult;
    if (params.kcom2Firstname && params.kcom2Email && params.kcom2Password){
        transactionManager.runInTransaction(function () {
            var ur = applications.userApp.findUserResource(params.kcom2Email);
            if (!ur){
                log.info('kcom2 createAccount user not found {}', ur);
                var p = securityManager.createProfile(rootOrg, params.kcom2Email, params.kcom2Firstname, params.kcom2Password);
                p.firstName = params.kcom2Firstname;
                p.surName = params.kcom2Surname;
                services.userManager.updateUser(p);
                orgData.createMembership(p.name, p.email, orgData, "ecommerce-users");
                jsonResult = views.jsonView(true, "Profile created");
            } else {
                if (!ur.hasPassword){
                    log.info('kcom2 createAccount user found and has no password {}', ur);
                    var p = ur.thisProfile;
                    p.firstName = params.kcom2Firstname;
                    p.surName = params.kcom2Surname;

                    var org = services.userManager.toOrg(orgData);
                    services.userManager.setPassword(p, params.kcom2Password);

                    services.userManager.updateUser(p);
                    if (!ur.isInGroup("ecommerce-users")){
                        orgData.createMembership(p.name, p.email, orgData, "ecommerce-users");
                    }

                    jsonResult = views.jsonView(true, "Profile updated with password");
                } else {
                    log.info('kcom2 createAccount user found and has password {}', ur);
                    jsonResult = views.jsonView(false, "Profile with password existed. Please login");
                }
            }
        });
    } else {
        jsonResult = views.jsonView(false, "Please enter required fields to continue");
    }

    return jsonResult;
}

function getAddresses(page, params) {
    log.info('getAddresses {} {}', page, params);
    var user = securityManager.currentUser;
    if (user) {
        var addrs = services.userManager.findAddresses(user.thisProfile);
        var profileAddrs = {};
        for (var i in addrs){
            var item = addrs[i];
            var addr = {
                addressLine1: item.address.addressLine1,
                addressLine2: item.address.addressLine2,
                addressState: item.address.addressState,
                city: item.address.city,
                postcode: item.address.postcode,
                country: item.address.country,
            };
            var addressType = item.addressType;
            if (addressType) {
                profileAddrs[addressType] = addr;
            }
        }

        return views.jsonObjectView(JSON.stringify({status: true, data: profileAddrs}))
    } else {
        return views.jsonView(false, "Not logged in");
    }

}