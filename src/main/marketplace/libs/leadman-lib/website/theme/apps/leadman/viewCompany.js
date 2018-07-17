function initLeadCompanyDetailTags() {
    var assignedTags = $('#companyAssignedTags');
    var viewLeadTagsInput = $("#view-company-tags");
    var tagsSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            url: '/leadOrgTypes',
            ttl: 0,
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
            if (confirm('Are you sure you want to add this tag?')) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        title: newTag
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
        }
    });

    function doAddTag(tagId) {
        if (!assignedTags.find('[data-tag-id='+tagId+']').length){
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    addTag: tagId
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
        doAddTag(tag.id);
    });

    assignedTags.on('click', '[data-role=removetag]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var tagId = $(this).parent().attr('data-tag-id');
        if (tagId){
            if (confirm('Are you sure you want to remove this tag?')) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        deleteTag: tagId
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

$(function () {
    initLeadCompanyDetailTags();
})