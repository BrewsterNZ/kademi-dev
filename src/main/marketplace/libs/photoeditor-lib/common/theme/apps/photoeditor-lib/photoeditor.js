(function ($, window) {
    var DEFAULTS = {
        aspectRatio: null,
        useModal: true,
        modalSize: '',
        modalAuto: true,
        btnSaveText: 'Save image',
        btnCancelText: 'Cancel',
        onSave: function () {
        
        },
        onCancel: function () {
        
        },
        onModalShow: function (modal) {
        
        },
        onModalShown: function (modal) {
        
        },
        onModalHide: function (modal) {
        
        },
        onModalHidden: function (modal) {
        
        },
        onReady: function () {
        
        },
        preview: true
    };
    
    var PhotoEditor = function (target, options) {
        this.target = target;
        this.options = $.extend({}, DEFAULTS, options);
        this.init();
    };
    
    PhotoEditor.DEFAULTS = DEFAULTS;
    
    PhotoEditor.prototype.init = function () {
        var self = this;
        var options = self.options;
        
        if (options.useModal) {
            self.getModal();
            
            if (options.modalAuto) {
                self.target.on('click', function (e) {
                    e.preventDefault();
                    
                    self.modal.modal('show');
                });
            }
        } else {
            self.target.wrap('<div class="photo-editor-wrapper clearfix"></div>');
            self.container = self.target.parent();
        }
        self.image = self.container.find('img');
        self.image.wrap('<div class="photo-editor-cropper"></div>');
        
        self.container.prepend('<div class="photo-editor-helper"></div>');
        self.helper = self.container.find('.photo-editor-helper');
        
        self.initCropZone();
        
        if (typeof options.onReady === 'function') {
            options.onReady.call(self);
        }
    };
    
    PhotoEditor.prototype.getModal = function () {
        var self = this;
        var options = self.options;
        var modalId = 'photo-editor-modal-' + (new Date()).getTime();
        
        $(document.body).append(
            '<div id="' + modalId + '" class="modal fade" tabindex="-1" >' +
            '   <div class="modal-dialog ' + options.modalSize + '">' +
            '       <div class="modal-content">' +
            '           <div class="modal-header">' +
            '               <button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '               <h4 class="modal-title">Photo Editor</h4>' +
            '           </div>' +
            '           <div class="modal-header">' +
            '               <p class="alert alert-info fade in">' +
            '                   <a class="close" href="#" data-dismiss="alert">&times;</a>' +
            '                   <i class="fa fa-info-circle"></i> Below width &amp; height are real size. If you want to reduce size of image, please change them (Ratio will be kept when changing).<br /><b>Note:</b> When you change size of crop zone, width &amp; height will be changed.' +
            '               </p>' +
            '               <div class="photo-editor-wrapper clearfix"><img src="" class="img-responsive" /></div>' +
            '           </div>' +
            '           <div class="modal-footer">' +
            '               <button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">' + options.btnCancelText + '</button>' +
            '               <button type="button" class="btn btn-primary btn-save-image">' + options.btnSaveText + '</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
        );
        
        self.modal = $('#' + modalId);
        self.container = self.modal.find('.photo-editor-wrapper');
        
        self.modal.find('.btn-save-image').on('click', function (e) {
            e.preventDefault();
            
            var data = self.getCroppedData();
            
            if (typeof options.onSave === 'function') {
                options.onSave.call(self, data);
            }
            
            if (options.modalAuto) {
                self.modal.modal('hide');
            }
        });
        
        self.modal.find('.btn-cancel').on('click', function (e) {
            e.preventDefault();
            
            if (typeof options.onCancel === 'function') {
                options.onCancel.call(self);
            }
        });
        
        self.modal.on({
            'show.bs.modal': function () {
                if (typeof options.onModalShow === 'function') {
                    options.onModalShow.call(self, self.modal);
                }
            },
            'shown.bs.modal': function () {
                if (typeof options.onModalShown === 'function') {
                    options.onModalShown.call(self, self.modal);
                }
            },
            'hide.bs.modal': function () {
                if (typeof options.onModalHide === 'function') {
                    options.onModalHide.call(self, self.modal);
                }
            },
            'hidden.bs.modal': function () {
                if (typeof options.onModalHidden === 'function') {
                    options.onModalHidden.call(self, self.modal);
                }
            }
        });
    };
    
    PhotoEditor.prototype.initCropZone = function () {
        var self = this;
        var options = self.options;
        var helper = self.helper;
        
        if (options.preview === true) {
            helper.append('<div class="photo-editor-previewer"></div>');
            self.previewer = helper.find('.photo-editor-previewer');
        }
        
        helper.append(
            '<div class="photo-editor-info clearfix">' +
            '    <div class="input-group input-group-sm">' +
            '        <label class="input-group-addon">Width</label>' +
            '        <input type="text" class="form-control photo-editor-width" name="width" />' +
            '        <span class="input-group-addon">px</span>' +
            '    </div>' +
            '    <div class="input-group input-group-sm">' +
            '        <label class="input-group-addon">Height</label>' +
            '        <input type="text" class="form-control photo-editor-height" name="height" />' +
            '        <span class="input-group-addon">px</span>' +
            '    </div>' +
            '</div>' +
            '<div class="photo-editor-toolbar clearfix">' +
            '    <div class="btn-group btn-group-sm">' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-move" title="Drag to move image"><i class="fa fa-arrows"></i></a>' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-crop" title="Drag to crop image"><i class="fa fa-crop"></i></a>' +
            '    </div>' +
            '    <div class="btn-group btn-group-sm">' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-zoom-in" title="Zoom in"><i class="fa fa-search-plus"></i></a>' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-zoom-out" title="Zoom out"><i class="fa fa-search-minus"></i></a>' +
            '    </div>' +
            '    <div class="btn-group btn-group-sm">' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-rotate-left" title="Rotate image 45 degree to left"><i class="fa fa-rotate-left"></i></a>' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-rotate-right" title="Rotate image 45 degree to right"><i class="fa fa-rotate-right"></i></a>' +
            '    </div>' +
            '    <div class="btn-group btn-group-sm">' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-flip-horizontal" title="Flip image horizontal"><i class="fa fa-arrows-h"></i></a>' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-flip-vertical" title="Flip image vertical"><i class="fa fa-arrows-v"></i></a>' +
            '    </div>' +
            '    <div class="btn-group btn-group-sm">' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-reset" title="Reset"><i class="fa fa-refresh"></i></a>' +
            '    </div>' +
            '</div>'
        );
        
        var txtWidth = self.txtWidth = helper.find('.photo-editor-width');
        var txtHeight = self.txtHeight = helper.find('.photo-editor-height');
        
        txtWidth.on('change', function () {
            var data = self.cropper.getData(true);
            
            if (this.value && !isNaN(this.value) && +this.value <= data.width) {
                var newHeight = data.height * (+this.value) / data.width;
                txtHeight.val(Math.round(newHeight));
            } else {
                this.value = data.width;
            }
        });
        
        txtHeight.on('change', function () {
            var data = self.cropper.getData(true);
            
            if (this.value && !isNaN(this.value) && +this.value <= data.height) {
                var newWidth = data.width * (+this.value) / data.height;
                txtWidth.val(Math.round(newWidth));
            } else {
                this.value = data.height;
            }
        });
        
        helper.find('.photo-editor-move').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.setDragMode('move');
        });
        
        helper.find('.photo-editor-crop').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.setDragMode('crop');
        });
        
        helper.find('.photo-editor-zoom-in').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.zoom(0.1);
        });
        
        helper.find('.photo-editor-zoom-out').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.zoom(-0.1);
        });
        
        helper.find('.photo-editor-rotate-left').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.rotate(-45);
        });
        
        helper.find('.photo-editor-rotate-right').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.rotate(45);
        });
        
        helper.find('.photo-editor-flip-horizontal').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.scaleX(-self.cropper.getData(true).scaleX);
        });
        
        helper.find('.photo-editor-flip-vertical').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.scaleY(-self.cropper.getData(true).scaleY);
        });
        
        helper.find('.photo-editor-reset').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.reset();
        });
        
        if (!options.useModal) {
            self.setImage(self.image.attr('src'));
        }
    };
    
    PhotoEditor.prototype.setImage = function (url) {
        if (!url) {
            return;
        }
        
        var self = this;
        var options = self.options;
        var cropperOptions = {
            responsive: true,
            viewMode: 1,
            aspectRatio: options.aspectRatio,
            preview: self.previewer.get(0),
            crop: function (e) {
                self.helper.find('.photo-editor-width').val(Math.round(e.detail.width));
                self.helper.find('.photo-editor-height').val(Math.round(e.detail.height));
            }
        };

        if (options.minContainerWidth && options.minContainerHeight){
            cropperOptions.minContainerWidth = options.minContainerWidth;
            cropperOptions.minContainerHeight = options.minContainerHeight;
        }
        
        self.image.attr('src', url);
        self.image.css('max-height', $(window).height() * 0.7);
        
        if (self.cropper) {
            self.cropper.destroy();
        }
        self.cropper = new Cropper(self.image.get(0), cropperOptions);
    };
    
    PhotoEditor.prototype.getImage = function (imageType) {
        var self = this;
        
        if (!self.cropper) {
            return null;
        }
        
        if (imageType) {
            imageType = 'image/jpeg';
        }
        
        var croppedCanvas = self.cropper.getCroppedCanvas();
        try {
            return croppedCanvas.toDataURL(imageType);
        } catch (e) {
            flog('Error when get data image from canvas:' + e);
            
            return null;
        }
    };
    
    PhotoEditor.prototype.getCroppedData = function () {
        var self = this;
        var data;
        
        if (self.cropper) {
            data = self.cropper.getData(true);
            
            var croppedWidth = self.txtWidth.val() || data.width;
            var croppedHeight = self.txtHeight.val() || data.height;
            
            data.croppedWidth = croppedWidth;
            data.croppedHeight = croppedHeight;
            data.croppedCanvas = self.cropper.getCroppedCanvas({
                width: croppedWidth,
                height: croppedHeight
            });
            data.croppedImage = data.croppedCanvas.toDataURL();
            
            var block = data.croppedImage.split(';');
            var contentType = block[0].split(':')[1];
            var realData = block[1].split(',')[1];
            var blob = self.base64toBlob(realData, contentType);
            
            data.croppedImageBlob = blob;
        }
        
        return data;
    };
    
    PhotoEditor.prototype.base64toBlob = function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            
            var byteArray = new Uint8Array(byteNumbers);
            
            byteArrays.push(byteArray);
        }
        
        var blob = null;
        
        try {
            blob = new Blob(byteArrays, {type: contentType});
        } catch (e) {
            // TypeError old chrome and FF
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(byteArrays);
                blob = bb.getBlob(contentType);
            } else if (e.name == "InvalidStateError") {
                // InvalidStateError (tested on FF13 WinXP)
                blob = new Blob(byteArrays, {type: contentType});
            } else {
                // We're screwed, blob constructor unsupported entirely
                blob = null;
            }
        }
        
        return blob;
    };
    
    PhotoEditor.prototype.showModal = function () {
        this.modal && this.modal.modal('show');
    };
    
    PhotoEditor.prototype.hideModal = function () {
        this.modal && this.modal.modal('hide');
    };
    
    $.fn.photoEditor = function (options) {
        var target = $(this)
        var data = target.data('photoEditor');
        
        if (!data) {
            target.data('photoEditor', (data = new PhotoEditor(target, options)));
        }
        
        if (typeof options == 'string') {
            return data[options].apply(data, Array.prototype.slice.call(arguments, 1));
        } else {
            return data;
        }
    };
    
    $.fn.photoEditor.constructor = PhotoEditor;
    
})(jQuery, window);