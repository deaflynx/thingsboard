/*
 * Copyright © 2016-2020 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
///
/// Copyright © 2016-2020 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var angular_jwt_1 = require("@auth0/angular-jwt");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var http_utils_1 = require("../http/http-utils");
var ReplaySubject_1 = require("rxjs/internal/ReplaySubject");
var auth_actions_1 = require("./auth.actions");
var auth_selectors_1 = require("./auth.selectors");
var authority_enum_1 = require("@shared/models/authority.enum");
var settings_actions_1 = require("@app/core/settings/settings.actions");
var page_link_1 = require("@shared/models/page/page-link");
var notification_actions_1 = require("@core/notification/notification.actions");
var AuthService = /** @class */ (function () {
    function AuthService(store, http, userService, timeService, router, route, zone, utils, dashboardService, adminService, translate) {
        this.store = store;
        this.http = http;
        this.userService = userService;
        this.timeService = timeService;
        this.router = router;
        this.route = route;
        this.zone = zone;
        this.utils = utils;
        this.dashboardService = dashboardService;
        this.adminService = adminService;
        this.translate = translate;
        this.refreshTokenSubject = null;
        this.jwtHelper = new angular_jwt_1.JwtHelperService();
    }
    AuthService_1 = AuthService;
    AuthService._storeGet = function (key) {
        return localStorage.getItem(key);
    };
    AuthService.isTokenValid = function (prefix) {
        var clientExpiration = AuthService_1._storeGet(prefix + '_expiration');
        return clientExpiration && Number(clientExpiration) > (new Date().valueOf() + 2000);
    };
    AuthService.isJwtTokenValid = function () {
        return AuthService_1.isTokenValid('jwt_token');
    };
    AuthService.clearTokenData = function () {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('jwt_token_expiration');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('refresh_token_expiration');
    };
    AuthService.getJwtToken = function () {
        return AuthService_1._storeGet('jwt_token');
    };
    AuthService.prototype.reloadUser = function () {
        var _this = this;
        this.loadUser(true).subscribe(function (authPayload) {
            _this.notifyAuthenticated(authPayload);
            _this.notifyUserLoaded(true);
        }, function () {
            _this.notifyUnauthenticated();
            _this.notifyUserLoaded(true);
        });
    };
    AuthService.prototype.login = function (loginRequest) {
        var _this = this;
        return this.http.post('/api/auth/login', loginRequest, http_utils_1.defaultHttpOptions()).pipe(operators_1.tap(function (loginResponse) {
            _this.setUserFromJwtToken(loginResponse.token, loginResponse.refreshToken, true);
        }));
    };
    AuthService.prototype.publicLogin = function (publicId) {
        var publicLoginRequest = {
            publicId: publicId
        };
        return this.http.post('/api/auth/login/public', publicLoginRequest, http_utils_1.defaultHttpOptions());
    };
    AuthService.prototype.sendResetPasswordLink = function (email) {
        return this.http.post('/api/noauth/resetPasswordByEmail', { email: email }, http_utils_1.defaultHttpOptions());
    };
    AuthService.prototype.activate = function (activateToken, password) {
        var _this = this;
        return this.http.post('/api/noauth/activate', { activateToken: activateToken, password: password }, http_utils_1.defaultHttpOptions()).pipe(operators_1.tap(function (loginResponse) {
            _this.setUserFromJwtToken(loginResponse.token, loginResponse.refreshToken, true);
        }));
    };
    AuthService.prototype.resetPassword = function (resetToken, password) {
        var _this = this;
        return this.http.post('/api/noauth/resetPassword', { resetToken: resetToken, password: password }, http_utils_1.defaultHttpOptions()).pipe(operators_1.tap(function (loginResponse) {
            _this.setUserFromJwtToken(loginResponse.token, loginResponse.refreshToken, true);
        }));
    };
    AuthService.prototype.changePassword = function (currentPassword, newPassword) {
        return this.http.post('/api/auth/changePassword', { currentPassword: currentPassword, newPassword: newPassword }, http_utils_1.defaultHttpOptions());
    };
    AuthService.prototype.activateByEmailCode = function (emailCode) {
        return this.http.post("/api/noauth/activateByEmailCode?emailCode=" + emailCode, null, http_utils_1.defaultHttpOptions());
    };
    AuthService.prototype.resendEmailActivation = function (email) {
        return this.http.post("/api/noauth/resendEmailActivation?email=" + email, null, http_utils_1.defaultHttpOptions());
    };
    AuthService.prototype.loginAsUser = function (userId) {
        var _this = this;
        return this.http.get("/api/user/" + userId + "/token", http_utils_1.defaultHttpOptions()).pipe(operators_1.tap(function (loginResponse) {
            _this.setUserFromJwtToken(loginResponse.token, loginResponse.refreshToken, true);
        }));
    };
    AuthService.prototype.logout = function (captureLastUrl) {
        var _this = this;
        if (captureLastUrl === void 0) { captureLastUrl = false; }
        if (captureLastUrl) {
            this.redirectUrl = this.router.url;
        }
        this.http.post('/api/auth/logout', null, http_utils_1.defaultHttpOptions(true, true))
            .subscribe(function () {
            _this.clearJwtToken();
        }, function () {
            _this.clearJwtToken();
        });
    };
    AuthService.prototype.notifyUserLoaded = function (isUserLoaded) {
        this.store.dispatch(new auth_actions_1.ActionAuthLoadUser({ isUserLoaded: isUserLoaded }));
    };
    AuthService.prototype.gotoDefaultPlace = function (isAuthenticated) {
        var _this = this;
        var authState = auth_selectors_1.getCurrentAuthState(this.store);
        var url = this.defaultUrl(isAuthenticated, authState);
        this.zone.run(function () {
            _this.router.navigateByUrl(url);
        });
    };
    AuthService.prototype.forceDefaultPlace = function (authState, path, params) {
        if (authState && authState.authUser) {
            if (authState.authUser.authority === authority_enum_1.Authority.TENANT_ADMIN || authState.authUser.authority === authority_enum_1.Authority.CUSTOMER_USER) {
                if ((this.userHasDefaultDashboard(authState) && authState.forceFullscreen) || authState.authUser.isPublic) {
                    if (path === 'profile') {
                        if (this.userHasProfile(authState.authUser)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    else if (path.startsWith('dashboard.') || path.startsWith('dashboards.') &&
                        authState.allowedDashboardIds.indexOf(params.dashboardId) > -1) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    AuthService.prototype.defaultUrl = function (isAuthenticated, authState, path, params) {
        var _this = this;
        var result = null;
        if (isAuthenticated) {
            if (!path || path === 'login' || this.forceDefaultPlace(authState, path, params)) {
                if (this.redirectUrl) {
                    var redirectUrl = this.redirectUrl;
                    this.redirectUrl = null;
                    result = this.router.parseUrl(redirectUrl);
                }
                else {
                    result = this.router.parseUrl('home');
                }
                if (authState.authUser.authority === authority_enum_1.Authority.TENANT_ADMIN || authState.authUser.authority === authority_enum_1.Authority.CUSTOMER_USER) {
                    if (this.userHasDefaultDashboard(authState)) {
                        var dashboardId = authState.userDetails.additionalInfo.defaultDashboardId;
                        if (authState.forceFullscreen) {
                            result = this.router.parseUrl("dashboard/" + dashboardId);
                        }
                        else {
                            result = this.router.parseUrl("dashboards/" + dashboardId);
                        }
                    }
                    else if (authState.authUser.isPublic) {
                        result = this.router.parseUrl("dashboard/" + authState.lastPublicDashboardId);
                    }
                }
                else if (authState.authUser.authority === authority_enum_1.Authority.SYS_ADMIN) {
                    this.adminService.checkUpdates().subscribe(function (updateMessage) {
                        if (updateMessage && updateMessage.updateAvailable) {
                            _this.store.dispatch(new notification_actions_1.ActionNotificationShow({ message: updateMessage.message,
                                type: 'info',
                                verticalPosition: 'bottom',
                                horizontalPosition: 'right' }));
                        }
                    });
                }
            }
        }
        else {
            result = this.router.parseUrl('login');
        }
        return result;
    };
    AuthService.prototype.loadUser = function (doTokenRefresh) {
        var _this = this;
        var authUser = auth_selectors_1.getCurrentAuthUser(this.store);
        if (!authUser) {
            var publicId = this.utils.getQueryParam('publicId');
            var accessToken = this.utils.getQueryParam('accessToken');
            var refreshToken = this.utils.getQueryParam('refreshToken');
            if (publicId) {
                return this.publicLogin(publicId).pipe(operators_1.mergeMap(function (response) {
                    _this.updateAndValidateToken(response.token, 'jwt_token', false);
                    _this.updateAndValidateToken(response.refreshToken, 'refresh_token', false);
                    return _this.procceedJwtTokenValidate();
                }), operators_1.catchError(function (err) {
                    _this.utils.updateQueryParam('publicId', null);
                    throw Error();
                }));
            }
            else if (accessToken) {
                this.utils.updateQueryParam('accessToken', null);
                if (refreshToken) {
                    this.utils.updateQueryParam('refreshToken', null);
                }
                try {
                    this.updateAndValidateToken(accessToken, 'jwt_token', false);
                    if (refreshToken) {
                        this.updateAndValidateToken(refreshToken, 'refresh_token', false);
                    }
                    else {
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('refresh_token_expiration');
                    }
                }
                catch (e) {
                    return rxjs_1.throwError(e);
                }
                return this.procceedJwtTokenValidate();
            }
            return this.procceedJwtTokenValidate(doTokenRefresh);
        }
        else {
            return rxjs_1.of({});
        }
    };
    AuthService.prototype.procceedJwtTokenValidate = function (doTokenRefresh) {
        var _this = this;
        var loadUserSubject = new ReplaySubject_1.ReplaySubject();
        this.validateJwtToken(doTokenRefresh).subscribe(function () {
            var authPayload = {};
            var jwtToken = AuthService_1._storeGet('jwt_token');
            authPayload.authUser = _this.jwtHelper.decodeToken(jwtToken);
            if (authPayload.authUser && authPayload.authUser.scopes && authPayload.authUser.scopes.length) {
                authPayload.authUser.authority = authority_enum_1.Authority[authPayload.authUser.scopes[0]];
            }
            else if (authPayload.authUser) {
                authPayload.authUser.authority = authority_enum_1.Authority.ANONYMOUS;
            }
            if (authPayload.authUser.isPublic) {
                authPayload.forceFullscreen = true;
            }
            if (authPayload.authUser.isPublic) {
                _this.loadSystemParams(authPayload).subscribe(function (sysParams) {
                    authPayload = __assign(__assign({}, authPayload), sysParams);
                    loadUserSubject.next(authPayload);
                    loadUserSubject.complete();
                }, function (err) {
                    loadUserSubject.error(err);
                });
            }
            else if (authPayload.authUser.userId) {
                _this.userService.getUser(authPayload.authUser.userId).subscribe(function (user) {
                    authPayload.userDetails = user;
                    authPayload.forceFullscreen = false;
                    if (_this.userForceFullscreen(authPayload)) {
                        authPayload.forceFullscreen = true;
                    }
                    _this.loadSystemParams(authPayload).subscribe(function (sysParams) {
                        authPayload = __assign(__assign({}, authPayload), sysParams);
                        var userLang;
                        if (authPayload.userDetails.additionalInfo && authPayload.userDetails.additionalInfo.lang) {
                            userLang = authPayload.userDetails.additionalInfo.lang;
                        }
                        else {
                            userLang = null;
                        }
                        _this.notifyUserLang(userLang);
                        loadUserSubject.next(authPayload);
                        loadUserSubject.complete();
                    }, function (err) {
                        loadUserSubject.error(err);
                        _this.logout();
                    });
                }, function (err) {
                    loadUserSubject.error(err);
                    _this.logout();
                });
            }
            else {
                loadUserSubject.error(null);
            }
        }, function (err) {
            loadUserSubject.error(err);
        });
        return loadUserSubject;
    };
    AuthService.prototype.loadIsUserTokenAccessEnabled = function (authUser) {
        if (authUser.authority === authority_enum_1.Authority.SYS_ADMIN ||
            authUser.authority === authority_enum_1.Authority.TENANT_ADMIN) {
            return this.http.get('/api/user/tokenAccessEnabled', http_utils_1.defaultHttpOptions());
        }
        else {
            return rxjs_1.of(false);
        }
    };
    AuthService.prototype.loadSystemParams = function (authPayload) {
        var sources = [this.loadIsUserTokenAccessEnabled(authPayload.authUser),
            this.fetchAllowedDashboardIds(authPayload),
            this.timeService.loadMaxDatapointsLimit()];
        return rxjs_1.forkJoin(sources)
            .pipe(operators_1.map(function (data) {
            var userTokenAccessEnabled = data[0];
            var allowedDashboardIds = data[1];
            return { userTokenAccessEnabled: userTokenAccessEnabled, allowedDashboardIds: allowedDashboardIds };
        }));
    };
    AuthService.prototype.refreshJwtToken = function () {
        var _this = this;
        var response = this.refreshTokenSubject;
        if (this.refreshTokenSubject === null) {
            this.refreshTokenSubject = new ReplaySubject_1.ReplaySubject(1);
            response = this.refreshTokenSubject;
            var refreshToken = AuthService_1._storeGet('refresh_token');
            var refreshTokenValid = AuthService_1.isTokenValid('refresh_token');
            this.setUserFromJwtToken(null, null, false);
            if (!refreshTokenValid) {
                this.refreshTokenSubject.error(new Error(this.translate.instant('access.refresh-token-expired')));
                this.refreshTokenSubject = null;
            }
            else {
                var refreshTokenRequest = {
                    refreshToken: refreshToken
                };
                var refreshObservable = this.http.post('/api/auth/token', refreshTokenRequest, http_utils_1.defaultHttpOptions());
                refreshObservable.subscribe(function (loginResponse) {
                    _this.setUserFromJwtToken(loginResponse.token, loginResponse.refreshToken, false);
                    _this.refreshTokenSubject.next(loginResponse);
                    _this.refreshTokenSubject.complete();
                    _this.refreshTokenSubject = null;
                }, function () {
                    _this.clearJwtToken();
                    _this.refreshTokenSubject.error(new Error(_this.translate.instant('access.refresh-token-failed')));
                    _this.refreshTokenSubject = null;
                });
            }
        }
        return response;
    };
    AuthService.prototype.validateJwtToken = function (doRefresh) {
        var subject = new ReplaySubject_1.ReplaySubject();
        if (!AuthService_1.isTokenValid('jwt_token')) {
            if (doRefresh) {
                this.refreshJwtToken().subscribe(function () {
                    subject.next();
                    subject.complete();
                }, function (err) {
                    subject.error(err);
                });
            }
            else {
                this.clearJwtToken();
                subject.error(null);
            }
        }
        else {
            subject.next();
            subject.complete();
        }
        return subject;
    };
    AuthService.prototype.refreshTokenPending = function () {
        return this.refreshTokenSubject !== null;
    };
    AuthService.prototype.setUserFromJwtToken = function (jwtToken, refreshToken, notify) {
        var _this = this;
        if (!jwtToken) {
            AuthService_1.clearTokenData();
            if (notify) {
                this.notifyUnauthenticated();
            }
        }
        else {
            this.updateAndValidateToken(jwtToken, 'jwt_token', true);
            this.updateAndValidateToken(refreshToken, 'refresh_token', true);
            if (notify) {
                this.notifyUserLoaded(false);
                this.loadUser(false).subscribe(function (authPayload) {
                    _this.notifyUserLoaded(true);
                    _this.notifyAuthenticated(authPayload);
                }, function () {
                    _this.notifyUserLoaded(true);
                    _this.notifyUnauthenticated();
                });
            }
            else {
                this.loadUser(false).subscribe();
            }
        }
    };
    AuthService.prototype.parsePublicId = function () {
        var token = AuthService_1.getJwtToken();
        if (token) {
            var tokenData = this.jwtHelper.decodeToken(token);
            if (tokenData && tokenData.isPublic) {
                return tokenData.sub;
            }
        }
        return null;
    };
    AuthService.prototype.notifyUnauthenticated = function () {
        this.store.dispatch(new auth_actions_1.ActionAuthUnauthenticated());
    };
    AuthService.prototype.notifyAuthenticated = function (authPayload) {
        this.store.dispatch(new auth_actions_1.ActionAuthAuthenticated(authPayload));
    };
    AuthService.prototype.notifyUserLang = function (userLang) {
        this.store.dispatch(new settings_actions_1.ActionSettingsChangeLanguage({ userLang: userLang }));
    };
    AuthService.prototype.updateAndValidateToken = function (token, prefix, notify) {
        var valid = false;
        var tokenData = this.jwtHelper.decodeToken(token);
        var issuedAt = tokenData.iat;
        var expTime = tokenData.exp;
        if (issuedAt && expTime) {
            var ttl = expTime - issuedAt;
            if (ttl > 0) {
                var clientExpiration = new Date().valueOf() + ttl * 1000;
                localStorage.setItem(prefix, token);
                localStorage.setItem(prefix + '_expiration', '' + clientExpiration);
                valid = true;
            }
        }
        if (!valid && notify) {
            this.notifyUnauthenticated();
        }
    };
    AuthService.prototype.clearJwtToken = function () {
        this.setUserFromJwtToken(null, null, true);
    };
    AuthService.prototype.userForceFullscreen = function (authPayload) {
        return (authPayload.authUser && authPayload.authUser.isPublic) ||
            (authPayload.userDetails && authPayload.userDetails.additionalInfo &&
                authPayload.userDetails.additionalInfo.defaultDashboardFullscreen &&
                authPayload.userDetails.additionalInfo.defaultDashboardFullscreen === true);
    };
    AuthService.prototype.userHasProfile = function (authUser) {
        return authUser && !authUser.isPublic;
    };
    AuthService.prototype.userHasDefaultDashboard = function (authState) {
        if (authState && authState.userDetails && authState.userDetails.additionalInfo
            && authState.userDetails.additionalInfo.defaultDashboardId) {
            return true;
        }
        else {
            return false;
        }
    };
    AuthService.prototype.fetchAllowedDashboardIds = function (authPayload) {
        if (authPayload.forceFullscreen && (authPayload.authUser.authority === authority_enum_1.Authority.TENANT_ADMIN ||
            authPayload.authUser.authority === authority_enum_1.Authority.CUSTOMER_USER)) {
            var pageLink = new page_link_1.PageLink(100);
            var fetchDashboardsObservable = void 0;
            if (authPayload.authUser.authority === authority_enum_1.Authority.TENANT_ADMIN) {
                fetchDashboardsObservable = this.dashboardService.getTenantDashboards(pageLink);
            }
            else {
                fetchDashboardsObservable = this.dashboardService.getCustomerDashboards(authPayload.authUser.customerId, pageLink);
            }
            return fetchDashboardsObservable.pipe(operators_1.map(function (result) {
                var dashboards = result.data;
                return dashboards.map(function (dashboard) { return dashboard.id.id; });
            }));
        }
        else {
            return rxjs_1.of([]);
        }
    };
    var AuthService_1;
    AuthService = AuthService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
