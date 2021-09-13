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

import { BaseData } from '@shared/models/base-data';
import { EntityId } from '@shared/models/id/entity-id';
import { EntityType } from '@shared/models/entity-type.models';
import { TenantId } from '@shared/models/id/tenant-id';
import { Lwm2mSecurityType } from '@shared/models/lwm2m-security-config.models';

export enum MqttClientType {
  DEVICE = 'DEVICE',
  APPLICATION = 'APPLICATION'
}

export const mqttClientTypeTranslationMap = new Map<MqttClientType, string>(
  [
    [MqttClientType.DEVICE, 'Device'],
    [MqttClientType.APPLICATION, 'Application']
  ]
);

export enum MqttClientCredentialsType {
  MQTT_BASIC = 'MQTT_BASIC',
  SSL = 'SSL'
}

export interface MqttAdminDto extends BaseData<MqttClientId> {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export class MqttClientId implements EntityId {
  entityType = EntityType.MQTT_CLIENT;
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

export interface MqttClient extends BaseData<MqttClientId> {
  clientId?: string,
  type?: MqttClientType,
  tenantId?: TenantId,
  description?: string;
}

export interface MqttSessionInfo {
  clientInfo: MqttClient
  persistent: boolean,
  serviceId: string,
  sessionId: string
}

export interface MqttClientSession {
  connected: boolean,
  sessionInfo: MqttSessionInfo,
  lastUpdateTime: number;
}

export interface MqttClientCredentials extends MqttClient {
  credentialsId?: string,
  credentialsType?: MqttClientCredentialsType
  credentialsValue?: string
}

export interface MqttSubscription {
  qos: number,
  topic: string
}
