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

import { Injectable } from '@angular/core';

import { Resolve, Router } from '@angular/router';
import {
  DateEntityTableColumn,
  EntityTableColumn,
  EntityTableConfig
} from '@home/models/entity/entities-table-config.models';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { EntityType, entityTypeResources, entityTypeTranslations } from '@shared/models/entity-type.models';
import { EntityAction } from '@home/models/entity/entity-component.models';
import { NULL_UUID } from '@shared/models/id/has-uuid';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { Authority } from '@shared/models/authority.enum';
import { DialogService } from '@core/services/dialog.service';
import { ImportExportService } from '@home/components/import-export/import-export.service';
import {
  Client,
  DetailedClientSessionInfoDto,
  clientTypeTranslationMap,
  connectionStateTranslationMap
} from '@shared/models/mqtt.models';
import { MqttClientService } from '@core/http/mqtt-client.service';
import { MqttClientsComponent } from '@home/pages/mqtt-clients/mqtt-clients.component';
import { MqttClientSessionService } from '@core/http/mqtt-client-session.service';

@Injectable()
export class MqttClientsTableConfigResolver implements Resolve<EntityTableConfig<DetailedClientSessionInfoDto>> {

  private readonly config: EntityTableConfig<DetailedClientSessionInfoDto> = new EntityTableConfig<DetailedClientSessionInfoDto>();

  constructor(private store: Store<AppState>,
              private dialogService: DialogService,
              private mqttClientService: MqttClientService,
              private mqttClientSessionService: MqttClientSessionService,
              private translate: TranslateService,
              private importExport: ImportExportService,
              private datePipe: DatePipe,
              private router: Router) {

    this.config.entityComponent = MqttClientsComponent;
    this.config.entityTranslations = entityTypeTranslations.get(EntityType.MQTT_CLIENT);
    this.config.entityResources = entityTypeResources.get(EntityType.MQTT_CLIENT);
    this.config.tableTitle = this.translate.instant('mqtt-client.clients');

    this.config.addEnabled = false;
    this.config.entitiesDeleteEnabled = false;
    this.config.deleteEnabled = () => false;

    this.config.entityTitle = (mqttClient) => mqttClient ?
      mqttClient.clientId : '';

    this.config.columns.push(
      // new DateEntityTableColumn<DetailedClientSessionInfoDto>('createdTime', 'common.created-time', this.datePipe, '150px'),
      new EntityTableColumn<DetailedClientSessionInfoDto>('clientId', 'mqtt-client.client-id', '25%'),
      new EntityTableColumn<DetailedClientSessionInfoDto>('connectionState', 'mqtt-client.connect', '25%',
        (entity) => connectionStateTranslationMap.get(entity.connectionState)),
      new EntityTableColumn<DetailedClientSessionInfoDto>('nodeId', 'mqtt-client.node-id', '25%'),
      new EntityTableColumn<DetailedClientSessionInfoDto>('clientType', 'mqtt-client.client-type', '25%',
        (entity) => clientTypeTranslationMap.get(entity.clientType))
    );

    this.config.loadEntity = id => this.loadEntity(id);
    // this.config.onEntityAction = action => this.onMqttClientAction(action);
  }

  resolve(): EntityTableConfig<DetailedClientSessionInfoDto> {
    this.config.entitiesFetchFunction = pageLink => this.mqttClientSessionService.getClientSessionInfos(pageLink);
    return this.config;
  }

  loadEntity(id) {
    return this.mqttClientSessionService.getClientSessionInfo(id);
  }

  isMqttClientEditable(mqttClient: Client, authority: Authority): boolean {
    if (authority === Authority.TENANT_ADMIN) {
      return mqttClient && mqttClient.tenantId && mqttClient.tenantId.id !== NULL_UUID;
    } else {
      return authority === Authority.SYS_ADMIN;
    }
  }

  openMqttClient($event: Event, mqttClient: Client) {
    if ($event) {
      $event.stopPropagation();
    }
    this.router.navigateByUrl(`clients/${mqttClient.id.id}`);
  }

  onMqttClientAction(action: EntityAction<DetailedClientSessionInfoDto>): boolean {
    switch (action.action) {
      case 'open':
        // this.openMqttClient(action.event, action.entity);
        return true;
    }
    return false;
  }

}
