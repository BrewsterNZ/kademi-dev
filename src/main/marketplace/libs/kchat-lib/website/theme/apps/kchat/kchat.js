(function ($) {
    var KChat = function (element, options) {
        var self = this;
        self.$elem = $(element);
        self.$maxFileSize = 1000000 * 10; // 10 MB

        // Create a logger
        if (typeof window.flog === 'function') {
            self.$log = window.flog.bind(self, '[ KChat ] ::');
        } else if (window.console && typeof console.log === 'function') {
            self.$log = window.console.log.bind(self, '[ KChat ] ::');
        } else {
            self.$log = function () {
            };
        }

        // Check if WebSockets is supported, And only init if it is...
        self.$supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
        if (self.$supportsWebSockets) {
            self.$WebSocket = window.WebSocket || window.MozWebSocket;
        } else {
            self.$log('Error: WebSocket not supported...');

            self.$elem.hide();
        }

        // Init Handlebars Helpers
        Handlebars.registerHelper('_ifImage', function (contentType, options) {
            contentType = Handlebars.Utils.escapeExpression(contentType);

            if (contentType.contains('image/')) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

        Handlebars.registerHelper('_getExtension', function (fileName) {
            if (typeof fileName === 'string' && fileName.lastIndexOf('.') > -1) {
                return fileName.substring(fileName.lastIndexOf('.'));
            } else {
                return '';
            }
        });

        // Init Handlebars Templates
        var msgr_templ = self.$elem.find('.kchat-msgr-template').html();
        self.$msgr = Handlebars.compile(msgr_templ);

        var msgl_templ = self.$elem.find('.kchat-msgl-template').html();
        self.$msgl = Handlebars.compile(msgl_templ);

        // Register send button listener
        self.$elem.on('click', '[data-action=kchat-send]', function (e) {
            e.preventDefault();

            var inp = self.$elem.find('.kchat-msg-input');
            var value = inp.val().trim();

            self.sendMsg(value);

            inp.val('');
        });

        self.$elem.on('keypress', '.kchat-msg-input', function (e) {
            if (e.which === 13) { // Enter key pressed
                var inp = self.$elem.find('.kchat-msg-input');
                var value = inp.val().trim();
                self.sendMsg(value);
                inp.val('');
            }
        });
        self.$elem.find('#kchat-accordion-collapse').on('shown.bs.collapse', function () {
            self.scrollToBottom();
        });

        // Check if formData is supported
        self.$supportFormData = 'FormData' in window;

        if (self.$supportFormData) {

            // Init support for image pasting
            self.$elem.on('paste', function (e) {
                self.$log('On Paste: ', this, e);

                var items = (e.clipboardData || e.originalEvent.clipboardData).items;
                console.log(JSON.stringify(items));

                for (var index in items) {
                    var item = items[index];
                    if (item.kind === 'file') {
                        var blob = item.getAsFile();

                        self._kchatUploadFile(blob);
                    }
                }
            });

            // Init Drag-Drop file uploader
            if ('draggable' in self.$elem[0] || ('ondragstart' in self.$elem[0] && 'ondrop' in self.$elem[0])) {
                var elm = self.$elem.find('#kchat-accordion-collapse .panel-body');

                elm.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                    self.$log('Drag Event', e);
                    e.preventDefault();
                    e.stopPropagation();
                }).on('dragstart drag dragover dragenter', function (e) {
                    self.$log('Drag Event 1', e);
                    elm.addClass('is-dragover');
                }).on('dragleave dragend drop', function (e) {
                    self.$log('Drag Event 2', e);
                    elm.removeClass('is-dragover');
                }).on('drop', function (e) {
                    elm.removeClass('is-dragover');
                    var droppedFiles = e.originalEvent.dataTransfer.files;
                    if (droppedFiles && droppedFiles.length > 0) {
                        self._kchatUploadFile(droppedFiles[0]);
                    }
                });
            }
        }

        // Init Websockets URL
        self.$cid = self.$elem.data('cid');
        self.$hostname = self.$elem.data('hostname') || window.location.hostname;
        self.$b64ContentId = Base64.encode(self.$cid.toString());
        self.$port = parseInt(window.location.port || 80) + 1;
        self.$proto = 'ws://';
        self.$visitorId = $.cookie('kdmt') || '';
        self.$visitorName = $.cookie('kdmtu') || '';


        if (window.location.protocol === 'https:') {
            self.$proto = 'wss://';
            self.$port = parseInt(window.location.port || 443) + 1;
        }
        self.$wsUrl = self.$proto + self.$hostname + ':' + self.$port + '/ws/' + self.$hostname + '/kchat/' + self.$b64ContentId + '?kdmt=' + self.$visitorId + '&kdmtu=' + self.$visitorName;

        // Start it
        if (self.$supportsWebSockets) {
            self._kchatConnectWs();
        }
    };

    KChat.prototype = {
        show: function () {
            var self = this;

            self.$elem.find('#kchat-accordion-collapse').collapse('show');
        },
        hide: function () {
            var self = this;

            self.$elem.find('#kchat-accordion-collapse').collapse('hide');
        },
        toggle: function () {
            var self = this;

            self.$elem.find('#kchat-accordion-collapse').collapse('toggle');
        },
        sendMsg: function (msg) {
            var self = this;

            var c = {
                action: "msg",
                message: msg
            };

            self._kchatSend(c);

            c.timestamp = (new moment()).toISOString();
            c.profile = {
                name: "Me"
            };
            var html = $.parseHTML(self.$msgr(c));

            $(html).find('.timeago').timeago();
            self.$elem.find('.kchat-msg-list').append($(html));
            self.scrollToBottom();
        },
        scrollToBottom: function () {
            var self = this;

            var panelBody = self.$elem.find('.panel-body').get(0);
            panelBody.scrollTop = panelBody.scrollHeight;
        },
        isConnected: function () {
            var self = this;

            if (self.$ws !== null && typeof self.$ws !== 'undefined' && self.$ws instanceof self.$WebSocket) {
                return self.$ws.readyState === self.$ws.OPEN;
            }

            return false;
        },
        _kchatSend: function (d) {
            var self = this;

            if (self.isConnected()) {
                var msg;
                if (typeof d === 'string') {
                    msg = d;
                } else {
                    msg = JSON.stringify(d);
                }

                self.$ws.send(msg);
            } else {
                self.$log('Not Connected, So Queueing message to be sent...');
            }
        },
        _kchatWSTimeout: function () {
            var self = this;

            self.$log('Connection timed out, Attempt to reconnect...');

            self._kchatConnectWs();
        },
        _kchatCheckWS: function () {
            var self = this;

            if (self.$pollTimer) {
                self.$pollTimer = window.clearTimeout(self.$pollTimer);
            }

            if (self.isConnected()) {
                self._kchatSend(':::::ping:::::');
            }

            if (self.$timeoutTimer) {
                self.$timeoutTimer = window.clearTimeout(self.$timeoutTimer);
            }

            self.$timeoutTimer = window.setTimeout(self._kchatWSTimeout.bind(self), 4000);
        },
        _kchatStartCheckWS: function () {
            var self = this;

            if (self.$pollTimer) {
                self.$pollTimer = window.clearTimeout(self.$pollTimer);
            }
            if (self.$timeoutTimer) {
                self.$timeoutTimer = window.clearTimeout(self.$timeoutTimer);
            }

            self.$pollTimer = window.setTimeout(self._kchatCheckWS.bind(self), 5000);
        },
        _kchatOnMessage: function (evt) {
            var self = this;

            if (evt.data === ':::::pong:::::') {
                self._kchatStartCheckWS();
            } else {
                var c = $.parseJSON(evt.data);
                if (c.action === 'msg') {
                    self._kchatStartCheckWS();

                    self._processMessage.call(self, c.chatMessage);

                    self._kchatStartCheckWS();
                } else if (c.action === 'history') {
                    self._kchatStartCheckWS();

                    if (c.data) {
                        c.data.sort(function (a, b) {
                            var result = (a['timestamp'] < b['timestamp']) ? -1 : (a['timestamp'] > b['timestamp']) ? 1 : 0;
                            return result * 1;
                        });
                        
                        // Clear existing chat list as we have a new one
                        self.$elem.find('.kchat-msg-list').empty();

                        for (var i = 0; i < c.data.length; i++) {
                            var cm = c.data[i];

                            self._processMessage.call(self, cm);
                        }

                        self._sortChatList();
                    }

                    self._kchatStartCheckWS();
                } else if (c.action === 'connected') {
                    if (c.visitorId && c.visitorId.length > 0) {
                        self.$visitorId = c.visitorId;
                        $.cookie('kdmt', c.visitorId,
                                {
                                    expires: 1000000,
                                    path: '/',
                                    domain: self.$hostname
                                }
                        );
                    }
                } else if (c.action === 'pong') {
                    self._kchatStartCheckWS();
                }
            }
        },
        _processMessage: function (cm) {
            var self = this;

            if (self.$elem.find('[data-messageid=' + cm.id + ']').length < 1) {
                var html = $.parseHTML((cm.fromAdmin ? self.$msgl(cm) : self.$msgr(cm)));
                $(html).find('.timeago').timeago();
                self.$elem.find('.kchat-msg-list').append($(html));
                self.scrollToBottom();
            }
        },
        _sortChatList: function () {
            var self = this;

            var chats = self.$elem.find('li');

            chats.sort(function (a, b) {
                var aVal = $(a).data('timestamp');
                var bVal = $(b).data('timestamp');

                var result = (aVal < bVal) ? -1 : (aVal > bVal) ? 1 : 0;
                return result * 1;
            });

            self.$elem.find('.kchat-msg-list').empty().append(chats);
            self.scrollToBottom();
        },
        _kchatUploadFile: function (file) {
            var self = this;

            if (file.size > self.$maxFileSize) {
                self.$elem.find('.kchat-fileUpload-title').text('File too large to upload');
                self.$elem.find('.progress').hide();
                self.$elem.find('.kchat-fileUpload-wrapper').show();
            } else {
                self.$elem.find('.kchat-fileUpload-title').text('Uploading ' + file.name + '...');
                self.$elem.find('.progress').show();
                self.$elem.find('.kchat-fileUpload-wrapper').show();

                var fd = new FormData();

                fd.append('file', file, file.name);

                $.ajax({
                    type: 'POST',
                    url: '/kchat',
                    dataType: 'JSON',
                    success: function (data, textStatus, jqXHR) {
                        flog('success', data);

                        if (data.status) {
                            self._processMessage(data.data);
                            self.$elem.find('.kchat-fileUpload-wrapper').hide();
                        } else {
                            self.$elem.find('.kchat-fileUpload-title').text('Error uploading file: ' + (data.messages || ''));
                            self.$elem.find('.progress').hide();
                            self.$elem.find('.kchat-fileUpload-wrapper').show();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        self.$elem.find('.kchat-fileUpload-title').text('Error uploading file');
                        self.$elem.find('.progress').hide();
                        self.$elem.find('.kchat-fileUpload-wrapper').show();
                    },
                    processData: false,
                    contentType: false,
                    beforeSend: function (xhr, options) {
                        options.data = fd;
                        if (fd.fake) {
                            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + fd.boundary);
                            // with fake FormData object, we must use sendAsBinary
                            xhr.send = function (data) {
                                xhr.sendAsBinary(data.toString());
                            };
                        }
                    }
                });
            }
        },
        _kchatOnClose: function () {
            var self = this;

            if (!self.$wsConnecting) {
                self.$log('WS Connection Closed, Re-attempt soon...');

                self._kchatStartCheckWS();
            }
        },
        _kchatOnOpen: function () {
            var self = this;

            self.$log('WS Connection Opened...');
            // Check history

            self._kchatSend({action: 'history'});
            self.$elem.show();
        },
        _kchatOnError: function () {
            var self = this;

            if (!self.$wsConnecting) {
                self.$log('Error connecting to WS, Re-attempt soon...');

                self._kchatStartCheckWS();
            }
        },
        _kchatConnectWs: function () {
            var self = this;
            self.$wsConnecting = true;

            self.$log('Connecting to ' + self.$wsUrl);

            if (self.$ws !== null && typeof self.$ws !== 'undefined') {
                try {
                    self.ws.close();
                } catch (err) {
                }
            }

            try {
                self.$ws = new self.$WebSocket(self.$wsUrl);
                self.$ws.onmessage = self._kchatOnMessage.bind(self);
                self.$ws.onclose = self._kchatOnClose.bind(self);
                self.$ws.onopen = self._kchatOnOpen.bind(self);
                self.$ws.onerror = self._kchatOnError.bind(self);
            } catch (err) {
                self.$log('Error Connecting to ' + self.$wsUrl);
            }

            self._kchatStartCheckWS();
            self.$wsConnecting = false;
        }
    };

    $.fn.KChat = function (options) {
        if (typeof options === 'string' && this.data('kademi_kchat')) {
            var data = this.data('kademi_kchat');
            return data[options]();
        }

        return this.each(function () {
            var self = $(this),
                    data = self.data('kademi_kchat');
            if (!data)
                self.data('kademi_kchat', (data = new KChat(this, options)));
            if (typeof options === 'string')
                return data[options]();
        });
    };

    // Auto Init windows...
    $(function () {
        $('.kchat-chat-container').KChat();
    });

})(jQuery);