function initProductDetails(editorType) {
    initProductDetailsForm();

    toggleOrderInfo();
    $('#canOrderChk').change(function (event) {
        toggleOrderInfo();
    });
    initProductImages();
    initProductVariants();
    initProductVariantImgUpload();
    initProductVariantImgSelector();
    initCategoryManagment();
    initBrands();
    initSuplierOrgs();
    initProductContentsTab(editorType);

    $(document).on('change', '#relatedAppIdSelect', function (e) {
        $('form.updateProduct').trigger('submit');
    });
    $(document).on('change', '[name=relatedItemId]', function (e) {
        $('form.updateProduct').trigger('submit');
    });
    $("#create-asset-form").forms({
        onSuccess: function (resp) {
            if( resp.status ) {
                Msg.info("Created asset, reloading ..");
                window.location.reload();
            } else {
                Msg.error("An error occurred creating the linked asset " + resp.messages);
            }
        }
    });
}

function initProductContentsTab(editorType) {
    if (editorType === 'html') {
        initHtmlEditors();
    } else {
        initFullscreenEditor($('#brief'));
        initFullscreenEditor($('#notes'));
    }

    $('.updateProductBrief').forms({
        onSuccess: function () {
            Msg.success('Successfully updated product\'s brief!', 'saveProduct');
        }
    });

    $('.updateProductContent').forms({
        onSuccess: function () {
            Msg.success('Successfully updated product\'s content!', 'saveProduct');
        }
    });
}

function initProductDetailsForm() {
    $('form.updateProduct').forms({
        onSuccess: function (resp) {
            flog(resp)
            $('#relatedAppWrap').reloadFragment({
                whenComplete: function (dom) {
                }
            });
            Msg.success('Successfully updated product!', 'saveProduct');

            var webNameInput = $('form.updateProduct [name=webName]');
            var origWebname = webNameInput.data('orig')
            var newWebname = webNameInput.val();

            if (origWebname != newWebname && resp.status) {
                window.location.href = resp.nextHref;
            }
        }
    });

}

function initProductVariants() {
    var modal = $('#modal-product-option');
    modal.find('form').forms({
        onSuccess: function (resp, form) {
            flog('done', resp, form);
            if (resp.status) {
                Msg.info('Saved');
                modal.modal('hide');
                reloadVariantList();
            } else {
                Msg.error('An error occured saving the option');
            }
        }
    });

    var variantsWrapper = $('#variants');

    variantsWrapper.on('click', '.btn-add-variant', function (e) {
        e.preventDefault();
        var target = $(e.target);
        var ppId = target.closest('.product-parameter').data('product-parameter-id');
        modal.find('input[name=productParameterId]').val(ppId);
        modal.find('input[name=productOptionId]').val('');
        modal.find('input[name=name]').val('');
        modal.find('input[name=title]').val('');
        modal.find('input[name=cost]').val('');
        flog('add variant for', ppId, modal.find('input[name=productParameterId]'));

        modal.modal('show');
    });

    variantsWrapper.on('click', '.add-variant-type', function (e) {
        e.preventDefault();
        var title = prompt('Please enter a name for the variant type, eg Colour or Size ');
        if (title !== null) {
            doCreateProductParameter(title);
        }
    });

    variantsWrapper.on('click', '.add-field', function (e) {
        e.preventDefault();
        var title = prompt('Please enter a name for the field, eg Height');
        if (title !== null) {
            doCreateProductField(title);
        }
    });

    variantsWrapper.on('click', '.btn-edit-variant', function (e) {
        e.preventDefault();
        var target = $(e.target);
        var tr = target.closest('tr');
        var ppId = target.closest('.product-parameter').data('product-parameter-id');
        modal.find('input[name=productParameterId]').val(ppId);
        var optId = target.closest('a').attr('href');
        modal.find('input[name=productOptionId]').val(optId);
        modal.find('input[name=name]').val(tr.find('.variant-name').text());
        modal.find('input[name=title]').val(tr.find('.variant-title').text());
        modal.find('input[name=cost]').val(tr.find('.variant-cost').text());
        modal.modal('show');
    });

    variantsWrapper.on('click', '.btn-option-img-del', function (e) {
        e.preventDefault();

        var btn = $(this);
        var optid = btn.data('optid');

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                productOptionId: optid,
                productOptionImgUrl: false
            },
            success: function () {
                reloadVariantList();
            }
        });
    });

    $(document.body).on('click', '.btn-delete-variant-type', function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        var name = $(this).attr('title');
        confirmDelete(id, name, function () {
            Msg.success('Variant type deleted', 'deleteVariant');
            reloadVariantList();
        });
    });

    $(document.body).on('click', '.btn-delete-variant', function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        var name = $(this).attr('title');
        confirmDelete(id, name, function () {
            Msg.success('Variant deleted', 'deleteVariant');
            reloadVariantList();
        });
    });
}

