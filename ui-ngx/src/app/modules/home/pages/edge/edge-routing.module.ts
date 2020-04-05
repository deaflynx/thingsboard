import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import { EntitiesTableComponent } from "@home/components/entity/entities-table.component";
import { Authority } from "@shared/models/authority.enum";
import { EdgeTableConfigResolver } from "@modules/home/pages/edge/edge-table-config.resolver"

const routes: Routes = [
  {
    path: 'edges',
    component: EntitiesTableComponent,
    data: {
      auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
      title: 'edge.edges',
      edgesType: 'tenant',
      breadcrumb: {
        label: 'edge.edges',
        icon: 'router'
      }
    },
    resolve: {
      entitiesTableConfig: EdgeTableConfigResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    EdgeTableConfigResolver
  ]
})
export class EdgeRoutingModule { }
