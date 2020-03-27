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
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {AppState} from '@core/core.state';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {EntityType} from '@shared/models/entity-type.models';
import {DashboardService} from '@core/http/dashboard.service';
import {forkJoin, Observable} from 'rxjs';
import { DialogComponent } from '@shared/components/dialog.component';
import { Router } from '@angular/router';

export type ManageDashboardEdgesActionType = 'assign' | 'manage' | 'unassign';

export interface ManageDashboardEdgesDialogData {
  actionType: ManageDashboardEdgesActionType;
  dashboardIds: Array<string>;
  assignedEdgesIds?: Array<string>;
}

@Component({
  selector: 'tb-manage-dashboard-edges-dialog',
  templateUrl: './manage-dashboard-edges-dialog.component.html',
  providers: [{provide: ErrorStateMatcher, useExisting: ManageDashboardEdgesDialogComponent}],
  styleUrls: []
})
export class ManageDashboardEdgesDialogComponent extends
  DialogComponent<ManageDashboardEdgesDialogComponent, boolean> implements OnInit, ErrorStateMatcher {

  dashboardEdgesFormGroup: FormGroup;

  submitted = false;

  entityType = EntityType;

  titleText: string;
  labelText: string;
  actionName: string;

  assignedEdgesIds: string[];

  constructor(protected store: Store<AppState>,
              protected router: Router,
              @Inject(MAT_DIALOG_DATA) public data: ManageDashboardEdgesDialogData,
              private dashboardService: DashboardService,
              @SkipSelf() private errorStateMatcher: ErrorStateMatcher,
              public dialogRef: MatDialogRef<ManageDashboardEdgesDialogComponent, boolean>,
              public fb: FormBuilder) {
    super(store, router, dialogRef);

    this.assignedEdgesIds = data.assignedEdgesIds || [];
    switch (data.actionType) {
      case 'assign':
        this.titleText = 'dashboard.assign-to-edges';
        this.labelText = 'dashboard.assign-to-edges-text';
        this.actionName = 'action.assign';
        break;
      case 'manage':
        this.titleText = 'dashboard.manage-assigned-edges';
        this.labelText = 'dashboard.assigned-edges';
        this.actionName = 'action.update';
        break;
      case 'unassign':
        this.titleText = 'dashboard.unassign-from-edges';
        this.labelText = 'dashboard.unassign-from-edges-text';
        this.actionName = 'action.unassign';
        break;
    }
  }

  ngOnInit(): void {
    this.dashboardEdgesFormGroup = this.fb.group({
      assignedEdgeIds: [[...this.assignedEdgesIds]]
    });
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const originalErrorState = this.errorStateMatcher.isErrorState(control, form);
    const customErrorState = !!(control && control.invalid && this.submitted);
    return originalErrorState || customErrorState;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.submitted = true;
    const edgeIds: Array<string> = this.dashboardEdgesFormGroup.get('assignedEdgeIds').value;
    const tasks: Observable<any>[] = [];

    this.data.dashboardIds.forEach(
      (dashboardId) => {
        tasks.push(this.getManageDashboardEdgesTask(dashboardId, edgeIds));
      }
    );
    forkJoin(tasks).subscribe(
      () => {
        this.dialogRef.close(true);
      }
    );
  }

  private getManageDashboardEdgesTask(dashboardId: string, edgeIds: Array<string>): Observable<any> {
    switch (this.data.actionType) {
      case 'assign':
        return this.dashboardService.addDashboardEdges(dashboardId, edgeIds);
        break;
      case 'manage':
        return this.dashboardService.updateDashboardEdges(dashboardId, edgeIds);
        break;
      case 'unassign':
        return this.dashboardService.removeDashboardEdges(dashboardId, edgeIds);
        break;
    }
  }
}