function reloadVariantList() {
    $('#variantsList').reloadFragment({
        whenComplete: function () {
            initProductVariantImgUpload();
        }
    });
}

function initProductVariantImgSelector() {
    var modal = $('#modal-option-img');

    $(document.body).on('click', '.btn-option-img', function (e) {
        e.preventDefault();

        var btn = $(this);
        var optid = btn.data('optid');

        modal.find('input[name=productOptionId]').val(optid);

        modal.modal('show');
    });

    $(document.body).on('click', '.select-opt-img', function (e) {
        e.preventDefault();

        modal.find('.btn-image-selected ').removeClass('image-selected');

        var img = $(this);
        img.closest('div').find('.btn-image-selected ').addClass('image-selected');
        var href = img.attr('href');

        var form = img.closest('form');
        form.find('input[name=productOptionImgUrl]').val(href);
    });

    $(document.body).on('click', '.image-change', function (e) {
        e.preventDefault();

        var btn = $(this);
        var optid = btn.data('optid');

        modal.find('input[name=productOptionId]').val(optid);

        modal.modal('show');
    });

    modal.find('form').forms({
        onSuccess: function (resp) {
            modal.modal('hide');
            reloadVariantList();
        }
    });

    $(document.body).on('hidden.bs.modal', '#modal-option-img', function () {
        modal.find('input[name=productOptionId]').val(null);
        modal.find('.btn-image-selected ').removeClass('image-selected');
    });
}

function initProductVariantImgUpload() {
    $('.btn-option-img-upload').each(function (i, item) {
        var btn = $(item);
        var optid = btn.data('optid');

        btn.upcropImage({
            buttonContinueText: 'Save',
            url: window.location.pathname + '?productOptionId=' + optid,
            fieldName: 'variantImg',
            onCropComplete: function (resp) {
                flog('onCropComplete:', resp, resp.nextHref);
                reloadVariantList();
            },
            onContinue: function (resp) {
                flog('onContinue:', resp, resp.result.nextHref);
                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        uploadedHref: resp.result.nextHref,
                        applyImage: true
                    },
                    success: function (resp) {
                        flog('success');
                        if (resp.status) {
                            Msg.info('Done', 'uploadVariantImg');
                            reloadVariantList();
                        } else {
                            Msg.error('An error occured processing the variant image.', 'uploadVariantImg');
                        }
                    },
                    error: function () {
                        alert('An error occured processing the variant image.');
                    }
                });
            }
        });
    });
}

function initProductImages() {
    $('#product-images').on('click', '.delete-image', function (e) {
        e.preventDefault();
        var target = $(e.target).closest('a');
        var href = target.attr('href');
        var name = getFileName(href);
        confirmDelete(href, name, function () {
            target.closest('.product-image-thumb').remove();
        });
    });

    var curImageHref = '';
    $('.change-image').on('click', function (e) {
        curImageHref = $(this).attr('href');
    });

    $('.change-image').mselect({
        forceHideFiles: true,
        onSelectFile: function () {
            flog("prod: onSelectFile", arguments);
            var hash = arguments[3];
            // This will update with new product image
            $.ajax({
                url: window.location.pathname,
                data: {
                    newImageHash : hash,
                    curImageHref: curImageHref
                },
                dataType: 'json',
                type: 'post',
                success: function (resp) {
                    if (resp && resp.status){
                        Msg.success('Done', 'uploadProductImg');
                        $('#product-images').reloadFragment();
                    } else {
                        Msg.error('An error occurred processing the product image', 'uploadProductImg');
                    }
                    curImageHref = '';
                },
                error: function () {
                    Msg.error('An error occurred processing the product image', 'uploadProductImg');
                    curImageHref = '';
                }
            })
        }
    });

    $('#btn-change-ava').mselect({
        forceHideFiles: true,
        onSelectFile: function () {
            var hash = arguments[3];
            $.ajax({
                url: window.location.pathname,
                data: {
                    hash: hash,
                },
                dataType: 'json',
                type: 'post',
                success: function (resp) {
                    if (resp && resp.status){
                        Msg.success('Done', 'uploadProductImg');
                        $('#product-images').reloadFragment();
                    } else {
                        Msg.error('An error occurred processing the product image', 'uploadProductImg');
                    }
                },
                error: function () {
                    Msg.error('An error occurred processing the product image', 'uploadProductImg');
                }
            })
        }
    });
}

