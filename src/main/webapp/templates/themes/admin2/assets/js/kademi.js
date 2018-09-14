/**
 * Disable/enable form controls
 * @method disable
 * @param {Boolean} disable Be disabled or enabled
 * @return {jQuery} The disabled/enabled control
 */
$.fn.disable = function (disable) {
    return this.each(function () {
        this.disabled = disable;
    });
};

/**
 * Check/uncheck form controls
 * @method check
 * @param {Boolean} check Be checked or unchecked
 * @return {jQuery} The checked/unchecked control
 */
$.fn.check = function (check) {
    return this.each(function () {
        this.checked = check;
    });
};

/**
 * Check value or innerHTML of element is empty or not
 * @method isEmpty
 * @return {Boolean}
 */
$.fn.isEmpty = function () {
    return this[0].value === undefined ? this.text().trim() === '' : this[0].value.trim() === '';
};

/**
 * Check the available/existing of a object, if object is existing, the callback will be run
 * @method exist
 * @param {Function} whenExist The callback is called when object is existed
 * @param {Function} whenNotExist The callback is called when object is not existed
 * @return {jQuery}
 */
$.fn.exist = function (whenExist, whenNotExist) {
    if (this.length > 0) {
        if (typeof whenExist === 'function') {
            whenExist.call(this);
        }
    } else {
        if (typeof whenNotExist === 'function') {
            whenNotExist.call(this);
        }
    }
    return this;
};

(function ($) {
    var oldModal = $.fn.modal;

    function checkModal(modal) {
        var modalDialog = modal.find('.modal-dialog');

        if (modalDialog.length === 0) {
            flog('Modal has old structure. Modifying structure...');

            var modalContent = modal.html();
            var sizeClass = '';
            if (modal.hasClass('modal-lg')) {
                sizeClass = 'modal-lg';
                modal.removeClass('modal-lg');
            } else if (modal.hasClass('modal-md')) {
                sizeClass = 'modal-md';
                modal.removeClass('modal-md');
            } else if (modal.hasClass('modal-sm')) {
                sizeClass = 'modal-sm';
                modal.removeClass('modal-sm');
            } else if (modal.hasClass('modal-xs')) {
                sizeClass = 'modal-xs';
                modal.removeClass('modal-xs');
            } else if (modal.hasClass('modal-xss')) {
                sizeClass = 'modal-xss';
                modal.removeClass('modal-xss');
            }

            modal.html('<div class="modal-dialog ' + sizeClass + '"><div class="modal-content">' + modalContent + '</div></div>');
            flog('Modifying structure is DONE');

            modal.trigger('modal.bs.done');

            if (console && console.log) {
                console.log('%cHey! You\'re using old modal structure of Bootstrap2. You SHOULD change your modal structure! \n%c- url="' + window.location.href + '" \n- id="' + modal.attr('id') + '" \n%cMessage from duc@kademi.co', 'font-size: 24px; color: blue;', 'font-size: 16px; color: #000;', 'font-size: 11px; color: #aaa;');
            }
        }
    }

    $.fn.modal = function (option, _relatedTarget) {
        var targets = $(this);
        targets.each(function () {
            checkModal($(this));
        });

        return oldModal.call(targets, option, _relatedTarget);
    };

    $(function () {
        $('.modal').each(function () {
            checkModal($(this));
        });
    });

})(jQuery);

function initToggled() {
    flog('initToggled');

    $('[data-toggled=display]').exist(function () {
        this.each(function () {
            var panel = $(this);
            var actor = $(panel.attr('data-actor'));
            var checkActor = function () {
                if (actor.is(':checked')) {
                    panel.show();
                    actor.trigger('checked.toggled', panel);
                } else {
                    panel.hide();
                    actor.trigger('unchecked.toggled', panel);
                }
            };

            actor.addClass('toggler');

            actor.on('click', function () {
                checkActor();
            });
            setTimeout(function () {
                checkActor();
            }, 100);
        });
    });
}

function doMasonryPanel() {

    $('.masonry-panel').each(function () {
        var panel = $(this);

        // Bind event listener
        panel.on('layoutComplete', function () {
            var items = panel.find(".masonry-item");

            flog("onlayout", items);

            items.animate({
                opacity: 1
            }, 1000, function () {
                flog("complete");
            });
        });

        panel.masonry({
            columnWidth: ".masonry-sizer",
            percentPosition: true
        });
    });
}

function initMasonryPanel() {
    flog('initMasonryPanel');

    if (typeof window.Masonry === 'function') {
        doMasonryPanel();
    } else {
        $.getScriptOnce('/static/masonry/3.3.2/masonry.pkgd.min.js', function () {
            doMasonryPanel();
        });
    }
}

function initDatePicker() {
    flog('initDatePicker');

    $('.date-picker').exist(function () {
        var datePicker = this;
        var container = 'body';
        var inputGroup = datePicker.closest('.input-group');
        var formGroup = datePicker.closest('.form-group');
        var id = 'date-picker-wrapper' + (new Date()).getTime();

        if (inputGroup.length > 0) {
            inputGroup.attr('id', id);
            container = '#' + id;
        } else if (formGroup.length > 0) {
            formGroup.attr('id', id);
            container = '#' + id;
        }

        datePicker.datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy',
            container: container
        });

        var impactedTargetSelector = datePicker.attr('data-impacted');

        if (impactedTargetSelector) {
            var changedOption = datePicker.attr('data-impact') === 'startDate' ? 'StartDate' : 'EndDate';

            datePicker.on('changeDate', function (ev) {
                flog(ev);
                var impactedTarget = $(impactedTargetSelector);
                var dataDatePicker = impactedTarget.data('datepicker');
                dataDatePicker['set' + changedOption](ev.date);
            });
        }
    });

    $(document.body).on('click', '[data-role="date-picker-trigger"]', function (e) {
        e.preventDefault();

        var trigger = $(this);
        var datePickerId = trigger.attr('href');
        var datePicker = $(datePickerId);

        datePicker.datepicker('show');
    });

    $(document.body).on('click', '[data-role="date-time-picker-trigger"]', function (e) {
        e.preventDefault();

        var trigger = $(this);
        var datePickerId = trigger.attr('href');
        var datePicker = $(datePickerId);

        datePicker.datetimepicker('show');
    });

    $('.date-time-picker').exist(function () {
        flog('Found date-time-picker', this);
        var options = {};
        if (this.data('format')) {
            options.format = this.data('format');
        }
        this.datetimepicker(options);
    });
}

