/**
 *
 * jquery.orgFinder.js
 * @version: 1.0.1
 * @require: bootstrap-select, jquery.scrollTo
 *
 * Configuration:
 * @option {Array<Number>} initLatLng Initialized latitude and longitude of map
 * @option {Number} initZoomLevel Initialized zoom level of map
 * @option {String} initQuery Initialized search query
 * @option {String} googleAPIKey Google API key
 * @option {String} searchUrl Search URL. Must be link to signup page of a group or /organisations/ (if you use this plugin in Kademi admin console)
 * @option {Array} orgTypes List of organisation types. It's optional
 * @option {Array} allowedCountries List of countries which will available for searching. It's optional
 * @option {String} template Template string for orgFinder. Form search must has 'org-finder-search' class, textbox must be named 'q' and selectbox for organisation types must be named 'orgType'. Items list wrapper must has 'org-finder-list' class. Map div must has class 'org-finder-map'
 * @option {Function} onReady Callback will be called when orgFinder is ready. Arguments: 'formSearch', 'itemsWrapper', 'mapDiv'
 * @option {Function} onSelect Callback will be called when click on marker on map or item in org list panel. Arguments: 'orgData', 'item', 'marker', 'infoWindow'
 * @option {Function} onSearch Callback will be called when search a keyword. Arguments: 'query'
 * @option {Function} beforeSearch Callback will be called before searching a keyword. This callback must be return data object which will be sent to server. Arguments: 'query', 'data'
 * @option {Function} onSearched Callback will be called after searching a keyword. Arguments: 'query', 'resp'
 * @option {Function} renderItemContent Method for rendering content of an item in organization list. If you don't want to show this organization, just return null or empty. Arguments: 'orgData'
 * @option {Function} renderMarkerContent Method for rendering content for InfoWindow of a marker on Google Map. If you don't want to show this organization, just return null or empty. Arguments: 'orgData'
 * @option {String} emptyItemText Text will be showed when there is no result in organization list
 */

