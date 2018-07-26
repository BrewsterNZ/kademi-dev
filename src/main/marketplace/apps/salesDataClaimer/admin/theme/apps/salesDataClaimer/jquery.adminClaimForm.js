(function ($) {
    Handlebars.registerHelper('format_claim_date', function (date) {
        if (typeof date === 'string') {
            var newDate = moment(date).format('DD/MM/YYYY HH:mm');

            return new Handlebars.SafeString(newDate);
        }
    });

    var ROW_TEMPLATE = '<tr {{#if recordId}} data-id="{{recordId}}" {{/if}}">' +
            '<td>' +
            '  <input type="hidden" name="claimid.{{_currentCount}}" value="{{recordId}}"/>' +
            '  <input value="{{format_claim_date soldDate}}" type="text" name="soldDate.{{_currentCount}}" placeholder="Purchase date" data-format="DD/MM/YYYY HH:mm" class="form-control date-time-picker required" />' +
            '</td>' +
            '<td>' +
            '  <input value="{{soldById}}" class="soldById" type="hidden" name="soldById.{{_currentCount}}"/>' +
            '  <input value="{{soldBy}}" data-text="{{soldBy}}" type="text" class="form-control searchProfile required soldBy" name="soldBy.{{_currentCount}}" placeholder="Sold By" />' +
            '</td>' +
            '<td><input value="{{productSku}}" type="text" class="form-control required" name="productSku.{{_currentCount}}" placeholder="Product Sku" /></td>' +
            '<td><input step="0.001" value="{{amount}}" type="number" class="form-control required" name="amount.{{_currentCount}}" placeholder="Sale amount" /></td>' +
            '<td><button type="button" class="btn btn-sm btn-danger btn-delete-row" title="Delete Row"><i class="fa fa-trash"></i></button></td>' +
            '</tr>';

    var COMPILED_ROW_TEMPLATE = Handlebars.compile(ROW_TEMPLATE);

    function salesDataClaimForm(element, options) {
        var $this = this;

        $this.$elem = $(element);
        $this.$options = $.extend({}, $.fn.salesDataClaimForm.defaults, options);

        $this.$_currentCount = 0;

        $this.$elem.on('click', '[data-action="add-claim-item"]', function (e) {
            e.preventDefault();

            $this.addEmptyRow.call($this);
        });

        $this.$elem.on('click', '.btn-delete-row', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');

            Kalert.confirm('You want to delete this row', function () {
                row.remove();

                // Update ID's and count
                $this.$elem.find('tbody tr').each(function (i, item) {
                    var claimRow = $(item);

                    claimRow.find('[name^="claimid."]').attr('name', 'claimid.' + i);
                    claimRow.find('[name^="soldDate."]').attr('name', 'soldDate.' + i);
                    claimRow.find('[name^="soldById."]').attr('name', 'soldById.' + i);
                    claimRow.find('[name^="soldBy."]').attr('name', 'soldBy.' + i);
                    claimRow.find('[name^="productSku."]').attr('name', 'productSku.' + i);
                    claimRow.find('[name^="amount."]').attr('name', 'amount.' + i);
                });

                $this.$_currentCount = $this.$elem.find('tbody tr').length;
                $this.$elem.find('[name=claimItemsLength]').val($this.$_currentCount);
            });
        });
    }

    salesDataClaimForm.prototype.addEmptyRow = function () {
        var $this = this;

        $this.addRow.call($this, {});
    };

    salesDataClaimForm.prototype.addRow = function (data) {
        var $this = this;

        data._currentCount = $this.$_currentCount;

        var row = $(COMPILED_ROW_TEMPLATE(data));

        $this.$elem.find('tbody').append(row);

        row.find('.date-time-picker').datetimepicker({
            format: 'DD/MM/YYYY HH:mm'
        });

        row.find('.searchProfile').entityFinder({
            type: 'profile',
            onSelectSuggestion: function (elem, userName, actualId, type) {
                row.find('.soldBy').val(userName);
                row.find('.soldById').val(actualId);
            }
        });

        $this.$_currentCount++;
        $this.$elem.find('[name=claimItemsLength]').val($this.$_currentCount);
    };

    salesDataClaimForm.prototype.populate = function (data) {
        var $this = this;

        $this.reset.call($this);

        console.log('populate', data, arguments);

        $this.$elem.data('claimid', data.recordId);

        // Populate rows
        if (data.claimItems) {
            for (var i = 0; i < data.claimItems.length; i++) {
                var claimItem = data.claimItems[i];
                $this.addRow.call($this, claimItem);
            }
        }

        // Populate receipt
        if (data.receipt) {
            $this.$elem.find('.thumbnail img').attr('src', data.receipt);
            $this.$elem.find('.btn-upload-receipt span').html('Upload other receipt');
            $this.$elem.find('.btn-upload-receipt i').attr('class', 'fa fa-check');
        }
    };

    salesDataClaimForm.prototype.reset = function () {
        var $this = this;

        $this.$_currentCount = 0;
        $this.$elem.find('[name=claimItemsLength]').val($this.$_currentCount);
        $this.$elem.find('tbody').empty();
    };

    $.fn.salesDataClaimForm = function (options) {
        if (typeof options === 'string' && this.data('adminClaimsForm')) {
            var data = this.data('adminClaimsForm');
            var optionalArgs = Array.prototype.slice.call(arguments, 1);
            return data[options].apply(data, optionalArgs);
        }

        return this.each(function () {
            var $this = $(this),
                    data = $this.data('adminClaimsForm');
            if (!data) {
                $this.data('adminClaimsForm', (data = new salesDataClaimForm(this, options)));
                data = $this.data('adminClaimsForm');
            }

            if (typeof options === 'string' && typeof data[options] === 'function') {
                var optionalArgs = Array.prototype.slice.call(arguments, 1);
                return data[options].apply(data, optionalArgs);
            }

            return $this;
        });
    };

    $.fn.salesDataClaimForm.defaults = {};
})(jQuery);