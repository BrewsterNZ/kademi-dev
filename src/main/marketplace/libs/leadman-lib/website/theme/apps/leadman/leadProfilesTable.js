(function ($) {
    $(document).ready(function () {
        var $lead = $('.lead-profiles-table-component');
        if ($lead.length > 0) {
            initSearchLead();
            initUploads();
        }

        var $lead = $('#default-leadsPageTable');
        if ($lead.length > 0) {
            initLeadUploads();
        }
    });
})(jQuery);
