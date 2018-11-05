function initManageRepos() {
    log('initManageRepositories');

    $('#txt-search-repo').domFinder({
        container: $('#table-repo'),
        items: 'tbody tr',
        showItems: function (items) {
            items.css('display', '');
        }
    });

    var tableWrapper = $('#table-repo');

    var modal = $('#modal-new-repo');
    $('.btn-add-repo').on('click', function(e) {
        e.preventDefault();

        $('#repoModal').text("Add new repository");
        $('#updateRepo').val("");
        $('#newName').val("");

        modal.modal('show');
    });

    addEventToUpdate(modal);

    modal.find('form').forms({
        onSuccess: function(resp) {
    		if ($('#updateRepo').val() == '') {
    			Msg.success($('#newName').val() + ' is created!');
    		} else {
    			Msg.success($('#newName').val() + ' is updated!');
    		}
    		tableWrapper.reloadFragment({
    			whenComplete: function () {
    				initSwitch();
    				addEventToUpdate(modal);
    			}
    		});
    		modal.modal('hide');
    	}
    });

    tableWrapper.on('click', 'a.btn-delete-repo', function(e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');
        var name = getFileName(href);

        confirmDeleteRepo(href, name, function() {
            Msg.success('Repository "' + name + '" deleted');
            btn.closest('tr').remove();
        });
    });

    tableWrapper.on('click', 'a.transfer-ownership', function(e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');
        var name = getFileName(href);

        var destAdminDomain = prompt("Please enter the admin domain to transfer this repository to");
        if( destAdminDomain !== null ) {
            if( confirm("Are you sure you want to transfer ownership of the " + name + " repository? This action cannot be undone") ) {
                doTransferOwnership( href, destAdminDomain);
            }
        }
    });

    flog("init switch", $('td.public input'));
    $('td.public input').on('change switchChange', function(e) {
        flog("switch", e.target);
        e.preventDefault();

        var label = $(this);
        var wrapper = label.parents('.make-switch');

        setTimeout(function() {
            var isChecked = wrapper.find('input:checked').val() === 'true';
            flog("checked=", isChecked);
            var href = wrapper.closest("tr").find("a.repo").attr("href");
            setRepoPublicAccess(href, isChecked);
        }, 0);
    });
}

function addEventToUpdate(modalUpdate) {
    $('.btn-update-repo').on('click', function(e) {
        e.preventDefault();

        $('#repoModal').text("Update repository");
        $('#updateRepo').val(e.target.name);
        $('#newName').val(e.target.name);

        modalUpdate.modal('show');
    });
}

function confirmDeleteRepo(href, name, callback) {
    if (confirm('Are you sure you want to delete repository ' + name + '? WARNING: This action cannot be undone')) {
        deleteRepo(href, name, callback);
    }
}

function deleteRepo(href, name, callback) {
    $.ajax({
        type: 'POST',
        data: {delete: "true"},
        url: href,
        success: function(data) {
            callback();
        },
        error: function(resp) {
            flog("error deleting: ", href, resp);
            Msg.error('Sorry, couldnt delete: ' + name);
        }
    });
}

function doTransferOwnership(href, destAdminDomain) {
    $.ajax({
        type: 'POST',
        data: {destAdminDomain: destAdminDomain},
        url: href,
        success: function(data) {
            alert("Ownership has been transferred");
            window.location.reload();
        },
        error: function(resp) {
            flog("error updating: ", href, resp);
            Msg.error('Sorry, couldnt update public access: ' + resp);
            window.location.reload();
        }
    });
}