function initTabbable() {
    flog('initTabbable');

    $('.tabbable').exist(function () {
        this.each(function () {
            var wrapper = $(this);
            var isModal = wrapper.closest('.modal').length > 0;
            var tabHeader = wrapper.find('.nav-tabs');
            var links = tabHeader.find('a');
            var hash = window.location.hash;

            links.each(function () {
                var link = $(this);
                link.on('click', function (e) {
                    e.preventDefault();

                    if (!isModal) {
                        window.location.hash = $(this).attr('href') + '-tab';
                    }
                });
            });

            if (hash === '') {
                links.eq(0).trigger('click');
            }
        });

        $(window).on('hashchange', function () {
            var hash = window.location.hash.replace('-tab', '');
            flog('hashchanged', hash);

            var tabbable = $('.tabbable .nav-tabs a[href="' + hash + '"]');
            tabbable.trigger('click');
        }).trigger('hashchange');
    });
}

function initChkAll() {

    $(document.body).on('click', '.chk-all', function () {
        $(this).closest('table').find('tbody input:checkbox').prop('checked', this.checked);
    });
}

function initClearer() {
    var body = $(document.body);

    body.on('click', '[data-type=clearer]', function (e) {
        e.preventDefault();

        var target = $($(this).data('target'));
        flog("clearer click", target);
        target.val('');
        target.trigger('change');
        target.trigger('keyup');
    });
}

function initSwitch() {
    if ($(document).bootstrapSwitch) {

        $(".make-switch input[type=checkbox], input.make-switch").each(function () {
            var target = $(this);
            var dataHolder = target.is('.make-switch') ? target : target.closest('.make-switch');

            target.bootstrapSwitch({
                onColor: dataHolder.attr('data-on-color') || 'info',
                offColor: dataHolder.attr('data-off-color') || 'default',
                size: dataHolder.attr('data-size') || 'normal',
                onText: dataHolder.attr('data-on-text') || 'ON',
                offText: dataHolder.attr('data-off-text') || 'OFF',
                labelText: dataHolder.attr('data-label-text') || '&nbsp;',
                handleWidth: +dataHolder.attr('data-handle-width') || 'auto',
                labelWidth: +dataHolder.attr('data-label-width') || 'auto'
            });
        });
    }
}

function validateFuseEmail(emailAddress) {
    var pattern = /^(("[\w-\s]+")|([\w-'']+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,66}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;

    if (pattern.test(emailAddress)) {
        return true;
    } else {
        emailAddress = (emailAddress || '').replace(/^.*\<(.*)\>$/, '$1');

        return pattern.test(emailAddress);
    }
}

function initFuseModals() {
    $(document.body).on('click', '[data-toggle=modal]', function (e) {
        e.preventDefault();
    });

    $(document.body).on('click', '[data-type=form-submit]', function (e) {
        e.preventDefault();
        flog("click submit");
        $(this).closest('.modal').find('form').not('.dz-clickable').trigger('submit');

        if (console && console.log) {
            console.log('%cHey! You\'re using data-type="form-submit" button. You SHOULD change it to type="submit" and move this button inside your form.\n%cMessage from duc@kademi.co', 'font-size: 24px; color: blue;', 'font-size: 11px; color: #aaa;');
        }
    });

    $(document.body).on('shown.bs.modal loaded.bs.modal', '.modal', function () {
        var textbox = $(this).find('input, textarea').filter(':visible');
        textbox.eq(0).focus();
    });

    $(document).on({
        'show.bs.modal': function () {
            var zIndex = 1040 + (10 * $('.modal:visible').length);
            $(this).css('z-index', zIndex);
            setTimeout(function () {
                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            }, 0);
        },
        'hidden.bs.modal': function () {
            $('.modal:visible').length && $(document.body).addClass('modal-open');
        }
    }, '.modal');
}

function initFuseModal(modal, callback) {
    modal.modal({
        show: false
    });

    if (typeof callback === 'function') {
        callback.apply(this);
    }
}

function initNewUserForm() {
    var modal = $('#modal-new-user');
    var form = modal.find('form');
    var newOrganisationBtn = modal.find(".newOrganisation");
    var existingOrganisationBtn = modal.find(".existingOrganisation");
    var orgIdTxt = modal.find("#newOrgId");
    var nextAction = 'view';

    $(newOrganisationBtn).click(function () {
        $("#existingOrganisation").addClass("hide");
        $("#createNewOrganisation").removeClass("hide");
    });

    $(existingOrganisationBtn).click(function () {
        $("#existingOrganisation").removeClass("hide");
        $("#createNewOrganisation").addClass("hide");
    });


    form.on("input", ".orgTitle", function (e) {
        var inp = $(e.target);
        var val = inp.val();
        if (val) {
            // new page
            var newVal = val.toLowerCase();
            newVal = newVal.replaceAll("[", "-");
            newVal = newVal.replaceAll("]", "-");
            newVal = newVal.replaceAll(" ", "-");
            newVal = newVal.replaceAll("{", "-");
            newVal = newVal.replaceAll("}", "-");
            newVal = newVal.replaceAll("(", "-");
            newVal = newVal.replaceAll(")", "-");
            flog("on change", val, newVal);
            orgIdTxt.val(newVal);
        }
    });

    $('.btn-add-user').click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        modal.modal('show');
    });

    $('.btn-add-and-view').on('click', function (e) {
        nextAction = 'view';
    });

    $('.btn-add-and-add').on('click', function (e) {
        nextAction = 'add';
    });

    $('.btn-add-and-close').on('click', function (e) {
        nextAction = 'close';
    });

    modal.on('hidden.bs.modal', function () {
        resetForm(form);
    });

    form.forms({
        // validate: function () {
        //     var newUserEmail = $('#newUserEmail');
        //     var newUserEmailStr = newUserEmail.val();
        //
        //     if (newUserEmailStr == null || newUserEmailStr == "") {
        //         return true; // blank is ok now!
        //     }
        //
        //     var error = 0;
        //
        //     if (!validateFuseEmail(newUserEmailStr)) {
        //         error++;
        //         showErrorField(newUserEmail);
        //     }
        //
        //     if (error === 0) {
        //         return true;
        //     } else {
        //         showMessage('Email address is invalid!', form);
        //
        //         return false;
        //     }
        // },
        onSuccess: function (resp) {
            flog('done new user', resp);

            switch (nextAction) {
                case 'view':
                    if (resp.nextHref) {
                        window.location.href = resp.nextHref;
                    }

                    modal.modal('hide');
                    break;

                case 'close':
                    setTimeout(function () {
                        $('#table-users-body,#searchStats').reloadFragment();
                    }, 600);
                    modal.modal('hide');
                    break;

                case 'add':
                    $('#table-users-body').reloadFragment();
                    $("#newUserEmail, #newUserSurName, #newUserFirstName, #newUserNickName").val("");
                    break;
            }

            Msg.info('Saved');
        }
    });

    initOrgFinder();

}

