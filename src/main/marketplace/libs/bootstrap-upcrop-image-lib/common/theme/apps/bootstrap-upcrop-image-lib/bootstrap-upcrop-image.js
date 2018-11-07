(function ($) {
    var DEFAULTS = {
        buttonUploadText: 'Upload',
        buttonUploadOtherText: 'Upload other',
        buttonCropText: 'Crop',
        buttonContinueText: 'Continue',
        buttonCameraText: 'Camera',
        buttonTakePictureText: 'Take a picture',
        buttonTakeAnotherText: 'Take another picture',
        modalTitle: 'Upload and crop image',
        cropHint: '<p class="alert alert-info"><i class="glyphicon glyphicon-info-sign"></i> Please drag a rectangle to crop the image</p>',
        onUploadComplete: null,
        onUploadedImageLoad: null,
        onCropComplete: null,
        onContinue: null,
        onUploadOther: null,
        onReady: null,
        url: window.location.pathname,
        ratio: 1,
        bgOpacity: 0.4,
        bgColor: '#fff',
        isEmbedded: false,
        isCameraEnabled: false,
        fieldName: "file",
        modalTemplate: '<div class="modal fade" id="{{upcropId}}" data-backdrop="static" data-keyboard="false">' +
        '   <div class="modal-dialog">' +
        '       <div class="modal-content">' +
        '           <div class="modal-header">' +
        '               <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '               <h4 class="modal-title">{{modalTitle}}</h4>' +
        '           </div>' +
        '           <div class="modal-body">' +
        '               {{upcropZone}}' +
        '               {{takePictureZone}}' +
        '           </div>' +
        '           <div class="modal-footer">' +
        '               <div class="pull-left">' +
        '                   {{buttonTakeAnother}}' +
        '                   {{buttonUploadOther}}' +
        '               </div>' +
        '               {{buttonCamera}} ' +
        '               {{buttonTakePicture}} ' +
        '               <button class="btn btn-default" type="button" data-dismiss="modal">Cancel</button> ' +
        '               {{buttonCrop}} ' +
        '               {{buttonContinue}}' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>',
        embeddedTemplate: '<div class="upcrop-embedded" id="{{upcropId}}">' +
        '   {{upcropZone}}' +
        '   <div class="clearfix">' +
        '       <div class="pull-left">' +
        '           {{buttonUploadOther}}' +
        '       </div>' +
        '       <div class="pull-right">' +
        '           {{buttonContinue}}' +
        '           {{buttonCrop}}' +
        '       </div>' +
        '   </div>' +
        '</div>'
    };
    
    var methods = {
        init: function (options) {
            var target = $(this);
            
            if (target.data('upcrop')) {
                flog('This target is already upcrop object!', target);
                return target;
                
            }
            
            var config = $.extend({}, DEFAULTS, options);
            var uniqueId = 'upcrop-' + Math.round(Math.random() * 123456789) + '-' + (new Date()).getTime();
            
            var dataUpCrop = {
                upcropId: uniqueId,
                upcropZone: getUpcropZone(config),
                takePictureZone: getTakePictureZone(config),
                buttonUploadOther: getButtonUploadOther(config),
                buttonCrop: getButtonCrop(config),
                buttonContinue: getButtonContinue(config),
                buttonCamera: getButtonCamera(config),
                buttonTakePicture: getButtonTakePicture(config),
                buttonTakeAnother: getButtonTakeAnother(config)
            };
            flog('Data upcrop: ', dataUpCrop);
            
            if (config.isEmbedded) {
                initUpCropEmbedded(target, config, dataUpCrop);
            } else {
                initUpCropModal(target, config, dataUpCrop);
            }
            
            var upcropContainer = $('#' + uniqueId);
            var uploadZone = upcropContainer.find('.upload-zone');
            var cropZone = upcropContainer.find('.crop-zone');
            var takePictureZone = upcropContainer.find('.take-picture');
            var btnCamera = upcropContainer.find('.btn-camera');
            var btnTakePicture = upcropContainer.find('.btn-take-picture');
            var btnTakeAnother = upcropContainer.find('.btn-take-another');
            var btnUploadOther = upcropContainer.find('.btn-upload-other');
            var btnCrop = upcropContainer.find('.btn-crop');
            var btnContinue = upcropContainer.find('.btn-continue');
            
            var txtX = upcropContainer.find('[name=x]');
            var txtY = upcropContainer.find('[name=y]');
            var txtW = upcropContainer.find('[name=w]');
            var txtH = upcropContainer.find('[name=h]');
            var txtUrl = upcropContainer.find('[name=url]');
            
            var dataContinue;
            
            // Event of hiding the modal
            $(upcropContainer).on('hidden.bs.modal', function () {
                flog("Hiding modal...");
                stopCameraHardware();
                destroyPictureZone();
                destroyCropZone();
                cropZone.addClass("hide");
                btnTakeAnother.addClass("hide");
                btnContinue.addClass("hide");
            });
            
            // Action for button `Upload other`
            btnUploadOther.click(function (e) {
                e.preventDefault();
                
                uploadZone.removeClass('hide');
                cropZone.addClass('hide');
                btnCrop.addClass('hide');
                btnContinue.addClass('hide');
                btnUploadOther.addClass('hide');
                
                if (!config.isEmbedded) {
                    upcropContainer.trigger('resize');
                }
                
                var dropzone = uploadZone.data('dropzone');
                if (dropzone) {
                    dropzone.removeAllFiles();
                }
                
                destroyCropZone();
                
                if (typeof config.onUploadOther === 'function') {
                    config.onUploadOther.apply(this, upcropContainer);
                }
            });
            
            var widthVideo = 572;
            var heightVideo = 430;
            var constraints = {video: {mandatory: {minWidth: widthVideo, minHeight: heightVideo}}};
            var videoStream;
            
            // Action for "Camera" button
            btnCamera.click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                setTakePictureZone();
                if (hasGetUserMedia()) {
                    
                    btnCamera.addClass('hide');
                    btnTakePicture.removeClass('hide');
                    
                    navigator.getUserMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;
                    
                    var video = getTag("video");
                    takePictureZone.append(video);
                    
                    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                        videoStream = stream;
                        video.src = window.URL.createObjectURL(videoStream);
                        video.play();
                    });
                    
                } else {
                    alert('Sorry this feature is not supported in your browser.');
                }
            });
            
            //Action for  "Take a picture" button
            btnTakePicture.click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                flog("Taking the picture...");
                
                btnTakePicture.addClass('hide');
                btnTakeAnother.removeClass('hide');
                
                var video = getTag("video");
                var canvas = getTag("canvas");
                
                var context = canvas.getContext('2d');
                flog("Video paused");
                video.pause(); // Pause the image of the video
                
                context.drawImage(video, 0, 0, widthVideo, heightVideo); // Draw the Image
                video.remove(); // Remove the video tag
                
                stopCameraHardware();
                
                var href = canvas.toDataURL("image/png"); // Get the canvas URL
                var image = new Image();
                image.src = href;
                image.id = "takenPicture";
                
                var file = convertCanvasToBlob(canvas);
                var form = upcropContainer.find('form');
                var formdata = new FormData();
                var name = 'webcam.png';
                formdata.append("overwrite", "true");
                formdata.append("file", file, name);
                
                // Posting the img
                $.ajax({
                    type: form.attr("method"),
                    url: form.attr("action"),
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        var data = {'result': res, 'name': name};
                        dataContinue = [data];
                        flog('uploaded image: ', data, name, data.result.nextHref);
                        uploadedHref = data.result.nextHref;
                        uploadedName = name;
                        href = data.result.nextHref + '?' + Math.round(Math.random() * 123456789);
                        flog("href:", href);
                        txtUrl.val(href);
                    }
                });
                takePictureZone.addClass('hide');
                cropZone.removeClass('hide');
                btnContinue.removeClass('hide');
                
                takePictureZone.append(image);
                $("#takenPicture").addClass("image-crop");
                
                dimMultiplier = widthVideo / cropZone.find('.image-wrapper').width();
                
                initCropZone(href);
                if (typeof config.onUploadComplete === 'function') {
                    flog("onUploadComplete callback..");
                    config.onUploadComplete(data, name, href);
                } else {
                    flog("No onUploadComplete function");
                }
                
            });
            
            // Action for "Take another picture" button
            btnTakeAnother.click(function (e) {
                e.preventDefault();
                destroyCropZone();
                btnCamera.click();
            });
            
            function destroyPictureZone() {
                $('canvas').remove();
                $('video').remove();
                $("#takenPicture").remove();
                $(".take-picture").empty();
                uploadZone.removeClass('hide');
                btnCamera.removeClass('hide');
                takePictureZone.addClass('hide');
                btnTakePicture.addClass('hide');
            }
            
            function setTakePictureZone() {
                destroyPictureZone();
                takePictureZone.removeClass('hide');
                btnCamera.removeClass('hide');
                uploadZone.addClass('hide');
                cropZone.addClass('hide');
                btnCrop.addClass('hide');
                btnContinue.addClass('hide');
                btnUploadOther.addClass('hide');
                btnTakePicture.addClass('hide');
                btnTakeAnother.addClass('hide');
            }
            
            function hasGetUserMedia() {
                return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
            }
            
            function stopCameraHardware() {
                if (videoStream !== undefined) {
                    videoStream.getVideoTracks().forEach(function (track) { // Stop the camera hardware
                        flog("stoping camera.");
                        track.stop();
                    });
                }
            }
            
            function getTag(tagName) {
                var tag;
                if (document.querySelector(tagName) !== undefined && document.querySelector(tagName) !== null) {
                    flog("Returning tag: ", tagName);
                    tag = document.querySelector(tagName);
                } else {
                    flog("Creating tag: ", tagName);
                    tag = document.createElement(tagName);
                    tag.id = tagName + "Zone";
                    tag.width = widthVideo;
                    tag.height = heightVideo;
                }
                return tag;
            }
            
            function convertCanvasToBlob(canvas) {
                var blobBin = atob(canvas.toDataURL('image/png').split(',')[1]);
                var array = [];
                for (var i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: 'image/png'});
            }
            
            
            // Action for button `Continue`
            btnContinue.on('click', function (e) {
                e.preventDefault();
                
                if (typeof config.onContinue === 'function') {
                    config.onContinue.apply(this, dataContinue);
                }
                
                if (!config.isEmbedded) {
                    destroyCropZone();
                    destroyPictureZone();
                    upcropContainer.modal('hide');
                }
            });
            
            // These are set when the uploaded image is set into the <img> element
            var realWidth;
            var realHeight;
            var dimMultiplier; // multiply given coords by this to get real dimensions
            var uploadedHref; // set when uploaded
            var uploadedName;
            
            // Action for button `Crop`
            btnCrop.click(function (e) {
                e.preventDefault();
                
                var url = txtUrl.val();
                var x = txtX.val();
                var y = txtY.val();
                var w = txtW.val();
                var h = txtH.val();
                
                flog("x: " + x, "y: " + y, "w: " + w, "h: " + h, "url: " + url);
                
                try {
                    var data = {
                        crop: true,
                        x: x * dimMultiplier,
                        y: y * dimMultiplier,
                        w: w * dimMultiplier,
                        h: h * dimMultiplier,
                        uploadedHref: uploadedHref
                    };
                    $.ajax({
                        url: config.url,
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function (resp) {
                            if (resp.status) {
                                if (typeof config.onCropComplete === 'function') {
                                    var newArgs = [resp, uploadedName];
                                    config.onCropComplete.apply(this, newArgs);
                                }
                                
                                if (!config.isEmbedded) {
                                    upcropContainer.modal('hide');
                                }
                            } else {
                                alert("Sorry, an error occured updating your profile image");
                            }
                        },
                        error: function () {
                            alert('Sorry, we couldnt crop your profile image.');
                        }
                    });
                } catch (e) {
                    flog("Error applying crop", e, data);
                }
            });
            
            // Get script and style of jcrop
            var jcropScript = '/static/jcrop/0.9.12/js/jquery.Jcrop.min.js';
            var jcropStyle = '/static/jcrop/0.9.12/css/jquery.Jcrop.min.css';
            $.getScriptOnce(jcropScript);
            
            if (!$('link[href="' + jcropStyle + '"]').length) {
                flog("loading css");
                $('<link href="' + jcropStyle + '" rel="stylesheet" />').appendTo('head');
            } else {
                flog('already have jcrop css');
            }
            
            var showPreview = function (coords) {
                txtX.val(coords.x);
                txtY.val(coords.y);
                txtW.val(coords.w);
                txtH.val(coords.h);
                
                btnCrop.removeClass('hide');
            };
            
            var initCropZone = function (href) {
                var img = cropZone.find('.image-crop');
                
                if (!href) {
                    href = img.attr('src');
                }
                
                img.attr('src', href).load(function () {
                    img.Jcrop({
                        onChange: showPreview,
                        onSelect: showPreview,
                        onRelease: function () {
                            btnCrop.addClass('hide');
                            txtX.val('');
                            txtY.val('');
                            txtW.val('');
                            txtH.val('');
                        },
                        aspectRatio: config.ratio === 'auto' ? img.width() / img.height() : config.ratio,
                        bgOpacity: config.bgOpacity,
                        bgColor: config.bgColor
                    }, function () {
                        cropZone.find('.jcrop-holder').children().eq(0).hide();
                    });

                    if (!config.isEmbedded) {
                        upcropContainer.trigger('resize');
                    }
                    
                    if (typeof config.onUploadedImageLoad === 'function') {
                        config.onUploadedImageLoad.call(this, img, href);
                    }
                });
            };
            
            var destroyCropZone = function () {
                var jcropApi = cropZone.find('.image-crop').data('Jcrop');
                if (jcropApi) {
                    jcropApi.destroy();
                }
                cropZone.find('.image-crop').attr('src', '').css({
                    width: '',
                    height: ''
                });
            };

            uploadZone.mupload({
                url: config.url,
                fieldName: config.fieldName,
                useJsonPut: false, // Just do a POST
                maxFiles: 1,
                useDropzone: true,
                acceptedFiles: 'image/*',
                oncomplete: function (data, name, href) {
                    dataContinue = arguments;
                    flog('uploaded image: ', data, name, data.result.nextHref);
                    uploadedHref = data.result.nextHref;
                    uploadedName = name;
                    href = data.result.nextHref + '?' + Math.round(Math.random() * 123456789);
                    flog("href:", href);

                    txtUrl.val(href);

                    uploadZone.addClass('hide');
                    cropZone.removeClass('hide');
                    btnContinue.removeClass('hide');
                    btnUploadOther.removeClass('hide');

                    // Load the href into an img not attached to the DOM to get the original sizes
                    var sizingImg = new Image();
                    sizingImg.onload = function () {
                        realWidth = sizingImg.width;
                        realHeight = sizingImg.height;
                        dimMultiplier = realWidth / cropZone.find('.image-wrapper').width();
                    };
                    sizingImg.src = href;

                    initCropZone(href);
                    if (typeof config.onUploadComplete === 'function') {
                        flog("onUploadComplete callback..");
                        config.onUploadComplete(data, name, href);
                    } else {
                        flog("No onUploadComplete function");
                    }
                }
            });
            
            var upcropData = {
                uniqueId: uniqueId,
                options: config,
                upcropContainer: upcropContainer,
                uploadZone: uploadZone,
                cropZone: cropZone,
                btnUploadOther: btnUploadOther,
                btnTakeAnother: btnTakeAnother,
                btnCrop: btnCrop,
                btnContinue: btnContinue
            };
            flog('Bind upcropData for target', upcropData);
            target.data('upcrop', upcropData);
            
            if (typeof config.onReady === 'function') {
                config.onReady.call(this, upcropContainer);
            }
            
            return target;
        },
        getJcropApi: function () {
            var target = $(this);
            var upcropData = target.data('upcrop');
            
            if (upcropData) {
                var imgCrop = upcropData.cropZone.find('.image-crop');
                
                return imgCrop.data('Jcrop');
            } else {
                $.error('This is not upcrop object!');
                return null;
            }
        },
        setUrl: function (url) {
            var target = $(this);
            var upcropData = target.data('upcrop');
            
            if (upcropData) {
                upcropData.options.url = url;
                upcropData.uploadZone.find('form').attr('action', url);
            } else {
                $.error('This is not upcrop object!');
                return null;
            }
        }
    };
    
    $.fn.upcropImage = function (method) {
        flog("upcropImage", this);
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on bootstrap-upcrop-image');
        }
    };
    
    function getButtonUploadOther(config) {
        return '<button class="btn btn-primary btn-upload-other hide" type="button">' + config.buttonUploadOtherText + '</button>';
    }
    
    function getButtonCrop(config) {
        return '<button class="btn btn-success btn-crop hide" type="button">' + config.buttonCropText + '</button>';
    }
    
    function getButtonContinue(config) {
        return '<button class="btn btn-info btn-continue hide" type="button">' + config.buttonContinueText + '</button>';
    }
    
    function getButtonCamera(config) {
        var button = "";
        if (config.isCameraEnabled) {
            button = '<button class="btn btn-success btn-camera" type="button">' + config.buttonCameraText + '</button>';
        }
        return button;
    }
    
    function getButtonTakePicture(config) {
        return '<button class="btn btn-primary btn-take-picture hide" type="button">' + config.buttonTakePictureText + '</button>';
    }
    
    function getButtonTakeAnother(config) {
        return '<button class="btn btn-primary btn-take-another hide" type="button">' + config.buttonTakeAnotherText + '</button>';
    }
    
    function getUpcropZone(config) {
        return (
            '<input type="hidden" value="" name="x" />' +
            '<input type="hidden" value="" name="y" />' +
            '<input type="hidden" value="" name="w" />' +
            '<input type="hidden" value="" name="h" />' +
            '<input type="hidden" value="" name="url" />' +
            '<div class="upload-zone panel panel-default"></div>' +
            '<div class="crop-zone hide clearfix">' +
            config.cropHint +
            '<div class="image-wrapper"><img class="image-crop" src="" width="100%" /></div>' +
            '</div>'
        );
    }
    
    function getTakePictureZone(config) {
        var html = "";
        if (config.isCameraEnabled) {
            html = ('<div class="take-picture hide clearfix"></div>');
        }
        return html;
    }
    
    function initUpCropModal(target, config, dataUpCrop) {
        flog('Init upcrop modal');
        dataUpCrop.modalTitle = config.modalTitle;
        var modalString = renderTemplate(config.modalTemplate, dataUpCrop);
        $(document.body).append(modalString);
        
        target.attr({
            'data-toggle': 'modal',
            'data-target': '#' + dataUpCrop.upcropId
        });
        
        $(document.body).on('show.bs.modal', '#' + dataUpCrop.upcropId, function () {
            var btnUploadOther = $(this).find('.btn-upload-other');
            !btnUploadOther.hasClass('hide') && btnUploadOther.trigger('click');
            $(".btn-continue").addClass("hide");
        });
    }
    
    function initUpCropEmbedded(target, config, dataUpCrop) {
        flog('Init upcrop embedded');
        target.html(renderTemplate(config.embeddedTemplate, dataUpCrop));
    }
    
    function renderTemplate(templateString, data) {
        var renderedString = templateString;
        
        for (var key in data) {
            var regex = new RegExp('{{' + key + '}}', 'g');
            renderedString = renderedString.replace(regex, data[key]);
        }
        
        return renderedString;
    }
    
})(jQuery);