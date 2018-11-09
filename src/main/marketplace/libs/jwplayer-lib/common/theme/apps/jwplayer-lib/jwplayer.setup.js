$(function () {
    jwplayer.key = "cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=";
    var JWPLAYER_LIB_PATH = '/theme/apps/jwplayer-lib/';
    var JWPLAYER_LIB_PATH_FLASH = JWPLAYER_LIB_PATH + 'jwplayer.flash.swf';
    var JWPLAYER_LIB_PATH_HTML5 = JWPLAYER_LIB_PATH + 'jwplayer.html5.js';

    /**
     *  Uses the new jwplayer and HLS. Replaces images with the video-jw class with a
     *  jwPlayer control, which loads the video from a path either derived from
     *  the image src, or from the data-video-src attribute if present
     */
    function initVideos() {
        doInitVideos();
        $(document).on("pjaxComplete", function () {
            doInitVideos();
        });
    }

    function doInitVideos() {
        var images = $(".video-jw");
        if (images.length === 0) {
            return;
        }
        replaceImagesWithJWPlayer(images);
    }

    function replaceImagesWithJWPlayer(images) {
        images.each(function (i, n) {
            var img = $(n);
            var src = img.attr("data-video-src");
            var posterUrl = img.attr("src");
            var aspectratio = img.attr("data-aspectratio");
            var autostart = img.attr('data-autostart') === 'true';
            var repeat = img.attr('data-repeat') === 'true';
            var controls = true; // Force showing controls for now
            if (src == null) {
                flog("replaceImagesWithJWPlayer: derive video base path from src", posterUrl);
                src = getFolderPath(posterUrl);
            } else {
                flog("replaceImagesWithJWPlayer: Using data-video-src", src);
            }
            flog("jwplayer item", img, i, src);
            buildJWPlayer(img, i + 10, src, posterUrl, aspectratio, autostart, repeat, controls);
        });
    }

    function buildJWAudioPlayer(count, src, autostart) {
        var playerInstance = jwplayer("kaudio-player-" + count);
        var isHash = src.indexOf('/_hashes/files/') === 0;

        playerInstance.setup({
            file: src + (isHash ? '.mp3' : ''),
            width: '100%',
            height: 30,
            autostart: autostart,
            flashplayer: JWPLAYER_LIB_PATH_FLASH,
            html5player: JWPLAYER_LIB_PATH_HTML5,
            primary: "html5"
        });
        playerInstance.onReady(function () {
            flog('jwplayer init done');
        });
    }

    function buildJWPlayer(itemToReplace, count, src, posterHref, aspectratio, autostart, repeat, controls) {
        flog('buildJWPlayer', itemToReplace);

        var h = itemToReplace.height();
        if (h < 100) {
            h = 360;
        }

        var w = itemToReplace.width();
        if (w < 100) {
            w = 640;
        }

        if (!aspectratio) {
            aspectratio = w + ':' + h;
        }

        var div = buildJWPlayerContainer(count);
        itemToReplace.replaceWith(div);

        var innerId = div.find('.jw-video').attr('id');
        var m3u8Url = src + '/alt-hls.m3u8';
        var webmUrl = src + '/alt-640-360.webm';
        var m4vUrl = src + '/alt-640-360.m4v';

        flog('buildJWPlayer:\n - src=' + src + ' \n - size=' + h + '-' + w + '\n - m3u8Url=' + m3u8Url + ' \n - webmUrl=' + webmUrl + '\n - m4vUrl=' + m4vUrl);

        jwplayer(innerId).setup({
            flashplayer: JWPLAYER_LIB_PATH_FLASH,
            html5player: JWPLAYER_LIB_PATH_HTML5,
            width: '100%',
            aspectratio: aspectratio,
            autostart: autostart,
            repeat: repeat,
            controls: controls,
            androidhls: true, //enable hls on android 4.1+
            playlist: [{
                image: posterHref,
                sources: [{
                    file: m3u8Url
                }, {
                    file: webmUrl
                }, {
                    file: m4vUrl
                }]
            }]
            , primary: 'html5'
        });

        jwplayer(innerId).onReady(function () {
            var wrapperId = innerId;
            var wrapper = $('#' + wrapperId);
            wrapper.addClass('jwplayer-wrapper');
        });
    }

    function buildJWPlayerContainer(count) {
        var c = "<div class='jw_container_outer'><div id='jw_container_" + count + "' class='jw-video'></div></div>";
        return $(c);
    }

    function doInitAudio() {
        var images = $('img[data-kaudio]');
        if (images.length === 0) {
            return;
        }
        replaceImagesWithAudio(images);
    }

    function initAudios() {
        flog('initAudios');
        doInitAudio();

        $(document).on('pjaxComplete', function () {
            doInitAudio();
        });
    }

    function replaceImagesWithAudio(images) {
        // will not transform images which in /contenteditor page
        if ($(document.body).hasClass('content-editor-page'))
            return;

        images.each(function (i, n) {
            var img = $(n);
            var src = img.attr('data-kaudio');
            var width = img.attr('data-width');
            if (!width) {
                width = 300;
            }
            var autostart = img.attr('data-autostart') === 'true';
            img.wrap('<div style="width: ' + width + 'px; max-width: 100%; margin-left: auto; margin-right: auto"></div>');
            if (src) {
                flog('replaceImagesWithAudio: Using data-kaudio', src);
                var audioWrap = $('<div id="kaudio-player-' + i + '" />');
                audioWrap.insertAfter(img);
                img.hide();
                buildJWAudioPlayer(i, src, autostart);
            } else {
                flog('replaceImagesWithAudio: audio not found', src);
            }
        });
    }


    initVideos();
    initAudios();
    window.buildJWPlayer = buildJWPlayer;
    window.buildJWAudioPlayer = buildJWAudioPlayer;
    window.JWPLAYER_LIB_PATH_FLASH = JWPLAYER_LIB_PATH_FLASH;
    window.JWPLAYER_LIB_PATH_HTML5 = JWPLAYER_LIB_PATH_HTML5;
});