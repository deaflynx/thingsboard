import { Component, OnInit } from '@angular/core';
import {EntityTabsComponent} from "@home/components/entity/entity-tabs.component";
import {Store} from "@ngrx/store";
import {AppState} from "@core/core.state";
import {EdgeInfo} from "@shared/models/edge.models";

@Component({
  selector: 'tb-edge-tabs',
  templateUrl: './edge-tabs.component.html',
  styleUrls: []
})
export class EdgeTabsComponent extends EntityTabsComponent<EdgeInfo> {

  constructor(protected store: Store<AppState>) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
