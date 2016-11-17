/**
 * KEditor SVG Map Component (Australia)
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['ksvgmap'] = {
        init: function (contentArea, container, component, keditor) {
            var script = component.find('script');
            if (script.length) {
                script.remove();
            }
            if (component.attr('data-height')){
                component.find('.ksvgmap').css('height', +component.attr('data-height'));
            }
            $.getScriptOnce('/static/jquery-jvectormap/jquery-jvectormap-2.0.3.min.js', function () {
                $.getScriptOnce('/static/jquery-jvectormap/jquery-jvectormap-au-mill.js', function () {
                    component.find('.ksvgmap').vectorMap({
                        map: 'au_mill',
                        backgroundColor: '#fff',
                        zoomButtons: false,
                        focusOn: {
                            x: 0.5,
                            y: 0.5,
                            scale: 1
                        },
                        regionStyle: {
                            initial: {
                                fill: '#efefef'
                            },
                            hover: {
                                fill: "#00aa90"
                            }
                        },
                        onRegionTipShow: function (e, el, code) {
                            if (component.attr('data-' + code))
                                el.html(el.html() + ' - ' + component.attr('data-' + code));
                        }
                    });
                    var i = setInterval(function(){
                        try {
                            var map = component.find('.ksvgmap').vectorMap('get', 'mapObject');
                            map.updateSize();
                            clearInterval(i);
                        } catch (e){
                            flog('trying to get jvectormap object');
                        }
                    },50);
                });
            });
        },
        getContent: function (component, keditor) {
            flog('getContent "svgmap" component', component);
            var componentContent = component.children('.keditor-component-content');
            var script = '<script>$(function(){$(document.body).hasClass("content-editor-page")||$.getScriptOnce("/static/jquery-jvectormap/jquery-jvectormap-2.0.3.min.js",function(){$.getScriptOnce("/static/jquery-jvectormap/jquery-jvectormap-au-mill.js",function(){$(".ksvgmap").each(function(){var a=$(this).parents("[data-type=component-ksvgmap]");a.hasClass("ksvgInit")||(a.addClass("ksvgInit"),$(this).vectorMap({map:"au_mill",backgroundColor:"#fff",zoomButtons:!1,scale:5,regionStyle:{initial:{fill:"#efefef"},hover:{fill:"#00aa90"}},onRegionTipShow:function(b,c,d){a.attr("data-"+d)&&c.html(c.html()+" - "+a.attr("data-"+d))}}))})})})});</script>';
            var css = '<link rel="stylesheet" href="/static/jquery-jvectormap/jquery-jvectormap-2.0.3.css">';
            component.find('.jvectormap-container').remove();
            var arr = $(document.body).find('[data-type="component-ksvgmap"]:not(.keditor-snippet)');
            if (arr.length > 0){
                if ($(arr[arr.length-1]).attr('id') === component.attr('id')){
                    $(css).insertBefore(component.find('.ksvgmap'));
                    $(script).insertAfter(component.find('.ksvgmap'));
                }
            }

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'SVGMap Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "svgmap" component');
            form.append(
                '<form class="form-horizontal" onsubmit="return false;">' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Section</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control state">' +
                '               <option value="AU-QLD">Queensland</option>' +
                '               <option value="AU-NSW">New South Wales</option>' +
                '               <option value="AU-VIC">Victoria</option>' +
                '               <option value="AU-TAS">Tasmania</option>' +
                '               <option value="AU-SA">South Australia</option>' +
                '               <option value="AU-NT">Northern Territory</option>' +
                '               <option value="AU-WA">Western Australia</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group embed">' +
                '       <label class="col-sm-12">Section Message</label>' +
                '       <div class="col-sm-12">' +
                '           <textarea rows="2" class="form-control stateMessage" placeholder="State Message"></textarea>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Height(px)</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" class="form-control height" value="300" placeholder="Height" />' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );
            var component = keditor.getSettingComponent();
            form.find('.state').on('change', function (e) {
                var val = component.attr('data-' + this.value);
                form.find('.stateMessage').val(val);
            });
            form.find('.stateMessage').on('change', function (e) {
                var currentState = form.find('.state').val();
                component.attr('data-' + currentState, this.value);
            });
            form.find('.height').on('change', function (e) {
                component.attr('data-height', this.value);
                component.find('.ksvgmap').css('height', this.value);
                var map = component.find('.ksvgmap').vectorMap('get', 'mapObject');
                map.updateSize();
            });
        },
        showSettingForm: function (form, component, keditor) {
            var height = component.attr('data-height');
            var defaultState = form.find('.state').val();
            form.find('.height').val(height);
            form.find('.stateMessage').val(component.attr('data-' + defaultState));
        }
    };
})(jQuery);
