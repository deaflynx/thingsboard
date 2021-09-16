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

export enum ClientType {
  DEVICE = 'DEVICE',
  APPLICATION = 'APPLICATION'
}

export enum ConnectionState {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED'
}

export enum MqttQoS {
  AT_MOST_ONCE = 'AT_MOST_ONCE',
  AT_LEAST_ONCE = 'AT_LEAST_ONCE',
  EXACTLY_ONCE = 'EXACTLY_ONCE'
}

export enum ClientCredentialsType {
  MQTT_BASIC = 'MQTT_BASIC',
  SSL = 'SSL'
}

export const clientTypeTranslationMap = new Map<ClientType, string>(
  [
    [ClientType.DEVICE, 'Device'],
    [ClientType.APPLICATION, 'Application']
  ]
);

export interface Client extends BaseData<ClientId> {
  clientId: string,
  type: ClientType;
  description?: string;
  tenantId?: TenantId;
  session: DetailedClientSessionInfoDto;
}

export class ClientId implements EntityId {
  entityType = EntityType.MQTT_CLIENT;
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

export interface ClientSession {
  connected: boolean;
  sessionInfo: SessionInfo;
}

export interface ClientInfo {
  clientId: string;
  type: ClientType;
}

export interface ClientSessionInfo {
  clientSession: ClientSession;
  lastUpdateTime: number;
}

export interface SessionInfo {
  serviceId: string;
  sessionId: string;
  persistent: boolean;
  clientInfo: ClientInfo;
}

export interface MqttClientCredentials {
  clientId: string;
  credentialsId: string;
  credentialsValue: string;
  credentialsType: ClientCredentialsType;
}

export interface MqttAdminDto extends BaseData<ClientId> {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface DetailedClientSessionInfoDto extends BaseData<ClientId>{
  id: {
    id: string,
    entityType: EntityType.MQTT_CLIENT
  },
  clientId: string;
  connectionState: ConnectionState;
  clientType: ClientType;
  nodeId: string;
  persistent: boolean;
  username: string;
  subscriptions: TopicSubscription;
  keepAliveSeconds: number;
  connectedAt: number;
  disconnectedAt: number;
}

export interface TopicSubscription {
  topic: string;
  qos: MqttQoS;
}
