(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($, undefined) {
    var DEFAULTS = {
        btnClass: 'btn btn-success',
        btnOkClass: 'btn btn-sm btn-primary',
        modalTitle: 'Select file',
        contentType: null,
        excludedEndPaths: ['.mil/'],
        basePath: '/',
        pagePath: window.location.pathname,
        zIndex: null,
        showModal: function (modal) {
            modal.modal('show');
        },
        onSelectFile: function (selectedUrl, selectedRelUrl, type, hash, isAsset) {
        },
        onSelectFolder: function (selectedUrl, selectedRelUrl) {

        },
        onPreviewFile: function (type, selectedUrl, hash) {
        },
        onReady: function () {

        },
        useModal: true,
        useCrop: true,
        showAssets: true,
        showFiles: true,
        forceHideFiles: false,
        forceHideAssets: false
    };

    function MSelect(target, options) {
        $.getStyleOnce('/theme/apps/mselect-lib/jquery.mselect.css');
        this.target = target;
        this.options = $.extend({}, DEFAULTS, options);
        this.init();
    }

    MSelect.prototype.init = function () {
        var self = this;
        var options = self.options;
        var target = self.target;

        flog('[MSelect] Initializing mselect', target);

        var editorPageBody = $('.content-editor-page');
        if (!editorPageBody.length) {
            editorPageBody = $('.edm-editor-page');
        }
        var uploadProviders = editorPageBody.find('>.uploadProviders').val();
        if (uploadProviders) {
            options.showFiles = false;
            options.showAssets = false;

            uploadProviders = uploadProviders.split(',');
            if (uploadProviders.indexOf('files') !== -1) {
                options.showFiles = true;
            }
            if (uploadProviders.indexOf('assets') !== -1) {
                options.showAssets = true;
            }
        } else {
            options.showFiles = true;
            options.showAssets = true;
        }

        if (options.forceHideFiles){
            options.showFiles = false;
        }

        if (options.forceHideAssets){
            options.showAssets = false;
        }

        if (options.useModal) {
            flog('[MSelect] Initializing button and modal...', target);

            self.getModal();
            target.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                options.showModal(self.modal);

                if (options.zIndex) {
                    self.modal.css('z-index', options.zIndex + 1).siblings('.modal-backdrop').last().css('z-index', options.zIndex);
                }
            });
        } else {
            flog('[MSelect] Initializing mselect container only', target);

            target.html(self.getSelectContainer());
            self.initSelectContainer(target);
        }

        flog('[MSelect] Initialized mselect');
    };

    MSelect.prototype.getModal = function () {
        var self = this;
        var options = self.options;
        var modalId = 'modal-milton-file-select-' + (new Date()).getTime();

        var modal = $(
                '<div id="' + modalId + '" class="modal modal-mselect fade" aria-hidden="true" tabindex="-1" data-backdrop="static" data-keyboard="false">' +
                '   <div class="modal-dialog modal-lg">' +
                '       <div class="modal-content">' +
                '           <div class="modal-header">' +
                '               <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
                '               <h4 class="modal-title">' + options.modalTitle + '</h4>' +
                '           </div>' +
                '           <div class="modal-body">' + self.getSelectContainer() + '</div>' +
                '           <div class="modal-footer">' +
                '               <button class="' + options.btnOkClass + ' btn-ok" type="button"> OK </button>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>'
                );

        $(document.body).append(modal);

        self.initSelectContainer(modal, function () {
            modal.modal('hide');
        });

        self.modal = modal;
    };

    MSelect.prototype.selectFile = function (hash, callback) {
        var self = this;
        var target = self.target;
        var tree = target.find('div.milton-tree-wrapper');
        try {
            tree.mtree('select', tree.find('[data-hash="' + hash + '"]'), callback);
        } catch (e) {
        }
    }

    MSelect.prototype.updateOption = function (key, value) {
        this.options[key] = value;
    }

    MSelect.prototype.getExtension = function (filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }

    MSelect.prototype.isImage = function (filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
                //etc
                return true;
        }
        return false;
    };

    MSelect.prototype.isVideo = function (filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'm4v':
            case 'avi':
            case 'mpg':
            case 'mp4':
                // etc
                return true;
        }
        return false;
    };

    MSelect.prototype.isAudio = function (filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            // Since jwplayer supports mp3, aac and Vorbis
            case 'mp3':
            case 'aac':
            case 'ogg':
            case 'oga':
                // etc
                return true;
        }
        return false;
    };

    MSelect.prototype.getFileType = function (fileUrl, isFormat) {
        // Remove '/_DAV/....' before checking file type
        fileUrl = (fileUrl || '').replace(/^(.+)(\/_DAV\/.+)$/, '$1')
        flog('[MSelect] getFileType', fileUrl, isFormat);

        var fileType = 'other';

        if (isFormat) {
            var indexOfSlash = fileUrl.indexOf('/');
            if (indexOfSlash !== -1) {
                fileType = fileUrl.substr(0, indexOfSlash);
            } else {
                fileType = fileUrl;
            }
        } else {
            if (this.isVideo(fileUrl)) {
                fileType = 'video';
            } else if (this.isImage(fileUrl)) {
                fileType = 'image';
            } else if (this.isAudio(fileUrl)) {
                fileType = 'audio';
            } else if( fileUrl.endsWith('.html')) {
                fileType = 'html';
            }
        }


        return fileType;
    };

    MSelect.prototype.getAcceptedFile = function (contentType) {
        return contentType + '/*';
    };

    MSelect.prototype.getCleanUrl = function (url) {
        return (url || '').replace(/\/\//g, '/');
    };

    MSelect.prototype.initTreeContainer = function (container) {
        flog('[MSelect] initTreeContainer', container);

        var self = this;
        var options = self.options;

        var treeContainer = self.treeContainer;
        var progressBar = self.progressBar;
        var progressBarInner = self.progressBarInner;
        var previewContainer = self.previewContainer;
        var btnUploadFile = self.btnUploadFile;

        var mtreeOptions = {
            basePath: options.basePath,
            pagePath: options.pagePath,
            includeContentType: options.contentType,
            excludedEndPaths: options.excludedEndPaths,
            showAssets: options.showAssets,
            showFiles: options.showFiles,
            onSelect: function (node, type, selectedUrl, hash, isAsset) {
                flog('[MSelect] Select node', node, selectedUrl, hash, isAsset);

                if (!isAsset) {
                    var selectFolder = this.getSelectedFolderUrl();
                    var newUrl = options.basePath + selectFolder;
                    flog('[MSelect] setUrl', selectFolder, options.basePath);
                    btnUploadFile.mupload('setUrl', newUrl);
                }

                var fileType = self.getFileType(selectedUrl);
                if (isAsset) {
                    fileType = self.getFileType(node.attr('data-format'), true);
                }

                var previewUrl = isAsset ? selectedUrl : '/_hashes/files/' + hash;
                flog('[MSelect] File type="' + fileType + '"');

                progressBar.show();
                progressBarInner.html('Loading...');
                container.find('.btn-edit-image').hide();
                previewContainer.attr({
                    'data-file-type': fileType,
                    'data-hash': (isAsset ? '' : hash),
                    'data-uniqueid': (isAsset ? hash : ''),
                    'data-url': selectedUrl
                });

                switch (fileType) {
                    case 'video':
                        previewContainer.html('<img class="jp-video" />');
                        window.buildJWPlayer(previewContainer.find('img.jp-video'), 100, previewUrl, previewUrl + '/alt-640-360.png');

                        if (typeof options.onPreviewFile === 'function') {
                            options.onPreviewFile.call(container, fileType, selectedUrl, hash);
                        }
                        progressBar.hide();
                        break;

                    case 'audio':
                        previewContainer.html('<div class="jp-audio" style="padding: 15px"><div id="kaudio-player-100" /></div>');
                        window.buildJWAudioPlayer(100, previewUrl, false);

                        if (typeof options.onPreviewFile === 'function') {
                            options.onPreviewFile.call(container, fileType, selectedUrl, hash);
                        }
                        progressBar.hide();
                        break;

                    case 'image':
                        container.find('.btn-edit-image').show();

                        $('<img />').attr('src', previewUrl).on('load', function () {
                            var realWidth = this.width;
                            var realHeight = this.height;
                            var ratio = realWidth / realHeight;

                            previewContainer.html('<img src="' + previewUrl + '" data-real-width="' + realWidth + '" data-real-height="' + realHeight + '" data-ratio="' + ratio + '" />');

                            if (typeof options.onPreviewFile === 'function') {
                                options.onPreviewFile.call(container, fileType, selectedUrl, hash);
                            }
                            progressBar.hide();
                        });
                        break;

                    default:
                        if( fileType == "html" || type == "folder") {
                            flog("show folder previoew", fileType, type, selectedUrl);
                            previewContainer.html('<iframe src="' + selectedUrl + '" style="width: 100%; height: 100%; border: 0" />');
                            if (typeof options.onPreviewFile === 'function') {
                                options.onPreviewFile.call(container, fileType, selectedUrl, hash);
                            }
                        } else {
                            flog("unsupported file type", fileType, type, selectedUrl);
                            previewContainer.html('<div class="alert alert-warning">Unsupported preview file</div>');
                        }
                        progressBar.hide();
                }

            }
        };

        if (options.showAssets && options.showFiles) {
            mtreeOptions.onTabSwitch = function (tabType) {
                if (tabType === 'assets') {
                    self.btnUploadAsset.show();
                    self.btnUploadFile.hide();
                } else {
                    self.btnUploadAsset.hide();
                    self.btnUploadFile.show();
                }
            }
        }

        self.mtree = treeContainer.mtree(mtreeOptions);
    };

    MSelect.prototype.initUploadButtons = function () {
        var self = this;
        var options = self.options;

        var progressBar = self.progressBar;
        var progressBarInner = self.progressBarInner;

        var muploadOptions = {
            url: options.basePath,
            buttonText: '<i class="fa fa-upload"></i>',
            buttonSize: 'btn-sm',
            oncomplete: function (data, name, href) {
                flog('[MSelect] oncomplete', data);
                progressBar.hide();
                self.mtree.addNode(href, name);
            },
            onBeforeUpload: function () {
                progressBar.show();
                progressBarInner.html('Uploading...');
            }
        };

        if (options.contentType) {
            muploadOptions.acceptedFiles = self.getAcceptedFile(options.contentType);
        }

        if (options.showFiles) {
            self.btnUploadFile.mupload(muploadOptions);
        }

        if (options.showAssets) {
            muploadOptions.url = '/assets/';
            self.btnUploadAsset.mupload(muploadOptions);
        }
    };

    MSelect.prototype.initSelectContainer = function (container, onOk) {
        flog('[MSelect] initSelectContainer', container);

        var self = this;
        var options = self.options;

        options.basePath = self.getCleanUrl(options.basePath);
        options.pagePath = self.getCleanUrl(options.pagePath);

        var treeContainer = self.treeContainer = container.find('div.milton-tree-wrapper');
        var progressBar = self.progressBar = container.find('.milton-file-progress');
        var progressBarInner = self.progressBarInner = progressBar.find('.progress-bar');
        var previewContainer = self.previewContainer = container.find('.milton-file-preview');

        var btnUploadFile = self.btnUploadFile = container.find('.milton-btn-upload-file');
        var btnUploadAsset = self.btnUploadAsset = container.find('.milton-btn-upload-asset');

        self.initTreeContainer(container);
        self.initUploadButtons(container);

        if (options.showAssets && options.showFiles) {
            btnUploadFile.show();
        } else {
            if (options.showFiles) {
                btnUploadFile.show();
            }

            if (options.showAssets) {
                btnUploadAsset.show();
            }
        }

        container.find('.btn-ok').click(function () {
            var url = previewContainer.attr('data-url');
            var hash = previewContainer.attr('data-hash');
            var uniqueId = previewContainer.attr('data-uniqueid');

            if (url) {
                if (typeof options.onSelectFile === 'function') {
                    var isAssets = !hash;
                    var fileType = previewContainer.attr('data-file-type');
                    var relUrl = isAssets ? url : url.substring(options.basePath.length, url.length);
                    flog('[MSelect] Selected', url, relUrl);

                    options.onSelectFile.call(container, url, relUrl, fileType, isAssets ? uniqueId : hash, isAssets);
                }

                if (typeof options.onSelectFolder === 'function') {
                    options.onSelectFolder.call(container, url, hash);
                }

                if (typeof onOk === 'function') {
                    onOk.call(this);
                }
            } else {
                flog('[MSelect] No selected file! 1');
            }
        });

        self.initEditZone(container);

        if (typeof options.onReady === 'function') {
            options.onReady.call(self);
        }
    };

    MSelect.prototype.initEditZone = function (container) {
        flog('[MSelect] initEditZone', container);

        var self = this;
        var options = self.options;
        var btnEditImage = container.find('.btn-edit-image');
        var mselectModal;
        if (options.useModal) {
            mselectModal = container;
        }
        if (!mselectModal) {
            mselectModal = $('.modal-mselect');
        }

        var photoEditor = btnEditImage.photoEditor({
            modalSize: 'modal-lg',
            modalAuto: false,
            btnCancelText: 'Back to Upload',
            onModalShow: function () {
                if (mselectModal && mselectModal.length > 0) {
                    mselectModal.modal('hide');
                }
            },
            onModalShown: function () {
                var hash = self.previewContainer.attr('data-hash');
                var uniqueId = self.previewContainer.attr('data-uniqueid');
                this.setImage(hash ? '/_hashes/files/' + hash : '/assets/' + uniqueId);
            },
            onCancel: function () {
                if (mselectModal && mselectModal.length > 0) {
                    mselectModal.modal('show');
                }
            },
            onSave: function (data) {
                flog('onSave photoeditor', data);

                var editModal = this.modal;
                var btns = editModal.find('.btn');
                btns.prop('disabled', true);

                var ajaxOptions = {
                    url: '/mselect-lib/storeImage',
                    type: 'post',
                    dataType: 'json',
                    success: function (resp) {
                        if (resp && resp.status) {
                            if (typeof self.options.onSelectFile === 'function') {
                                var url = '/_hashes/files/' + resp.hash;
                                self.previewContainer.attr({
                                    'data-uniqueid': '',
                                    'data-hash': resp.hash,
                                    'data-url': url
                                });

                                $('<img />').attr('src', url).on('load', function () {
                                    var realWidth = this.width;
                                    var realHeight = this.height;
                                    var ratio = realWidth / realHeight;

                                    self.previewContainer.html('<img src="' + url + '" data-real-width="' + realWidth + '" data-real-height="' + realHeight + '" data-ratio="' + ratio + '" width="' + realWidth + '" height="' + realHeight + '" />');

                                    if (typeof options.onPreviewFile === 'function') {
                                        options.onPreviewFile.call(container, 'image', url, resp.hash);
                                    }

                                    self.options.onSelectFile.call(container, url, url, 'image', resp.hash, false);
                                });
                            }
                            editModal.modal('hide');
                        } else {
                            flog('Error when saving image', resp);
                            Msg.error('Error when saving image. Please contact your administrators to resolve this issue')
                        }

                        btns.prop('disabled', false);
                    },
                    error: function (jqXhr, textStatus, errorThrow) {
                        flog('Error when saving image', jqXhr, textStatus, errorThrow);
                        Msg.error('Error when saving image. Please contact your administrators to resolve this issue')
                        btns.prop('disabled', false);
                    }
                };

                var ajaxData;
                if (data.croppedImageBlob) {
                    ajaxData = new FormData();
                    ajaxData.append('file', data.croppedImageBlob);

                    ajaxOptions.processData = false;
                    ajaxOptions.contentType = false;
                } else {
                    ajaxData = {
                        file: data.croppedImage
                    };
                }
                ajaxOptions.data = ajaxData;

                $.ajax(ajaxOptions);
            }
        });

        btnEditImage.on('click', function (e) {
            e.preventDefault();

            var url = self.previewContainer.attr('data-url');

            if (url) {
                photoEditor.showModal();
            } else {
                flog('[MSelect] No selected file! 2');
            }
        });
    };

    MSelect.prototype.getSelectContainer = function () {
        var self = this;
        var options = self.options;
        var extraElement = '';

        if (options.useCrop) {
            extraElement += '<button type="button" class="btn btn-primary btn-sm btn-edit-image" title="Edit image" style="display: none;"><i class="fa fa-edit"></i></button>';
        }

        if (!options.useModal) {
            extraElement += '<button type="button" class="btn btn-primary btn-sm btn-ok"><i class="fa fa-check"></i></button>';
        }

        return (
                '<div class="milton-file-select-container">' +
                '    <div class="row">' +
                '        <div class="col-xs-3"><div class="milton-tree-wrapper"></div></div>' +
                '        <div class="col-xs-9">' +
                '            <div class="milton-file-preview-wrapper">' +
                '                ' + (options.showAssets ? '<div class="milton-btn-upload-asset" style="display: none;"></div>' : '') +
                '                ' + (options.showFiles ? '<div class="milton-btn-upload-file" style="display: none;"></div>' : '') +
                '                ' + extraElement +
                '                <div class="milton-file-progress progress" style="display: none;">' +
                '                    <div class="progress-bar progress-bar-info progress-bar-striped active" style="width: 100%"></div>' +
                '                </div>' +
                '                <div class="milton-file-preview panel panel-default"></div>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
                );
    };

    MSelect.DEFAULTS = DEFAULTS;

    $.fn.mselect = $.fn.mselectAll = function (options) {
        var element = $(this)
        var data = element.data('mselect');

        if (!data) {
            element.data('mselect', (data = new MSelect(element, options)));
        }

        if (typeof options == 'string') {
            return data[options].apply(data, Array.prototype.slice.call(arguments, 1));
        } else {
            return data;
        }
    };

    $.fn.mselect.constructor = MSelect;

    $(function () {
        $(document.body).on('shown.bs.modal', '.modal-mselect', function () {
            var modal = $(this);
            var modalHeader = modal.find('.modal-header');
            var modalBody = modal.find('.modal-body');
            var modalFooter = modal.find('.modal-footer');

            modalBody.height('calc(100% - ' + modalHeader.outerHeight() + 'px - ' + modalFooter.outerHeight() + 'px');

            var mtreeWrapper = modal.find('.milton-tree-wrapper');
            if (mtreeWrapper.length > 0) {
                mtreeWrapper.data('mtree').adjustTabHeight();
            }
        });
    });
}));
