$(function() {
    flog("init change modal", $('#myModal'));
    $('#myModal').on('shown shown.bs.modal show.bs.modal', function() {
        flog("modal shown");
        initChangeOrgModal();
    })
});
function initChangeOrgModal() {
    flog("initChangeOrgModal", $("#changeMemberOrgForm"));
    $("#changeMemberOrgForm").forms({
        onSuccess: function(resp, form) {
            window.location.reload();
        }
    });

    try {
        var orgs = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: window.location.pathname,
                //url: searchUrl + '?jsonQuery=%QUERY&th',
                replace: function() {
                    return window.location.pathname + "?changeMemberOrg=" + $("#changeMemberOrg").val() + "&orgSearchQuery=" + encodeURIComponent($("#orgTitle").val()) + '&th';
                }
            }
        });

        orgs.initialize();

        $("#orgTitle").typeahead(null, {
            minLength: 1,
            valueKey: "title",
            name: "orgs",
            source: orgs.ttAdapter(),
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No organisations match your search',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile('<p><strong>{{title}}</strong> ({{postcode}})</p>')
            }
        });
        flog("init typeahead2", $("#orgTitle"));
        $("#orgTitle").on("typeahead:selected", function(e, datum) {
            log("Selected", e, datum);
            $("#orgId").val(datum.orgId);
        });
        flog("init typeahead3");
    } catch (e) {
        flog("exception: " + e);
    }
}