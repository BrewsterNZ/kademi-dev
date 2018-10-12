(function (w) {
    function paymentForm() {
        var _self = this;
        _self.callbacks = [];

        _self.beforePostForm = function (callback) {
            if (typeof callback === 'function') {
                _self.callbacks.push(callback);
            }
        };
    }

    w.paymentForm = new paymentForm();
})(window);


(function () {
    window.initEcommerceCheckout = function () {
        flog('initEcommerceCheckout');
        initCartForm();
        initItemQuantity();
        initRemoveItem();
        initPaymentOptionSelect();
        initLoginForm();
        initPromoCodes();

        $('.btn-decrease-quantity, .btn-increase-quantity, .ecom-txt-quantity, .btn-ecom-remove-item').prop('disabled', false);
    }

    function initPromoCodes() {
        $("body").on("click", ".apply-promo-codes", function(e) {
            e.preventDefault();
            var cont = $(e.target).closest(".promo-codes-container");
            var inp = cont.find("input[name=promoCodes]");
            var codes = inp.val();
            applyPromoCodes(codes, window.location.href);
        });
    }

    function initCartForm() {
        $('#cart-form').forms({
            validate: function (form) {
                var icon = form.find('button[type=submit] i');

                icon.show();

                var cvv = form.find('[name=cardcvn]');
                if (cvv.val() && isNaN(cvv.val())) {
                    icon.hide();
                    return {
                        error: 1,
                        errorFields: [cvv],
                        errorMessages: ['CVV must be a number']
                    };
                }

                if (cvv.val() && cvv.val().length < 3) {
                    icon.hide();
                    return {
                        error: 1,
                        errorFields: [cvv],
                        errorMessages: ['CVV must have 3 digital characters']
                    };
                }

                var phone = form.find('[name=phone]');
                var phoneValue = phone.val();
                if (phoneValue) {
                    var regex = /-|\+|\s|\(|\)|x|ext|,|\.|\//ig;
                    var phoneValue = phoneValue.replace(regex, '');
                    if (isNaN(phoneValue)) {
                        icon.hide();
                        return {
                            error: 1,
                            errorFields: [phone],
                            errorMessages: ['Please enter a valid phone number']
                        };
                    }
                }

                return true;
            },
            beforePostForm: function (form, config, data) {
                var newData = {};
                data = data.split('&');

                for (var i = 0; i < data.length; i++) {
                    var pair = data[i].split('=');
                    var key = pair[0];
                    var value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');
                    newData[key] = value;
                }

                for (var i = 0; i < paymentForm.callbacks.length; i++) {
                    var cb = paymentForm.callbacks[i];
                    cb.call(form, newData);
                }


                // AN: getting the cart items fields. since bss336
                var cartData = $('#cart-items').serialize();
                cartData = cartData.split('&');
                for (var i = 0; i < cartData.length; i++) {
                    var pair = cartData[i].split('=');
                    var key = pair[0];
                    var value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');
                    newData[key] = value;
                }
                form.trigger("onBeforeCheckout", [newData, form]);

                return $.param(newData);
            },
            onSuccess: function (resp) {
                if (resp.status) {
                    $('#cart-form, #cart-link, #cart-checkout-data').reloadFragment({
                        whenComplete: function () {
                            $('#cart-form').hide('fast');
                            $('#cart-items').hide('fast');
                            $('#modal-success-message').modal('show');
                            $.cookie('ecommerceCartId', '');
                        }
                    });
                } else {
                    Msg.warning(resp.messages[0])
                }
                $('#cart-form').find('button[type=submit] i').hide();
            },
            onError: function (resp, form, config) {
                try {
                    flog('[jquery.forms] Status indicates failure', resp);

                    if (resp) {
                        if (resp.messages && resp.messages.length > 0) {
                            showErrorMessage(form, config, resp.messages);
                        } else {
                            showErrorMessage(form, config, 'Sorry, we could not process your request');
                        }

                        showFieldMessages(resp.fieldMessages, form, config);
                    } else {
                        showErrorMessage(form, config, 'Sorry, we could not process your request');
                    }
                } catch (e) {
                    flog('[jquery.forms] Error!', e);
                } finally {
                    $('#cart-form').find('button[type=submit]').prop('disabled', false).find('i').hide();
                }
            }
        });
    }

    function initItemQuantity() {
        flog('initItemQuantity');

        var body = $(document.body);
        var changeQuantity = function (trigger, isIncrease) {
            var inputGroup = trigger.closest('.input-group');
            var txtQuantity = inputGroup.find('.ecom-txt-quantity');
            var quantity = txtQuantity.val().trim();

            if (isNaN(quantity)) {
                quantity = 0;
            } else {
                quantity = +quantity;
            }

            if (isIncrease) {
                quantity++;
            } else {
                quantity--;
            }

            if (quantity < 1) {
                quantity = 1;
            }

            txtQuantity.val(quantity).change();
        };

        body.on('click', '.btn-decrease-quantity', function (e) {
            e.preventDefault();

            var btn = $(this);

            changeQuantity(btn, false);
        });

        body.on('click', '.btn-increase-quantity', function (e) {
            e.preventDefault();

            var btn = $(this);

            changeQuantity(btn, true);
        });

        var quantityUpdateTimer = null;
        body.on('change', '.ecom-txt-quantity', function (e) {
            e.preventDefault();

            var inpt = $(this);

            clearTimeout(quantityUpdateTimer);
            quantityUpdateTimer = setTimeout(function () {

                var val = inpt.val();
                var lineItemId = inpt.data('item-id');

                doQuantityUpdate(this.window.location, lineItemId, val);
            }, 500);
        });
    }


    function doQuantityUpdate(cartHref, lineItemId, quantity) {
        flog("doQuantityUpdate", cartHref);

        var actors = $('.btn-decrease-quantity, .btn-increase-quantity, .ecom-txt-quantity, .btn-ecom-remove-item');
        actors.prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: cartHref,
            data: {
                changeItemId : lineItemId,
                newQuantity: quantity
            },
            datatype: "json",
            success: function (data) {
                $("#ecomItemsTable, #cart-link, #cart-checkout-data, #shipping-provide-select").reloadFragment({
                    whenComplete: function (resp) {
                        Msg.info("Updated item in your shopping cart");
                        actors.prop('disabled', false);
                    }
                });
            },
            error: function (resp) {
                Msg.error("An error occured adding the product to your shopping cart. Please check your internet connection and try again");
            }
        });
    }

    function initRemoveItem() {
        flog('initRemoveItem');

        $(document.body).on('click', '.btn-ecom-remove-item', function (e) {
            e.preventDefault();

            var btn = $(this);
            var href = btn.attr("href");
            var row = btn.closest('.item-row');
            var lineItemId = btn.data('item-id');

            doRemoveFromCart(href, lineItemId, function() {
                row.remove();
            });
        });
    }

    function doRemoveFromCart(href, lineItemId, callback) {
        flog('doRemoveFromCart', href);
        $.ajax({
            type: 'POST',
            url: href,
            data: {
                removeLineId : lineItemId
            },
            datatype: "json",
            success: function (data) {
                if( data.status ) {
                    callback();
                    $("#ecomItemsTable, #cart-link, #cart-checkout-data, #shipping-provide-select").reloadFragment({
                        whenComplete: function () {
                            Msg.info("Removed item from your shopping cart");
                        }
                    });
                }
            },
            error: function (resp) {
                Msg.error("An error occured adding the product to your shopping cart. Please check your internet connection and try again");
            }
        });
    }

    function initPaymentOptionSelect() {
        flog('initPaymentOptionSelect');

        // First check to see if the current form has any required fields
        checkPaymentRequiredFields();

        // Next we setup event handlers
        $('body').on('click', '.payment-option', function (e) {
            e.preventDefault();

            var btn = $(this);
            var pid = btn.data('pid');
            var op = btn.data('option');

            $('.payment-option i').removeClass('active');
            btn.find('i').addClass('active');

            var paymentForms = $('.payment-form');
            paymentForms.hide();

            var selectedForm = $('#pf-' + pid);
            selectedForm.show();

            var cartForm = $('#cart-form');
            cartForm.find('input[name=paymentProvider]').val(pid);
            cartForm.find('input[name=paymentOption]').val(op);

            checkPaymentRequiredFields();
        });
    }

    function checkPaymentRequiredFields() {
        var paymentForms = $('.payment-form');
        paymentForms.each(function (i, item) {
            var f = $(item);
            var isShown = f.is(':visible');
            var requiredField = f.find('.required-if-shown');
            if (isShown) {
                f.find('input, select, textarea, button').disable(false);
                requiredField.addClass('required');
                requiredField.attr('required', 'required');
            } else {
                f.find('input, select, textarea, button').disable(true);
                requiredField.removeClass('required');
                requiredField.removeAttr('required');
            }
        });
    }

    function initLoginForm() {
        jQuery(".login-form").user({
            afterLoginUrl: window.location.pathname,
            valiationMessageSelector: "p.login.message"
        }); // setup login and logout
    }

    function applyPromoCodes(codes, cartHref) {
        flog("applyPromoCodes", codes, cartHref);
        $.ajax({
            type: 'POST',
            url: cartHref,
            data: {
                promoCodes : codes // includes vouchers and promotion codes
            },
            datatype: "json",
            success: function (data) {
                $("#ecomItemsTable, #cart-link, #cart-checkout-data, #shipping-provide-select").reloadFragment({
                    whenComplete: function (resp) {
                        Msg.info("Updated item in your shopping cart");
                        var actors = $('.btn-decrease-quantity, .btn-increase-quantity, .ecom-txt-quantity, .btn-ecom-remove-item');
                        actors.prop('disabled', false);
                    }
                });
            },
            error: function (resp) {
                Msg.error("An error occured applying your promotion codes");
            }
        });
    }


})(jQuery);

