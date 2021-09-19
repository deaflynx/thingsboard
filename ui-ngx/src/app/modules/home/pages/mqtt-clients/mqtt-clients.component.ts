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

import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import {
  Client,
  ClientType,
  clientTypeTranslationMap, ConnectionState,
  DetailedClientSessionInfoDto, MqttQoS
} from '@shared/models/mqtt.models';
import { EntityComponent } from '@home/components/entity/entity.component';
import { EntityTableConfig } from '@home/models/entity/entities-table-config.models';

@Component({
  selector: 'tb-mqtt-clients',
  templateUrl: './mqtt-clients.component.html',
  styleUrls: ['./mqtt-clients.component.scss']
})
export class MqttClientsComponent extends EntityComponent<DetailedClientSessionInfoDto> {

  mqttClientTypes = Object.values(ClientType);
  mqttClientTypeTranslationMap = clientTypeTranslationMap;

  constructor(protected store: Store<AppState>,
              @Inject('entity') protected entityValue: DetailedClientSessionInfoDto,
              @Inject('entitiesTableConfig') protected entitiesTableConfigValue: EntityTableConfig<DetailedClientSessionInfoDto>,
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

  buildForm(entity: DetailedClientSessionInfoDto): FormGroup {
    const mockEntity = {
      id: '123124151251251651612',
      clientId: '8888',
      connectionState: ConnectionState.CONNECTED,
      clientType: ClientType.DEVICE,
      nodeId: '1',
      persistent: true,
      username: 'username 1',
      subscriptions: {
        topic: 'topic1',
        qos: MqttQoS.AT_LEAST_ONCE
      },
      keepAliveSeconds: 60,
      connectedAt: 123456789,
      disconnectedAt: 987654321,
      note: 'note',
      cleanSession: true,
      subscriptionsCount: 2
    }
    // return this.fb.group(
    //   {
    //     nodeId: [mockEntity ? mockEntity.nodeId : ''],
    //     clientId2: [mockEntity ? mockEntity.clientId : ''],
    //     username: [mockEntity ? mockEntity.username : ''],
    //     note: [mockEntity ? mockEntity.note : ''],
    //     keepAliveSeconds: [mockEntity ? mockEntity.keepAliveSeconds : ''],
    //     connectedAt: [mockEntity ? mockEntity.connectedAt : ''],
    //     connectionState: [mockEntity ? mockEntity.connectionState : '']
    //   }
    // );

    return this.fb.group({
      connection: [mockEntity, []],
      session: [mockEntity, []]
    });
  }

  updateForm(entity: DetailedClientSessionInfoDto) {
    if (entity) {
    }
    this.entityForm.patchValue({
    });
  }

}
