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
var store_1 = require("@ngrx/store");
var operators_1 = require("rxjs/operators");
exports.selectAuthState = store_1.createFeatureSelector('auth');
exports.selectAuth = store_1.createSelector(exports.selectAuthState, function (state) { return state; });
exports.selectIsAuthenticated = store_1.createSelector(exports.selectAuthState, function (state) { return state.isAuthenticated; });
exports.selectIsUserLoaded = store_1.createSelector(exports.selectAuthState, function (state) { return state.isUserLoaded; });
exports.selectAuthUser = store_1.createSelector(exports.selectAuthState, function (state) { return state.authUser; });
exports.selectUserDetails = store_1.createSelector(exports.selectAuthState, function (state) { return state.userDetails; });
exports.selectUserTokenAccessEnabled = store_1.createSelector(exports.selectAuthState, function (state) { return state.userTokenAccessEnabled; });
function getCurrentAuthState(store) {
    var state;
    store.pipe(store_1.select(exports.selectAuth), operators_1.take(1)).subscribe(function (val) { return state = val; });
    return state;
}
exports.getCurrentAuthState = getCurrentAuthState;
function getCurrentAuthUser(store) {
    var authUser;
    store.pipe(store_1.select(exports.selectAuthUser), operators_1.take(1)).subscribe(function (val) { return authUser = val; });
    return authUser;
}
exports.getCurrentAuthUser = getCurrentAuthUser;
