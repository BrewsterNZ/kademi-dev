/** Start bootstrap320 init-theme.js */

/**
 *  Editor support: Note that this relies on a global variable called toolbarSets
 *
 *  A default is defined in toolbars.js. You should override that file in your
 *  application to get the toolbars you want
 */

CKEDITOR_BASEPATH = "/static/ckeditor440/";


// Templates should push theme css files into this array, so they will be included in the editor
var themeCssFiles = new Array();


function initTheme() {
    flog("initTheme-bootstrap320: init-theme.js");

    // the login box in header is normally for logging in from a public page. So
    // in this case we want to navigate to the user's dashboard
    $(".header .Login").user({});
    // the login form appears in content when the requested page requires a login
    // so in this case we do not give a post-login url, we will just refresh the current page
    $("#content .Login").user();

    initEdify();
    initActiveNav(".initActive");
    initHelp();
    initRotation();
    initPrintLink();
    initVideos();

    flog("initTheme: run page init functions", pageInitFunctions.length);
    $.each(pageInitFunctions, function (i, f) {
        log("run function" + i);
        pageInitFunctions[i]();
        log("done run function", i);

    });

    flog("finished init-theme");
}


function initHelp() {
    $(".helpIcon").click(function (e) {

        e.preventDefault();

        var page = $(document).find("meta[name=templateName]").attr("value");
        var href = "http://docs.fuselms.com/ref/screens";
        href += page;
        window.open(href);
    });
}


/**
 * Make sure you push any required css files into "themeCssFiles" before calling
 *
 * See /static/js/toolbars.js
 */
function initHtmlEditors(elements, height, width, extraPlugins, removePlugins) {
    flog("initHtmlEditors: bs320 height=", height, "removePlugins", removePlugins);
    //flog("initHtmlEditors: elements=", elements, "editorSkin", editorSkin);
//    if (!$('.htmleditor').ckeditor) {
//        log("ckeditor jquery adapter is not loaded");
//        return;/
//    }
    if (!elements) {
        elements = $(".htmleditor");
    }
    if (!extraPlugins) {
        extraPlugins = standardExtraPlugins; // see toolbars.js
    }
    flog("extraPlugins", extraPlugins);
    if (!removePlugins) {
        removePlugins = standardRemovePlugins;
    }
    flog("removePlugins", removePlugins);
    log("prepare html editors", elements);

    elements.each(function (i, n) {
        var inp = $(n);

        var inputClasses = inp.attr("class");
        var id = inp.attr("id");
        var toolbar = "Default";
        if (inputClasses) {
            c = inputClasses.split(" ");
            for (i = 0; i < c.length; i++) {
                var s = c[i];
                if (s.startsWith("toolbar-")) {
                    s = s.substring(8);
                    toolbar = s;
                    break;
                }
            }
        }

        toolbar = "Default"; // HACK!!
        flog("using toolbar", toolbar, "=>", toolbarSets[toolbar]);

        flog("themeCssFiles", themeCssFiles);
        flog("editorSkin", editorSkin);
        var currentFolder = getFolderPath(window.location.pathname);
        var config = {
            skin: editorSkin,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
            contentsCss: themeCssFiles, // mainCssFile,
            bodyId: "editor",
            templates_files: [templatesPath],
            templates_replaceContent: false,
            toolbarGroups: toolbarSets[toolbar],
            extraPlugins: extraPlugins,
            removePlugins: removePlugins,
            enterMode: "P",
            forceEnterMode: true,
            filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
            // filebrowserBrowseUrl: currentFolder + '/_ckbrowser.html?Type=Image&Connector=/fck_connector.html', // TODO
            filebrowserUploadUrl: '/fck_connector.html?CurrentFolder=' + currentFolder,
            format_tags: 'p;h1;h2;h3;h4;h5;h6', // removed p2
            format_p2: {
                element: 'p',
                attributes: {
                    'class': 'lessSpace'
                }
            }
        };

        if (height) {
            config.height = height;
        } else {
            config.height = "300";
        }
        if (width) {
            config.width = width;
        }

        //config.stylesSet = 'myStyles:/theme/styles.js'; // TODO: needs to be configurable, based on theme
        config.stylesSet = "myStyles:" + stylesPath;
        flog("create editor", inp, config);
        var editor = inp.ckeditor(config).editor;
        //var editor = CKEDITOR.instances["body"];
        flog("editor instances", CKEDITOR.instances);

    });
}


