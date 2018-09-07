(function ($) {
    function initCreateMemberForm() {
        var modal = $('#modal-add-member');
        var form = modal.find('form');
        var teamOrgType = form.find('#teamFinder').attr('data-team-orgtype');
        var url = '/leads/';
        if (teamOrgType){
            url += '?' + $.param({orgType: teamOrgType});
        }
        form.find('#teamFinder').entityFinder({
            type: 'organisation',
            useActualId: true,
            url : url
        });

        form.forms({
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

    function initSelectPicker(){
        $('.selectpicker').selectpicker({

        });
    }

    var searchOpts = {};
    function initSearch(){
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

    function doSearch(){
        var uri = new URI(window.location.pathname);
        for(var key in searchOpts){
            uri.setSearch(key, searchOpts[key]);
        }

        history.pushState(null, document.title, uri.toString());

        $('#searchResults').reloadFragment({
            url: uri.toString(),
            whenComplete: function (resp) {
            }
        })
    }

    function initCreateTeam(){
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

    function initTeamMemberForm(){
        var form = $('#teamMemberDetails');
        if (form.length){
            form.forms({
                onSuccess: function (resp) {
                    if (resp && resp.status){
                        Msg.success("Updated");
                    }
                }
            })
        }
    }

    $(function () {
        initCreateMemberForm();
        initCreateTeam();
        initSelectPicker();
        initSearch();
        initTeamMemberForm();
    });

})(jQuery);