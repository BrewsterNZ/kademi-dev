/**
 *
 *  jquery.login.js
 *
 *  Depends on user.js and common.js
 *
 *  The target should be a div containing
 *  - a form
 *  - <p> with id validationMessage
 *  - input type text for the username
 *  - input type password for the password
 *
 * Config:
 * urlSuffix: is appended to the current page url to make the url to POST the login request to. Default /.ajax
 * afterLoginUrl: the page to redirect to after login. Default index.html.  3 possibilities
 *      null = redirect to nextHref if provided from server, else do a location.reload()
 *      "reload" - literal value means always do location.reload()
 *      "none" - literal value "none" means no redirect
 *      "something" or "" = a relative path, will be avaluated relative to the user's url (returned in cookie)
 *      "/dashboard" = an absolute path, will be used exactly as given
 *  logoutSelector
 *  valiationMessageSelector
 *  requiredFieldsMessage
 *  loginFailedMessage
 *  userNameProperty: property name to use in sending request to server
 *  passwordProperty
 *  loginCallback: called after successful login
 *
 */

(function( $ ) {
    $.fn.user = function(options) {
        initUser();
        var config = $.extend( {
            urlSuffix: "/.dologin",
            afterLoginUrl: null,
            logoutSelector: ".logout",
            valiationMessageSelector: "#validationMessage",
	        valiationMessageText: '#validationMessage',
            requiredFieldsMessage: "Please enter your credentials.",
            loginFailedMessage: "Sorry, those login details were not recognised.",
            userNameProperty: "_loginUserName",
            passwordProperty: "_loginPassword",
            secondFactorProperty: "_login2FA",
            secondFactorModalSelector: "#modal-2fa-input",
            secondFactorValidationMessageText: "#validationMessage2FA",
            secondFactorValidationMessage: "The 2FA code is incorrect. Try again.",
            loginCallback: function() {

            }
        }, options);

        $(config.logoutSelector).click(function() {
            doLogout();
        });

        var getUserName = function(){ return $("input[name=email]", container).val();  }
        var getPassword = function(){ return $("input[name=password]", container).val(); }
        var getLogin2FA = function(){ return $("#login2FA", container).val();  }

        var container = this;
        var form = $("form", this);
        form.submit(function() {
            $("input", container).removeClass("errorField");
            $(config.valiationMessageSelector, this).hide(100);
            try {
                var userName = getUserName();
                var password = getPassword();
                var login2FA = getLogin2FA();

                if( userName == null || userName.length == 0 ) {
                    $("input[type=text]", container).addClass("errorField");
                    $(config.valiationMessageText, container).text(config.requiredFieldsMessage);
                    $(config.valiationMessageSelector, container).show(200);
                    return false;
                }
                doLogin(userName, password, login2FA, config, container);
            } catch(e) {
                flog("exception doing login", e);
            }
            return false;
        });


        $(".login2FA").on("click", function(){
           flog("Doing login with 2FA");
           try{
                var container = this;
                var userName = getUserName();
                var password = getPassword();
                var login2FA = getLogin2FA();

                doLogin(userName, password, login2FA, config, container);
            } catch(e) {
                flog("exception doing login with 2FA", e);
            }
            return false;
        });
    };
})( jQuery );

function showLoginFailedMessage(config, resp){
    $(config.valiationMessageText).text(config.loginFailedMessage);
    flog("error response from server, set message. msg output:", $(config.valiationMessageSelector, this), "config msg:", config.loginFailedMessage, "resp:", resp);
    $(config.valiationMessageSelector).show(300);
}

function doLogin(userName, password, login2FA, config, container) {
    flog("doLogin", userName, login2FA, config.urlSuffix);
    $(config.valiationMessageSelector).hide();
    var data = new Object();
    var userNameProperty;
    if( config.userNameProperty ) {
        userNameProperty = config.userNameProperty;
    } else {
        userNameProperty = "_loginUserName";
    }
    var passwordProperty;
    if( config.passwordProperty ) {
        passwordProperty = config.passwordProperty;
    } else {
        passwordProperty = "_loginPassword";
    }

    var login2FAProperty;
    if( config.login2FAProperty ) {
        login2FAProperty = config.login2FAProperty;
    } else {
        login2FAProperty = "_login2FA";
    }

    data[userNameProperty] = userName;
    data[passwordProperty] = password;
    data[login2FAProperty] = login2FA;

    flog(data);

    $.ajax({
        type: 'POST',
        url: config.urlSuffix,
        data: data,
        dataType: "json",
        acceptsMap: "application/x-javascript",
        success: function(resp) {
            console.log(resp);

            flog("received login response", resp)
            initUser();
            if( resp.status ) {
                flog("login success", resp.status);

                if( config.loginCallback) {
                    config.loginCallback();
                }
                if( config.afterLoginUrl === null) {
                    // If not url in config then use the next href in the response, if given, else reload current page
                    if( resp.nextHref ) {
                        flog("login: no afterLoginUrl and received next href, so go there", resp.nextHref);
                        window.location.href = resp.nextHref;
                    } else {
                        flog("login: no afterLoginUrl and no nextHref, so reload");
                        window.location.reload(true);
                    }
                } else if( config.afterLoginUrl.startsWith("/")) {
                    // if config has an absolute path the redirect to it
                    flog("redirect to1: " + config.afterLoginUrl);
                    //return;
                    window.location = config.afterLoginUrl;
                } else {
                    if( config.afterLoginUrl === "none") {
                        flog("Not doing redirect because afterLoginUrl=='none'");
                    } else if( config.afterLoginUrl === "reload") {
                        flog("Reload current location");
                        window.location.reload(true);
                    } else {
                        // if config has a relative path, then evaluate it relative to the user's own url in response
                        flog("redirect to2: " + userUrl + config.afterLoginUrl);
                        //return;
                        window.location = userUrl + config.afterLoginUrl;
                    }
                }

            } else {
                flog("Login not successful", resp.status);
                // null userurl, so login was not successful
                $(config.valiationMessageText, container).text(config.loginFailedMessage);
                flog("null userUrl, so failed. Set validation message message", $(config.valiationMessageSelector, this), config.loginFailedMessage);
                $(config.valiationMessageSelector, container).show(200);
            }
        //window.location = "/index.html";
        },
        error: function(resp) {
            try {
                if(resp.responseText !== undefined && resp.responseText !== ""){
                    var response = JSON.parse(resp.responseText);
                    if(response.code2FA !== undefined){
                        if( response.code2FA == "REQUIRED" || response.code2FA == "INVALID"){
                            if(response.code2FA == "REQUIRED"){
                                flog("2FA is enabled and required");
                                $(config.secondFactorModalSelector).modal("show");
                            }else{
                                flog("2FA code is invalid");
                                $(config.secondFactorValidationMessageText).text(config.secondFactorValidationMessage);
                                $(config.secondFactorValidationMessageText).show(300);
                            }
                            return;
                        }
                    }
                }else{
                    showLoginFailedMessage(config, resp);
                }
            }catch(err) {
                showLoginFailedMessage(config, resp);
            }
        }
    });
}

