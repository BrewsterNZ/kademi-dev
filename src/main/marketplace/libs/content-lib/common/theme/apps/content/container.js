(function ($, window) {
    var win = $(window);

    $(function () {
        initFullHeightContainer();
        initMultiBackgroundContainer();
        initGoogleMap();
    });

    function initGoogleMap() {
        $(document.body).on('onGoogleMapReady', function () {
            $('[data-type="component-googlemap"]').each(function () {
                initKGoogleMap($(this));
            });
        });
    }

    window.initKGoogleMap = function (component) {
        var kgoogleMap = component.find('.kgooglemap');

        if (component.attr('data-maptype') !== 'manually') {
            kgoogleMap.hide();
            return;
        }

        var map = new google.maps.Map(kgoogleMap.get(0), {
            zoom: 13,
            mapTypeId: 'roadmap'
        });

        var input = component.find('input')[0];
        input.value = component.attr('data-place');

        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }

            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    flog('Returned place contains no geometry');
                    return;
                }

                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
                markers.push(new google.maps.Marker({map: map, icon: icon, title: place.name, position: place.geometry.location}));

                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });

            map.fitBounds(bounds);
        });

        setTimeout(function () {
            google.maps.event.trigger(input, 'focus');
            google.maps.event.trigger(input, 'keydown', {
                keyCode: 13
            });
        }, 1000);
    };

    function initFullHeightContainer() {
        var winTimer;
        win.on('resize', function () {
            clearTimeout(winTimer);
            winTimer = setTimeout(function () {
                $('.container-full-height').css('min-height', win.height());
            }, 250);

        }).trigger('resize');
    }

    function initMultiBackgroundContainer() {
        win.on('load', function () {
            $('.container-bg').each(function () {
                var item = $(this);
                var isMulti = item.attr('data-multiple-bg') == 'true';
                var imagesStr = item.attr('data-images');
                var transition = item.attr('data-bg-transition') * 1000 || 2000;

                if (isMulti && imagesStr) {
                    var imagesArr = imagesStr.split(',');
                    if (imagesArr.length) {
                        for (var i = 0; i < imagesArr.length; i++) {
                            var img = $('<img>').attr('src', imagesArr[i]).css('position', 'absolute').css('left', '-9999999px');
                            $(document.body).append(img);
                        }

                        var count = 1;

                        function slide() {
                            if (count >= imagesArr.length) {
                                count = 0
                            }
                            var bgFor = item.hasClass('background-for') ? item : item.find('.container-content-wrapper');
                            bgFor.addClass('multiple-background-effect').css("background-image", 'url("' + imagesArr[count] + '")');
                            count++;
                        }

                        setInterval(slide, transition);
                    }
                }
            })
        });
    }

})(jQuery, window);