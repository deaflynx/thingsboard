///
/// Copyright © 2016-2021 The Thingsboard Authors
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

import { ChangeDetectorRef, Component, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import {
  ClientSessionInfo,
  ClientType,
  clientTypeTranslationMap, ConnectionState, connectionStateTranslationMap,
} from '@shared/models/mqtt.models';
import { EntityComponent } from '@home/components/entity/entity.component';
import { EntityTableConfig } from '@home/models/entity/entities-table-config.models';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-mqtt-clients',
  templateUrl: './mqtt-clients.component.html',
  styleUrls: ['./mqtt-clients.component.scss']
})
export class MqttClientsComponent extends EntityComponent<ClientSessionInfo> {

  mqttClientTypes = Object.values(ClientType);
  clientTypeTranslationMap = clientTypeTranslationMap;

  get connectionState() {
    return this.entityForm.get('connectionState').value;
  }

  constructor(protected store: Store<AppState>,
              @Inject('entity') protected entityValue: ClientSessionInfo,
              @Inject('entitiesTableConfig') protected entitiesTableConfigValue: EntityTableConfig<ClientSessionInfo>,
              public fb: FormBuilder,
              protected cd: ChangeDetectorRef,
              private datePipe: DatePipe,
              private translate: TranslateService) {
    super(store, fb, entityValue, entitiesTableConfigValue, cd);
  }

  hideDelete() {
    if (this.entitiesTableConfig) {
      return !this.entitiesTableConfig.deleteEnabled(this.entity);
    } else {
      return false;
    }
  }

  buildForm(entity: ClientSessionInfo): FormGroup {
    const form = this.fb.group(
      {
        clientId: [entity ? entity.clientId : null],
        clientType: [entity ? entity.clientType : null],
        nodeId: [entity ? entity.nodeId : null],
        username: [entity ? entity.username : null],
        note: [entity ? entity.note : null],
        keepAliveSeconds: [entity ? entity.keepAliveSeconds : null],
        connectedAt: [entity ? this.datePipe.transform(entity.connectedAt, 'yyyy-MM-dd HH:mm:ss') : null],
        connectionState: [entity ? entity.connectionState : null],
        persistent: [entity ? entity.persistent : null],
        disconnectedAt: [entity ? this.datePipe.transform(entity.disconnectedAt, 'yyyy-MM-dd HH:mm:ss') : null],
        cleanSession: [entity ? !entity.persistent : null],
        subscriptionsCount: [entity ? entity.subscriptions.length : null],
        subscriptions: [entity ? entity.subscriptions : null]
      }
    );
    return form;
  }

  updateForm(entity: ClientSessionInfo) {
    this.entityForm.patchValue({ clientId: entity.clientId}, {emitEvent: false} );
    this.entityForm.patchValue({ clientType: entity.clientType}, {emitEvent: false} );
    this.entityForm.patchValue({ nodeId: entity.nodeId}, {emitEvent: false} );
    this.entityForm.patchValue({ username: entity.username}, {emitEvent: false} );
    this.entityForm.patchValue({ note: entity.note}, {emitEvent: false} );
    this.entityForm.patchValue({ keepAliveSeconds: entity.keepAliveSeconds}, {emitEvent: false} );
    this.entityForm.patchValue({ connectedAt: this.datePipe.transform(entity.connectedAt, 'yyyy-MM-dd HH:mm:ss')}, {emitEvent: false} );
    this.entityForm.patchValue({ connectionState: this.translate.instant(connectionStateTranslationMap.get(entity.connectionState))}, {emitEvent: false} );
    this.entityForm.patchValue({ persistent: entity.persistent}, {emitEvent: false} );
    this.entityForm.patchValue({ disconnectedAt: this.datePipe.transform(entity.disconnectedAt, 'yyyy-MM-dd HH:mm:ss')}, {emitEvent: false} );
    this.entityForm.patchValue({ cleanSession: entity.cleanSession}, {emitEvent: false} );
    this.entityForm.patchValue({ subscriptionsCount: entity.subscriptionsCount}, {emitEvent: false} );
    this.entityForm.patchValue({ subscriptions: entity.subscriptions}, {emitEvent: false} );
  }

  isConnected(): boolean {
    return this.entityForm.get('connectionState').value === "Connected";
  }

  updateFormState() {
    super.updateFormState();
    this.entityForm.get('clientId').disable({ emitEvent: false });
    this.entityForm.get('clientType');
    this.entityForm.get('nodeId').disable({ emitEvent: false });
    this.entityForm.get('username').disable({ emitEvent: false });
    this.entityForm.get('note').disable({ emitEvent: false });
    this.entityForm.get('keepAliveSeconds').disable({ emitEvent: false });
    this.entityForm.get('connectedAt').disable({ emitEvent: false });
    this.entityForm.get('connectionState').disable({ emitEvent: false });
    this.entityForm.get('persistent').disable({ emitEvent: false });
    this.entityForm.get('disconnectedAt').disable({ emitEvent: false });
    this.entityForm.get('cleanSession').disable({ emitEvent: false });
    this.entityForm.get('subscriptionsCount').disable({ emitEvent: false });
  }

}
