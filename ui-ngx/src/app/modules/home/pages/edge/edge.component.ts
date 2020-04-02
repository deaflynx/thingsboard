import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from "@core/core.state";
import { EntityComponent } from "@home/components/entity/entity.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from '@shared/models/user.model';
import { selectAuth, selectUserDetails } from '@core/auth/auth.selectors';
import { map } from 'rxjs/operators';
import { Authority } from '@shared/models/authority.enum';

import {EntityType} from "@shared/models/entity-type.models";
import {EdgeInfo} from "@shared/models/edge.models";
import {TranslateService} from "@ngx-translate/core";
import {ClipboardService} from "ngx-clipboard";
import {EdgeService} from "@core/http/edge.service";
import {NULL_UUID} from "@shared/models/id/has-uuid";
import {ActionNotificationShow} from "@core/notification/notification.actions";
import {utils} from "protractor";

@Component({
  selector: 'tb-edge',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.scss']
})

export class EdgeComponent extends EntityComponent<EdgeInfo>{

  entityType = EntityType;
  edgeScope: 'tenant' | 'customer' | 'customer_user';
  secretKeyTest = this.generateSecretTest('TOP ')

  constructor(protected store: Store<AppState>,
              protected translate: TranslateService,
              private edgeService: EdgeService,
              private clipboardService: ClipboardService,
              public fb: FormBuilder) {
    super(store);
  }

  ngOnInit() {
    this.edgeScope = this.entitiesTableConfig.componentsData.edgeScope;
    super.ngOnInit()
  }

  generateSecretTest(randomNumber: string): string {
    let text = '';
    text += ' SECRET'
    return text;
  }

  hideDelete() {
    if (this.entitiesTableConfig) {
      return !this.entitiesTableConfig.deleteEnabled(this.entity);
    } else {
      return false;
    }
  }

  isAssignedToCustomer(entity: EdgeInfo): boolean {
    return entity && entity.customerId && entity.customerId.id !== NULL_UUID;
  }

  buildForm(entity: EdgeInfo): FormGroup {
    return this.fb.group(
      {
        name: [entity ? entity.name : '', [Validators.required]],
        type: [entity ? entity.type : null, [Validators.required]],
        label: [entity ? entity.label : ''],
        additionalInfo: this.fb.group(
          {
            description: [entity && entity.additionalInfo ? entity.additionalInfo.description : ''],
          }
        )
      }
    );
  }

  updateForm(entity: EdgeInfo) {
    this.entityForm.patchValue({name: entity.name});
    this.entityForm.patchValue({type: entity.type});
    this.entityForm.patchValue({label: entity.label});
    this.entityForm.patchValue({additionalInfo: {description: entity.additionalInfo ? entity.additionalInfo.description : ''}});
  }

  onEdgeIdCopied($event) {
    this.store.dispatch(new ActionNotificationShow(
      {
        message: this.translate.instant('edge.id-copied-message'),
        type: 'success',
        duration: 750,
        verticalPosition: 'bottom',
        horizontalPosition: 'left'
      }));
  }

  onEdgeKeyCopied($event) {
    this.store.dispatch(new ActionNotificationShow(
      {
        message: this.translate.instant('edge.edge-key-copied-message'),
        type: 'success',
        duration: 750,
        verticalPosition: 'bottom',
        horizontalPosition: 'left'
      }));
  }

  onEdgeSecretCopied($event) {
    this.store.dispatch(new ActionNotificationShow(
      {
        message: this.translate.instant('edge.edge-secret-copied-message'),
        type: 'success',
        duration: 750,
        verticalPosition: 'bottom',
        horizontalPosition: 'left'
      }));
  }

  generateSecret(length): void {

    // if (length == null) {
    //   length = 1;
    // }
    // var l = length > 10 ? 10 : length;
    // var str = Math.random().toString(36).substr(2, l);
    // if (str.length >= length) {
    //   return str;
    // }
    // return str.concat(this.generateSecret(length - str.length));
  }

}
