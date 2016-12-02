(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    // BM: Would be nice if we can extend button, but not sure how to do that..
    KEditor.components['passwordResetLink'] = $.extend({}, KEditor.components['button'], {
        settingTitle: 'Password Reset Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "passwordResetLink" component');

            form.append(this.settingFormHtml);
            form.find('.button-link').remove();
            form.prepend(
                '<div class="form-group">' +
                '   <div class="col-md-12">' +
                '       <label>Background</label>' +
                '       <div class="input-group color-picker">' +
                '           <span class="input-group-addon"><i></i></span>' +
                '           <input type="text" value="" class="txt-bg-color form-control" />' +
                '       </div>' +
                '   </div>' +
                '</div>' +
                '<div class="form-group">' +
                '   <div class="col-md-12">' +
                '       <label>Padding (in px)</label>' +
                '       <div class="row row-sm text-center">' +
                '           <div class="col-xs-4 col-xs-offset-4">' +
                '               <input type="number" value="" class="txt-padding form-control" name="padding-top" />' +
                '               <small>top</small>' +
                '           </div>' +
                '       </div>' +
                '       <div class="row row-sm text-center">' +
                '           <div class="col-xs-4">' +
                '               <input type="number" value="" class="txt-padding form-control" name="padding-left" />' +
                '               <small>left</small>' +
                '           </div>' +
                '           <div class="col-xs-4 col-xs-offset-4">' +
                '               <input type="number" value="" class="txt-padding form-control" name="padding-right" />' +
                '               <small>right</small>' +
                '           </div>' +
                '       </div>' +
                '       <div class="row row-sm text-center">' +
                '           <div class="col-xs-4 col-xs-offset-4">' +
                '               <input type="number" value="" class="txt-padding form-control" name="padding-bottom" />' +
                '               <small>bottom</small>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>'
            );

            var colorPicker = form.find('.color-picker');
            initColorPicker(colorPicker, function (color) {
                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');

                if (color && color !== 'transparent') {
                    component.attr('data-bg-color', color);
                } else {
                    component.attr('data-bg-color', '');
                    form.find('.txt-bg-color').val('');
                }

                keditor.initDynamicContent(dynamicElement);
            });

            var buttonColorPicker = form.find('.button-color-picker');
            initColorPicker(buttonColorPicker, function (color) {
                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');

                if (color && color !== 'transparent') {
                    component.attr('data-color', color);
                } else {
                    component.attr('data-color', '');
                    form.find('.button-color').val('');
                }

                keditor.initDynamicContent(dynamicElement);
            });

            var txtBorderRadius = form.find('#button-border-radius');
            txtBorderRadius.on('change', function () {
                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');
                component.attr('data-border-radius', this.value);
                keditor.initDynamicContent(dynamicElement);
            });

            form.find('.button-inner-padding').each(function () {
                var input = $(this);
                var name = input.attr('name');

                input.on('change', function () {
                    var value = this.value > 0 ? this.value : 0;

                    var component = keditor.getSettingComponent();
                    var dynamicElement = component.find('[data-dynamic-href]');

                    component.attr('data-inner-' + name, value);
                    keditor.initDynamicContent(dynamicElement);
                });
            });

            form.find('.txt-padding').each(function () {
                var input = $(this);
                var name = input.attr('name');

                input.on('change', function () {
                    var value = this.value > 0 ? this.value : 0;

                    var component = keditor.getSettingComponent();
                    var dynamicElement = component.find('[data-dynamic-href]');

                    component.attr('data-' + name, value);
                    keditor.initDynamicContent(dynamicElement);
                });
            });

            var txtText = form.find('#button-text');
            txtText.on('change', function () {
                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');

                component.attr('data-message', (this.value || '').trim());
                keditor.initDynamicContent(dynamicElement);
            });

            var buttonTextColorPicker = form.find('.button-color-text-picker');
            initColorPicker(buttonTextColorPicker, function (color) {

                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');

                if (color && color !== 'transparent') {
                    component.attr('data-text-color', color);
                } else {
                    component.attr('data-text-color', '');
                    form.find('.button-text-color').val('');
                }

                keditor.initDynamicContent(dynamicElement);
            });

            var txtFontSize = form.find('#button-font-size');
            txtFontSize.on('change', function () {
                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');

                component.attr('data-font-size', this.value > 0 ? this.value : 0);
                keditor.initDynamicContent(dynamicElement);
            });

            var cbbFontFamily = form.find('#button-font-family');
            cbbFontFamily.on('change', function () {
                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');

                component.attr('data-font-family', this.value);
                keditor.initDynamicContent(dynamicElement);
            });

            form.find('.btn-style').each(function () {
                var btn = $(this);
                var name = btn.attr('name');

                btn.on('click', function (e) {
                    e.preventDefault();

                    var value = btn.attr('data-value');
                    if (btn.hasClass('active')) {
                        btn.removeClass('active');
                        value = '';
                    } else {
                        btn.addClass('active');
                    }

                    var component = keditor.getSettingComponent();
                    var dynamicElement = component.find('[data-dynamic-href]');

                    component.attr('data-' + name, value);
                    keditor.initDynamicContent(dynamicElement);
                });
            });

            var btnsAlign = form.find('.btn-align');
            btnsAlign.each(function () {
                var btn = $(this);
                var value = btn.attr('data-value');

                btn.on('click', function (e) {
                    e.preventDefault();

                    if (!btn.hasClass('active')) {
                        btnsAlign.removeClass('active');
                        btn.addClass('active');

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-text-align', value);
                        keditor.initDynamicContent(dynamicElement);
                    }
                });
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "passwordResetLink" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

            form.find('.button-color-picker').colorpicker('setValue', dataAttributes['data-color'] || 'transparent');
            form.find('.color-picker').colorpicker('setValue', dataAttributes['data-bg-color'] || 'transparent');
            form.find('#button-border-radius').val(dataAttributes['data-border-radius'] || '0');

            form.find('.button-inner-padding').each(function () {
                var input = $(this);
                var name = input.attr('name');

                input.val(dataAttributes['data-inner-' + name] || '0');
            });

            form.find('.txt-padding').each(function () {
                var input = $(this);
                var name = input.attr('name');

                input.val(dataAttributes['data-' + name] || '0');
            });

            form.find('#button-text').val(dataAttributes['data-message'] || '');
            form.find('.button-color-text-picker').colorpicker('setValue', dataAttributes['data-text-color'] || '');
            form.find('#button-font-size').val(dataAttributes['data-font-size'] || '');
            form.find('#button-font-family').val(dataAttributes['data-font-family'] || '');
            form.find('.btn-bold')[dataAttributes['data-font-weight'] === 'bold' ? 'addClass' : 'removeClass']('active');
            form.find('.btn-italic')[dataAttributes['data-font-style'] === 'italic' ? 'addClass' : 'removeClass']('active');
            form.find('.btn-align').removeClass('active').filter('[data-value=' + (dataAttributes['data-text-align'] || '') + ']').addClass('active');

        }
    });

})(jQuery);