import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {EntitiesTableComponent} from "@home/components/entity/entities-table.component";
import {Authority} from "@shared/models/authority.enum";

import {EdgesTableConfigResolver} from "@home/pages/edge/edges-table-config.resolver"
import {AssetsTableConfigResolver} from "@home/pages/asset/assets-table-config.resolver";
import {DevicesTableConfigResolver} from "@home/pages/device/devices-table-config.resolver";
import {EntityViewsTableConfigResolver} from "@home/pages/entity-view/entity-views-table-config.resolver";
import {DashboardsTableConfigResolver} from "@home/pages/dashboard/dashboards-table-config.resolver";
import {DashboardPageComponent} from "@home/pages/dashboard/dashboard-page.component";
import {BreadCrumbConfig} from "@shared/components/breadcrumb";
import {RuleChainsTableConfigResolver} from "@home/pages/rulechain/rulechains-table-config.resolver";
import {dashboardBreadcumbLabelFunction, DashboardResolver} from "@home/pages/dashboard/dashboard-routing.module";

const routes: Routes = [
  {
    path: 'edges',
    data: {
      breadcrumb: {
        label: 'edge.edges',
        icon: 'router'
      }
    },
    children: [
      {
        path: '',
        component: EntitiesTableComponent,
        data: {
          auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
          title: 'edge.edges',
          edgesType: 'tenant'
        },
        resolve: {
          entitiesTableConfig: EdgesTableConfigResolver
        }
      },
      {
        path: ':edgeId/assets',
        component: EntitiesTableComponent,
        data: {
          auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
          title: 'edge.assets',
          assetsType: 'edge',
          breadcrumb: {
            label: 'edge.assets',
            icon: 'domain'
          }
        },
        resolve: {
          entitiesTableConfig: AssetsTableConfigResolver
        }
      },
      {
        path: ':edgeId/devices',
        component: EntitiesTableComponent,
        data: {
          auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
          title: 'edge.devices',
          devicesType: 'edge',
          breadcrumb: {
            label: 'edge.devices',
            icon: 'devices_other'
          },
        },
        resolve: {
          entitiesTableConfig: DevicesTableConfigResolver
        }
      },
      {
        path: ':edgeId/entityViews',
        component: EntitiesTableComponent,
        data: {
          auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
          title: 'edge.entity-views',
          entityViewsType: 'edge',
          breadcrumb: {
            label: 'edge.entity-views',
            icon: 'view_quilt'
          },
        },
        resolve: {
          entitiesTableConfig: EntityViewsTableConfigResolver
        }
      },
      {
        path: ':edgeId/ruleChains',
        component: EntitiesTableComponent,
        data: {
          auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
          title: 'edge.rulechains',
          rulechainsType: 'edge',
          breadcrumb: {
            label: 'edge.rulechains',
            icon: 'settings_ethernet'
          },
        },
        resolve: {
          entitiesTableConfig: RuleChainsTableConfigResolver
        }
      },
      {
        path: ':edgeId/dashboards',
        data: {
          breadcrumb: {
            label: 'edge.dashboards',
            icon: 'dashboard'
          }
        },
        children: [
          {
            path: '',
            component: EntitiesTableComponent,
            data: {
              auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
              title: 'edge.dashboards',
              dashboardsType: 'edge'
            },
            resolve: {
              entitiesTableConfig: DashboardsTableConfigResolver
            }
          },
          {
            path: ':dashboardId',
            component: DashboardPageComponent,
            data: {
              breadcrumb: {
                labelFunction: dashboardBreadcumbLabelFunction,
                icon: 'dashboard'
              } as BreadCrumbConfig,
              auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
              title: 'edge.dashboard',
              widgetEditMode: false
            },
            resolve: {
              dashboard: DashboardResolver
            }
          }
      ]
      }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    EdgesTableConfigResolver
  ]
})
export class EdgeRoutingModule { }
