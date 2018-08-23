(function ($) {
    function initCreateMemberForm() {
        var modal = $('#modal-add-member');
        var form = modal.find('form');

        form.find('#teamFinder').entityFinder({
            type: 'organisation',
            useActualId: true,
            url : '/leads/'
        });

        form.forms({
            onSuccess: function (resp) {
                if (resp.status) {
                    modal.modal('hide');
                    $('#teamTable').reloadFragment();
                    Msg.success('Member added');
                } else {

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

    $(function () {
        initCreateMemberForm();
        initCreateTeam();
        initSelectPicker();
        initSearch();
    });

})(jQuery);