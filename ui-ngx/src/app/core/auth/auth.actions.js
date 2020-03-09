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
exports.__esModule = true;
var AuthActionTypes;
(function (AuthActionTypes) {
    AuthActionTypes["AUTHENTICATED"] = "[Auth] Authenticated";
    AuthActionTypes["UNAUTHENTICATED"] = "[Auth] Unauthenticated";
    AuthActionTypes["LOAD_USER"] = "[Auth] Load User";
    AuthActionTypes["UPDATE_USER_DETAILS"] = "[Auth] Update User Details";
    AuthActionTypes["UPDATE_LAST_PUBLIC_DASHBOARD_ID"] = "[Auth] Update Last Public Dashboard Id";
})(AuthActionTypes = exports.AuthActionTypes || (exports.AuthActionTypes = {}));
var ActionAuthAuthenticated = /** @class */ (function () {
    function ActionAuthAuthenticated(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.AUTHENTICATED;
    }
    return ActionAuthAuthenticated;
}());
exports.ActionAuthAuthenticated = ActionAuthAuthenticated;
var ActionAuthUnauthenticated = /** @class */ (function () {
    function ActionAuthUnauthenticated() {
        this.type = AuthActionTypes.UNAUTHENTICATED;
    }
    return ActionAuthUnauthenticated;
}());
exports.ActionAuthUnauthenticated = ActionAuthUnauthenticated;
var ActionAuthLoadUser = /** @class */ (function () {
    function ActionAuthLoadUser(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.LOAD_USER;
    }
    return ActionAuthLoadUser;
}());
exports.ActionAuthLoadUser = ActionAuthLoadUser;
var ActionAuthUpdateUserDetails = /** @class */ (function () {
    function ActionAuthUpdateUserDetails(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.UPDATE_USER_DETAILS;
    }
    return ActionAuthUpdateUserDetails;
}());
exports.ActionAuthUpdateUserDetails = ActionAuthUpdateUserDetails;
var ActionAuthUpdateLastPublicDashboardId = /** @class */ (function () {
    function ActionAuthUpdateLastPublicDashboardId(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.UPDATE_LAST_PUBLIC_DASHBOARD_ID;
    }
    return ActionAuthUpdateLastPublicDashboardId;
}());
exports.ActionAuthUpdateLastPublicDashboardId = ActionAuthUpdateLastPublicDashboardId;
