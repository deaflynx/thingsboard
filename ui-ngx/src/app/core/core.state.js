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
var ngrx_store_freeze_1 = require("ngrx-store-freeze");
var environment_1 = require("@env/environment");
var init_state_from_local_storage_reducer_1 = require("./meta-reducers/init-state-from-local-storage.reducer");
var debug_reducer_1 = require("./meta-reducers/debug.reducer");
var load_reducer_1 = require("./interceptors/load.reducer");
var auth_reducer_1 = require("./auth/auth.reducer");
var settings_reducer_1 = require("@app/core/settings/settings.reducer");
var settings_effects_1 = require("@app/core/settings/settings.effects");
var notification_reducer_1 = require("@app/core/notification/notification.reducer");
var notification_effects_1 = require("@app/core/notification/notification.effects");
exports.reducers = {
    load: load_reducer_1.loadReducer,
    auth: auth_reducer_1.authReducer,
    settings: settings_reducer_1.settingsReducer,
    notification: notification_reducer_1.notificationReducer
};
exports.metaReducers = [
    init_state_from_local_storage_reducer_1.initStateFromLocalStorage
];
if (!environment_1.environment.production) {
    exports.metaReducers.unshift(ngrx_store_freeze_1.storeFreeze);
    exports.metaReducers.unshift(debug_reducer_1.debug);
}
exports.effects = [
    settings_effects_1.SettingsEffects,
    notification_effects_1.NotificationEffects
];
