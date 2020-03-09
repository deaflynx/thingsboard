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
var http_utils_1 = require("./http-utils");
var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.getTenantAdmins = function (tenantId, pageLink, config) {
        return this.http.get("/api/tenant/" + tenantId + "/users" + pageLink.toQuery(), http_utils_1.defaultHttpOptionsFromConfig(config));
    };
    UserService.prototype.getCustomerUsers = function (customerId, pageLink, config) {
        return this.http.get("/api/customer/" + customerId + "/users" + pageLink.toQuery(), http_utils_1.defaultHttpOptionsFromConfig(config));
    };
    UserService.prototype.getUser = function (userId, config) {
        return this.http.get("/api/user/" + userId, http_utils_1.defaultHttpOptionsFromConfig(config));
    };
    UserService.prototype.saveUser = function (user, sendActivationMail, config) {
        if (sendActivationMail === void 0) { sendActivationMail = false; }
        var url = '/api/user';
        url += '?sendActivationMail=' + sendActivationMail;
        return this.http.post(url, user, http_utils_1.defaultHttpOptionsFromConfig(config));
    };
    UserService.prototype.deleteUser = function (userId, config) {
        return this.http["delete"]("/api/user/" + userId, http_utils_1.defaultHttpOptionsFromConfig(config));
    };
    UserService.prototype.getActivationLink = function (userId, config) {
        return this.http.get("/api/user/" + userId + "/activationLink", __assign({ responseType: 'text' }, http_utils_1.defaultHttpOptionsFromConfig(config)));
    };
    UserService.prototype.sendActivationEmail = function (email, config) {
        return this.http.post("/api/user/sendActivationMail?email=" + email, null, http_utils_1.defaultHttpOptionsFromConfig(config));
    };
    UserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