function initOrgFinder() {
    $('input#orgId').entityFinder({
        useActualId: true,
        type: 'organisation'
    });
    $("input.entity-select").each(function (i, n) {
        var inp = $(n);
        var entityType = inp.data("entity-type");
        inp.entityFinder({
            useActualId: true,
            type: entityType
        });
    });
}

function initEntityFinder(targets) {
    if (!targets) {
        targets = $('.entity-finder');
    }

    targets.each(function () {
        var input = $(this);

        input.entityFinder({
            useActualId: input.attr('data-use-actual-id') === 'true'
        });
    });
}

function openFuseModal(modal, callback, time) {
    flog("openFuseModal");

    modal.modal('show');

    if (typeof callback === 'function') {
        callback.apply(this);
    }
}

function closeFuseModal(modal, callback) {
    modal.modal('hide');

    if (typeof callback === 'function') {
        callback.apply(this);
    }
}

function getStandardEditorHeight() {
    return $(window).height() - 400;
}

function getStandardModalEditorHeight() {
    return getStandardEditorHeight() + 200;
}

function getStandardModalHeight() {
    return getStandardModalEditorHeight();
}

/**
 * Formats a numeric value as a date, or if already a string just returns it
 *
 * @param {type} l - the numeric value to format as a date or a string to return as is
 * @returns {String} - a formatted date
 */
function formatDate(l) {
    if (l) {
        if (typeof l === "string") {
            return l;
        } else {
            var dt = new Date(l);
            var m = dt.getMonth() + 1; // java dates are 1 indexed, but js is zero indexed
            return pad2(dt.getDate()) + "/" + pad2(m) + "/" + dt.getFullYear();
        }
    } else {
        return "";
    }
}

/**
 * Formats a numeric value as a date and time, or if already a string just returns it
 *
 * @param {type} l - the numeric value to format as a date/time or a string to return as is
 * @returns {String} - a formatted date
 */
function formatDateTime(l) {
    if (l) {
        if (typeof l === "string") {
            return l;
        } else {
            var dt = new Date(l);
            var m = dt.getMonth() + 1; // java dates are 1 indexed, but js is zero indexed
            return pad2(dt.getDate()) + "/" + pad2(m) + "/" + dt.getFullYear() + " " + pad2(dt.getHours()) + ":" + pad2(dt.getMinutes());
        }
    } else {
        return "";
    }
}

function runPageInitFunctions() {
    flog('runPageInitFunctions');

    $.each(window.pageInitFunctions, function (i) {
        log('runPageInitFunctions | Run function #' + i);
        pageInitFunctions[i]();
        log('runPageInitFunctions | Done in run function #', i);
    });
}

function initAjaxStatus() {
    var depth = 0;
    $(document).ajaxStart(function () {
        depth++;
        //flog('Ajax started', depth);
        $('#mainSpinner').show();
    });

    $(document).ajaxComplete(function () {
        depth--;
        //flog('Ajax stopped', depth);
        if (depth < 0) {
            depth = 0;
        }
        if (depth == 0) {
            $('#mainSpinner').hide();
            $(document).trigger('kademiAjaxComplete');
        }

        // Init time ago after Ajax is completed
        initTimeago();
    });
}

function initAdminTopNavSearch() {
    var txt = $('#top-nav-search-input');
    txt.omniSearch();
}

function drawPieChart(chart, options, padding, isFirstTime) {
    var wrapper = chart.closest('.col-sm-6');
    var canvas = chart.find('canvas');
    var sizeChart = wrapper.width() - padding;
    if (sizeChart < 0) {
        sizeChart = 100;
    }
    var currentSize = +chart.attr('data-size');
    flog("got size", sizeChart, chart);

    // Hide canvas
    canvas.hide();

    if (currentSize !== sizeChart || isFirstTime) {
        flog('Render new chart', sizeChart);

        // Clear data pf easyPieChart
        if (!isFirstTime) {
            chart.data('easy-pie-chart', null);
            chart.data('size', sizeChart);
        }

        // Remove the chart
        canvas.remove();

        // Render new chart
        options.size = sizeChart;
        flog("chart size", sizeChart);
        try {
            chart.easyPieChart(options);
        } catch (e) {
            flog('Error when rendering easyPieChart', e);
        }
    } else {
        flog('Re-show current chart');
        canvas.show();
    }
}

function initPieChart(target, options, padding) {
    drawPieChart(target, options, padding, true);

    var timer = null;
    $(window).on('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            drawPieChart(target, options, padding);
        }, 200);
    });
}

function initPageDatePicker() {
    var range = $('#commonControlsRange');
    if (range.length > 0) {
        var extraClass = range.attr('data-class') || '';
        var position = range.attr('data-position') || 'right';
        var timeZone = window.KademiTimeZone;
        var options = {
            extraClass: extraClass,
            position: position
        };
        if (timeZone) {
            options.timeZone = timeZone;
        }
        range.pageDatePicker(options);
    }
}

function initTimeago() {
    if ($.timeago) {
        $.timeago.settings.allowFuture = true;
        $(".timeago").timeago();
    }
}