function initKcom2CheckoutForm() {
    var findEmailForm = $('#kcom2FindEmailForm');
    var kcom2PasswordForm = $('#kcom2PasswordForm');
    var kcom2RegoForm = $('#kcom2RegoForm');
    var kcom2ShippingForm = $('#kcom2ShippingForm');
    var kcom2ShippingProvider = $('#kcom2ShippingProvider');
    var kcom2CartForm = $('#cart-form');
    var shippingSelect = $("#shipping-provide-select");

    findEmailForm.forms({
        onSuccess: function (resp) {
            if (resp && resp.status){
                findEmailForm.addClass('hide');
                kcom2PasswordForm.removeClass('hide');
                kcom2PasswordForm.find('[name=kcom2Email]').val(findEmailForm.find('[name=findProfileEmail]').val());
            }
        },
        onError: function () {
            // Show rego form with skip button
            kcom2RegoForm.removeClass('hide');
            findEmailForm.addClass('hide');
            kcom2RegoForm.find('[name=kcom2Email]').val(findEmailForm.find('[name=findProfileEmail]').val());
        }
    });

    kcom2RegoForm.on('click', '.btn-skip-rego', function () {
        kcom2RegoForm.addClass('hide');
        kcom2ShippingForm.removeClass('hide');
        initCountryList();
    });

    kcom2PasswordForm.on('click', '.btn-prev', function () {
        findEmailForm.removeClass('hide');
        kcom2PasswordForm.addClass('hide');
    });


    shippingSelect.click( function(e) {
        // selected shipping provider, so save it and then reload the prices panel
        var target = $(e.target);
        var selectedId = target.val();
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                shippingProviderId : selectedId
            },
            datatype: 'json',
            success: function (data) {
                Msg.info('Saved shipping details');
                $('#ecomItemsTable, #cart-checkout-data').reloadFragment();
            },
            error: function (resp) {
                Msg.error('An error occured adding the product to your shopping cart. Please check your internet connection and try again');
            }
        });
    });



    kcom2PasswordForm.user({
        afterLoginUrl: 'none',
        userNameSelector: kcom2PasswordForm.find('[name=kcom2Email]'),
        passwordSelector: kcom2PasswordForm.find('[name=kcom2Password]'),
        onSuccess: function () {
            $('[data-type="component-menu"]').reloadFragment({
                whenComplete: function (resp) {
                    var html = resp.find('[data-type="component-menu"]').html();
                    $('[data-type="component-menu"]').html(html);
                    kcom2PasswordForm.addClass('hide');
                    kcom2ShippingForm.removeClass('hide');
                }
            });
        }
    });

    kcom2RegoForm.find('form').forms({
        onSuccess: function (resp) {
            if (resp && resp.status){
                kcom2RegoForm.addClass('hide');
                kcom2ShippingForm.removeClass('hide');
            }
        }
    });

    kcom2ShippingProvider.on('click', '.btn-prev', function () {
        kcom2PasswordForm.removeClass('hide');
        kcom2ShippingForm.addClass('hide');
    });

    kcom2ShippingForm.find('form').forms({
        onSuccess: function () {
            kcom2ShippingForm.addClass('hide');
            kcom2ShippingProvider.removeClass('hide');
            $('#ecomItemsTable, #cart-checkout-data').reloadFragment();
        }
    });

    kcom2ShippingProvider.on('click', '.btn-prev', function () {
        kcom2ShippingForm.removeClass('hide');
        kcom2ShippingProvider.addClass('hide');
    });

    kcom2ShippingProvider.forms({
        allowPostForm: false,
        onValid: function () {
            kcom2ShippingProvider.addClass('hide');
            kcom2CartForm.removeClass('hide');
        }
    });

    kcom2CartForm.on('click', '.btn-prev', function () {
        kcom2ShippingProvider.removeClass('hide');
        kcom2CartForm.addClass('hide');
    });
}

