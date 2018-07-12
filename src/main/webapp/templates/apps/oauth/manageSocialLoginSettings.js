(function ($) {
    // Init add Login Provider
    function initLoginProviderModal() {
        var addProviderModal = $('#add-oauth-provider');
        var form = addProviderModal.find('form');

        form.forms({
            onSuccess: function (resp) {
                if (resp.status) {
                    $('#oauthproviders').reloadFragment();
                    addProviderModal.modal('hide');

                    Msg.success(resp.messages);
                } else {
                    Msg.warning(resp.messages);
                }
            }
        });

        $('body').on('change', '.sel-template', function (e) {
            e.preventDefault();

            var btn = $(this);
            var val = btn.val();

            var template = oauth2Templates[val];

            if (template === null || typeof template === 'undefined') {
                addProviderModal.find('form').trigger('reset');
            } else {
                addProviderModal.find('input[name=providerId]').val(template.providerId);
                addProviderModal.find('select[name=providerType]').val(template.providerTypeId);
                addProviderModal.find('select[name=tokenType]').val(template.tokenType);
                addProviderModal.find('input[name=clientId]').val(template.clientId);
                addProviderModal.find('input[name=clientSecret]').val(template.clientSecret);
                addProviderModal.find('input[name=authLocation]').val(template.authLocation);
                addProviderModal.find('input[name=tokenLocation]').val(template.tokenLocation);
                addProviderModal.find('input[name=profileLocation]').val(template.profileLocation);
                addProviderModal.find('input[name=redirectURI]').val(template.redirectURI);
                addProviderModal.find('input[name=accountId]').val(template.accountId);
                if (template.permissionScopes) {
                    addProviderModal.find('textarea[name=permissionScopes]').val(template.permissionScopes.join(','));
                }
                addProviderModal.find('input[name=displayNamePath]').val(template.displayNamePath);

            }
        });
    }

    function initAddLoginProvider() {
        $('body').on('click', '.btn-add-provider', function (e) {
            e.preventDefault();

            showProviderModal(null, 'add', 'Add a new OAuth2 Provider');
        });
    }

    function initEditLoginProvider() {
        $('body').on('click', '.btn-edit-provider', function (e) {
            e.preventDefault();

            var btn = $(this);
            var selectedProv = btn.closest("div.row");
            var jsonText = selectedProv.data('json');
            flog(jsonText);

            showProviderModal(jsonText, 'edit', 'Edit ');
        });
    }

    function initDeleteLoginProvider() {
        $('body').on('click', '.btn-delete-provider', function (e) {
            e.preventDefault();

            var btn = $(this);
            var providerId = btn.data('id');
            Kalert.confirm('You want to delete ' + providerId + '?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    url: window.location.pathname,
                    data: {
                        providerAction: 'delete',
                        providerId: providerId
                    },
                    dataType: 'json',
                    success: function (result) {
                        Msg.info(result.messages);
                        $('#oauthproviders').reloadFragment();
                    }
                });
            });
        });
    }

    function showProviderModal(data, type, title) {
        var add_provider_modal = $('#add-oauth-provider');

        if (data === null || typeof data === 'undefined') {
            add_provider_modal.find('form').trigger('reset');
        } else {
            add_provider_modal.find('input[name=providerId]').val(data.providerId);
            add_provider_modal.find('select[name=providerType]').val(data.providerTypeId);
            add_provider_modal.find('select[name=tokenType]').val(data.OAuth2AccessTokenType);
            add_provider_modal.find('input[name=clientId]').val(data.clientId);
            add_provider_modal.find('input[name=clientSecret]').val(data.clientSecret);
            add_provider_modal.find('input[name=authLocation]').val(data.authLocation);
            add_provider_modal.find('input[name=tokenLocation]').val(data.tokenLocation);
            add_provider_modal.find('input[name=profileLocation]').val(data.profileLocation);
            add_provider_modal.find('input[name=displayNamePath]').val(data.displayNamePath);
            add_provider_modal.find('input[name=redirectURI]').val(data.redirectURI);
            add_provider_modal.find('input[name=accountId]').val(data.accountId);
            if (data.permissionScopes) {
                add_provider_modal.find('textarea[name=permissionScopes]').val(data.permissionScopes.join(','));
            }
        }

        add_provider_modal.find('input[name=providerAction]').val(type);
        add_provider_modal.find('.modal-title').html(title);

        if (type === 'add') {
            add_provider_modal.find('button[data-type=form-submit]').text('Add Provider');
        } else if (type === 'edit') {
            add_provider_modal.find('input[name=origProviderId]').val(data.providerId);
            add_provider_modal.find('button[data-type=form-submit]').text('Save Provider');
        }

        add_provider_modal.modal('show');
    }

    function initAddSocialPoster() {
        var form = $('#social-logins-add-poster-form');

        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);
                form.trigger('reset');
                $('#socialPosters-table').reloadFragment();
            }
        });
    }

    function initDeleteSocialPoster() {
        $('body').on('click', '.btn-delete-poster', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var title = row.data('title');
            var id = row.data('id');

            Kalert.confirm('You want to delete ' + title + '?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        deletePosterService: id
                    },
                    success: function (resp) {
                        if (resp.status) {
                            Msg.success(resp.messages);
                            $('#socialPosters-table').reloadFragment();
                        } else {
                            Msg.warning(resp.messages);
                        }
                    },
                    error: function () {
                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        });
    }

    function initEditPosterSettings() {
        var modal = $('#modal-social-poster-edit');
        var form = modal.find('form');

        $('body').on('click', '.btn-edit-poster', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var id = row.data('id');
            var title = row.data('title');

            var json = btn.data('fields');
            var settings = btn.data('settings');

            form.find('[name=editPosterSettings]').val(true);
            form.find('[name=posterId]').val(id);
            form.find('.poster-title').text(title);

            var inputFields = [];

            for (var i in json) {
                var val = '';
                if (settings.hasOwnProperty(i)) {
                    val = settings[i];
                }
                inputFields.push(
                        '<div class="form-group">' +
                        '  <label for="settings_' + i + '" class="col-sm-2 control-label">' + json[i] + '</label>' +
                        '  <div class="col-sm-10">' +
                        '    <input type="text" class="form-control" id="settings_' + i + '" name="' + i + '" placeholder="' + json[i] + '" value="' + val + '">' +
                        '  </div>' +
                        '</div>');
            }

            form.find('.modal-body').empty().append(inputFields);

            modal.modal('show');
        });

        form.forms({
            onSuccess: function (resp) {
                modal.modal('hide');
                form.trigger('reset');
                Msg.success(resp.messages);
            }
        });
    }

    // Run init files
    $(function () {
        initLoginProviderModal();
        initAddLoginProvider();
        initEditLoginProvider();
        initDeleteLoginProvider();

        initAddSocialPoster();
        initDeleteSocialPoster();
        initEditPosterSettings();
    });
})(jQuery);