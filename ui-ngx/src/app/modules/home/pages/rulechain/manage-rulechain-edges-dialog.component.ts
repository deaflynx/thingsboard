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
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {EntityType} from '@shared/models/entity-type.models';
import {RuleChainService} from "@core/http/rule-chain.service";
import {forkJoin, Observable} from 'rxjs';
import {DialogComponent} from '@shared/components/dialog.component';
import {Router} from '@angular/router';

export type ManageRuleChainEdgesActionType = 'assign' | 'manage' | 'unassign';

export interface ManageRuleChainEdgesDialogData {
  actionType: ManageRuleChainEdgesActionType;
  ruleChainIds: Array<string>;
  assignedEdgesIds?: Array<string>;
}

@Component({
  selector: 'tb-manage-rulechain-edges-dialog',
  templateUrl: './manage-rulechain-edges-dialog.component.html',
  providers: [{provide: ErrorStateMatcher, useExisting: ManageRuleChainEdgesDialogComponent}],
  styleUrls: []
})
export class ManageRuleChainEdgesDialogComponent extends
  DialogComponent<ManageRuleChainEdgesDialogComponent, boolean> implements OnInit, ErrorStateMatcher {

  ruleChainEdgesFormGroup: FormGroup;

  submitted = false;

  entityType = EntityType.EDGE;

  titleText: string;
  labelText: string;
  actionName: string;

  assignedEdgesIds: string[];

  constructor(protected store: Store<AppState>,
              protected router: Router,
              @Inject(MAT_DIALOG_DATA) public data: ManageRuleChainEdgesDialogData,
              private ruleChainService: RuleChainService,
              @SkipSelf() private errorStateMatcher: ErrorStateMatcher,
              public dialogRef: MatDialogRef<ManageRuleChainEdgesDialogComponent, boolean>,
              public fb: FormBuilder) {
    super(store, router, dialogRef);

    this.assignedEdgesIds = data.assignedEdgesIds || [];
    switch (data.actionType) {
      case 'assign':
        this.titleText = 'rulechain.assign-to-edges';
        this.labelText = 'rulechain.assign-to-edges-text';
        this.actionName = 'action.assign';
        break;
      case 'manage':
        this.titleText = 'rulechain.manage-assigned-edges';
        this.labelText = 'rulechain.assigned-edges';
        this.actionName = 'action.update';
        break;
      case 'unassign':
        this.titleText = 'rulechain.unassign-from-edges';
        this.labelText = 'rulechain.unassign-from-edges-text';
        this.actionName = 'action.unassign';
        break;
    }
  }

  ngOnInit(): void {
    this.ruleChainEdgesFormGroup = this.fb.group({
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
    const edgeIds: Array<string> = this.ruleChainEdgesFormGroup.get('assignedEdgeIds').value;
    const tasks: Observable<any>[] = [];

    this.data.ruleChainIds.forEach(
      (ruleChainId) => {
        tasks.push(this.getManageRuleChainEdgesTask(ruleChainId, edgeIds));
      }
    );
    forkJoin(tasks).subscribe(
      () => {
        this.dialogRef.close(true);
      }
    );
  }

  private getManageRuleChainEdgesTask(ruleChainId: string, edgeIds: Array<string>): Observable<any> {
    switch (this.data.actionType) {
      case 'assign':
        return this.ruleChainService.addRuleChainEdges(ruleChainId, edgeIds);
        break;
      case 'manage':
        return this.ruleChainService.updateRuleChainEdges(ruleChainId, edgeIds);
        break;
      case 'unassign':
        return this.ruleChainService.removeRuleChainEdges(ruleChainId, edgeIds);
        break;
    }
  }
}
