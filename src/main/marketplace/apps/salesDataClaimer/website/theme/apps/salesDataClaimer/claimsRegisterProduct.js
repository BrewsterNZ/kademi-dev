(function ($) {
    var step3Ready = false;

    $(function () {
        if ( $("#ClaimRegisterProductForm").length === 0) {
            return;
        }
        
        initWizard();
        initDateTimePickers();
        initImagePicker();
        initOrgPickers();
        initBSBNumber();
        initIndoorSerialCheck();
        bottomNextPrev();
        initProductModelNumber();
        initAutoFillStoreData();
        
        $(".claimRegisterProductForm").forms({
            beforePostForm: function(form, config, data) {
                $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", true);
                $(".form-message").slideUp(300, function() {    $(this).remove();   });
                
                return data;
            },
            onError: function (resp, form, config) {
                $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                
                try {
                    flog('[jquery.forms] Status indicates failure', resp);
                    
                    if (resp) {
                        if (resp.messages && resp.messages.length > 0) {
                            showErrorMessage(form, config, resp.messages);
                        } else {
                            showErrorMessage(form, config, config.cantProcessRequestErrorMessage);
                        }
                        
                        showFieldMessages(resp.fieldMessages, form);
                    } else {
                        showErrorMessage(form, config, config.cantProcessRequestErrorMessage);
                    }
                } catch (e) {
                    flog('[jquery.forms] Error!', e);
                }
            },
            onSuccess: function (resp, form) {
                flog('Claims :: ', resp);
                
                $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                
                if (resp === undefined || resp.status === false) {
                    Msg.info('Sorry there was an error submitting the form.');
                } else {
                    $(".result-unique-id-no").html(resp.data.claimGroupId);
                    
                    $(".last-step .step-pane:eq(0) > .row").prepend('<div class="col-md-6 print-show" style="display: none;">' +
                        '<div class="form-group">' +
                            '<label for="title" class="col-md-12">Unique ID number:</label>' +
                            '<div class="col-md-12">' +
                                '<span class="summary-field" data-parent-step="1">' + resp.data.claimGroupId + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>');
                    
                    $("#ClaimRegisterProductForm").slideUp(300);
                    $("#thankYou").slideDown(300);
                }
            }
        });
    });

    function initDateTimePickers() {
        flog('initDateTimePickers');
    
        var purchaseDate = $('#purchase-date');
        purchaseDate.datetimepicker({
            format: 'DD/MM/YYYY'/*,
            startDate: '01/05/2018',
            endDate: '31/08/2018'*/
        });
        
        var installationDate = $('#installation-date');
        installationDate.datetimepicker({
            format: 'DD/MM/YYYY'
        });
    }
    
    function initImagePicker(){
        $('.success-invoice-image').hide();
        $('#invoice-image').change(function(){
            $('.success-invoice-image').show();    
        });
        
        $('.success-installation-image').hide();
        $('#installation-invoice-image').change(function(){
            $('.success-installation-image').show();    
        });
    }
    
    function initOrgPickers() {
        //$("#supplier-orgId, #installer-orgId").select2();
        //#supplier-orgId, 
        $("#supplier-orgId, #installer-orgId").on("change", function() {
            var email = $(this).find(":selected").data("email");
            if(email === ""){
                return;
            }
            $("#" + $(this).data("email-to")).val(email);
            $("#confirm-" + $(this).data("email-to")).val(email);
        });
    }  
    
    function initProductModelNumber() {
        $('#prod1-model-number').on('change', function(e) {
            $('#prod1-indoor-model-number-view').val($(e.target).find(':selected').data("product-model"));
            $('#prod1-indoor-model-number').val($(e.target).find(':selected').data("product-model"));
            $('#prod1-consumer-bonus').val($(e.target).find(':selected').data("consumer-bonus"));
        });
        
        $('#prod2-model-number').on('change', function(e) {
            $('#prod2-indoor-model-number-view').val($(e.target).find(':selected').data("product-model"));
            $('#prod2-indoor-model-number').val($(e.target).find(':selected').data("product-model"));
            $('#prod2-consumer-bonus').val($(e.target).find(':selected').data("consumer-bonus"));
        });
        
        $('#prod3-model-number').on('change', function(e) {
            $('#prod3-indoor-model-number-view').val($(e.target).find(':selected').data("product-model"));
            $('#prod3-indoor-model-number').val($(e.target).find(':selected').data("product-model"));
            $('#prod3-consumer-bonus').val($(e.target).find(':selected').data("consumer-bonus"));
        });
    }
    
    function initAutoFillStoreData() {
        $('#store-name').on('change', function(e) {
            
            if ( $("#suppliers option[value='" + $(e.target).val() + "']").length > 0){
                $('#store-suburb').val($("#suppliers option[value='" + $(e.target).val() + "']").data("suburb"));
                $('#store-state').val($("#suppliers option[value='" + $(e.target).val() + "']").data("state").toLowerCase());
            }else{
                $('#store-suburb').val("");
                $('#store-state').val("");
            }
        });
    }
    
    function initBSBNumber() {
        
        var dash = "-"; 

        function isNumber (o) {
          return ! isNaN (o-0);
        }  
        
        // $(".bsb-number-12").keyup(function(e){
        //     txtVal = $(this).val();  
        //     if(isNumber(txtVal) && txtVal.length>3) {
        //         $(this).val(txtVal.substring(0,3) )
        //     }
        // });
        
        $(".bsb-number-12").inputmask('999');
        
        //called when key is pressed in textbox
        $("#bsb-number-1, #bsb-number-2").keydown(function (e) {
             //if the letter is not digit then display error and don't type anything
             if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && (e.which < 96 || e.which > 105)) {
                //display error message
                $("#errmsg12").html("Digits Only").show().fadeOut("slow");
                return false;
            }
        });
        
        // navigator.sayswho= (function(){
        //     var ua= navigator.userAgent, tem, 
        //     M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        //     if(/trident/i.test(M[1])){
        //         tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        //         return 'IE '+(tem[1] || '');
        //     }
        //     if(M[1]=== 'Chrome'){
        //         tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        //         if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        //     }
        //     M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        //     if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        //     return M.join(' ');
        // })();
        
        // if( navigator.sayswho.contains("IE") || navigator.sayswho.contains("ie")){
        //     $("#bsb-number-1").keyup(function () {
        //         if($(this).val().replace("_","").length == 3){
        //             $('#bsb-number-2').focus();
        //         }
        //     });  
        // }else{
        //     $("#bsb-number-1").keyup(function () {
        //         if($(this).val().replace("_","").length == 3){
        //             $('#bsb-number-2').focus();
        //         }
        //     });
        // }
        
        $("#bsb-number-1").keyup(function () {
            if($(this).val().replace("_","").length == 3){
                $('#bsb-number-2').focus();
            }
        });
    
        
        $("#bsb-number-1").keyup(function(){
            $('#bsb-number').val( $(this).val() +  dash + $('#bsb-number-2').val() );
        });        
        $("#bsb-number-2").keyup(function(){
            $('#bsb-number').val( $('#bsb-number-1').val() +  dash + $(this).val() );
        });
         
        $('#btn').click(function(){
            alert( $('#bsb-number').val() );
        });
        
        
    }
    
    function initIndoorSerialCheck(){
        $(".product-serial-number").on("change", function() {
            step3Ready = false;
        });
    }
    
    
    function parseDate(input) {
      var parts = input.match(/(\d+)/g);
      // note parts[1]-1
      return new Date(parts[2], parts[1]-1, parts[0]);
    }
    
    function initWizard() {
        flog('initWizard');

        var myWizard = $('#myWizard');
        var stepPane = myWizard.find('.step-pane');
        myWizard.wizard();

        myWizard.on('changed.fu.wizard', function (evt, data) {
            if (data.step === 1) {

            }

            if (data.step === 2) {
                var stepPane2 = stepPane.eq(1);
            }

            if (data.step === 5) {
               // $(".last-step").html(""); $("#ClaimRegisterProductForm .step-pane:not(.last-step)").clone().css("display", "block").find(":input").prop("disabled", true).end().appendTo(".last-step")
                $(".summary-last-step").html(""); 
                $("#ClaimRegisterProductForm .step-pane:not(.last-step)")
                        .find("select :selected").each(function() { 
                            $(this).attr("selected", "selected"); 
                        }).end().clone()
                        .find("button").remove().end()
						.find(".ignore").remove().end()
						.css("display", "block")
                        .find(":input").each(function() {
                            $(this).replaceWith('<span class="summary-field" data-parent-step="' + $(this).parents(".step-pane").data("step") + '">' + ($(this).find(":selected").html() === undefined ? $(this).val().replace("C:\\fakepath\\", "") : $(this).find(":selected").html()) + '</span>'); 
                        }).end().appendTo(".summary-last-step");
                $("body").on("click", ".summary-field", function() {
                    $("li[data-step='" + $(this).data("parent-step") + "']").click();
                });
                
                var str1 = $('#errmsg12:last-child').parent('.col-md-12').children('.summary-field').text();
                var res1 = str1.substr(0, 3);
                $('#errmsg12:last-child').parent('.col-md-12').children('.summary-field').text( res1 + '-xxx' );
                
                var str2 = $('#getAccountNoOnSummary:last-child').parent('.col-md-12').children('.summary-field').text();
                var res2 = str2.substr(0, 3);
                $('#getAccountNoOnSummary:last-child').parent('.col-md-12').children('.summary-field').text( res2 + '-xxxxxxx' );
                
                setTimeout(function(){ $(window).scrollTop(0); }, 100);
            }
        });
        
        myWizard.on('actionclicked.fu.wizard', function (evt, data) {
            if (data.direction === "previous") {
                $(".form-message").remove();
                    
                return;
            }
            
            var error = false;
            
            if (data.step === 1) {
                var stepPane1 = stepPane.eq(0);
                resetValidation(stepPane1);
                $(".form-message .error-message, .form-message .error-message-title").remove();

                if (!validateFormFields(stepPane.eq(0))) {
                    evt.preventDefault();
                    error = true;
                }
                
                if( $('#confirm-email').val() != $('#email').val()){
                    showErrorField($('#confirm-email'));
                    showErrorMessage(stepPane1, null, 'Email address and confirm email address must be similar');
                    evt.preventDefault();
                    error = true;
                }
                
                var phoneReg = new RegExp("^[0-9]*$");
                if(!phoneReg.test($('#phone').val())){
                    showErrorField($('#phone'));
                    showErrorMessage(stepPane1, null, 'Please check the format of your phone number. Only use numbers and no special characters.');
                    evt.preventDefault();
                    error = true;
                }
                
                if (!error) {
                    $(".form-message").remove();
                }
            }

            if (data.step === 2) {
                var stepPane2 = stepPane.eq(1);
                resetValidation(stepPane2);
                $(".form-message .error-message, .form-message .error-message-title").remove();
                
                if (!validateFormFields(stepPane2)) {
                    evt.preventDefault();
                    error = true;
                }
                
                if( $('#purchase-date').length > 0 ){
                    var purchaseDate = parseDate($('#purchase-date').val());
                    var month = purchaseDate.getMonth() + 1;
                    var year = purchaseDate.getFullYear();
                    if( month < 5 || month > 8 || year != 2018){
                        showErrorField($('#purchase-date'));
                        showErrorMessage(stepPane2, null, 'Your purchase must be between 1st May and 31st August to be eligible.');
                        evt.preventDefault();
                        error = true;
                    }
                }
                
                if($("#invoice-image").val() == ""){
                    showErrorField($('#invoice-image'));
                    showErrorMessage(stepPane2, null, 'Please upload a PDF or image of the invoice.');
                    evt.preventDefault();
                    error = true;
                }
                
                if (!error) {
                    $(".form-message").remove();
                    step3Ready = false;
                }
            }

            if (data.step === 3) {
                var stepPane3 = stepPane.eq(2);
                resetValidation(stepPane3);
                $(".form-message .error-message, .form-message .error-message-title").remove();
                
                if (!validateFormFields(stepPane3)) {
                    evt.preventDefault();
                    error = true;
                }
                
                // Commented due to Paddy's request.
                
                // var serialReg = new RegExp("^([a-zA-Z0-9]){11}$");
                // if($('#prod1-indoor-serial-number').is(":visible")){
                //     if(!serialReg.test($('#prod1-indoor-serial-number').val())){
                //         showErrorField($('#prod1-indoor-serial-number'));
                //         showErrorMessage(stepPane3, null, 'Product 1 indoor Serial must contain 11 characters including numbers and letters to be eligible');
                //         evt.preventDefault();
                //         error = true;
                //     }
                // }
                // if($('#prod2-indoor-serial-number').is(":visible")){
                //     if(!serialReg.test($('#prod2-indoor-serial-number').val())){
                //         showErrorField($('#prod2-indoor-serial-number'));
                //         showErrorMessage(stepPane3, null, 'Product 2 indoor Serial must contain 11 characters including numbers and letters to be eligible');
                //         evt.preventDefault();
                //         error = true;
                //     }
                // }
                // if($('#prod3-indoor-serial-number').is(":visible")){
                //     if(!serialReg.test($('#prod3-indoor-serial-number').val())){
                //         showErrorField($('#prod3-indoor-serial-number'));
                //         showErrorMessage(stepPane3, null, 'Product 3 indoor Serial must contain 11 characters including numbers and letters to be eligible');
                //         evt.preventDefault();
                //         error = true;
                //     }
                // }
                
                if($('#prod1-indoor-serial-number').is(":visible") && $('#prod2-indoor-serial-number').is(":visible")){
                    if( $('#prod1-indoor-serial-number').val() == $('#prod2-indoor-serial-number').val() ){
                        showErrorField($('#prod2-indoor-serial-number'));
                        showErrorMessage(stepPane3, null, 'You must enter a unique serial number for each product.');
                        evt.preventDefault();
                        error = true;
                    }
                }
                
                if($('#prod2-indoor-serial-number').is(":visible") && $('#prod3-indoor-serial-number').is(":visible")){
                    if( $('#prod2-indoor-serial-number').val() == $('#prod3-indoor-serial-number').val() ){
                        showErrorField($('#prod3-indoor-serial-number'));
                        showErrorMessage(stepPane3, null, 'You must enter a unique serial number for each product.');
                        evt.preventDefault();
                        error = true;
                    }
                    
                    if( $('#prod1-indoor-serial-number').val() == $('#prod3-indoor-serial-number').val() ){
                        showErrorField($('#prod3-indoor-serial-number'));
                        showErrorMessage(stepPane3, null, 'You must enter a unique serial number for each product.');
                        evt.preventDefault();
                        error = true;
                    }
                }
                
                if (!error) {
                    $(".form-message").remove();
                    
                    if (!step3Ready) {
                        evt.preventDefault();
                        
                        var productsCount = $(".product-serial-number:visible").length;
                        var checkedProductsCount = 0;
                        var error = false;
                        
                        if (productsCount > 0) {
                            $("#ClaimRegisterProductForm button, #ClaimRegisterProduct:input:not(#prod1-indoor-model-number):not(#prod2-indoor-model-number):not(#prod3-indoor-model-number)").prop("disabled", true);
                        }
                        
                        $(".product-serial-number:visible").each(function() {
                            var $this = $(this);
                            
                        	$.ajax({
                                url: /salesDataClaimsProducts/,
                                type: 'POST',
                                dataType: 'JSON',
                                data: {
                                    validate: true,
                                    serialNumber: $(this).val()
                                },
                                success: function (resp) {
                                    checkedProductsCount++;

                                    if (!resp.status) {
                                        if (resp.messages[0] === 'Product serial number already exist') {
                                            error = true;
                                            showErrorField($this);
                                            showErrorMessage($(".step-pane:eq(2)"), null, 'Serial number has already been submitted before "' + $this.val() + '"!');
                                        } else {
                                            $this.next().val("Yes");
                                        }
                                    }else{
                                        $this.next().val("No");
                                    }
                                    
                                    if (checkedProductsCount === productsCount) {
                                        $("#ClaimRegisterProductForm button, #ClaimRegisterProduct:input:not(#prod1-indoor-model-number):not(#prod2-indoor-model-number):not(#prod3-indoor-model-number)").prop("disabled", false);
                                        
                                        if (!error) {
                                            step3Ready = true;
                                            
                                            $(".btn-next").click();
                                        }
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    checkedProductsCount++;
                                    error = true;
                                    
                                    flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                                    
                                    if (checkedProductsCount === productsCount) {
                                        $("#ClaimRegisterProductForm button, #ClaimRegisterProduct:input:not(#prod1-indoor-model-number):not(#prod2-indoor-model-number):not(#prod3-indoor-model-number)").prop("disabled", false);
                                        
                                        if (!error) {
                                            step3Ready = true;
                                            
                                            $(".btn-next").click();
                                        }
                                    }
                                }
                            });
                        });
                    }
                }
            }

            if (data.step === 4) {
                var stepPane4 = stepPane.eq(3);
                resetValidation(stepPane4);
                $(".form-message .error-message, .form-message .error-message-title").remove();
                
                if (!validateFormFields(stepPane4)) {
                    evt.preventDefault();
                    error = true;
                }
                
                var bsbReg = new RegExp("^[0-9]{3}-[0-9]{3}$");
                if(!bsbReg.test($('#bsb-number').val())){
                    showErrorField($('#bsb-number'));
                    showErrorMessage(stepPane4, null, 'Your BSB number must be between exactly 6 digits and contains digits only to be eligible');
                    evt.preventDefault();
                    error = true;
                }
                
                var accountReg = new RegExp("^[0-9]{1,10}$");
                if(!accountReg.test($('#account-no').val())){
                    showErrorField($('#account-no'));
                    showErrorMessage(stepPane4, null, 'Your account number must be less than 10 digits and contains digits only to be eligible');
                    evt.preventDefault();
                    error = true;
                }
                
                if (!error) {
                    $(".form-message").remove();
                }
            }

            if (data.step === 5) {
                error = false;
                var stepPane5 = stepPane.eq(4);
                resetValidation(stepPane5);
                $(".form-message .error-message, .form-message .error-message-title").remove();
                
                if (!validateFormFields(stepPane5)) {
                    evt.preventDefault();
                    error = true;
                }
                
                if( $('#terms-checkbox').prop('checked') != true){
                    showErrorField($('#terms-checkbox'));
                    showErrorMessage(stepPane5, null, 'Please accept terms and conditions agreement.');
                    evt.preventDefault();
                    error = true;
                }
                
                if(!error){
                    $('#ClaimRegisterProductForm').trigger('submit');
                }
                
                if (!error) {
                    $(".form-message").remove();
                }
            }
        });

        $("body").on("change", ".dynamic-toggle", function() {
            $("." + $(this).data("group-class")).hide();
            $($(this).find(":selected").data("toggle")).show();
            $("." + $(this).data("group-class") + ":not(:visible) :input").val("");
        });
        
        var options = {
        types: ['geocode'],
        componentRestrictions: {country: "au"}
        };
        
        var componentForm = {
              locality: '#suburb',
              administrative_area_level_1: '#state',
              postal_code: '#postcode'
            };
        
        var input = document.getElementById("address1");
        
        $("input, select").on("keydown", function(e) { if (e.keyCode === 13) { e.preventDefault(); return false; } });
        
        google.maps.event.addDomListener(input, 'keydown', function(event) { 
          if (event.keyCode === 13) { 
              event.preventDefault(); 
          }
        }); 
        
        var selected = false;
        
        $("#address1").on("keyup", function() {
              selected = false;
        });
        
        $("#address1").on("blur", function() {
              if (!selected) {
                      $("#address1").val("");
          }
        });
        
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener('place_changed', function (event) {
          var place = autocomplete.getPlace();
        
              if (place === undefined || place.address_components === undefined) {
                      $("#address1").val("");
                      selected = false;
                      return;	
            }
        
            $.ajax({
                url: /salesDataClaimsProducts/,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    validate: true,
                    address: $('#address1').val()
                },
                success: function (resp) {
                    if (!resp.status) {
                        showErrorField($('#address1'));
                        showErrorMessage($(".step-pane:eq(0)"), null, 'A claim has already been submitted from this address "' + $("#address1").val() + '"!');
                        $("#address1").val("");
                        selected = false;
                    } else {
                        
                        for (var i = 0; i < place.address_components.length; i++) {
                            var addressType = place.address_components[i].types[0];
                            if (componentForm[addressType]) {
                              var val = place.address_components[i]['long_name'];
                                      $(componentForm[addressType]).val(val);
                            }
                        }
                
                        selected = true;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                }
            });
    
        });
    }

function bottomNextPrev(){



$('.bottom-next-prev .bottom-next').click(function(){

    $('#myWizard .actions .btn-next').click();
    $(this).html($('#myWizard .actions .btn-next').html());
    
    $('html, body').animate({
        scrollTop: ($('#myWizard .steps-container').offset().top)
    },500);

});

$('*').click(function(){
    $('.bottom-next-prev .bottom-next').html($('#myWizard .actions .btn-next').html());
});
$('.bottom-next-prev .bottom-prev').click(function(){

    $('#myWizard .actions .btn-prev').click();
    
});
}

})(jQuery);
