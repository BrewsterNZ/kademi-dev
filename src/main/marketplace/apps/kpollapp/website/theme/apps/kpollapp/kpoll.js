(function ($) {
    $(function () {
        var kpollComponents = $('.kpoll-wrapper');
        if (kpollComponents.length > 0) {
            kpollComponents.each(function () {
                var component = $(this);
                
                initKpollForm(component);
                initKpollButtons(component);
            });
        }
        
        var kpollPortlet = $('#kpoll-portlet');
        if (kpollPortlet.length > 0) {
            initKpollForm(kpollPortlet);
            initKpollButtons(kpollPortlet);
        }
    })
    
    function initKpollForm(container) {
        flog('initKpollForm', container);
        
        var form = container.find('.form-kpoll');
        
        // Add 'required' attribute for all radio buttons
        form.find('input:radio').prop('required', true);
        
        // Handler for form submit event
        form.forms({
            onSuccess: function (resp) {
                if (resp && resp.status) {
                    showKpollResult(container);
                } else {
                    if (resp && resp.messages.length > 0) {
                        Msg.error(resp.messages[0]);
                    } else {
                        Msg.error('Error when answering this poll. Please contact your administrator for resolving this problem!');
                    }
                }
            }
        });
    }
    
    function initKpollButtons(container) {
        var btnSeeResult = container.find('.btn-see-result');
        
        btnSeeResult.on('click', function (e) {
            e.preventDefault();
            
            showKpollResult(container, true);
        });
    }
    
    function showKpollResult(container, isPreview) {
        $.get(window.location.href, function (response) {
            var newDom = $('<div />').html(response);
            var id = container.attr('id');
            var result = newDom.find('#' + id + ' .poll-result');
            result.find('.alert').remove();
            
            if (!isPreview) {
                Msg.success('Answered!');
            }
            
            container.find('.form-kpoll').animate({
                'opacity': 'hide',
                'height': 'hide'
            }, 200);
            
            container.find('.poll-result').html(result.html()).animate({
                'opacity': 'show',
                'height': 'show'
            }, 200);
            
        });
    }
    
})(jQuery);