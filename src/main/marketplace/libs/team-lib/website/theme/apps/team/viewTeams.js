(function ($) {
    function initCreateMemberForm() {
        var modal = $('#modal-add-member');
        var form = modal.find('form');
        var teamOrgType = form.find('#teamFinder').attr('data-team-orgtype');
        var url = '/leads/';
        if (teamOrgType) {
            url += '?' + $.param({orgType: teamOrgType});
        }
        form.find('#teamFinder').entityFinder({
            type: 'organisation',
            useActualId: true,
            url: url
        });

        form.forms({
            validate : function(form, config) {
                var selectedRoles = form.find("input[name=group]:checked");
                if( selectedRoles.length == 0) {
                    return {
                        error: 1,
                        errorFields: ["Roles"],
                        errorMessages: ['Please select at least one role']
                    };
                } else {
                    return true;
                }
            },
            onSuccess: function (resp) {
                if (resp.status) {
                    modal.modal('hide');
                    Msg.info('Processing...');
                    setTimeout(function () {
                        $('#teamTable').reloadFragment({
                            whenComplete: function (resp) {
                                Msg.success('Member added');
                            }
                        });
                    }, 800);
                }
            }
        });

        $('body').on('hidden.bs.modal', '#modal-add-member', function () {
            form.trigger('reset');
        });
    }

    function initSelectPicker() {
        $('.selectpicker').selectpicker({
        });
    }

    var searchOpts = {};
    function initSearch() {
        var timer;

        $('#team-members-query').on('input', function () {
            clearTimeout(timer);
            searchOpts.q = this.value;
            timer = setTimeout(doSearch, 500);
        });

        $('#rolesFilter').on('change', function () {
            searchOpts.role = this.value;
            clearTimeout(timer);
            timer = setTimeout(doSearch, 500);
        });

        $('#teamFilters').on('change', function () {
            searchOpts.team = this.value;
            clearTimeout(timer);
            timer = setTimeout(doSearch, 500);
        })

    }

    function doSearch() {
        var uri = new URI(window.location.pathname);
        for (var key in searchOpts) {
            uri.setSearch(key, searchOpts[key]);
        }

        history.pushState(null, document.title, uri.toString());

        $('#searchResults').reloadFragment({
            url: uri.toString(),
            whenComplete: function (resp) {
            }
        })
    }

    function initCreateTeam() {
        var modal = $('#modal-add-team');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                if (resp && resp.status) {
                    modal.modal('hide');
                    $('#teamFilters').reloadFragment({
                        whenComplete: function () {
                            $('.selectpicker').selectpicker('refresh');
                        }
                    });
                    Msg.success('Team added');
                }
            }
        });
    }

    function initTeamMemberForm() {
        var form = $('#teamMemberDetails');
        if (form.length) {
            form.forms({
                onSuccess: function (resp) {
                    if (resp && resp.status) {
                        Msg.success("Updated");
                    }
                }
            })
        }
    }

    function initDeleteTeams() {
        $("body").on("click", ".btn-teams-delete", function (e) {
            e.preventDefault();
            var btn = (e.target).closest("button");
            var container = $(btn.closest(".teams-list-container"));
            flog("delete teams", btn, container);

            var ids = [];

            container.find('input[name=memberId]:checked').each(function (i, item) {
                var id = $(item).val();
                ids.push(id);
            });

            if (ids.length < 1) {
                Msg.info('Please select at least one member to delete');
            } else {
                if( confirm('You want to delete ' + ids.length + ' member' + (ids.length > 1 ? 's' : '') + '?', '') )  {
                    $.ajax({
                        type: 'POST',
                        url: window.location.pathname,
                        data: {
                            toRemoveTeamIds: ids
                        },
                        datatype: "json",
                        success: function (data) {
                            if (data.status) {
                                container.reloadFragment();
                                Msg.info('Successfully deleted ' + ids.length + ' member' + (ids.length > 1 ? 's' : ''));
                            } else {
                                Msg.error("Sorry, an error occured deleting the members " + data.messages);
                            }
                        },
                        error: function (resp) {
                            Msg.error("An error occured deleting teams");
                        }
                    });
                }
            }
        });
    }

    $(function () {
        initCreateMemberForm();
        initCreateTeam();
        initSelectPicker();
        initSearch();
        initTeamMemberForm();
        initDeleteTeams();
    });

})(jQuery);