$(function () {
    flog("Fuse init");

    initAdminTopNavSearch();
    initSwitch();
    initToggled();
    initDatePicker();
    initTabbable();
    initChkAll();
    initFuseModals();
    initClearer();
    initAjaxStatus();
    initMasonryPanel();
    initTimeago();
    initMultiLingual();
    initNewUserForm();
    initEmailEventSimulator();
    initEntityFinder();
    initCreateAccount();
    initAddWebsite();
    initRepoSwitcher();

    $('.main-navigation-menu').children('li').children('a[href=#]').on('click', function (e) {
        e.preventDefault();
    });
});

function initRepoSwitcher() {
    var switchers = $('.repo-switcher');

    if (switchers.length > 0) {
        $.getStyleOnce('/theme/assets/plugins/bootstrap-chosen/1.0.1/bootstrap-chosen.css');
        $.getScriptOnce('/static/chosen/1.1.0/chosen.jquery.js', function () {
            switchers.each(function () {
                var switcher = $(this);
                var btn = switcher.find('.btn');
                var selector = switcher.find('.repo-switcher-selector');

                selector.chosen({
                    search_contains: true
                });

                btn.on('click', function (e) {
                    e.preventDefault();

                    setTimeout(function () {
                        switcher.find('.chosen-container-single').trigger('mousedown');
                    }, 50);
                });

                selector.trigger('chosen:updated').on('change', function () {
                    window.location.href = this.value;
                });
            });
        });
    }
}

function initEmailEventSimulator() {
    $(document.body).on('click', '.simulateEvent a', function (e) {
        e.preventDefault();
        var action = $(e.target).attr("href");
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                eventAction: action
            },
            dataType: 'json',
            success: function (content) {
                if (content.status) {
                    Msg.info("Done");
                } else {
                    Msg.error("Hmm ... not so good. " + content.messages);
                }
            }
        });
    });
}

$(window).load(function () {
    if ((typeof CKEDITOR != 'undefined')) {
        $('head link').last().after('<link rel="stylesheet" type="text/css" href="/static/jquery-ui/1.12.1/jquery-ui.min.css" />');
    }
});

function initMultiLingual() {
    initModalTranslate();

    $('.select-lang').on('click', function (e) {
        e.preventDefault();

        var langCode = $(this).attr('href');
        flog('Selected lang: ' + langCode);

        $.cookie('selectedLangCode', langCode, {
            expires: 360, path: '/'
        });
        window.location.reload();
    });

    var timer;
    if (window.CKEDITOR) {
        CKEDITOR.on('instanceReady', function (e) {
            var editor = e.editor;

            var element = $(editor.element.$);
            if (element.hasClass('translatable')) {
                editor.on('focus', function () {
                    showTranslateButton(element, timer);
                });

                editor.on('blur', function () {
                    hideTranslateButton(timer);
                });
            }
        });
    }

    $(document.body).on({
        focus: function () {
            showTranslateButton($(this), timer);
        },
        blur: function () {
            hideTranslateButton(timer);
        }
    }, '.translatable');
}

function showTranslateButton(target, timer) {
    flog(showTranslateButton, target, timer);

    clearTimeout(timer);

    var btn = $('#btn-translate');
    if (btn.length === 0) {
        btn = $('<button class="btn btn-warning btn-sm" id="btn-translate"><i class="fa fa-language"></i></button>');
        $(document.body).append(btn);
    }

    btn.off('click').on('click', function (e) {
        e.preventDefault();

        showModalTranslate(target);
    });

    var position;
    if (target.is('.htmleditor')) {
        position = $('#cke_' + target.attr('id')).offset();
    } else {
        position = target.offset();
    }

    position.top = position.top - 30;
    btn.css(position).show();
}

function initModalTranslate() {
    var modal = $(
        '<div id="modal-translate" class="modal fade" tabindex="-1">' +
        '     <div class="modal-dialog modal-sm">' +
        '        <div class="modal-content">' +
        '            <div class="modal-header">' +
        '                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
        '                <h4 class="modal-title">Save translated text</h4>' +
        '            </div>' +
        '            <form method="POST" class="form-horizontal" action="/translations/">' +
        '                <div class="modal-body">' +
        '                    <p class="form-message alert alert-danger" style="display: none;"></p>' +
        '                    <input type="hidden" name="sourceType" value="" />' +
        '                    <input type="hidden" name="sourceId" value="" />' +
        '                    <input type="hidden" name="sourceField" value="" />' +
        '                    <input type="hidden" name="langCode" value="" />' +
        '                    <div class="form-group">' +
        '                        <label for="translated" class="control-label col-md-3">Translated text</label>' +
        '                        <div class="col-md-9">' +
        '                            <input type="text" class="form-control" name="translated" placeholder="Enter translated text here..." disabled="disabled" style="display: none" />' +
        '                            <textarea type="text" class="form-control" name="translated" placeholder="Enter translated text here..." disabled="disabled" rows="3" style="display: none"></textarea>' +
        '                            <div class="htmleditor-wrapper" style="display: none;"><textarea type="text" class="form-control htmleditor" disabled="disabled" name="translated" placeholder="Enter translated text here..."></textarea></div>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="modal-footer">' +
        '                    <button class="btn btn-sm btn-default" data-dismiss="modal" type="button">Close</button>' +
        '                    <button class="btn btn-sm btn-primary" type="submit" type="submit">Save</button>' +
        '                </div>' +
        '            </form>' +
        '        </div>' +
        '     </div>' +
        '</div>'
    );
    $(document.body).append(modal);

    modal.find('form').forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info("Translated text is saved");
                modal.modal('hide');
            } else {
                Msg.error("There was a problem saving the translation " + resp.messages);
            }
        }
    });

    modal.on('hidden.bs.modal', function () {
        modal.find('[name=translated]').prop('disabled', true).removeClass('required').hide();
        modal.find('.htmleditor-wrapper').hide();
        var ckeditor = CKEDITOR.instances[modal.find('.htmleditor').attr('id')];
        if (ckeditor) {
            ckeditor.setReadOnly(true);
        }
    });

    return modal;
}