function initRotation() {
    $(function () {
        flog("initRotation");
        var rotaters = $(".rotate");
        if (rotaters.length === 0) {
            return;
        }
        try {
            var rotateDegrees = 0;

            setInterval(function () {
                if (rotateDegrees === 360) {
                    rotateDegrees = 0;
                } else {
                    rotateDegrees += 2;
                }

                $('.rotate.anticlockwise').rotate(-rotateDegrees);
                $('.rotate.clockwise').rotate(rotateDegrees);
            }, 50);
        } catch (e) {
            flog("initRotation - exception: " + e);
            alert("exception in init rotation");
        }
    });
}


function initPrintLink() {
    var links = $("a.print2");
    flog("initPrintLink", links);
    links.off('click').on('click', function (e) {
        e.preventDefault();
        window.print();
        return false;
    });
}


/**
 *  Although this function is defined here in the theme, it should be called
 *  from each page.
 *
 *  Each page should decide what url to pass as the pageUrl, as this can be used
 *  to share comments across pages (such as when the logical context is the folder
 *  the pages are in, rather then each page)
 *
 *  Eg initComments(window.location.pathname);
 */
function initComments(pageUrl, followBtn, unFollowBtn) {
    log("initComments", pageUrl);

    var fBtn = $(followBtn);
    var unfBtn = $(unFollowBtn);

    fBtn.on('click', function (e) {
        e.preventDefault();

        var url = pageUrl;
        if (!url.endsWith('/')) {
            url += '/';
        }
        url += '_comments';

        $.post(url, {follow: true}, function (resp) {
            if (resp.status) {
                fBtn.hide();
                unfBtn.show();
            } else {
                Msg.info(resp.messages);
            }
        }, 'json');
    });

    unfBtn.on('click', function (e) {
        e.preventDefault();

        var url = pageUrl;
        if (!url.endsWith('/')) {
            url += '/';
        }
        url += '_comments';

        $.post(url, {unfollow: true}, function (resp) {
            if (resp.status) {
                fBtn.show();
                unfBtn.hide();
            } else {
                Msg.info(resp.messages);
            }
        }, 'json');
    });

    $(".hideBtn").click(function () {
        var oldCommentsHidden = $("#comments:visible").length == 0;
        log("store new comments hidden", oldCommentsHidden);
        jQuery.cookie("commentsHidden", !oldCommentsHidden, {
            path: "/"
        });
        $("#comments").toggle(100, function () {
            if (!oldCommentsHidden) {
                $(".hideBtn a").text("Show comments");
                $(".hideBtn a").addClass("ishidden");
            } else {
                $(".hideBtn a").text("Hide comments");
                $(".hideBtn a").removeClass("ishidden");
            }
        });
        return false;
    });
    var commentsHidden = jQuery.cookie("commentsHidden", {
        path: "/"
    });
    log("comments hidden", commentsHidden);
    if (commentsHidden === "true") {
        $("#comments").hide();
        $(".hideBtn a").text("Show comments");
        $(".hideBtn a").addClass("ishidden");
    }

    $("body").on("click focus", ".commentContainer textarea", function (e) {
        $(e.target).closest("div").find(".commentControls").show();
    });
    $('.commentContainer textarea').css('overflow', 'hidden').autogrow()

    var currentUser = {
        name: userName,
        href: userUrl,
        photoHref: "/profile/pic"
    };

    // This is for deferred logins, ie someone logs in after going to a page with comments
    $('body').on('userLoggedIn', function (event, userUrl, userName) {
        currentUser.name = userName;
        currentUser.href = userUrl;
    });

    var comments = $("#comments");
    if (comments.length > 0) {
        comments.comments({
            currentUser: currentUser,
            pageUrl: pageUrl
        });
    }
}


function initSelectAll() {
    $("body").on("click", ".selectAll", function (e) {
        var node = $(e.target);
        log("selectall", node, node.is(":checked"));
        var chkName = node.attr("name");
        var checked = node.is(":checked");
        checkBoxes = node.closest("table").find("tbody td input:[type=checkbox]:[name=" + chkName + "]");
        if (checked) {
            checkBoxes.attr("checked", "true");
        } else {
            checkBoxes.removeAttr("checked");
        }
    });
}


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
    $.getScript("/static/jwplayer/6.10/jwplayer.js", function () {
        $.getScript("/static/jwplayer/6.10/jwplayer.html5.js", function () {
            jwplayer.key = "cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=";
            replaceImagesWithJWPlayer(images);
        });
    });
}

function replaceImagesWithJWPlayer(images) {
    // will not transform images which in /contenteditor page
    if ($(document.body).hasClass('content-editor-page'))
        return;

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
        src += "/alt-hls.m3u8";
        flog("jwplayer item", img, i, src);
        buildJWPlayer(img, i + 10, src, posterUrl, aspectratio, autostart, repeat, controls);
    });
}


