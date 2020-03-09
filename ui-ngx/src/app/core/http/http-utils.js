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
var interceptor_http_params_1 = require("../interceptors/interceptor-http-params");
var http_1 = require("@angular/common/http");
var interceptor_config_1 = require("../interceptors/interceptor-config");
function defaultHttpOptionsFromConfig(config) {
    if (!config) {
        config = {};
    }
    return defaultHttpOptions(config.ignoreLoading, config.ignoreErrors, config.resendRequest);
}
exports.defaultHttpOptionsFromConfig = defaultHttpOptionsFromConfig;
function defaultHttpOptions(ignoreLoading, ignoreErrors, resendRequest) {
    if (ignoreLoading === void 0) { ignoreLoading = false; }
    if (ignoreErrors === void 0) { ignoreErrors = false; }
    if (resendRequest === void 0) { resendRequest = false; }
    return {
        headers: new http_1.HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new interceptor_http_params_1.InterceptorHttpParams(new interceptor_config_1.InterceptorConfig(ignoreLoading, ignoreErrors, resendRequest))
    };
}
exports.defaultHttpOptions = defaultHttpOptions;
