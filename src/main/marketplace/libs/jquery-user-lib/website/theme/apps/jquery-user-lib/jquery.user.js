/**
 * jquery.user.js
 * @depends: user.js, common.js, jquery.forms (v1.1.0+)
 *
 * The target should be a div containing
 * - a form
 * - <p> with id validationMessage
 * - input type text for the username
 * - input type password for the password
 *
 * Additionally, will prompt the user to register or login for any links of class requiresUser
 *
 * Configuration:
 * @param {String} urlSuffix Is appended to the current page url to make the url to POST the login request to. Default /.ajax
 * @param {String|Null} afterLoginUrl The page to redirect to after login. Default 'index.html'. There are 4 possibilities:
 *  - null = do a location.reload()
 *  - 'none' - literal value 'none' means no redirect
 *  - 'something' or '' = a relative path, will be evaluated relative to the user's url (returned in cookie)
 *  - '/dashboard' = an absolute path, will be used exactly as given
 *  @param {String} logoutSelector
 *  @param {String} validationMessageSelector
 *  @param {String} requiredFieldsMessage
 *  @param {String} loginFailedMessage
 *  @param {String} userNameProperty Property name to use for username field in sending request to server
 *  @param {String} passwordProperty Property name to use for password field in sending request to server
 *  @param {String} userNameSelector
 *  @param {String} passwordSelector
 *  @param {String} onSuccess Callback will be called after successful login
 */

(function ($) {
    //flog('[jquery.user] DEPRECATED options:');
    //flog('********************************************');
    //flog('- "valiationMessageSelector" is DEPRECATED. Use "validationMessageSelector" instead');
    //flog('- "loginCallback" is DEPRECATED. Use "onSuccess" instead');
    //flog('********************************************');

    $.fn.user = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.user] Method ' + method + ' does not exist on jquery.user');
        }
    };

    $.fn.user.DEFAULT = {
        urlSuffix: '/.dologin',
        afterLoginUrl: null,
        logoutSelector: '.logout',
        requiredFieldsMessage: 'Please enter your credentials.',
        loginFailedMessage: 'Sorry, those login details were not recognised.',
        userNameProperty: '_loginUserName',
        passwordProperty: '_loginPassword',
        userNameSelector: '[name=email]',
        passwordSelector: '[name=password]',
        onSuccess: function () {
        }
    };

    var methods = {
        init: function (options) {
            var config = $.extend({}, $.fn.user.DEFAULT, options);

            // ==============================================================================
            // Start of DEPRECATED migration
            // ==============================================================================
            if (typeof config.valiationMessageSelector === 'string') {
                config.validationMessageSelector = config.valiationMessageSelector;
            }

            if (typeof config.loginCallback === 'function') {
                config.onSuccess = config.loginCallback;
            }
            // ==============================================================================
            // End of DEPRECATED migration
            // ==============================================================================

            $(document).on('click', config.logoutSelector, function (e) {
                e.preventDefault();
                doLogout();
            });

            initUser();

            // Use a body class to ensure is only initialized once
            $(document.body).not('requiresUserDone').addClass('requiresUserDone').on('click', 'a.registerOrLogin, button.registerOrLogin', function (e) {
                var btn = $(this);
                flog('[jquery.user] Check required user', btn, userUrl);

                if (!userUrl) {
                    e.preventDefault();
                    e.stopPropagation();

                    showRegisterOrLoginModal(function () {
                        btn.removeClass('registerOrLogin');

                        if (btn.is('a')) {
                            flog('[jquery.user] Going to', btn.attr('href'));
                            window.location.href = btn.attr('href');
                        } else {
                            var form = btn.closest('form');
                            flog('[jquery.user] Submit the form', form);
                            form.trigger('click');
                        }
                    });
                } else {
                    flog('[jquery.user] All good, carry on...');
                }
            });

            return $(this).each(function () {
                var container = $(this);

                if (container.data('userOptions')) {
                    flog('[jquery.user] Already initialized');
                    return;
                } else {
                    container.data('userOptions', config);
                }

                var form = container.find('form');

                form.on('submit', function (e) {
                    flog('[jquery.user] On submit', form);
                    e.stopPropagation();
                    e.preventDefault();

                    resetValidation(container);

                    try {
                        var txtUserName = form.find(config.userNameSelector);
                        var userName = txtUserName.val();
                        var txtPassword = form.find(config.passwordSelector);
                        var password = txtPassword.val();

                        if (userName && password) {
                            doLogin(userName, password, config, form);
                        } else {
                            showErrorField(txtUserName);
                            showErrorField(txtPassword);
                            showErrorMessage(form, config, config.requiredFieldsMessage);
                        }
                    } catch (e) {
                        flog('[jquery.user] Exception logging in', e);
                    }
                });
            });
        }
    };

})(jQuery);

