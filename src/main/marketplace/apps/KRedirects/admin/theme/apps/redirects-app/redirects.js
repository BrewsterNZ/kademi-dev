$(function(){
    initCheckAll();
    initForm();
    initDelete();
});

function initCheckAll(){
    $('.check-all').change(function (e) {
        var checkedStatus = this.checked;
        $("#redirect-table-body input[data-redirect-id]").each(function(){
            $(this).prop('checked', checkedStatus);
        });
    });
}

function initForm(){
	$('#redirect-form').forms({
		onSuccess: function () {
		    Msg.success('Saved');
            $("#redirectsTableBody").reloadFragment();
            $('#redirect-form').trigger('reset');
        }
	});
}

function initDelete(){
    $('.btn-delete-redirects').click(function(e){
        e.preventDefault();
        var deleteRedirects = [];
        $("#redirect-table-body input[data-redirect-id]:checked").each(function(){
            deleteRedirects.push($(this).data('redirect-id'));
        });
        flog('Delete products: ',deleteRedirects);
        var deleteRedirectsCount = deleteRedirects.length;
        if(deleteRedirectsCount > 0 && confirm("Are you sure you want to delete " + deleteRedirectsCount  + " redirects?")){
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: window.location.href,
                data: {
                    deleteRedirect: 'deleteRedirect',
                    deleteList: deleteRedirects.join(','),
                },
                success: function (data) {
                    if (data.status) {
                        Msg.info(deleteRedirects.length + " redirect(s) have been deleted");
                        $("#redirect-table-body").reloadFragment();
                    } else {
                         
                        Msg.error("An error occured deleting the redirects. Please check your internet connection");
                    }
                },
                error: function (resp) {
                    
                    Msg.error("An error occured deleting the redirects");
                }
            });
        }
    })
}

