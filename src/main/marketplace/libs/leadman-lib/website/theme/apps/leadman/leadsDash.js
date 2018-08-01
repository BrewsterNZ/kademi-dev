(function($){
    function initDonuts() {
        flog("initDonuts");
        $.ajax({
            url: '/leads/?asJson&geoloc',
            dataType: 'json',
            success: function (resp, textStatus, jqXHR) {
                if (resp.status) {
                    $('.lead-dash-page .map-donutchart').show();
                    showDonuts(resp.data);
                } else {
                    flog("Not showing donuts because of bad response", resp);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Msg.error("Couldnot load geo-location data");
            }
        });
    }


    function showDonuts(donutData) {
        flog("showDonuts", donutData);

        $('.lead-dash-page .map-donutchart').mapDonutChart({
            max: 40,
            textLabel: false,
            hoverAction: true,
            data: donutData,
            colors: {
                'cold': '#44C9F4',
                'warm': '#FBDB4F',
                'hot': '#F2463B',
            }
        });
    }

    function leadDashUpdate() {
        flog("dotdotdot", $(".leadInner"));
        $(".leadInner").dotdotdot({
            //	configuration goes here
        });
        var primaryColor = $('.dashboardPieColor').first().css('background-color');
        var pieOptions = {
            animate: {
                duration: 700,
                enabled: true
            },
            barColor: primaryColor,
            scaleColor: false,
            lineCap: 'circle'
        };

        $('.easypie').easyPieChart(pieOptions);

        initDonuts();
    }

    function doLeadSearch(q) {
        var href = window.location.pathname + "?q=" + q
        $("#leadsBody").reloadFragment({
            url: href,
            whenComplete: function () {
                window.history.pushState("", href, href);
                $('abbr.timeago').timeago();
            }
        });
    }

    function initLeadDash(){
        $(document).on('click', '.btnCreateDashLead', function () {
            $('.nav-menuAddLeadjourney1').first().trigger('click');
        });

        $(document).on('click', '.btnCreateTaskDash', function () {
            $('.nav-menuAddTask').first().trigger('click');
        });
    }
    $(function(){

        if($('.lead-dash-page').length > 0) {
            $(document.body).on('onGoogleMapReady', function () {
                initDonuts();
            });

            $('#leadQuery').keyup(function () {
                typewatch(function () {
                    flog('do search');
                    doLeadSearch($('#leadQuery').val());
                }, 500);
            });
        }

        if ($('.leadsDash').length){
            leadDashUpdate();
        }

        $(document).on('onLeadDashUpdate', function () {
            flog('onLeadDashUpdate');
            leadDashUpdate();
        })

        initLeadDash();
    });
})(jQuery);
