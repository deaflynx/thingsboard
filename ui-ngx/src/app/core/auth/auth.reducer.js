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
exports.__esModule = true;
var auth_actions_1 = require("./auth.actions");
var emptyUserAuthState = {
    authUser: null,
    userDetails: null,
    userTokenAccessEnabled: false,
    forceFullscreen: false,
    allowedDashboardIds: []
};
exports.initialState = __assign({ isAuthenticated: false, isUserLoaded: false, lastPublicDashboardId: null }, emptyUserAuthState);
function authReducer(state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case auth_actions_1.AuthActionTypes.AUTHENTICATED:
            return __assign(__assign(__assign({}, state), { isAuthenticated: true }), action.payload);
        case auth_actions_1.AuthActionTypes.UNAUTHENTICATED:
            return __assign(__assign(__assign({}, state), { isAuthenticated: false }), emptyUserAuthState);
        case auth_actions_1.AuthActionTypes.LOAD_USER:
            return __assign(__assign(__assign(__assign({}, state), action.payload), { isAuthenticated: action.payload.isUserLoaded ? state.isAuthenticated : false }), action.payload.isUserLoaded ? {} : emptyUserAuthState);
        case auth_actions_1.AuthActionTypes.UPDATE_USER_DETAILS:
            return __assign(__assign({}, state), action.payload);
        case auth_actions_1.AuthActionTypes.UPDATE_LAST_PUBLIC_DASHBOARD_ID:
            return __assign(__assign({}, state), action.payload);
        default:
            return state;
    }
}
exports.authReducer = authReducer;