var userUrl = null;
var userName = null;

/**
 * returns true if there is a valid user
 */
function initUser() {
    if( userUrl ) {
        return true; // already done
    }
    initUserCookie();
    flog("initUser");
    if( isEmpty(userUrl) ) {
        // no cookie, so authentication hasnt been performed.
        flog('initUser: no userUrl');
        $(".requiresuser").hide();
        $(".sansuser").show();
        $("body").addClass("notLoggedIn");
        return false;
    } else {
        flog("userUrl", userUrl);
        $("body").addClass("isLoggedIn");
        userName = userUrl.substr(0, userUrl.length-1); // drop trailing slash
        var pos = userUrl.indexOf("users");
        userName = userName.substring(pos+6);
        $("#currentuser").attr("href", userUrl);
        $(".requiresuser").show();
        $(".sansuser").hide();
        $("a.relativeToUser").each(function(i, node) {
            var oldHref = $(node).attr("href");
            $(node).attr("href", userUrl + oldHref);
        });
        return true;
    }
}

function initUserCookie() {
    userUrl = $.cookie('miltonUserUrl');
    if( userUrl && userUrl.length > 1 ) {
        if( userUrl.startsWith("b64")) { // milton will append b64 if the url is base64 encoded
            userUrl = userUrl.substr(3);
            userUrl = Base64.decode(userUrl);
        }
        userUrl = dropQuotes(userUrl);
        userUrl = dropHost(userUrl);
        userName = userUrl.substr(0, userUrl.length-1); // drop trailing slash
        var pos = userUrl.indexOf("users");
        userName = userName.substring(pos+6);
        flog('initUserCookie: user:',userUrl, userName);
    } else {
        flog("initUserCookie: no user cookie");
        userName = null;
    }
}

function isEmpty(s) {
    return s == null || s.length == 0;
}

function doLogout() {
    flog("doLogout - common");
    $.ajax({
        type: 'POST',
        url: "/.dologin",
        data: "miltonLogout=true",
        dataType: "text",
        success: function() {
            flog("logged out ok, going to root...");
            window.location = "/";
        },
        error: function(resp) {
            flog('There was a problem logging you out, a 400 error is expected', resp);
            window.location = "/";
        }
    });
}


function dropQuotes(s) {
    if( s.startsWith("\"") ) {
        s = s.substr(1);
    }
    if( s.endsWith("\"") ) {
        s = s.substr(0, s.length-1);
    }
    return s;
}

function dropHost(s) {
    if( !s.startsWith("http")) {
        return s;
    }
    var pos = s.indexOf("/",8);
    flog("pos",pos);
    s = s.substr(pos);
    return s;
}

function showRegisterOrLoginModal(callbackOnLoggedIn) {
    var modal = $("#registerOrLoginModal");
    if( modal.length === 0 ) {
        modal = $("<div id='registerOrLoginModal' class='Modal' style='min-height: 300px'><a href='#' class='Close' title='Close'>Close</a><div class='modalContent'>");
        $("body").append(modal);
    }
    flog("showRegisterOrLoginModal", 1);
    $.getScript("/theme/apps/signup/register.js", function() {
        $.ajax({
            type: 'GET',
            url: "/registerOrLogin",
            dataType: "html",
            success: function(resp) {
                var page = $(resp);
                var r = page.find(".registerOrLoginCont");
                flog("content", page, "r", r);
                modal.find(".modalContent").html(r);
                flog("modal", modal);
                $("td.loginCont").user({
                    afterLoginUrl: "none",
                    loginCallback: function() {
                        flog("logged in ok, process callback");
                        $('body').trigger('userLoggedIn', [userUrl, userName]);
                        callbackOnLoggedIn();
                        $.tinybox.close();
                    }
                });
                initRegisterForms("none", function() {
                    flog("registered and logged in ok, process callback");
                    $('body').trigger('userLoggedIn', [userUrl, userName]);
                    callbackOnLoggedIn();
                    $.tinybox.close();
                });
            },
            error: function(resp) {
                flog('There was a problem logging you out', resp);
            }
        });

    });
    $.tinybox.show(modal, {
        overlayClose: false,
        opacity: 0
    });
}

/** End jquery.login.js */