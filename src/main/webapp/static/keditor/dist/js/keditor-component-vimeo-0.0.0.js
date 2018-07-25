/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */
/**
 * KEditor Vimeo Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['vimeo'] = {
        getContent: function (component, keditor) {
            flog('getContent "vimeo" component', component);

            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.vimeo-cover').remove();

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Vimeo Settings',

        initSettingForm: function (form, keditor) {
            flog('init "vimeo" settings', form);

            return $.ajax({
                url: '/static/keditor/componentVimeoSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    var btnEdit = form.find('.btn-vimeo-edit');
                    btnEdit.on('click', function (e) {
                        e.preventDefault();

                        var inputData = prompt('Please enter Vimeo URL in here (eg https://player.vimeo.com/video/12345):');
                        var vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
                        var match = inputData.match(vimeoRegex);
                        if (match && match[1]) {
                            keditor.getSettingComponent().find('.embed-responsive-item').attr('src', 'https://player.vimeo.com/video/' + match[1] + '?byline=0&portrait=0&badge=0');
                        } else {
                            //alert('Your Vimeo URL is invalid!');
                            keditor.getSettingComponent().find('.embed-responsive-item').attr('src', inputData + '?byline=0&portrait=0&badge=0');
                        }
                    });

                    var btn169 = form.find('.btn-vimeo-169');
                    btn169.on('click', function (e) {
                        e.preventDefault();

                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
                    });

                    var btn43 = form.find('.btn-vimeo-43');
                    btn43.on('click', function (e) {
                        e.preventDefault();

                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
                    });

                    var chkAutoplay = form.find('#vimeo-autoplay');
                    chkAutoplay.on('click', function () {
                        var embedItem = keditor.getSettingComponent().find('.embed-responsive-item');
                        var currentUrl = embedItem.attr('src');
                        var newUrl = (currentUrl.replace(/(\?.+)+/, '')) + '?byline=0&portrait=0&badge=0&autoplay=' + (chkAutoplay.is(':checked') ? 1 : 0);

                        flog('Current url: ' + currentUrl, 'New url: ' + newUrl);
                        embedItem.attr('src', newUrl);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "vimeo" component', component);

            var embedItem = component.find('.embed-responsive-item');
            var chkAutoplay = form.find('#vimeo-autoplay');
            var src = embedItem.attr('src');

            chkAutoplay.prop('checked', src.indexOf('autoplay=1') !== -1);
        }
    };

})(jQuery);
