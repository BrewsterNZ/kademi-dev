function initManageCertificates() {
    flog('initManageCertificate: ');
    initCertificateController();
    initModalCertificate();
}

function initManageCertificateDetails(certId) {
    flog('initManageCertificate: ', certId);
    themeCssFiles.push('/templates/apps/learner/certificate.dyn.css?imageHash=' + certId);
    
    edify($('.manage-certificate-details'),
        function(resp) {
            flog('done', resp);
            Msg.success('Saved ok');
        },
        function(form) {
            var content = $('#editContent');
            flog('validate', form, content, content.val());
            if( content.val().trim() == '') {
                Msg.error('Please enter some content for the certificate');
                return false;
            }
            return true;
        }
    );
                
    $('#btn-upload').mupload({
        url: window.location.pathname,
        useJsonPut: false,
        buttonText: '<i class="clip-folder"></i> New image',
        oncomplete: function(data, name, href) {
            window.location.reload();
        }
    }); 
    
}

function initModalCertificate() {
    var modal = $('#modal-add-cert');
    
    $('.btn-add-cert').on('click', function (e) {
        e.preventDefault();
        
        modal.modal('show');
    });
    
    modal.find('form').forms({
        callback: function(resp) {
            flog('done');
            window.location.href = resp.nextHref;        
            modal.modal('hide');
        }
    });
}

function initCertificateController() {
    $(document.body).on('click', '.btn-delete-cert', function(e) {
        e.preventDefault();
        var a = $(this);
        var name = a.closest('tr').find('td.name').text();
        
        flog('delete onclick', a, name);
        confirmDelete(a.attr('href'), name, function() {
            window.location.reload();
        });
    });
}