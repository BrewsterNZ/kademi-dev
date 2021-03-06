(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['youtube'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "youtube" component', component);
            
            component.find('iframe').attr('allowfullscreen', 'allowfullscreen');
        },
        
        getContent: function (component, keditor) {
            flog('getContent "youtube" component', component);
            
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.youtube-cover').remove();
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Youtube Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "youtube" settings', form);
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentYoutubeSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var btnEdit = form.find('.btn-youtube-edit');
                    btnEdit.on('click', function (e) {
                        e.preventDefault();
                        
                        var inputData = prompt('Please enter Youtube URL in here:');
                        if (inputData !== null) {
                            var youtubeRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/;
                            var match = (inputData || '').match(youtubeRegex);
                            if (match && match[1]) {
                                keditor.getSettingComponent().find('.embed-responsive-item').attr('src', 'https://www.youtube.com/embed/' + match[1]);
                            } else {
                                alert('Your Youtube URL is invalid!');
                            }
                        }
                    });
                    
                    var btn169 = form.find('.btn-youtube-169');
                    btn169.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
                    });
                    
                    var btn43 = form.find('.btn-youtube-43');
                    btn43.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
                    });
                    
                    var chkAutoplay = form.find('#youtube-autoplay');
                    chkAutoplay.on('click', function () {
                        var embedItem = keditor.getSettingComponent().find('.embed-responsive-item');
                        var currentUrl = embedItem.attr('src');
                        var newUrl = (currentUrl.replace(/(\?.+)+/, '')) + '?autoplay=' + (chkAutoplay.is(':checked') ? 1 : 0);
                        
                        flog('Current url: ' + currentUrl, 'New url: ' + newUrl);
                        embedItem.attr('src', newUrl);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "youtube" component', component);
            
            var embedItem = component.find('.embed-responsive-item');
            var chkAutoplay = form.find('#youtube-autoplay');
            var src = embedItem.attr('src');
            
            chkAutoplay.prop('checked', src.indexOf('autoplay=1') !== -1);
        }
    };
    
})(jQuery);