function showModalTranslate(target) {
    flog('showTranslateButton', target);

    var modal = $('#modal-translate');
    if (modal.length === 0) {
        modal = initModalTranslate();
    }

    var sourceType = target.data("source-type");
    if (sourceType == null) {
        sourceType = target.closest("form").data("source-type");
    }
    var sourceId = target.data("source-id");
    if (sourceId == null) {
        sourceId = target.closest("form").data("source-id");
    }
    var sourceField = target.data("source-field");
    var langCode = $.cookie('selectedLangCode');

    modal.find('[name=sourceType]').val(sourceType);
    modal.find('[name=sourceId]').val(sourceId);
    modal.find('[name=sourceField]').val(sourceField);
    modal.find('[name=langCode]').val(langCode);

    $.ajax({
        url: '/translations',
        dataType: 'json',
        type: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            sourceType: sourceType,
            sourceId: sourceId,
            sourceField: sourceField,
            langCode: langCode,
            asJson: true
        },
        success: function (resp) {
            var translatedText = '';
            if (resp && resp.status && resp.data.length > 0) {
                translatedText = resp.data[0].translated || '';
            }

            var modalSize = 'modal-sm';
            var translatedTextboxes = modal.find('[name=translated]');
            var destinationTextbox;
            if (target.is('textarea.htmleditor')) {
                modalSize = 'modal-lg';
                destinationTextbox = translatedTextboxes.filter('textarea.htmleditor');
                modal.find('.htmleditor-wrapper').show();

                var ckeditor = CKEDITOR.instances[destinationTextbox.attr('id')];
                if (ckeditor) {
                    ckeditor.setReadOnly(false);
                    ckeditor.setData(translatedText);
                } else {
                    destinationTextbox.val(destinationTextbox);
                    initHtmlEditors(destinationTextbox);
                }
            } else if (target.is('input')) {
                destinationTextbox = translatedTextboxes.filter('input');
            } else {
                destinationTextbox = translatedTextboxes.filter('textarea').not('.htmleditor');
            }

            destinationTextbox.prop('disabled', false).addClass('required').not('.htmleditor').show();
            destinationTextbox.val(translatedText);

            modal.find('.modal-dialog').attr('class', 'modal-dialog ' + modalSize);
            modal.modal('show');
        }
    });
}

function hideTranslateButton(timer) {
    timer = setTimeout(function () {
        $('#btn-translate').hide();
    }, 400);
}

function showLoginAs(profileId) {
    var modal = $("#modal-login-as");
    modal.find("ul").html("<li>Please wait...</li>");
    modal.modal('show');
    $.ajax({
        type: 'GET',
        url: profileId + "?availWebsites",
        dataType: "json",
        success: function (response) {
            flog("success", response.data);
            var newList = "";
            if (response.data.length > 0) {
                $.each(response.data, function (i, n) {
                    var branchesList = "<ul class='list collapse' id='" + n.name + "'>";
                    $.each(n.branches, function (ii, branch) {
                        branchesList += "<li class='text-success'><a target='_blank' href='" + profileId + "?loginTo=" + branch.domainName + "'>" + branch.name + "</a>"
                        if (branch.live) {
                            branchesList += "<span class='label label-success'>Live</span>";
                        }
                        branchesList += "</li>";
                    });
                    branchesList += "</ul>"
                    newList += "<li style='margin: 10px 0'><a target='_blank' href='" + profileId + "?loginTo=" + n.domainName + "'>" + n.name;
                    if (n.title) {
                        newList += " - " + n.title;
                    }
                    newList += "</a>"
                    newList += "<a href='#' style='margin-left: 10px; padding: 5px 10px' data-toggle='collapse' data-target='#" + n.name + "'><span class='caret'></span></a>";
                    newList += branchesList + "</li>";
                });
            } else {
                newList += "<li>The user does not have access to any websites. Check the user's group memberships, and that those groups have been added to the right websites</li>";
            }
            modal.find("ul")
                .empty()
                .html(newList);
        },
        error: function (resp) {
            Msg.error("An error occured loading websites. Please try again");
        }
    });
}

function setRecentItem(title, url) {
    flog("setRecentItem", title, url);
    if (typeof (Storage) !== "undefined") {
        //localStorage.removeItem("recent");
        var recentList = JSON.parse(localStorage.getItem("recent"));  // an associative array, key is the url
        if (recentList == null) {
            recentList = new Array();
        } else {

        }
        flog("recent", recentList);
        var item = {
            title: title,
            url: url
        };
        recentList.push(item);
        localStorage.setItem("recent", JSON.stringify(recentList));
        flog("recent2", recentList);
    } else {
        return;
    }
}

function getRecentItems() {
    if (typeof (Storage) !== "undefined") {
        var recentList = JSON.parse(localStorage.getItem("recent"));  // an associative array, key is the url
        return recentList;
    } else {
        return null;
    }
}

function initCreateAccount() {
    var modal = $("#modal-create-account");
    modal.find("form").forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info("Created account");
                var nextHref = "/organisations/?gotoDomain=" + resp.nextHref;
                window.location = nextHref;
            } else {
                Msg.error("Sorry, could not create the account because " + resp.messages);
            }
        }
    });
}

function initAddWebsite() {
    flog('initAddWebsite');

    var modal = $("#addWebsiteModal");
    if (modal.length > 0) {
        var form = modal.find("form");

        form.forms({
            onSuccess: function (resp) {
                flog("done", resp);
                modal.modal('hide');
                Msg.success(form.find('[name=newName]').val() + ' has been created, going to the website manager...');
                var nextHref = "/websites/" + resp.nextHref + "/";
                window.location = nextHref;

            }
        });
    }
}

function initBackgroundJobStatus(options) {
    // Find divs which need to reload to get job status. For each div get the current
    // job status and then apply data to the handlebars template in the div
    flog("initBackgroundJobStatus", options);

    options = $.extend({}, options);

    Handlebars.registerHelper('formatISODate', function (millis) {
        if (millis) {
            var m = millis;
            var date = new Date(m);

            return date.toISOString();
        } else {
            return "";
        }
    });

    Handlebars.registerHelper('formatDate', function (millis) {
        if (millis) {
            return moment(millis).format('DD/MM/YYYY');
        } else {
            return "";
        }
    });

    Handlebars.registerHelper('notRunning', function (data, options) {
        var b = (data == null || data.statusInfo.complete);
        var out = options.fn(data);

        return out;
    });

    $(".backgroundTask").each(function () {
        var div = $(this);
        var href = div.data("task-href");
        var templateHtml = div.next('.backgroundTaskTemplate').html();
        var template = Handlebars.compile(templateHtml);
        checkBackgroundJobStatus(href, div, template, options);
    });
}

