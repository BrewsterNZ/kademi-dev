function initLeadCompanyDetailTags() {
    var assignedTags = $('#companyAssignedTags');
    var viewLeadTagsInput = $("#view-company-tags");
    var tagsSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            url: '/leadOrgType',
            ttl: 0,
            cache: false
        }
    });

    tagsSearch.initialize();

    viewLeadTagsInput.typeahead({
        highlight: true
    },{
        displayKey: 'name',
        source: tagsSearch.ttAdapter(),
        templates: {
            empty: '<div class="text-danger" style="padding: 5px 10px;">No existing tags were found. Press enter to add</div>',
            suggestion: Handlebars.compile(
                '<div>'
                + '<div><i class="fa fa-tag"></i> {{displayName}}</div>'
                + '</div><hr>')
        }
    }).on('keyup', function (event) {
        if (event.keyCode == 13) {
            var newTag = this.value;
            var orgId = $(this).attr('data-orgid');
            if (orgId && newTag){
                if (confirm('Are you sure you want to add this tag?')) {
                    $.ajax({
                        url: '/leadOrgType',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            newOrgType: newTag,
                            orgId: orgId
                        },
                        success: function (resp) {
                            if (resp.status) {
                                reloadCompanyTags();
                            } else {
                                Msg.error("Couldnt add tag: " + resp.messages);
                            }
                        },
                        error: function (e) {
                            Msg.error(e.status + ': ' + e.statusText);
                        }
                    }).always(function () {
                        viewLeadTagsInput.typeahead('val','');
                    })
                }
            } else {
                Msg.warning('Missing parameters');
            }
        }
    });

    function doAddTag(tagId, orgId) {
        if (!assignedTags.find('[data-tag-id='+tagId+']').length){
            $.ajax({
                url: '/leadOrgType',
                type: 'POST',
                dataType: 'json',
                data: {
                    addOrgType: tagId,
                    orgId: orgId
                },
                success: function (resp) {
                    reloadCompanyTags();
                },
                error: function (e) {
                    Msg.error('Could not add tag');
                }
            });
        } else {
            Msg.info('Tag already added');
        }
    }

    viewLeadTagsInput.on('typeahead:select', function (ev, tag) {
        viewLeadTagsInput.typeahead('val','');
        var orgId = viewLeadTagsInput.attr('data-orgId');
        if (tag && tag.name && orgId){
            doAddTag(tag.name, orgId);
        } else {
            Msg.error('Could not add tag');
        }

    });

    assignedTags.on('click', '[data-role=removetag]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var tagId = $(this).parent().attr('data-tag-id');
        var orgId = $(this).parent().attr('data-orgid');
        if (tagId){
            if (confirm('Are you sure you want to remove this tag?')) {
                $.ajax({
                    url: '/leadOrgType',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        removeOrgType: tagId,
                        orgId: orgId
                    },
                    success: function (resp) {
                        if (resp.status) {
                            reloadCompanyTags();
                        } else {
                            Msg.error("Couldnt remove tag: " + resp.messages);
                        }
                    },
                    error: function (e) {
                        Msg.error(e.status + ': ' + e.statusText);
                    }
                });
            }
        }
    })
}

function reloadCompanyTags() {
    $('#companyAssignedTags').reloadFragment({
        whenComplete: function () {
            Msg.success('Tags updated');
        }
    });
}

function initCompanyForm(){
    $('#leadOrgDetails').forms({
        onSuccess: function (resp) {
            if (resp && resp.status){
                Msg.success('Updated');
            }
        }
    })
}

$(function () {
    initLeadCompanyDetailTags();
    initCompanyForm();
});