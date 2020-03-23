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

import {Component, Inject, OnInit, SkipSelf} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {AppState} from '@core/core.state';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {DeviceService} from '@core/http/device.service';
import {EntityId} from '@shared/models/id/entity-id';
import {EntityType} from '@shared/models/entity-type.models';
import {forkJoin, Observable} from 'rxjs';
import {AssetService} from '@core/http/asset.service';
import {EntityViewService} from '@core/http/entity-view.service';
import {DashboardService} from "@core/http/dashboard.service";
import {DialogComponent} from '@shared/components/dialog.component';
import {Router} from '@angular/router';
import {EdgeService} from "@core/http/edge.service";
import {RuleChainService} from "@core/http/rule-chain.service";

export interface AssignToEdgeDialogData {
  entityIds: Array<EntityId>;
  entityType: EntityType;
}

@Component({
  selector: 'tb-assign-to-edge-dialog',
  templateUrl: './assign-to-edge-dialog.component.html',
  providers: [{provide: ErrorStateMatcher, useExisting: AssignToEdgeDialogComponent}],
  styleUrls: []
})
export class AssignToEdgeDialogComponent extends
  DialogComponent<AssignToEdgeDialogComponent, boolean> implements OnInit, ErrorStateMatcher {

  assignToEdgeFormGroup: FormGroup;

  submitted = false;

  entityType = EntityType;

  assignToEdgeTitle: string;
  assignToEdgeText: string;

  constructor(protected store: Store<AppState>,
              protected router: Router,
              @Inject(MAT_DIALOG_DATA) public data: AssignToEdgeDialogData,
              private deviceService: DeviceService,
              private edgeService: EdgeService,
              private assetService: AssetService,
              private dashboardService: DashboardService,
              private entityViewService: EntityViewService,
              private ruleChainService: RuleChainService,
              @SkipSelf() private errorStateMatcher: ErrorStateMatcher,
              public dialogRef: MatDialogRef<AssignToEdgeDialogComponent, boolean>,
              public fb: FormBuilder) {
    super(store, router, dialogRef);
  }

  ngOnInit(): void {
    this.assignToEdgeFormGroup = this.fb.group({
      edgeId: [null, [Validators.required]]
    });
    switch (this.data.entityType) {
      case EntityType.DEVICE:
        this.assignToEdgeTitle = 'device.assign-device-to-edge';
        this.assignToEdgeText = 'device.assign-to-edge-text';
        break;
      case EntityType.ASSET:
        this.assignToEdgeTitle = 'asset.assign-asset-to-edge';
        this.assignToEdgeText = 'asset.assign-to-edge-text';
        break;
      case EntityType.ENTITY_VIEW:
        this.assignToEdgeTitle = 'entity-view.assign-entity-view-to-edge';
        this.assignToEdgeText = 'entity-view.assign-to-edge-text';
        break;
      case EntityType.DASHBOARD:
        this.assignToEdgeTitle = 'dashboard.assign-dashboard-to-edge';
        this.assignToEdgeText = 'dashboard.assign-to-edge-text';
        break;
      case EntityType.RULE_CHAIN:
        this.assignToEdgeTitle = 'rulechain.assign-dashboard-to-edge';
        this.assignToEdgeText = 'rulechain.assign-to-edge-text';
        break;
    }
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const originalErrorState = this.errorStateMatcher.isErrorState(control, form);
    const customErrorState = !!(control && control.invalid && this.submitted);
    return originalErrorState || customErrorState;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  assign(): void {
    this.submitted = true;
    const edgeId: string = this.assignToEdgeFormGroup.get('edgeId').value;
    const tasks: Observable<any>[] = [];
    this.data.entityIds.forEach(
      (entityId) => {
        tasks.push(this.getAssignToEdgeTask(edgeId, entityId.id));
      }
    );
    forkJoin(tasks).subscribe(
      () => {
        this.dialogRef.close(true);
      }
    );
  }

  private getAssignToEdgeTask(edgeId: string, entityId: string): Observable<any> {
    switch (this.data.entityType) {
      case EntityType.DEVICE:
        return this.deviceService.assignDeviceToEdge(edgeId, entityId);
        break;
      case EntityType.ASSET:
        return this.assetService.assignAssetToEdge(edgeId, entityId);
        break;
      case EntityType.ENTITY_VIEW:
        return this.entityViewService.assignEntityViewToEdge(edgeId, entityId);
        break;
      case EntityType.DASHBOARD:
        return this.dashboardService.assignDashboardToEdge(edgeId, entityId);
        break;
      case EntityType.RULE_CHAIN:
        return this.ruleChainService.assignRuleChainToEdge(edgeId, entityId);
        break;
    }
  }

}