function checkBackgroundJobStatus(href, div, template, options) {
    flog('checkBackgroundJobStatus', href, div, template, options);

    $.ajax({
        url: href,
        method: "GET",
        dataType: 'json',
        success: function (resp) {
            flog('Success in checking background task', resp);

            if (resp.status) {
                var htmlStr = template(resp);
                flog('Background task status HTML:', htmlStr);
                div.html(htmlStr);
                div.show(400);

                if (resp.data.statusInfo.complete) {
                    if (typeof options.onComplete === 'function') {
                        options.onComplete.call(this, resp);
                    }
                } else {
                    // Not complete, so update again
                    flog("Background task is not completed! Re-check status in next 3 seconds");
                    window.setTimeout(function () {
                        checkBackgroundJobStatus(href, div, template, options);
                    }, 3000);

                    if (typeof options.onRunning === 'function') {
                        options.onRunning.call(this, resp);
                    }
                }
            } else {
                var htmlStr = template(null);
                flog('Background task status HTML:', htmlStr);
                div.html(htmlStr);
                div.show(400);

                if (typeof options.onError === 'function') {
                    options.onError.call(this, resp);
                }
            }
        },
        error: function (jqXHR) {
            // probably a 404, which is fine, show the template with no data so it can render a run form
            flog("No task resource, thats cool, means not running and hasnt been run");

            var htmlStr = template(null);
            flog('Background task status HTML:', htmlStr);
            div.html(htmlStr);
            div.show(400);

            if (typeof options.onError === 'function') {
                options.onError.call(this, jqXHR);
            }
        }
    });
}

function getParam(name) {
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var value = regex.exec(window.location.href) || '';
    value = decodeURIComponent(value[1]);

    return value;
}

function initColorPicker(target, onChangeHandle) {
    if ($.fn.colorpicker) {
        target.each(function () {
            var colorPicker = $(this);
            var input = colorPicker.find('input');
            var previewer = colorPicker.find('.input-group-addon i');

            colorPicker.colorpicker({
                format: 'hex',
                container: colorPicker.parent(),
                component: '.input-group-addon',
                align: 'left',
                colorSelectors: {
                    'transparent': 'transparent'
                }
            }).on('changeColor.colorpicker', function (e) {
                var colorHex = e.color.toHex();

                if (!input.val() || input.val().trim().length === 0) {
                    colorHex = '';
                    previewer.css('background-color', '');
                }

                if (typeof onChangeHandle === 'function') {
                    onChangeHandle(colorHex);
                }
            });
        });
    } else {
        flog('ERROR! You need bootstrap-colorpicker plugin to continue this method!');
    }
}

function initImagePicker(target, basePath, pagePath) {
    flog('initImagePicker', target, basePath, pagePath);

    target.hide();
    target.wrap('<div class="image-picker-wrapper"></div>');

    var imgSrc = target.val() || target.attr('src') || target.attr('data-src') || '/static/images/photo_holder.png';

    var wrapper = target.parent();
    wrapper.append(
        '<div class="thumbnail">' +
        '   <img src="' + imgSrc + '" class="image-picker-previewer" />' +
        '</div>' +
        '<div class="btn-group btn-group-sm btn-group-justified">' +
        '   <a href="#" class="btn btn-success image-picker-upload" role="button"><i class="fa fa-picture-o"></i> Select</a>' +
        '   <a href="#" class="btn btn-danger image-picker-clear" role="button"><i class="fa fa-times"></i> Clear</a>' +
        '</div>'
    );

    var preview = wrapper.find('.image-picker-previewer');

    wrapper.find('.image-picker-upload').mselect({
        basePath: basePath,
        pagePath: pagePath,
        contentType: 'image',
        onSelectFile: function (selectedUrl, relativeUrl, type, hash, isAsset) {
            var newUrl = isAsset ? selectedUrl : '/_hashes/files/' + hash;

            target.val(newUrl);
            preview.attr('src', newUrl);
        }
    });

    wrapper.find('.image-picker-clear').on('click', function (e) {
        e.preventDefault();

        target.val('');
        preview.attr('src', '/static/images/photo_holder.png');
    });
};

