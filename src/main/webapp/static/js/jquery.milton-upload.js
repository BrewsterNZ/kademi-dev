(function ($) {
    var methods = {
        init: function (options) {
            var container = this;
            var config = $.extend({
                url: "./",
                useJsonPut: true,
                useDropzone: false,
                buttonText: "Add files",
                oncomplete: function (data) {
                    flog("finished upload", data);
                },
                isInCkeditor: false,
                isFullWidth: true,
                fieldName: "file",
                acceptedFiles: ''  // To filter which file type should be uploaded
            }, options);

            flog("init milton uploads", container);
            container.addClass('');
            var actionUrl = config.url;
            if (config.useJsonPut) {
                actionUrl += "_DAV/PUT?overwrite=true";
            }
            flog("upload to url: ", actionUrl);

            config.id = Math.floor(Math.random() * 1000000);
            flog('id', config.id);

            var isSupport = typeof (window.FileReader) !== 'undefined';

            if (isSupport) {
                var formHtml = "<form action='" + actionUrl + "' method='POST' enctype='multipart/form-data' style='position: relative'>"
                    + "<input type='hidden' name='overwrite' value='true'>";
                // If not using a dropzone, generate a bootstrap button
                if (!config.useDropzone) {
                    var buttonClass = config.isInCkeditor ? 'cke_dialog_ui_button cke_dialog_ui_button_ok' : 'btn btn-success';
                    var spanClass = config.isInCkeditor ? 'cke_dialog_ui_button' : '';

                    formHtml += "<button class='dz-message " + buttonClass + "' type='button'><span class='" + spanClass + "'>" + config.buttonText + "</span></button>";
                }
                formHtml += "</form>";
                var form = $(formHtml);
                form.css("position: relative");
                if (config.useDropzone) {
                    form.addClass("dropzone");

                    if (config.isFullWidth) {
                        form.addClass("dropzone-fullwidth");
                    }
                }
                form.attr("id", config.id);
                container.append(form);

                if (typeof window.Dropzone !== 'undefined') {
                    methods.initDropZone(container, form, config);
                } else {
                    $.getStyleOnce('/static/dropzone/4.3.0/downloads/css/dropzone.css');
                    $.getScriptOnce(('/static/dropzone/4.3.0/downloads/dropzone.min.js'), function () {
                        methods.initDropZone(container, form, config);
                    });
                }
            } else {
                flog('init fallback for dropzone');
                methods.initFallback(container, config, actionUrl);
            }

            return container;
        },

        initDropZone: function (container, form, config) {
            var previewDiv = null;
            Dropzone.autoDiscover = false;
            var dzConfig = {
                paramName: config.fieldName, // The name that will be used to transfer the file
                maxFilesize: 500.0, // MB
                addRemoveLinks: true,
                parallelUploads: 1,
                maxFiles: config.maxFiles,
                uploadMultiple: false,
                init: function () {
                    this.on("processing", function (file) {
                        this.options.url = form.attr('action');
                    });

                    if (config.maxFiles == 1) {
                        this.hiddenFileInput.removeAttribute('multiple'); // click file chooser btn allow select one
                    }

                    this.on("success", function (file, resp) {
                        flog("success1", resp);
                        var result = null;
                        if (typeof resp === "string") {
                            result = $.parseJSON(resp);
                        } else {
                            result = resp;
                        }
                        if ($.isArray(result)) {
                            result = result[0]; // might be a propfind response
                        }
                        var data = {
                            result: result,
                            name: file.name
                        };

                        config.oncomplete(data, file.name, result.href);
                    });

                    this.on("error", function (file, errorMessage) {
                        alert("An error occured uploading: " + file.name + " because: " + errorMessage);
                    });

                    this.on("addedfile", function (file, errorMessage) {
                        if (config.maxFiles == 1 && this.files[1] != null) {
                            this.removeFile(this.files[0]);
                        }

                        if (previewDiv !== null) {
                            previewDiv.show();
                        }
                    });

                    this.on("complete", function (file, errorMessage) {
                        if (previewDiv !== null) {
                            previewDiv.hide();
                        }
                    });
                }
            };

            if (config.acceptedFiles) {
                dzConfig.acceptedFiles = config.acceptedFiles;
            }

            if (!config.useDropzone) {
                flog("do not use dropzone, use button instead")
                previewDiv = $("<div class='dropzone-previews' style='display: none'></div>");
                form.append(previewDiv);
                previewDiv.css("position: absolute");
                previewDiv.css("top", "20px");

                dzConfig.previewsContainer = previewDiv[0];
                flog("done init dropzone config. previewsContainer=", dzConfig.previewsContainer);
            }

            flog("Now invoke dropzone plugin...", dzConfig);
            var dropzone = form.dropzone(dzConfig);
            container.data('dropzone', form.data('dropzone'));
            flog("Finished dropzone init", dropzone);
        },
        initFallback: function (container, config, actionUrl) {
            container.addClass('fallback-upload');

            var fallbackCss = "/templates/themes/admin2/assets/plugins/jQuery-File-Upload/css/jquery.fileupload-ui.css";
            if (!$("link[href='" + fallbackCss + "']").length) {
                flog("loading fallback css");
                $('<link href="' + fallbackCss + '" rel="stylesheet">').appendTo("head");
            } else {
                flog("already have fallback css");
            }

            $.getScriptOnce('/static/js/jquery-fileupload-9.5.2/js/jquery.iframe-transport.js');
            $.getScriptOnce('/static/js/jquery-fileupload-9.5.2/js/jquery.fileupload.js', function () {
                flog('All scripts for fallback are loaded!');
                var buttonClass = config.isInCkeditor ? 'cke_dialog_ui_button cke_dialog_ui_button_ok' : 'btn btn-success';
                var spanClass = config.isInCkeditor ? 'cke_dialog_ui_button' : '';

                if (config.useDropzone) {
                    container.addClass('fallback-dropzone');
                    container.append(
                        '<p class="fallback-message">' +
                        'Your browser does not support drag\'n\'drop file uploads.' +
                        'Please use the fallback button below to upload your files like in the olden days.' +
                        '</p>'
                    );
                }

                var button = $(
                    '<span id="' + config.id + '" type="button" class="' + buttonClass + ' fileinput-button fallback-button">' +
                    '<span class="' + spanClass + '">' + config.buttonText + '</span>' +
                    '<span class="fallback-progress"></span>' +
                    '<input type="file" name="files[]" data-url="' + actionUrl + '" />' +
                    '</span>'
                );

                container.append(button);

                // Initialize the jQuery File Upload widget:
                var fileUpload = button.fileupload({
                    url: actionUrl,
                    dataType: 'json',
                    paramName: config.fieldName,
                    done: function (e, data) {
                        button.find('.fallback-progress').hide();
                        flog(data);

                        var file = data.files[0];

                        config.oncomplete.call(this, data, file.name, file.href);
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);

                        button.find('.fallback-progress').show().css(
                            'width',
                            progress + '%'
                        );
                    },
                    fail: function (e, data) {
                        alert("An error occured uploading because: " + data.errorThrown);
                    }
                });

                container.data('fileUpload', fileUpload);
            });
        },
        setUrl: function (url) {
            flog("setUrl", this, url);
            var newAction = url + "_DAV/PUT?overwrite=true";
            this.find("form").attr("action", newAction);
        }
    };

    $.fn.mupload = function (method) {
        flog("mupload", this);
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };
})(jQuery);
