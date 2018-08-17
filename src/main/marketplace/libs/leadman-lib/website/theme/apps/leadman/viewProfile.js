/**
 * Created by Anh on 8/15/2016.
 */
function initNewProfileLeadForm() {
    var modal = $('#newLeadProfileModal');
    var form = modal.find('form');

    $(".createProfileLead").click(function (e) {
        flog("click");
        e.preventDefault();
        var funnelName = $(e.target).closest("a").attr("href");
        form.find("select").val(funnelName);
        modal.modal("show");
    });

    form.forms({
        onSuccess: function (resp) {
            flog('done new user', resp);
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            }
            Msg.info('Saved');
            modal.modal("hide");
        }
    });
}

function initDeleteCustomer() {
    function showSweetAlert(option) {
        swal({
            title: option.title || 'Are you sure?',
            text: option.message,
            type: option.type || 'warning',
            showCancelButton: true,
            confirmButtonClass: option.btnClass,
            confirmButtonText: option.btnText,
            closeOnConfirm: true,
            showLoaderOnConfirm: false
        }, typeof option.callback === 'function' ? option.callback : null);
    }

    function removeCustomer() {
        $.ajax({
            url: window.location.href,
            method: "DELETE",
            dataType: "json",
            success: function (data) {
                Msg.success('Customer removed successfully');
                window.location.href = "/custs";
            }
        });
    }

    $(".deleteCustomer").click(function (e) {
        flog("click deleteCustomer");
        e.preventDefault();
        var option = {
            title: "Are you sure you want to remove this customer?",
            message: "",
            type: 'warning',
            btnClass: 'btn-danger',
            btnText: "Remove",
            callback: removeCustomer
        };
        showSweetAlert(option);
    });
}

function initAssignOrg() {
    var modal = $('#assignOrgModal');
    var form = modal.find('form');

    form.forms({
        onSuccess: function (resp) {
            modal.modal('hide');
            form.trigger('reset');
            Msg.success(resp.messages);
            $('#company-body').reloadFragment();
        },
        onError: function () {

        }
    });

    var orgSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/leads?orgSearch=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#orgTitleSearchContactPage').typeahead({
        highlight: true
    }, {
        display: 'title',
        limit: 10,
        source: orgSearch,
        templates: {
            empty: [
                '<div class="empty-message">',
                'No existing companies were found.',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile(
                    '<div>'
                    + '<strong>{{title}}</strong>'
                    + '</br>'
                    + '<span>{{phone}}</span>'
                    + '</br>'
                    + '<span>{{address}}, {{addressLine2}}, {{addressState}}, {{postcode}}</span>'
                    + '</div>')
        }
    });

    $('#orgTitleSearch').bind('typeahead:select', function (ev, sug) {
        var inp = $(this);
        var form = inp.closest('form');

        form.find('input[name=email]').val(sug.email);
        form.find('input[name=phone]').val(sug.phone);
        form.find('input[name=address]').val(sug.address);
        form.find('input[name=addressLine2]').val(sug.addressLine2);
        form.find('input[name=addressState]').val(sug.state);
        form.find('input[name=postcode]').val(sug.postcode);
        form.find('input[name=orgId]').val(sug.orgId);
    });

    $('#orgTitleSearch').on({
        input: function () {
            var form = $(this).closest('form');
            if (!this.value) {
                form.find('input[name=email]').val('');
                form.find('input[name=phone]').val('');
                form.find('input[name=address]').val('');
                form.find('input[name=addressLine2]').val('');
                form.find('input[name=addressState]').val('');
                form.find('input[name=postcode]').val('');
                form.find('input[name=orgId]').val('');
            }
        }
    });

    $('body').on('click', '.removeMembership', function (e) {
        e.preventDefault();

        var btn = $(this);
        var mId = btn.data('mid');

        if (confirm('Are you sure you want to remove this company?')) {
            $.ajax({
                type: 'POST',
                data: {
                    removeMembership: true,
                    mId: mId
                },
                success: function (data, textStatus, jqXHR) {
                    $('#company-body').reloadFragment();
                }
            });
        }
    });
}

// function initTableProfileLeads() {
//     if ($('#tableProfileLeads').length){
//         $('#tableProfileLeads').DataTable({
//             paging: false,
//             searching: false,
//             destroy: true,
//             info: false,
//             initComplete: function(settings, json) {
//                 $('#tableProfileLeads').closest('.row').siblings('.row').remove();
//             }
//         });
//     }
// }
//
// $(function () {
//     initTableProfileLeads();
// })