function initCountryList() {
    var countriesBH = new Bloodhound({
        datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.name); },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: getCountries()
    });

    countriesBH.initialize();

    var kcom2ShippingForm = $('#kcom2ShippingForm');
    kcom2ShippingForm.find('.country-typeahead').typeahead(null, {
        displayKey: 'name',
        valueKey: "iso_code",
        source: countriesBH.ttAdapter()
    });

    var selectedCountry = kcom2ShippingForm.find('[name=country]').val();
    if (selectedCountry){
        var sel = getCountries().filter(function (item) {
            return item.iso_code === selectedCountry;
        });
        if (sel.length){
            kcom2ShippingForm.find('.country-typeahead').typeahead('val', sel[0].name);
        }
    }

    kcom2ShippingForm.find('.country-typeahead').on("typeahead:selected", function(e, datum) {
        kcom2ShippingForm.find('[name=country]').val(datum.iso_code);
    });
}

function initSelectAddress(){
    $(document).on('click', '#kcom2ShippingForm .address-type-drop a', function (e) {
        e.preventDefault();

        var value = $(this).attr('href');
        if (window.profileAddrs && Object.keys(window.profileAddrs).length > 0){
            var selected = window.profileAddrs[value];
            flog(selected);
            var kcom2ShippingForm = $('#kcom2ShippingForm');
            kcom2ShippingForm.find('[name=addressLine1]').val(selected.addressLine1);
            kcom2ShippingForm.find('[name=addressLine2]').val(selected.addressLine2);
            kcom2ShippingForm.find('[name=addressState]').val(selected.addressState);
            kcom2ShippingForm.find('[name=city]').val(selected.city);
            kcom2ShippingForm.find('[name=postcode]').val(selected.postcode);
            kcom2ShippingForm.find('[name=country]').val(selected.country);
            var sel = getCountries().filter(function (item) {
                return item.iso_code === selected.country;
            });
            if (sel.length){
                kcom2ShippingForm.find('.country-typeahead').typeahead('val', sel[0].name);
            }
        }
    })
}

$(function () {
    initKcom2CheckoutForm();
    initCountryList();
    initSelectAddress();
    if ($('.store-checkout-page').length > 0) {
        initEcommerceCheckout();
    }
});
