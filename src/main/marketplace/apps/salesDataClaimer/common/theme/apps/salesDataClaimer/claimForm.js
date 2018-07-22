$(function () {
    $('.claim-items [data-action="add-claim-item"]').on('click', function () {
        var btn = $(this);
        var form = btn.closest('form');
        var claimItemsLengthElem = form.find('[name="claimItemsLength"]');

        var claimItemsCounter = 0;
        if (isNumber(claimItemsLengthElem.val())) {
            claimItemsCounter = parseInt(claimItemsLengthElem.val());
        }

        if (claimItemsCounter < 0) {
            claimItemsCounter = 0;
        }

        var claimItemTemplte = '';
        claimItemTemplte += '<div class="claim-item claim-item-' + claimItemsCounter + '">';
        claimItemTemplte += '    <div class="form-group">';
        claimItemTemplte += '        <label for="amount" class="control-label sr-only">Amount</label>';

        claimItemTemplte += '        <div class="col-sm-12">';
        claimItemTemplte += '            <input type="number" class="form-control required" name="amount.' + claimItemsCounter + '" placeholder="Sale amount" />';
        claimItemTemplte += '        </div>';
        claimItemTemplte += '    </div>';

        claimItemTemplte += '    <div class="form-group">';
        claimItemTemplte += '        <label for="soldDate" class="control-label sr-only">Date</label>';

        claimItemTemplte += '        <div class="col-sm-12">';
        claimItemTemplte += '            <div class="input-group">';
        claimItemTemplte += '                <input type="text" name="soldDate.' + claimItemsCounter + '" placeholder="Purchase date" data-format="DD/MM/YYYY HH:mm" class="form-control date-time-picker required" />';
        claimItemTemplte += '                <span class="input-group-addon"> <i class="fa fa-calendar"></i> </span>';
        claimItemTemplte += '            </div>';
        claimItemTemplte += '        </div>';
        claimItemTemplte += '    </div>';

        claimItemTemplte += '    <div class="form-group">';
        claimItemTemplte += '        <label for="productSku" class="control-label sr-only">Product SKU</label>';

        claimItemTemplte += '        <div class="col-sm-12">';
        claimItemTemplte += '            <input name="productSku.' + claimItemsCounter + '" class="form-control required" placeholder="Product name" value="" />';
        claimItemTemplte += '        </div>';
        claimItemTemplte += '    </div>';
        claimItemTemplte += '</div>';

        form.find('.claim-items .claim-items-body').append(claimItemTemplte).find('.date-time-picker').each(function () {
            var input = $(this);
            var format = input.attr('data-format') || 'DD/MM/YYYY';

            input.datetimepicker({
                format: format
            });
        });

        claimItemsCounter++;

        claimItemsLengthElem.val(claimItemsCounter);
    });

    $('.claim-items [data-action="add-claim-item"]').each(function () {
        $(this).click();
        return false;
    });
});