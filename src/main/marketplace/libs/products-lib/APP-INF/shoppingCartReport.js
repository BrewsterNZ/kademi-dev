// String reportId, String title, String description, String reportTemplate, String function, String attachmentContentType, String attachmentExtension

controllerMappings.addReport(
        'ordersReport',
        'Orders Report',
        'Orders Report',
        '/theme/apps/products/shoppingCartReport.html',
        'generateShoppingCartReport',
        'text/csv',
        'csv');

function generateShoppingCartReport(page, params, req, resp) {
    log.info("generateShoppingCartReport");

    var csvData = formatter.newArrayList();

    // Add Headers
    csvData.add(getShoppingCartCSVHeaders());

    log.info('headers {}', csvData);

    var rows = getShoppingCartCSV();
    csvData.addAll(rows);

    log.info('data {}', csvData);

    return views.csvView(csvData);
}

function getShoppingCartCSVHeaders() {
    var headers = formatter.newArrayList();

    headers.addAll(["Product SKU", "Date", "First Name", "Last Name", "Redemption Product Name", "Redemption Product Quantity", "Shipping Address", "City", "State", "Post Code", "Phone Number", "CartID", "Internal ID"]);

    return headers;
}

function getShoppingCartCSV() {
    var csvData = [];

    var startDate = queryManager.getCommonStartDate();
    var finishDate = queryManager.getCommonFinishDate();

    var results = runShoppingCartQuery(startDate, finishDate);

    for (var i = 0; i < results.length; i++) {
        var cart = results[i];

        if (formatter.isNotNull(cart.productOrders)) {
            for (var o = 0; o < cart.productOrders.length; o++) {
                var po = cart.productOrders[o];
                var row = generateProductOrderRow(cart, po);
                csvData.push(row);
            }
        }
    }

    return csvData;
}

function generateProductOrderRow(c, po) {
    var row = formatter.newArrayList();

    // Get SKU and Product Title
    var sku = null;
    var productTitle = null;
    if (formatter.isNotNull(po.getProductSku())) {
        sku = po.getProductSku().getName();
        productTitle = po.getProductSku().getTitle();
    } else {
        sku = po.getProduct().getName();
        productTitle = po.getProduct().getTitle();
    }

    // Get profile information
    var p = c.getProfile();
    var firstName = c.getFirstName();
    var surName = c.getSurName();
    var phone = c.getPhone();
    if (formatter.isNotNull(p)) {
        firstName = formatter.firstNotNull(firstName, p.getFirstName());
        surName = formatter.firstNotNull(surName, p.getSurName());
        phone = formatter.firstNotNull(phone, p.getPhone());
    }

    row.add(formatter.cleanString(sku));
    row.add(formatter.formatDateTime(c.orderedDate));
    row.add(formatter.cleanString(firstName));
    row.add(formatter.cleanString(surName));
    row.add(formatter.cleanString(productTitle));
    row.add(formatter.cleanString(po.getQuantity()));
    row.add(formatter.cleanString(buildCartAddress(c)));
    row.add(formatter.cleanString(c.getCity()));
    row.add(formatter.cleanString(c.getAddressState()));
    row.add(formatter.cleanString(c.getPostcode()));
    row.add(formatter.cleanString(phone));
    row.add(formatter.cleanString(c.cartId));
    row.add(formatter.cleanString(c.id));


    return row;
}

function buildCartAddress(c) {
    var s = '';

    var addressLine1 = formatter.cleanString(c.getAddressLine1());
    var addressLine2 = formatter.cleanString(c.getAddressLine2());

    if (formatter.isNotNull(addressLine1)) {
        s += addressLine1;
    }
    if (formatter.isNotNull(addressLine2)) {
        if (s.length > 0) {
            s += ', ';
        }
        s += addressLine2;
    }

    return s;
}

function runShoppingCartQuery(startDate, finishDate, start, max, results) {
    var s = formatter.toInteger(start || 0, false);
    var m = formatter.toInteger(max || 0, false);
    if (m < 1) {
        m = 5000;
    }

    var crit = services.criteriaBuilders.get('cart')
            .ge('orderedDate', startDate)
            .le('orderedDate', finishDate)
            .ne('fulfilmentState', 'D')
            .sortDesc('orderedDate');

    var searchProps = services.criteriaBuilders.searchProps(s, m);

    var r = crit.execute(searchProps);
    if (results === null || typeof results === 'undefined' || results === 'undefined') {
        results = formatter.newArrayList();
    }
    results.addAll(r);

    if (r.length > 0 && r.length >= m) {
        var newS = s + m;
        results = runShoppingCartQuery(startDate, finishDate, newS, m, results);
    }

    return results;
}