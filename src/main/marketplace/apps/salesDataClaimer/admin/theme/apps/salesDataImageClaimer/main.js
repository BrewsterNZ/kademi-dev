$('input[name="select-all"]').click(function(){
    $this = $(this);
    
    if($this.prop('checked')){
        $('tbody [data-checkbox]').prop('checked', true);
    }else{
        $('tbody [data-checkbox]').prop('checked', false);
    }
}); 

$('[name="accept"]').click(function(){
    var checked = $('tbody').find('[data-checkbox]:checkbox:checked'); 
    var salesDataIds = [];
    
    checked.each(function () {
        salesDataIds.push(this.value);
    });   
    
    var confirmationDialog = confirm("Are you sure you want to claim these records?");
    if (confirmationDialog == true) {
        $.ajax({
            url: '/salesDataClaimsProducts/tagClaim',
            type: 'POST',
            dataType: 'JSON',
            data: {
                createImageClaimTagging: true,
                salesDataIds: salesDataIds.join(',')
            },
            success: function (resp) {
                flog('RESP ', resp);
                Msg.success("Claim tagged successfully");
                
                $('#table-ocr-manager-body').reloadFragment({
                    url: window.location.pathname + window.location.search
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {                                                            
                flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                Msg.error("Something went wrong !");
            }
        });
    }
});

$('[name="reject"]').click(function(){
    if(!confirm("Are you sure you want to reject these records?")){
        return;
    }
    
    var checked = $('tbody').find('[data-checkbox]:checkbox:checked');    
    
    checked.each(function () {
        var salesDataId = this.value;
        
        $.ajax({
            url: '/sales/ocr-series/',
            type: 'POST',
            dataType: 'JSON',
            data: {
                toRemoveId: salesDataId
            },
            async: false,
            success: function (resp) {
                flog('RESP ', resp);
                Msg.success("Claim rejected tagged successfully");
                
                $('#table-ocr-manager-body').reloadFragment({
                    url: window.location.pathname + window.location.search
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {                                                            
                flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                Msg.error("Something went wrong !");
            }
        });
    }); 
});