function doLogin(userName, password, config, form) {
    flog('[jquery.user] doLogin', userName, config, form);

    var data = {};
    var userNameProperty;
    if (config.userNameProperty) {
        userNameProperty = config.userNameProperty;
    } else {
        userNameProperty = '_loginUserName';
    }
    data[userNameProperty] = userName;

    var passwordProperty;
    if (config.passwordProperty) {
        passwordProperty = config.passwordProperty;
    } else {
        passwordProperty = '_loginPassword';
    }
    data[passwordProperty] = password;

    var chk = form.find('input[name=keepLoggedIn]');
    if (chk) {
        var keepLoggedIn = chk.prop('checked');
        data['keepLoggedIn'] = keepLoggedIn;
    }

    flog('[jquery.user] Login data', data);

    $.ajax({
        type: 'POST',
        url: config.urlSuffix,
        data: data,
        dataType: 'json',
        acceptsMap: 'application/x-javascript',
        success: function (resp) {
            if (resp.status) {
                flog('[jquery.user] Login success', resp);
                initUser();

                if (typeof config.onSuccess ==='function') {
                    config.onSuccess.call(this);
                }

                if (config.afterLoginUrl === null) {
                    // If not url in config then use the next href in the response, if given, else reload current page
                    if (resp.nextHref) {
                        window.location.href = resp.nextHref;
                    } else {
                        window.location.reload(true);
                    }
                } else if (config.afterLoginUrl.startsWith('/')) {
                    // if config has an absolute path the redirect to it
                    log('[jquery.user] Redirecting to absolute path: ' + config.afterLoginUrl);
                    window.location = config.afterLoginUrl;
                } else {
                    if (config.afterLoginUrl === 'none') {
                        flog('[jquery.user] Not doing redirect because afterLoginUrl="none"');
                    } else if (config.afterLoginUrl === 'reload') {
                        window.location.reload(true);
                    } else {
                        // if config has a relative path, then evaluate it relative to the user's own url in response
                        flog('[jquery.user] Redirecting to relative path: ' + userUrl + config.afterLoginUrl);
                        window.location = userUrl + config.afterLoginUrl;
                    }
                }
            } else {
                flog('null userUrl, so failed. Set validation message message');
                showErrorMessage(form, config, config.loginFailedMessage);
            }
        },
        error: function (resp) {
            flog('[jquery.user] Error response from server', resp);
            showErrorMessage(form, config, config.loginFailedMessage);
        }
    });
}

var userUrl = null;
var userName = null;
/**
 * returns true if there is a valid user
 */
function initUser() {
    if (userUrl) {
        return true; // already done
    }

    initUserCookie();

    var body = $(document.body);
    if (isEmpty(userUrl)) {
        // no cookie, so authentication hasn't been performed.

        $('.requiresUser').hide();
        $('.sansuser').show();
        body.addClass('notLoggedIn');

        return false;
    } else {
        userName = userUrl.substr(0, userUrl.length - 1); // drop trailing slash
        var pos = userUrl.indexOf('users');
        userName = userName.substring(pos + 6);

        flog('[jquery.user] current userName: ' + userName);

        $('.requiresUser').show();
        $('.sansuser').hide();
        body.addClass('isLoggedIn');

        $('#currentuser').attr('href', userUrl);
        $('a.relativeToUser').each(function () {
            var a = $(this);
            var oldHref = a.attr('href');
            a.attr('href', userUrl + oldHref);
        });

        return true;
    }
}

