(function ($) {

    function initSaveDetails() {
        $(".updateBadge").forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);
            }
        });
    }

    function initBadgeImageUpload() {
        flog('initBadgeImageUpload');
        $('.btn-krecognition-badge-img-upload').each(function (i, item) {
            var btn = $(this);
            
            btn.upcropImage({
                buttonContinueText: 'Save',
                url: window.location.pathname + '?uploadBadgeImage',
                fieldName: 'badgeImg',
                onCropComplete: function (resp) {
                    flog('onCropComplete:', resp, resp.nextHref);
                    reloadBadge();
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
                                Msg.info('Done');
                                reloadBadge();
                            } else {
                                Msg.error('An error occured processing the badge image.');
                            }
                        },
                        error: function () {
                            alert('An error occured processing the badge image.');
                        }
                    });
                }
            });
        });
    }

    function initBadgeImageDelete() {
        $('body').on('click', '.btn-krecognition-badge-img-del', function (e) {
            e.preventDefault();

            Kalert.confirm('You want to remove the badge image?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        removeBadgeImage: true
                    },
                    success: function (resp) {
                        Kalert.close();

                        if (resp.status) {
                            reloadBadge();
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                    },
                    error: function () {
                        reloadBadge();
                        Kalert.close();

                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        });
    }

    function reloadBadge() {
        window.location.reload();
    }

    /* Run Init Methods */
    $(function () {
        initSaveDetails();
        initBadgeImageUpload();
        initBadgeImageDelete();
    });
})(jQuery);