(function ($) {
    $.fn.orgFinder = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.orgFinder] Method ' + method + ' does not exist on jquery.orgFinder');
        }
    };

    // Version for jquery.orgFinder
    $.fn.orgFinder.version = '1.0.1';

    // Default configuration
    $.fn.orgFinder.DEFAULT = {
        initLatLng: [],
        initZoomLevel: 15,
        initQuery: null,
        googleAPIKey: null,
        searchUrl: null,
        orgTypes: null,
        allowedCountries: null,
        maxResults: 1000,
        template: '<form role="form" class="form-horizontal form-search org-finder-search" action="" style="margin-bottom: 15px;">' +
        '    <div class="input-group">' +
        '        <div class="clearfix dropdown">' +
        '            <input type="text" name="q" class="form-control" placeholder="Enter your address" id="q" value="" autocomplete="off" />' +
        '        </div>' +
        '        <span class="input-group-btn">' +
        '            <select name="country" class="selectpicker"></select>' +
        '            <select name="orgType" class="selectpicker"></select>' +
        '            <button class="btn btn-default" type="submit">Search</button>' +
        '        </span>' +
        '    </div>' +
        '</form>' +
        '<div class="row" style="margin-bottom: 40px;">' +
        '    <div class="col-md-4">' +
        '        <div class="panel panel-default">' +
        '            <div class="panel-heading"><i class="fa fa-list"></i> List Organisations</div>' +
        '            <div class="list-group org-finder-list" style="overflow-y: auto;"></div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="col-md-8">' +
        '        <div class="embed-responsive embed-responsive-16by9">' +
        '            <div class="embed-responsive-item org-finder-map"></div>' +
        '        </div>' +
        '    </div>' +
        '</div>'
        ,
        onReady: function (formSearch, itemsWrapper, mapDiv) {
        },
        onSelect: function (orgData, item, marker, infoWindow) {
        },
        onSearch: function (query) {
        },
        beforeSearch: function (query, data) {
            return data;
        },
        onSearched: function (query, resp) {
        },
        renderItemContent: function (orgData) {
            var itemContent = '';
            itemContent += '<h4 class="list-group-item-heading">' + orgData.title + '</h4>';

            if (orgData.orgTypes && orgData.orgTypes.length > 0) {
                var orgTypesHtml = '';
                for (var i = 0; i < orgData.orgTypes.length; i++) {
                    orgTypesHtml += '<span class="label label-info">' + orgData.orgTypes[i].dispayName + '</span> ';
                }

                itemContent += '<p>' + orgTypesHtml + '</p>';
            }

            if (orgData.phone) {
                itemContent += '<p class="list-group-item-text"><i class="fa fa-phone fa-fw"></i> ' + orgData.phone + '</p>';
            }
            if (orgData.email) {
                itemContent += '<p class="list-group-item-text" style="word-break: break-all;"><i class="fa fa-envelope-o fa-fw"></i> <a href="mailto:' + orgData.email + '">' + orgData.email + '</a></p>';
            }

            var address = '';
            if (orgData.address) {
                address += orgData.address + '<br />';
            }
            if (orgData.addressLine2) {
                address += orgData.addressLine2 + '<br />';
            }
            if (orgData.addressState) {
                address += orgData.addressState
            }
            if (orgData.postcode) {
                address += ' ' + orgData.postcode;
            }
            if (orgData.country) {
                address += ', ' + orgData.country;
            }
            if (address.trim() !== '') {
                itemContent += '<p class="list-group-item-text"><i class="fa fa-map-marker fa-fw"></i> ' + address + '</p>';
            }

            return '<div class="list-group-item">' + itemContent + '</div>';
        },
        renderMarkerContent: function (orgData) {
            return '<div><h3>' + orgData.title + '</h3></div>';
        },
        emptyItemText: '<div class="list-group-item text-muted">No result</li>'
    };

    var SEARCH_SELECTOR = '.org-finder-search';
    var LIST_SELECTOR = '.org-finder-list';
    var MAP_SELECTOR = '.org-finder-map';

    function Finder(container, options) {
        this.options = options;
        this.container = container;
        this.init();
    }

    Finder.prototype = {
        map: null,
        markers: [],
        infoWindows: [],
        listItems: [],
        activeInfoWidow: null,
        activeListItem: null,

        init: function () {
            var self = this;
            var options = self.options;
            var container = self.container;

            container.html(options.template);
            self.formSearch = container.find(SEARCH_SELECTOR);
            self.itemsWrapper = container.find(LIST_SELECTOR);
            self.mapDiv = container.find(MAP_SELECTOR);
            self.initMap();
        },

        initMap: function () {
            flog('[jquery.orgFinder] initMap');

            var self = this;
            var options = this.options;
            var functionName = 'init' + (new Date()).getTime();
            var googleMapCallback = '$.fn.orgFinder.' + functionName;

            $.fn.orgFinder[functionName] = function () {
                var mapOptions = {};
                if (options.initLatLng.length === 2) {
                    mapOptions.center = {
                        lat: options.initLatLng[0],
                        lng: options.initLatLng[1]
                    };
                }

                if (options.initZoomLevel) {
                    mapOptions.zoom = options.initZoomLevel;
                }

                self.map = new google.maps.Map(self.mapDiv.get(0), mapOptions);
                self.initCurrentLocation();
                self.initFormSearch();

                if (typeof options.onReady === 'function') {
                    options.onReady.call(self, self.formSearch, self.itemsWrapper, self.mapDiv);
                }
            };

            if (window.google && window.google.maps) {
                flog('[jquery.orgFinder] Google Map Api is already in documentation');
                $.fn.orgFinder[functionName].call(this);
            } else {
                var gmapApiUrl = 'https://maps.googleapis.com/maps/api/js?key=' + self.options.googleAPIKey + '&libraries=places&callback=' + googleMapCallback;
                flog('[jquery.orgFinder] Load Google Map Api from "' + gmapApiUrl + '"');
                $.getScript(gmapApiUrl);
            }
        },

        initCurrentLocation: function () {
            flog('[jquery.orgFinder] initCurrentLocation');

            var self = this;
            var map = self.map;
            
            if (navigator.geolocation) {
                flog('[jquery.orgFinder] Geolocation is supported');
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;

                    flog('[jquery.orgFinder] Add market for current location of user', lat, lng);
                    var latlng = new google.maps.LatLng(lat, lng);
                    var marker = new google.maps.Marker({
                        position: latlng,
                        title: 'Your location',
                        icon: 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_yellow.png'
                    });
                    marker.setMap(map);
                    var infoWindow = new google.maps.InfoWindow({
                        content: '<i class="fa fa-marker"></i> Your location',
                        disableAutoPan: true
                    });
                    infoWindow.open(map, marker);
                });
            } else {
                flog('[jquery.orgFinder] Geolocation is not supported');
            }
        },

        initFormSearch: function () {
            flog('[jquery.orgFinder] initFormSearch');

            var self = this;
            var options = self.options;
            var formSearch = self.formSearch;
            var cbbCountry = formSearch.find('[name=country]');
            var cbbOrgType = formSearch.find('[name=orgType]');
            var txtQ = formSearch.find('[name=q]');
            var btn = formSearch.find(':button');
            var initQuery = self.options.initQuery;
            var orgTypes = options.orgTypes;
            var allowedCountries = options.allowedCountries;

            if (initQuery !== null && initQuery !== undefined && initQuery.trim() !== '') {
                flog('[jquery.orgFinder] Init query is: ' + initQuery);
                txtQ.val(initQuery);
            }

            flog('[jquery.orgFinder] Initialize Google Map Autocomplete', txtQ);
            var autocomplete = self.autocomplete = new google.maps.places.Autocomplete(txtQ.get(0), {
                types: ['(cities)']
            });

            var eventHandler = function () {
                var selectedPlace = autocomplete.getPlace();
                flog('[jquery.orgFinder] Selected place', selectedPlace);

                if (selectedPlace && selectedPlace.place_id) {
                    var lat = selectedPlace.geometry.location.lat();
                    var lng = selectedPlace.geometry.location.lng();
                    var query = (txtQ.val() || '').trim();
                    query = query === '' ? ' ' : query;

                    self.clear();
                    self.doSearch(query, lat, lng);
                } else {
                    flog('[jquery.orgFinder] No place is selected!');
                }
            };

            if (orgTypes && $.isArray(orgTypes) && orgTypes.length > 0) {
                flog('[jquery.orgFinder] Initialize "Types" select box', cbbOrgType, orgTypes);
                var optionStr = '';

                for (var i = 0; i < orgTypes.length; i++) {
                    optionStr += '<option value="' + orgTypes[i].value + '">' + orgTypes[i].title + '</option>';
                }

                cbbOrgType.prop('multiple', true).html(optionStr).addClass('selectpicker');
                if (!cbbOrgType.attr('title')) {
                    cbbOrgType.attr('title', ' - Select Types - ')
                }
                cbbOrgType.selectpicker().on('change', function () {
                    eventHandler();
                });
            } else {
                flog('[jquery.orgFinder] Remove "Types" select box', cbbOrgType, orgTypes);
                cbbOrgType.remove();
            }

            if (allowedCountries && $.isArray(allowedCountries) && allowedCountries.length > 0) {
                flog('[jquery.orgFinder] Initialize "Country" select box', cbbCountry, allowedCountries);
                var optionStr = '';

                optionStr += '<option value="" selected="selected"> - Select Country - </option>';
                for (var i = 0; i < allowedCountries.length; i++) {
                    optionStr += '<option value="' + allowedCountries[i].value + '">' + allowedCountries[i].title + '</option>';
                }

                cbbCountry.html(optionStr).addClass('selectpicker');
                if (!cbbCountry.attr('title')) {
                    cbbCountry.attr('title', ' - Select Country - ')
                }
                cbbCountry.selectpicker().on('change', function () {
                    autocomplete.setComponentRestrictions(this.value ? {
                        country: this.value
                    } : []);
                    txtQ.val('');
                });
            } else {
                flog('[jquery.orgFinder] Remove "Country" select box', cbbCountry, allowedCountries);
                cbbCountry.remove();
            }

            if (formSearch.is('form')) {
                flog('[jquery.orgFinder] Form search is form tag', formSearch);
                formSearch.on('submit', function (e) {
                    e.preventDefault();

                    eventHandler();
                });
            } else {
                flog('[jquery.orgFinder] Form search is not form tag', formSearch);
                btn.on('click', function (e) {
                    e.preventDefault();

                    eventHandler();
                });
            }

            autocomplete.addListener('place_changed', function () {
                eventHandler();
            });
        },

        clear: function () {
            flog('[jquery.orgFinder] clear');

            if (this.activeInfoWidow) {
                this.activeInfoWidow.close();
            }

            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
                delete this.markers[i];
                delete this.infoWindows[i];
                delete this.listItems[i];
            }

            this.markers = [];
            this.infoWindows = [];
            this.listItems = [];
            this.activeInfoWidow = null;
            this.activeListItem = null;
            this.itemsWrapper.html('');
        },

        doSearch: function (query, lat, lng) {
            flog('[jquery.orgFinder] doSearch', query, lat, lng);

            var self = this;
            var options = self.options;
            var map = self.map;

            if (typeof options.onSearch === 'function') {
                options.onSearch.call(self, query);
            }

            var searchUrl = (options.searchUrl || '').trim();
            if (searchUrl.length === 0) {
                $.error('[jquery.orgFinder] Search Url is empty!');
            }

            var data = {
                maxResults: options.maxResults
            };

            if (lat !== undefined && lng !== undefined) {
                data.lat = lat;
                data.lng = lng;
            } else {
                data.jsonQuery = query;
            }

            if (options.orgTypes && $.isArray(options.orgTypes) && options.orgTypes.length > 0) {
                data.orgTypes = self.formSearch.find('[name=orgType]').val();
            }

            if (typeof options.beforeSearch === 'function') {
                data = options.beforeSearch.call(self, query, data);
            }

            $.ajax({
                url: options.searchUrl,
                dataType: 'json',
                type: 'get',
                data: data,
                success: function (resp) {
                    flog('[jquery.orgFinder] Success in getting data', resp);

                    self.clear();

                    if (lat && lng) {
                        flog('[jquery.orgFinder] Add market for selected place', lat, lng);
                        var latlng = new google.maps.LatLng(lat, lng);
                        var marker = new google.maps.Marker({
                            position: latlng,
                            title: query,
                            icon: 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green.png'
                        });
                        marker.setMap(map);
                        var infoWindow = new google.maps.InfoWindow({
                            content: query,
                            disableAutoPan: true
                        });
                        infoWindow.open(map, marker);
                        self.markers.push(marker);
                        self.infoWindows.push(infoWindow);
                    }

                    if (resp && resp.status && resp.data && resp.data[0]) {
                        self.generateData(resp.data, lat, lng);
                    } else {
                        flog('[jquery.orgFinder] No organisation match');
                        self.itemsWrapper.html(options.emptyItemText);

                        if (lat && lng) {
                            map.setCenter(new google.maps.LatLng(lat, lng));
                            map.setZoom(options.initZoomLevel);
                        }
                    }

                    if (typeof options.onSearched === 'function') {
                        options.onSearched.call(self, query, resp);
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('[jquery.orgFinder] Error when getting data', jqXHR, textStatus, errorThrown);
                }
            });
        },

        generateData: function (data, lat, lng) {
            flog('[jquery.orgFinder] generateData', data, lat, lng);

            var self = this;
            var map = self.map;
            var lats = [];
            var lngs = [];

            if (lat && lng) {
                lats.push(lat);
                lngs.push(lng);
            }

            for (var i = 0; i < data.length; i++) {
                self.createDataItem(data[i]);
                lats.push(data[i].lat);
                lngs.push(data[i].lng);
            }

            // Calculate center and zoom level for map when show all markers
            var minLat = Math.min.apply(Math, lats);
            var maxLat = Math.max.apply(Math, lats);
            var minLng = Math.min.apply(Math, lngs);
            var maxLng = Math.max.apply(Math, lngs);

            map.fitBounds(new google.maps.LatLngBounds(
                new google.maps.LatLng(minLat, minLng),
                new google.maps.LatLng(maxLat, maxLng)
            ));
        },

        createDataItem: function (markerData) {
            flog('[jquery.orgFinder] createDataItem', markerData);

            var self = this;
            var options = self.options;
            var map = self.map;
            var itemsWrapper = self.itemsWrapper;

            var latlng = new google.maps.LatLng(markerData.lat, markerData.lng);
            var marker = new google.maps.Marker({
                position: latlng,
                animation: google.maps.Animation.DROP,
                title: markerData.orgTypeDisplayName || markerData.title
            });
            marker.setMap(map);
            flog('[jquery.orgFinder] Marker', marker);

            if (typeof options.renderItemContent !== 'function') {
                $.error('[jquery.orgFinder] renderItemContent is not function. Please correct it!');
            }

            if (typeof options.renderMarkerContent !== 'function') {
                $.error('[jquery.orgFinder] renderMarkerContent is not function. Please correct it!');
            }

            var itemContent = options.renderItemContent(markerData) || '';
            var markerContent = options.renderMarkerContent(markerData) || '';

            if (itemContent.length === 0 || markerContent.length === 0) {
                flog('[jquery.orgFinder] Item content or Marker content is empty. Skipped on creating!');
            } else {
                flog('[jquery.orgFinder] Creating infoWindow and item');

                var infoWindow = new google.maps.InfoWindow({
                    content: markerContent
                });
                flog('[jquery.orgFinder] Info window', infoWindow);

                var item = $(itemContent);
                itemsWrapper.append(item);
                flog('[jquery.orgFinder] Item', item);

                var clickEventHandler = function (doScroll) {
                    if (self.activeInfoWidow) {
                        self.activeInfoWidow.close();
                    }
                    itemsWrapper.find('.active').removeClass('active');
                    infoWindow.open(map, marker);
                    self.activeInfoWidow = infoWindow;
                    item.addClass('active');

                    if (doScroll) {
                        itemsWrapper.scrollTo(item);
                    }

                    if (typeof options.onSelect === 'function') {
                        options.onSelect.call(self, markerData, item, marker, infoWindow);
                    }
                };

                marker.addListener('click', function () {
                    flog('[jquery.orgFinder] Clicked on marker', marker);

                    clickEventHandler(true);
                });

                item.on('click', function (e) {
                    e.preventDefault();
                    flog('[jquery.orgFinder] Clicked on item', item);

                    clickEventHandler(false);
                });

                self.markers.push(marker);
                self.infoWindows.push(infoWindow);
                self.listItems.push(item);
            }
        }
    };

    var methods = {
        init: function (options) {
            options = $.extend({}, $.fn.orgFinder.DEFAULT, options);

            if (options.googleAPIKey === null || options.googleAPIKey === undefined || options.googleAPIKey.trim() === '') {
                $.error('[jquery.orgFinder] Google API Key is empty!');
            }

            $(this).each(function () {
                var container = $(this);
                if (!container.data('orgFinder')) {
                    var finder = new Finder(container, options);
                    container.data('orgFinder', finder);
                }
            });
        }
    };

})(jQuery);
