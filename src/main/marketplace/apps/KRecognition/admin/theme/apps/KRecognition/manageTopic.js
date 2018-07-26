(function ($) {

    function initSaveDetails() {
        $("#topic-detail-form").forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);
            }
        });
    }

    function initSelectLevelsValueType() {
        $('body').on('change', '.krecognition-select-levels-value', function (e) {
            var sel = $(this);
            var val = sel.val();
            if (val === '' || val === null) {
                $('.krecognition-select-dataSeries').hide().find('select').val('');
                $('.krecognition-select-pointsBucket').hide().find('select').val('');
            } else {
                $('.krecognition-select-dataSeries').hide().find('select').val('');
                $('.krecognition-select-pointsBucket').hide().find('select').val('');

                $('.krecognition-select-' + val).show();
            }

        });
    }

    function initCreateBadge() {
        var modal = $('#modal-krecognition-create-badge');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);

                reloadBadges();

                modal.modal('hide');
                form.trigger('reset');
            }
        });
    }

    function initDeleteBadge() {
        $('body').on('click', '.btn-krecognition-badge-del', function (e) {
            e.preventDefault();

            var btn = $(this);
            var tr = btn.closest('tr');
            var badgeid = tr.data('badgeid');

            Kalert.confirm('You want to delete this badge?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        deleteBadge: badgeid
                    },
                    success: function (resp) {
                        Kalert.close();

                        if (resp.status) {
                            reloadBadges();
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                    },
                    error: function () {
                        reloadBadges();
                        Kalert.close();

                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        });
    }

    function initUpdateBadge() {
        var modal = $('#modal-krecognition-update-badge');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);

                reloadBadges();

                modal.modal('hide');
                form.trigger('reset');
            }
        });

        $('body').on('click', '.btn-krecognition-badge-update', function (e) {
            e.preventDefault();

            var btn = $(this);
            var tr = btn.closest('tr');

            var badgeid = tr.data('badgeid');
            var name = tr.data('badgename');
            var title = tr.data('badgetitle');

            modal.find('[name=updateBadge]').val(true);
            modal.find('[name=badgeid]').val(badgeid);
            modal.find('[name=newName]').val(name);
            modal.find('[name=title]').val(title);

            var display = title || name;

            modal.find('.krecognition-badge-title').text('"' + display + '"');

            modal.modal('show');
        });
    }

    function initBadgeImageUpload() {
        flog('initBadgeImageUpload');
        $('.btn-krecognition-badge-img-upload').each(function (i, item) {
            var btn = $(item);
            var tr = btn.closest('tr');
            var badgeid = tr.data('badgeid');

            btn.upcropImage({
                buttonContinueText: 'Save',
                url: window.location.pathname + 'badges/'+badgeid+'/?uploadBadgeImage',
                fieldName: 'badgeImg',
                onCropComplete: function (resp) {
                    flog('onCropComplete:', resp, resp.nextHref);
                    reloadBadges();
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
                                reloadBadges();
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

            var btn = $(this);
            var tr = btn.closest('tr');
            var badgeid = tr.data('badgeid');

            Kalert.confirm('You want to remove the badge image?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    url: window.location.pathname + 'badges/'+badgeid+'/',
                    data: {
                        removeBadgeImage: badgeid
                    },
                    success: function (resp) {
                        Kalert.close();

                        if (resp.status) {
                            reloadBadges();
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                    },
                    error: function () {
                        reloadBadges();
                        Kalert.close();

                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        });
    }

    function reloadBadges() {
        $('#krecognition-badges-body').reloadFragment({
            whenComplete: function () {
                initBadgeImageUpload();
            }
        });
    }

    function initCreateLevel() {
        var modal = $('#modal-krecognition-create-level');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);

                reloadLevels();

                modal.modal('hide');
                form.trigger('reset');
            }
        });
    }

    function initDeleteLevel() {
        $('body').on('click', '.btn-krecognition-level-del', function (e) {
            e.preventDefault();

            var btn = $(this);
            var tr = btn.closest('tr');
            var levelid = tr.data('levelid');

            Kalert.confirm('You want to delete this level?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        deleteLevel: levelid
                    },
                    success: function (resp) {
                        Kalert.close();

                        if (resp.status) {
                            reloadLevels();
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                    },
                    error: function () {
                        reloadLevels();
                        Kalert.close();

                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        });
    }

    function initUpdateLevel() {
        var modal = $('#modal-krecognition-update-level');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);

                reloadLevels();

                modal.modal('hide');
                form.trigger('reset');
            }
        });

        $('body').on('click', '.btn-krecognition-level-update', function (e) {
            e.preventDefault();

            var btn = $(this);
            var tr = btn.closest('tr');

            var levelid = tr.data('levelid');
            var name = tr.data('levelname');
            var title = tr.data('leveltitle');
            var amount = tr.data('levelamount');
            var colour = tr.data('colour');

            modal.find('[name=updateLevel]').val(true);
            modal.find('[name=levelid]').val(levelid);
            modal.find('[name=newName]').val(name);
            modal.find('[name=title]').val(title);
            modal.find('[name=levelAmount]').val(amount);
            modal.find('[name=colour]').val(colour);

            var display = title || name;

            modal.find('.krecognition-level-title').text('"' + display + '"');

            modal.modal('show');
        });
    }

    function initLevelImageUpload() {
        flog('initLevelImageUpload');
        $('.btn-krecognition-level-img-upload').each(function (i, item) {
            var btn = $(item);
            var tr = btn.closest('tr');
            var levelid = tr.data('levelid');

            btn.upcropImage({
                buttonContinueText: 'Save',
                url: window.location.pathname + '?uploadLevelImage&levelid=' + levelid,
                fieldName: 'levelImg',
                onCropComplete: function (resp) {
                    flog('onCropComplete:', resp, resp.nextHref);
                    reloadLevels();
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
                                reloadLevels();
                            } else {
                                Msg.error('An error occured processing the level image.');
                            }
                        },
                        error: function () {
                            alert('An error occured processing the level image.');
                        }
                    });
                }
            });
        });
    }

    function initLevelImageDelete() {
        $('body').on('click', '.btn-krecognition-level-img-del', function (e) {
            e.preventDefault();

            var btn = $(this);
            var tr = btn.closest('tr');
            var levelid = tr.data('levelid');

            Kalert.confirm('You want to remove the level image?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        removeLevelImage: levelid
                    },
                    success: function (resp) {
                        Kalert.close();

                        if (resp.status) {
                            reloadLevels();
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                    },
                    error: function () {
                        reloadBadges();
                        Kalert.close();

                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        });
    }

    function initGenerateLevelAwards() {
        $('body').on('click', '.btn-generate-awards', function (e) {
            e.preventDefault();

            var btn = $(this);

            Kalert.confirm('You want to generate level awards for this topic?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        processLevels: true
                    },
                    success: function (resp) {
                        Kalert.close();

                        if (resp.status) {
                            reloadLevels();
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                    },
                    error: function () {
                        reloadBadges();
                        Kalert.close();

                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        });
    }

    function reloadLevels() {
        $('#krecognition-levels-body').reloadFragment({
            whenComplete: function () {
                initLevelImageUpload();
            }
        });
    }

    /* Run Init Methods */
    $(function () {
        /* Topic */
        initSaveDetails();
        initSelectLevelsValueType();

        /* Badges */
        initCreateBadge();
        initDeleteBadge();
        initUpdateBadge();
        initBadgeImageUpload();
        initBadgeImageDelete();

        /* Levels */
        initCreateLevel();
        initDeleteLevel();
        initUpdateLevel();
        initLevelImageUpload();
        initLevelImageDelete();
        initGenerateLevelAwards();
    });
})(jQuery);