function buildJWPlayer(itemToReplace, count, src, posterHref, aspectratio, autostart, repeat, controls) {
    var h = itemToReplace.height();
    if (h < 100) {
        h = 360;
    }
    var w = itemToReplace.width();
    if (w < 100) {
        w = 640;
    }

    if (!aspectratio) {
        aspectratio = w + ":" + h;
    }

    var div = buildJWPlayerContainer(count);
    log("buildJWPlayer", src, "size=", h, w);
    itemToReplace.replaceWith(div);
    var innerId = div.find(".jw-video").attr("id");
    flog("HACK using src");
    jwplayer(innerId).setup({
//        file: src,
//        height: h,
//        image: posterHref,
        flashplayer: "/static/jwplayer/6.10/jwplayer.flash.swf",
        html5player: "/static/jwplayer/6.10/jwplayer.html5.js",
        width: "100%",
        aspectratio: aspectratio,
        autostart: autostart,
        repeat: repeat,
        controls: controls,
        androidhls: true, //enable hls on android 4.1+
        playlist: [{
            image: posterHref,
            sources: [{
                file: src
            }
                , {
                    file: src + "/../alt-640-360.webm"
                }, {
                    file: src + "/../alt-640-360.m4v"
                }]
        }]
        , primary: "flash"
    });
    jwplayer(innerId).onReady(function () {
        var wrapperId = innerId + "_wrapper";
        var wrapper = $("#" + wrapperId);
        wrapper.addClass("jwplayer-wrapper");
    });

}

function buildJWPlayerContainer(count) {
    var c = "<div class='jw_container_outer'><div id='jw_container_" + count + "' class='jw-video'></div></div>";
    return $(c);
}

function buildJWAudioPlayer(count, src, autostart) {
    var playerInstance = jwplayer("kaudio-player-" + count);
    var isHash = src.indexOf('/_hashes/files/') === 0;

    playerInstance.setup({
        file: src + (isHash ? '.mp3' : ''),
        width: '100%',
        height: 30,
        autostart: autostart,
        flashplayer: "/static/jwplayer/6.10/jwplayer.flash.swf",
        html5player: "/static/jwplayer/6.10/jwplayer.html5.js",
        primary: "flash"
    });
    playerInstance.onReady(function () {
        log('jwplayer init done');
    });
}

function doInitAudio() {
    var images = $('img[data-kaudio]');
    if (images.length === 0) {
        return;
    }
    $.getScript("/static/jwplayer/6.10/jwplayer.js", function () {
        jwplayer.key = "cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=";
        replaceImagesWithAudio(images);
    });
}

function initAudios() {
    doInitAudio();
    $(document).on("pjaxComplete", function () {
        doInitAudio();
    });
}
function replaceImagesWithAudio(images) {
    // will not transform images which in /contenteditor page
    if ($(document.body).hasClass('content-editor-page'))
        return;

    images.each(function (i, n) {
        var img = $(n);
        var src = img.attr("data-kaudio");
        var width = img.attr("data-width");
        var autostart = img.attr("data-autostart") === 'true';
        if (!width) {
            width = 300;
        }
        img.wrap('<div style="width: ' + width + 'px; max-width: 100%; margin-left: auto; margin-right: auto" ></div>');
        if (src) {
            log("replaceImagesWithAudio: Using data-kaudio", src);
            var audioWrap = $('<div id="kaudio-player-' + i + '" />');
            audioWrap.insertAfter(img);
            img.hide();
            buildJWAudioPlayer(i, src, autostart);
        } else {
            log("replaceImagesWithAudio: audio not found", src);
        }
    });
}

function initTablesForCkeditor() {
    //flog('checking tables for cellpadding or cellspacing since bootstrap doesnt support this');
    $('table').each(function () {
        var cellPadding = $(this).attr('cellpadding');
        var cellSpacing = $(this).attr('cellspacing');
        if (cellSpacing) {
            // Support cellpadding and cellspacing in css way
            flog('cellspacing found', this, cellSpacing);
            $(this).css({
                'border-collapse': 'separate',
                'border-spacing': cellSpacing + 'px'
            });
            $(this).removeAttr('cellspacing');
        }
        if (cellPadding) {
            flog('cellPadding found', this, cellPadding);
            $(this).find('th,td').css({'padding': cellPadding + 'px'});
            $(this).removeAttr('cellpadding');
        }
    })
}
/** End init-theme.js */