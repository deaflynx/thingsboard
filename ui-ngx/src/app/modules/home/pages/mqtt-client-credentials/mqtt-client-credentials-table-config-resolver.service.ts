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
import { getCurrentAuthUser } from '@app/core/auth/auth.selectors';
import { Authority } from '@shared/models/authority.enum';
import { DialogService } from '@core/services/dialog.service';
import { ImportExportService } from '@home/components/import-export/import-export.service';
import { Direction } from '@shared/models/page/sort-order';
import { Client, clientTypeTranslationMap } from '@shared/models/mqtt.models';
import { MqttClientService } from '@core/http/mqtt-client.service';
import { MqttClientCredentialsComponent } from '@home/pages/mqtt-client-credentials/mqtt-client-credentials.component';

@Injectable()
export class MqttClientCredentialsTableConfigResolver implements Resolve<EntityTableConfig<Client>> {

  private readonly config: EntityTableConfig<Client> = new EntityTableConfig<Client>();

  constructor(private store: Store<AppState>,
              private dialogService: DialogService,
              private mqttClientService: MqttClientService,
              private translate: TranslateService,
              private importExport: ImportExportService,
              private datePipe: DatePipe,
              private router: Router) {

    this.config.entityType = EntityType.MQTT_CLIENT;
    this.config.entityComponent = MqttClientCredentialsComponent;
    this.config.entityTranslations = entityTypeTranslations.get(EntityType.MQTT_CLIENT);
    this.config.entityResources = entityTypeResources.get(EntityType.MQTT_CLIENT);
    this.config.defaultSortOrder = { property: 'name', direction: Direction.ASC };

    this.config.addEnabled = true;
    this.config.entitiesDeleteEnabled = true;
    this.config.deleteEnabled = () => true;

    this.config.entityTitle = (mqttClient) => mqttClient ?
      mqttClient.clientId : '';

    this.config.columns.push(
      new DateEntityTableColumn<Client>('createdTime', 'common.created-time', this.datePipe, '150px'),
      new EntityTableColumn<Client>('name', 'mqtt-client.name', '30%'),
      new EntityTableColumn<Client>('clientId', 'mqtt-client.client-id', '30%'),
      new EntityTableColumn<Client>('type', 'mqtt-client.client-type', '30%',
        (entity) => this.translate.instant(clientTypeTranslationMap.get(entity.type))),
      // new EntityTableColumn<MqttClient>('status', 'mqtt-client.active', '60px',
      //   entity => {
      //     return checkBoxCell(entity.tenantId?.id === NULL_UUID);
      //   }),
    );

    this.config.addActionDescriptors.push(
      {
        name: this.translate.instant('mqtt-client.create-new-client'),
        icon: 'add',
        isEnabled: () => true,
        onAction: ($event) => this.config.table.addEntity($event)
      }
    );

    this.config.cellActionDescriptors.push(
      {
        name: this.translate.instant('mqtt-client.open-mqtt-client'),
        icon: 'devices',
        isEnabled: () => true,
        onAction: ($event, entity) => this.openMqttClient($event, entity)
      }
    );

    this.config.deleteEntityTitle = mqttClient => this.translate.instant('mqtt-client.delete-client-title',
      { mqttClientTitle: mqttClient.name });
    this.config.deleteEntityContent = () => this.translate.instant('mqtt-client.delete-client-text');
    this.config.deleteEntitiesTitle = count => this.translate.instant('mqtt-client.delete-mqtt-clients-title', {count});
    this.config.deleteEntitiesContent = () => this.translate.instant('mqtt-client.delete-mqtt-clients-text');


    this.config.loadEntity = id => this.loadEntity(id);
    this.config.saveEntity = mqttClient => this.mqttClientService.saveMqttClient(mqttClient);
    this.config.deleteEntity = id => this.mqttClientService.deleteMqttClient(id.id);
    this.config.onEntityAction = action => this.onMqttClientAction(action);
  }

  resolve(): EntityTableConfig<Client> {
    this.config.tableTitle = this.translate.instant('mqtt-client.clients');
    const authUser = getCurrentAuthUser(this.store);
    this.config.deleteEnabled = (widgetsBundle) => this.isMqttClientEditable(widgetsBundle, authUser.authority);
    this.config.entitySelectionEnabled = (widgetsBundle) => this.isMqttClientEditable(widgetsBundle, authUser.authority);
    this.config.detailsReadonly = (widgetsBundle) => !this.isMqttClientEditable(widgetsBundle, authUser.authority);
    this.config.entitiesFetchFunction = pageLink => this.mqttClientService.getMqttClients(pageLink);
    return this.config;
  }

  loadEntity(id) {
    return this.mqttClientService.getMqttClient(id);
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

  onMqttClientAction(action: EntityAction<Client>): boolean {
    switch (action.action) {
      case 'open':
        this.openMqttClient(action.event, action.entity);
        return true;
    }
    return false;
  }

}
