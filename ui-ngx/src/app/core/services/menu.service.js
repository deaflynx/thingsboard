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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var store_1 = require("@ngrx/store");
var auth_selectors_1 = require("../auth/auth.selectors");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var authority_enum_1 = require("@shared/models/authority.enum");
var MenuService = /** @class */ (function () {
    function MenuService(store, authService) {
        var _this = this;
        this.store = store;
        this.authService = authService;
        this.menuSections$ = new rxjs_1.BehaviorSubject([]);
        this.homeSections$ = new rxjs_1.BehaviorSubject([]);
        this.store.pipe(store_1.select(auth_selectors_1.selectIsAuthenticated)).subscribe(function (authenticated) {
            if (authenticated) {
                _this.buildMenu();
            }
        });
    }
    MenuService.prototype.buildMenu = function () {
        var _this = this;
        this.store.pipe(store_1.select(auth_selectors_1.selectAuthUser), operators_1.take(1)).subscribe(function (authUser) {
            if (authUser) {
                var menuSections = void 0;
                var homeSections = void 0;
                switch (authUser.authority) {
                    case authority_enum_1.Authority.SYS_ADMIN:
                        menuSections = _this.buildSysAdminMenu(authUser);
                        homeSections = _this.buildSysAdminHome(authUser);
                        break;
                    case authority_enum_1.Authority.TENANT_ADMIN:
                        menuSections = _this.buildTenantAdminMenu(authUser);
                        homeSections = _this.buildTenantAdminHome(authUser);
                        break;
                    case authority_enum_1.Authority.CUSTOMER_USER:
                        menuSections = _this.buildCustomerUserMenu(authUser);
                        homeSections = _this.buildCustomerUserHome(authUser);
                        break;
                }
                _this.menuSections$.next(menuSections);
                _this.homeSections$.next(homeSections);
            }
        });
    };
    MenuService.prototype.buildSysAdminMenu = function (authUser) {
        var sections = [];
        sections.push({
            name: 'home.home',
            type: 'link',
            path: '/home',
            icon: 'home'
        }, {
            name: 'tenant.tenants',
            type: 'link',
            path: '/tenants',
            icon: 'supervisor_account'
        }, {
            name: 'widget.widget-library',
            type: 'link',
            path: '/widgets-bundles',
            icon: 'now_widgets'
        }, {
            name: 'admin.system-settings',
            type: 'toggle',
            path: '/settings',
            height: '120px',
            icon: 'settings',
            pages: [
                {
                    name: 'admin.general',
                    type: 'link',
                    path: '/settings/general',
                    icon: 'settings_applications'
                },
                {
                    name: 'admin.outgoing-mail',
                    type: 'link',
                    path: '/settings/outgoing-mail',
                    icon: 'mail'
                },
                {
                    name: 'admin.security-settings',
                    type: 'link',
                    path: '/settings/security-settings',
                    icon: 'security'
                }
            ]
        });
        return sections;
    };
    MenuService.prototype.buildSysAdminHome = function (authUser) {
        var homeSections = [];
        homeSections.push({
            name: 'tenant.management',
            places: [
                {
                    name: 'tenant.tenants',
                    icon: 'supervisor_account',
                    path: '/tenants'
                }
            ]
        }, {
            name: 'widget.management',
            places: [
                {
                    name: 'widget.widget-library',
                    icon: 'now_widgets',
                    path: '/widgets-bundles'
                }
            ]
        }, {
            name: 'admin.system-settings',
            places: [
                {
                    name: 'admin.general',
                    icon: 'settings_applications',
                    path: '/settings/general'
                },
                {
                    name: 'admin.outgoing-mail',
                    icon: 'mail',
                    path: '/settings/outgoing-mail'
                },
                {
                    name: 'admin.security-settings',
                    icon: 'security',
                    path: '/settings/security-settings'
                }
            ]
        });
        return homeSections;
    };
    MenuService.prototype.buildTenantAdminMenu = function (authUser) {
        var sections = [];
        sections.push({
            name: 'home.home',
            type: 'link',
            path: '/home',
            icon: 'home'
        }, {
            name: 'rulechain.rulechains',
            type: 'link',
            path: '/ruleChains',
            icon: 'settings_ethernet'
        }, {
            name: 'customer.customers',
            type: 'link',
            path: '/customers',
            icon: 'supervisor_account'
        }, {
            name: 'asset.assets',
            type: 'link',
            path: '/assets',
            icon: 'domain'
        }, {
            name: 'device.devices',
            type: 'link',
            path: '/devices',
            icon: 'devices_other'
        }, {
            name: 'entity-view.entity-views',
            type: 'link',
            path: '/entityViews',
            icon: 'view_quilt'
        }, {
            name: 'widget.widget-library',
            type: 'link',
            path: '/widgets-bundles',
            icon: 'now_widgets'
        }, {
            name: 'dashboard.dashboards',
            type: 'link',
            path: '/dashboards',
            icon: 'dashboards'
        }, {
            name: 'audit-log.audit-logs',
            type: 'link',
            path: '/auditLogs',
            icon: 'track_changes'
        });
        return sections;
    };
    MenuService.prototype.buildTenantAdminHome = function (authUser) {
        var homeSections = [];
        homeSections.push({
            name: 'rulechain.management',
            places: [
                {
                    name: 'rulechain.rulechains',
                    icon: 'settings_ethernet',
                    path: '/ruleChains'
                }
            ]
        }, {
            name: 'customer.management',
            places: [
                {
                    name: 'customer.customers',
                    icon: 'supervisor_account',
                    path: '/customers'
                }
            ]
        }, {
            name: 'asset.management',
            places: [
                {
                    name: 'asset.assets',
                    icon: 'domain',
                    path: '/assets'
                }
            ]
        }, {
            name: 'device.management',
            places: [
                {
                    name: 'device.devices',
                    icon: 'devices_other',
                    path: '/devices'
                }
            ]
        }, {
            name: 'entity-view.management',
            places: [
                {
                    name: 'entity-view.entity-views',
                    icon: 'view_quilt',
                    path: '/entityViews'
                }
            ]
        }, {
            name: 'dashboard.management',
            places: [
                {
                    name: 'widget.widget-library',
                    icon: 'now_widgets',
                    path: '/widgets-bundles'
                },
                {
                    name: 'dashboard.dashboards',
                    icon: 'dashboard',
                    path: '/dashboards'
                }
            ]
        }, {
            name: 'audit-log.audit',
            places: [
                {
                    name: 'audit-log.audit-logs',
                    icon: 'track_changes',
                    path: '/auditLogs'
                }
            ]
        });
        return homeSections;
    };
    MenuService.prototype.buildCustomerUserMenu = function (authUser) {
        var sections = [];
        sections.push({
            name: 'device.devices',
            type: 'link',
            path: '/devices',
            icon: 'devices_other'
        });
        return sections;
    };
    MenuService.prototype.buildCustomerUserHome = function (authUser) {
        var homeSections = [
            {
                name: 'asset.view-assets',
                places: [
                    {
                        name: 'asset.assets',
                        icon: 'domain',
                        path: '/assets'
                    }
                ]
            },
            {
                name: 'device.view-devices',
                places: [
                    {
                        name: 'device.devices',
                        icon: 'devices_other',
                        path: '/devices'
                    }
                ]
            },
            {
                name: 'entity-view.management',
                places: [
                    {
                        name: 'entity-view.entity-views',
                        icon: 'view_quilt',
                        path: '/entityViews'
                    }
                ]
            },
            {
                name: 'dashboard.view-dashboards',
                places: [
                    {
                        name: 'dashboard.dashboards',
                        icon: 'dashboard',
                        path: '/dashboards'
                    }
                ]
            }
        ];
        return homeSections;
    };
    MenuService.prototype.menuSections = function () {
        return this.menuSections$;
    };
    MenuService.prototype.homeSections = function () {
        return this.homeSections$;
    };
    MenuService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], MenuService);
    return MenuService;
}());
exports.MenuService = MenuService;