function initUserCookie() {
    userUrl = $.cookie('miltonUserUrl');

    if (userUrl && userUrl.length > 1) {

        if (userUrl.startsWith('b64')) {
            userUrl = userUrl.substring(3); // strip b64 ext
            userUrl = Base64.decode(userUrl);
        }
        userUrl = dropQuotes(userUrl);
        userUrl = dropHost(userUrl);
        userName = userUrl.substr(0, userUrl.length - 1); // drop trailing slash

        var pos = userUrl.indexOf('users');
        userName = userName.substring(pos + 6);

    } else {
        userName = null;
    }
}

function isEmpty(s) {
    return s == null || s.length == 0;
}

function doLogout() {
    flog('[jquery.user] doLogout');

    $.ajax({
        type: 'POST',
        url: '/.dologin',
        data: 'miltonLogout=true',
        dataType: 'text',
        success: function () {
            flog('[jquery.user] Logged out ok, going to root...');
            window.location = '/';
        },
        error: function (resp) {
            flog('[jquery.user] There was a problem logging you out', resp);
            window.location = '/';
        }
    });
}

function dropQuotes(s) {
    if (s.startsWith('\'')) {
        s = s.substr(1);
    }
    if (s.endsWith('\'')) {
        s = s.substr(0, s.length - 1);
    }
    return s;
}

function dropHost(s) {
    if (!s.startsWith('http')) {
        return s;
    }
    var pos = s.indexOf('/', 8);
    flog('pos', pos);
    s = s.substr(pos);
    return s;
}

function showRegisterOrLoginModal(callbackOnLoggedIn) {
    var body = $(document.body);
    var modal = $('#registerOrLoginModal');
    if (modal.length === 0) {
        body.append(
            '<div class="modal fade" id="registerOrLoginModal">' +
            '   <div class="modal-dialog">' +
            '       <div class="modal-content">' +
            '           <div class="modal-header">' +
            '               <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '               <h3>Login or Register</h3>' +
            '           </div>' +
            '           <div class="modal-body">Please wait...</div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
        );
        modal = $('#registerOrLoginModal');
    }

    flog('[jquery.user] showRegisterOrLoginModal');

    $.getScript('/theme/apps/signup/register.js', function () {
        $.ajax({
            type: 'GET',
            url: 'registerOrLogin',
            dataType: 'html',
            success: function (resp) {
                var r = $('<div />').html(resp).find('.registerOrLoginCont');
                modal.find('.modal-body').html(r);

                $('.loginCont').user({
                    afterLoginUrl: 'none',
                    loginCallback: function () {
                        flog('[jquery.user] Logged in ok');
                        modal.modal('hide');
                        body.trigger('userLoggedIn', [userUrl, userName]);

                        if (typeof callbackOnLoggedIn === 'function') {
                            flog('[jquery.user] Process callback', callbackOnLoggedIn);
                            callbackOnLoggedIn();
                        }
                    }
                });

                initRegisterForms('none', function () {
                    flog('[jquery.user] Registered and logged in ok');
                    modal.modal('hide');
                    body.trigger('userLoggedIn', [userUrl, userName]);

                    if (typeof callbackOnLoggedIn === 'function') {
                        flog('[jquery.user] Process callback', callbackOnLoggedIn);
                        callbackOnLoggedIn();
                    }
                });
            },
            error: function (resp) {
                flog('[jquery.user] Error when getting register.js', resp);
                modal.find('.modal-body').html('<p>Sorry, there was a problem loading the form. Please refresh the page and try again</p>');
            }
        });

    });

    modal.modal('show');
}