function toggleOrderInfo() {
    var chk = $('#canOrderChk:checked');
    if (chk.length > 0) {
        $('.ordering').show();
    } else {
        $('.ordering').hide();
    }
}

function doCreateProductParameter(newTitle) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        dataType: 'json',
        data: {
            newProductParameterTitle: newTitle
        },
        success: function (resp) {
            flog('success');
            if (resp.status) {
                Msg.info('Done', 'productParams');
                reloadVariantList();
            } else {
                Msg.error('An error occured creating the variant type', 'productParams');
            }
        },
        error: function () {
            alert('Sorry, we couldn\'t save.');
        }
    });
}

function doCreateProductField(newTitle) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        dataType: 'json',
        data: {
            newProductFieldTitle: newTitle
        },
        success: function (resp) {
            flog('success');
            if (resp.status) {
                Msg.info('Done', 'productParams');
                reloadVariantList();
            } else {
                Msg.error('An error occured creating the field', 'productParams');
            }
        },
        error: function () {
            alert('Sorry, we couldn\'t save.');
        }
    });
}

function initCategoryManagment() {
    flog('init delete category');
    $('.categories-wrapper').on('click', 'a.btn-delete-category', function (e) {
        flog('click', this);
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this category?')) {
            var a = $(this);
            var categoryName = a.attr('href');
            doRemoveFromCategory(categoryName);
        }
    });

    $('.categories-wrapper').on('click', '.addCategory a', function (e) {
        flog('click', this);
        e.preventDefault();
        e.stopPropagation();
        var categoryName = $(e.target).closest('a').attr('href');
        doAddToCategory(categoryName);
    });

}

function doAddToCategory(categoryName) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {
            addProductCategory: categoryName
        },
        success: function (resp) {
            if (resp.status) {
                reloadCategories();
            } else {
                Msg.error('Couldnt add the product to category: ' + resp.messages, 'addToCategory');
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText, 'addToCategory');
        }
    })

}

function doRemoveFromCategory(categoryName) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {
            removeProductCategory: categoryName
        },
        success: function (resp) {
            if (resp.status) {
                reloadCategories();
            } else {
                Msg.error('Couldnt remove the product to category: ' + resp.messages, 'removeCategory');
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText, 'removeCategory');
        }
    })

}

function initBrands() {
    var brandSelector = $("#brandSelector");
    var brandSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: window.location.pathname + '?catSearch=%QUERY',
            wildcard: '%QUERY'
        }
    });


    brandSearch.initialize();

    brandSelector.typeahead({
        highlight: true
    },{
        displayKey: 'title',
        source: brandSearch.ttAdapter(),
        templates: {
            empty: '<div class="text-danger" style="padding: 5px 10px;">No existing brands were found</div>',
        }
    });

    brandSelector.bind('typeahead:select', function (ev, sug) {
        $('input[name=brand]').val(sug.name);
    });

    brandSelector.attr('autocomplete', 'off');
}

function initSuplierOrgs() {
    $("#suplierOrgs").entityFinder({
        type: 'organisation',
        useActualId: false,
        onSelectSuggestion: function (suggestion) {
            var orgId = $(suggestion).attr("data-id");
            $("[name=supplier]").val(orgId);
        }
    });
}

function reloadCategories() {
    $('#categoriesContainer').reloadFragment();
}