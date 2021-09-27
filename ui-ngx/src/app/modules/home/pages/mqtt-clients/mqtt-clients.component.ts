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

import { ChangeDetectorRef, Component, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import {
  Client, ClientSessionInfo,
  ClientType,
  clientTypeTranslationMap,
} from '@shared/models/mqtt.models';
import { EntityComponent } from '@home/components/entity/entity.component';
import { EntityTableConfig } from '@home/models/entity/entities-table-config.models';

@Component({
  selector: 'tb-mqtt-clients',
  templateUrl: './mqtt-clients.component.html',
  styleUrls: ['./mqtt-clients.component.scss']
})
export class MqttClientsComponent extends EntityComponent<ClientSessionInfo> {

  mqttClientTypes = Object.values(ClientType);
  mqttClientTypeTranslationMap = clientTypeTranslationMap;

  @Output('topics') topics: any;

  constructor(protected store: Store<AppState>,
              @Inject('entity') protected entityValue: ClientSessionInfo,
              @Inject('entitiesTableConfig') protected entitiesTableConfigValue: EntityTableConfig<ClientSessionInfo>,
              public fb: FormBuilder,
              protected cd: ChangeDetectorRef) {
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
    return this.fb.group({
      clientId: [entity ? entity.clientId : ''],
      nodeId: [entity ? entity.nodeId : ''],
      username: [entity ? entity.username : ''],
      note: [entity ? entity.note : ''],
      keepAliveSeconds: [entity ? entity.keepAliveSeconds : ''],
      connectedAt: [entity ? entity.connectedAt : ''],
      connectionState: [entity ? entity.connectionState : ''],
      clientType: [entity ? entity.clientType : ''],
      persistent: [entity ? entity.persistent : ''],
      disconnectedAt: [entity ? entity.disconnectedAt : ''],
      cleanSession: [entity ? entity.cleanSession : ''],
      subscriptionsCount: [entity ? entity.subscriptionsCount : ''],
      subscriptions: [entity ? entity.subscriptions : null, []]
    });
  }

  updateForm(entity: ClientSessionInfo) {
    this.entityForm.patchValue({clientId: entity.clientId});
    this.entityForm.patchValue({nodeId: entity.nodeId});
    this.entityForm.patchValue({username: entity.username});
    this.entityForm.patchValue({note: entity.note});
    this.entityForm.patchValue({keepAliveSeconds: entity.keepAliveSeconds});
    this.entityForm.patchValue({connectedAt: entity.connectedAt});
    this.entityForm.patchValue({connectionState: entity.connectionState});
    this.entityForm.patchValue({persistent: entity.persistent});
    this.entityForm.patchValue({disconnectedAt: entity.disconnectedAt});
    this.entityForm.patchValue({cleanSession: entity.cleanSession});
    this.entityForm.patchValue({subscriptionsCount: entity.subscriptionsCount});
    this.entityForm.patchValue({ subscriptions: entity ? entity.subscriptions : null });
  }

}
