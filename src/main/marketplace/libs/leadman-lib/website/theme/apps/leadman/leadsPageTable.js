(function($){
    $(document).ready(function(){
        var $leads = $('.leads-page-table-component');
        if($leads.length > 0) {
            window.searchOptions = {
                team: $leads.data("team"),
                query: $leads.data("query"),
                leadType: $leads.data("lead-type"),
                tags: $leads.data("tags"),
                assignedTo: $leads.data("assigned-to"),
                sources: $leads.data("sources"),
                journeys: $leads.data("journeys")
            };

            initLeadManPage();
        }
    });

})(jQuery);