// ========================================================================
// Kalert
// ========================================================================
(function ($, window) {
    var Kalert = {};
    Kalert.show = function (title, message, type) {
        swal({
            title: title,
            text: message,
            type: type,
            showCancelButton: false,
            confirmButtonClass: 'btn-primary',
            confirmButtonText: 'Ok',
            closeOnConfirm: true
        });
    };
    Kalert.info = function (title, message) {
        if (message === undefined) {
            message = title;
            title = 'Info'
        }
        Kalert.show(title, message, 'info');
    };
    Kalert.success = function (title, message) {
        if (message === undefined) {
            message = title;
            title = 'Success!'
        }
        Kalert.show(title, message, 'success');
    };
    Kalert.warning = function (title, message) {
        if (message === undefined) {
            message = title;
            title = 'Warning!'
        }
        Kalert.show(title, message, 'warning');
    };
    Kalert.error = function (title, message) {
        if (message === undefined) {
            message = title;
            title = 'Error!'
        }
        Kalert.show(title, message, 'error');
    };
    Kalert.confirm = function (title, message, type, btnClass, btnText, callback) {
        var option = {};

        if (arguments.length > 3) {
            option = {
                title: title,
                message: message,
                type: type,
                btnClass: btnClass,
                btnText: btnText,
                callback: callback
            };
        } else if (arguments.length === 3) {
            // Arguments are message, btnText, callback
            option = {
                title: 'Are you sure?',
                message: title,
                type: 'warning',
                btnClass: 'btn-danger',
                btnText: message,
                callback: type
            };
        } else if (arguments.length === 2) {
            // Arguments are message, callback
            option = {
                title: 'Are you sure?',
                message: title,
                type: 'warning',
                btnClass: 'btn-danger',
                btnText: 'Ok',
                callback: message
            };
        } else {
            return;
        }

        swal({
            title: option.title || 'Are you sure?',
            text: option.message,
            type: option.type || 'warning',
            showCancelButton: true,
            confirmButtonClass: option.btnClass,
            confirmButtonText: option.btnText,
            closeOnConfirm: true,
            showLoaderOnConfirm: false
        }, typeof option.callback === 'function' ? option.callback : null);
    };

    Kalert.confirmWait = function (title, message, type, btnClass, btnText, callback) {
        var option = {};

        if (arguments.length > 3) {
            option = {
                title: title,
                message: message,
                type: type,
                btnClass: btnClass,
                btnText: btnText,
                callback: callback
            };
        } else if (arguments.length === 3) {
            // Arguments are message, btnText, callback
            option = {
                title: 'Are you sure?',
                message: title,
                type: 'warning',
                btnClass: 'btn-danger',
                btnText: message,
                callback: type
            };
        } else if (arguments.length === 2) {
            // Arguments are message, callback
            option = {
                title: 'Are you sure?',
                message: title,
                type: 'warning',
                btnClass: 'btn-danger',
                btnText: 'Ok',
                callback: message
            };
        } else {
            return;
        }

        swal({
            title: option.title || 'Are you sure?',
            text: option.message,
            type: option.type || 'warning',
            showCancelButton: true,
            confirmButtonClass: option.btnClass,
            confirmButtonText: option.btnText,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, typeof option.callback === 'function' ? option.callback : null);
    };

    Kalert.close = function () {
        swal.close();
    };

    window.Kalert = Kalert;

})(jQuery, window);

// ========================================================================
// EDM Editor iframe mode
// ========================================================================
(function ($, window) {
    var allGroups = null;

    window.initIframeEDMEditor = function (target) {
        if (allGroups === null) {
            $.ajax({
                url: '/groups/_DAV/PROPFIND?fields=name,milton:groupTitle',
                dataType: 'json',
                type: 'get',
                success: function (resp) {
                    allGroups = {};
                    $.each(resp, function (i, group) {
                        allGroups[group.name] = group.groupTitle || group.name;
                    });
                }, complete: function () {
                    initEDMEditor(target, allGroups);
                }
            });
        } else {
            initEDMEditor(target, allGroups);
        }
    };

    function initEDMEditor(target, allGroups) {
        var wrapper = target.parent();
        var editorLoading = wrapper.find('.editor-loading');

        if (!wrapper.hasClass('editor-wrapper')) {
            target.wrap('<div class="editor-wrapper"></div>');
            wrapper = target.parent();
            editorLoading = $(
                '<div class="editor-loading">' +
                '    <span>' +
                '        <span class="loading-icon">' +
                '            <i class="fa fa-spinner fa-spin fa-4x fa-fw"></i>' +
                '        </span>' +
                '        <span class="loading-text">Initializing editor...</span>' +
                '    </span>' +
                '</div>'
            );
            wrapper.prepend(editorLoading);
        }

        var pageName = getFileName(window.location.href);
        var pagePath = target.attr('data-page-path') || '';
        var basePath = target.attr('data-base-path') || '';

        var urlParams = new URLSearchParams(window.location.search);
        var format = urlParams.get("format");
        flog("format", format);
        if( format ) {
            pageName += "&format=" + format;
        }

        flog("kademi.js: init edmEditor", pageName, window.location.href);
        target.edmEditor({
            iframeMode: true,
            snippetsUrl: './_components?fileName=' + pageName,
            snippetsHandlersUrl: './_components?handlers&fileName=' + pageName,
            basePath: basePath,
            pagePath: pagePath,
            allGroups: allGroups,
            contentStyles: [{href: '/theme/apps/admin/edmEditor.css'}, {href: '/theme/apps/keditor-lib/dist/css/keditor-bootstrap-settings-0.0.0.min.css'}],
            onReady: function () {
                editorLoading.hide();
            }
        });
    }

})(jQuery, window);


// ========================================================================
// KEditor iframe mode
// ========================================================================
(function ($, window) {
    var allGroups = null;

    window.initIframeContentEditor = function (target) {
        if (allGroups === null) {
            $.ajax({
                url: '/groups/_DAV/PROPFIND?fields=name,milton:groupTitle',
                dataType: 'json',
                type: 'get',
                success: function (resp) {
                    allGroups = {};
                    $.each(resp, function (i, group) {
                        allGroups[group.name] = group.groupTitle || group.name;
                    });
                }, complete: function () {
                    initKeditor(target, allGroups);
                }
            });
        } else {
            initKeditor(target, allGroups);
        }
    };

    function initKeditor(target, allGroups) {
        var wrapper = target.parent();
        var editorLoading = wrapper.find('.editor-loading');

        if (!wrapper.hasClass('editor-wrapper')) {
            target.wrap('<div class="editor-wrapper"></div>');
            wrapper = target.parent();
            editorLoading = $(
                '<div class="editor-loading">' +
                '    <span>' +
                '        <span class="loading-icon">' +
                '            <i class="fa fa-spinner fa-spin fa-4x fa-fw"></i>' +
                '        </span>' +
                '        <span class="loading-text">Initializing editor...</span>' +
                '    </span>' +
                '</div>'
            );
            wrapper.prepend(editorLoading);
        }

        var pageName = getFileName(window.location.href);
        var pagePath = target.attr('data-page-path') || '';
        var basePath = target.attr('data-base-path') || '';

        target.contentEditor({
            iframeMode: true,
            snippetsUrl: './_components?fileName=' + pageName,
            snippetsHandlersUrl: './_components?handlers&fileName=' + pageName,
            basePath: basePath,
            pagePath: pagePath,
            allGroups: allGroups,
            onReady: function () {
                editorLoading.hide();
            }
        });
    }

})(jQuery, window);

// ========================================================================
// Fullscreen editor
// ========================================================================
(function ($, window) {
    var allGroups = null;
    window.initFullscreenEditor = function (target) {
        var isContentEditor = target.hasClass('contenteditor');
        var isEdmEditor = target.hasClass('edmeditor');
        var previewLink = target.attr('data-preview');
        target.addClass('fullscreen-editor').removeClass('contenteditor htmleditor edmeditor').hide();

        if (isContentEditor || isEdmEditor) {
            if (allGroups === null) {
                $.ajax({
                    url: '/groups/_DAV/PROPFIND?fields=name,milton:groupTitle',
                    dataType: 'json',
                    type: 'get',
                    success: function (resp) {
                        allGroups = {};
                        $.each(resp, function (i, group) {
                            allGroups[group.name] = group.groupTitle || group.name;
                        });
                    }, complete: function () {
                        initKeditor(target, isContentEditor, isEdmEditor, allGroups);
                    }
                });
            } else {
                initKeditor(target, isContentEditor, isEdmEditor, allGroups);
            }
        } else {
            initFullscreenEditorModal(target, isContentEditor, isEdmEditor);
            initFullscreenEditorPreview(target, previewLink);
        }
    };

    function initKeditor(target, isContentEditor, isEdmEditor, allGroups) {
        var previewLink = target.attr('data-preview');
        if (isContentEditor) {
            initFullscreenEditorModal(target, isContentEditor, isEdmEditor, allGroups);
            initFullscreenEditorPreview(target, previewLink);
        } else {
            initFullscreenEditorModal(target, isContentEditor, isEdmEditor, allGroups);
            initFullscreenEditorPreview(target, previewLink);
        }
    }

    function loadFullscreenEditorInlinePreview(target) {
        var iframe = target.siblings('.fullscreen-editor-preview');
        var iframeDoc = iframe.contents()
        var stylesStr = '';
        $('link').each(function () {
            stylesStr += '<link rel="stylesheet" type="text/css" href="' + this.href + '" />';
        });

        iframeDoc.find('head').html(stylesStr);
        iframeDoc.find('body').html(target.val() || '');
    }

    function initFullscreenEditorPreview(target, previewLink) {
        var iframe = $('<iframe border="0" class="fullscreen-editor-preview"></iframe>');

        target.after(iframe);

        if (previewLink) {
            iframe.attr('src', previewLink);
        } else {
            iframe.addClass('fullscreen-editor-preview-inline');
            loadFullscreenEditorInlinePreview(target);
        }
    }

    function initFullscreenEditorModal(target, isContentEditor, isEdmEditor, allGroups) {
        var content = target.html() || '';
        var id = target.attr('id');
        if (!id) {
            id = 'editor-' + (new Date()).getTime();
            target.attr('id', id);
        }
        var modalId = 'modal-fullscreen-' + id;
        var modal = $(
            '<div id="' + modalId + '" class="modal ' + (isContentEditor || isEdmEditor ? 'modal-full' : '') + ' fullscreen-editor-modal fade" data-backdrop="static" data-keyboard="false">' +
            '    <div class="modal-dialog modal-lg">' +
            '        <div class="modal-content">' +
            '            <div class="modal-body">' +
            '                <div class="editor-wrapper">' +
            '                    <div class="editor-loading">' +
            '                        <span>' +
            '                            <span class="loading-icon">' +
            '                                <i class="fa fa-spinner fa-spin fa-4x fa-fw"></i>' +
            '                            </span>' +
            '                            <span class="loading-text">Initializing editor...</span>' +
            '                        </span>' +
            '                    </div>' +
            '                    <textarea autocomplete="off" class="form-control">' + content + '</textarea>' +
            '                </div>' +
            '            </div>' +
            '            <div class="modal-footer">' +
            '                <button type="button" data-dismiss="modal" class="btn btn-sm btn-default">Close</button>' +
            '                <button type="button" class="btn btn-sm btn-info fullscreen-editor-save">Save</button>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>'
        );
        modal.appendTo(document.body);

        var textarea = modal.find('textarea');
        var textareaId = 'modal-fullscreen-textarea-' + id;
        textarea.attr('id', textareaId);

        var ckeditor;
        var editorLoading = modal.find('.editor-loading');
        if (isContentEditor || isEdmEditor) {
            var pageName = getFileName(window.location.href);
            var pagePath = target.attr('data-page-path') || '';
            var basePath = target.attr('data-base-path') || '';

            textarea[isContentEditor ? 'contentEditor' : 'edmEditor']({
                iframeMode: true,
                snippetsUrl: './_components?fileName=' + pageName,
                snippetsHandlersUrl: './_components?handlers&fileName=' + pageName,
                basePath: basePath,
                pagePath: pagePath,
                allGroups: allGroups,
                onReady: function () {
                    editorLoading.hide();
                }
            });
        } else {
            initHtmlEditors(textarea, 500, null, null, null, function (editor) {
                ckeditor = editor;
                editorLoading.hide();
            });
        }

        var btnEditText = target.attr('data-button-text') || 'Edit content';
        var btnEdit = $('<button disabled="true" type="button" class="btn btn-sm btn-info fullscreen-editor-edit">' + btnEditText + '</button>');
        target.before(btnEdit);
        btnEdit.wrap('<p class="fullscreen-editor-actions"></p>');
        $(document).on('kademiAjaxComplete', function () {
            btnEdit.prop('disabled', false);
        });
        btnEdit.on('click', function (e) {
            e.preventDefault();

            modal.modal('show');
        });

        modal.find('.fullscreen-editor-save').on('click', function (e) {
            e.preventDefault();

            var content;
            if (isContentEditor || isEdmEditor) {
                content = textarea[isContentEditor ? 'contentEditor' : 'edmEditor']('getContent');
            } else {
                content = ckeditor.getData();
            }

            target.val(content);
            target.closest('form').trigger('submit');
            modal.modal('hide');

            var iframe = target.siblings('.fullscreen-editor-preview');
            if (iframe.hasClass('fullscreen-editor-preview-inline')) {
                loadFullscreenEditorInlinePreview(target);
            }
        });
    }

    window.reloadFullscreenEditorPreview = function (target) {
        var preview = target.attr('data-preview');
        target.siblings('.fullscreen-editor-preview').attr('src', preview);
    };

})(jQuery, window);
