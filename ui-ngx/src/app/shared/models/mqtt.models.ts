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

import { EntityType } from '@shared/models/entity-type.models';

export interface MqttBaseData<T> {
  createdTime?: number;
  id?: T;
  name?: string;
  label?: string;
}

export interface MqttClient extends MqttClientInfo, MqttBaseData<string> {
}

export interface MqttClientInfo {
  clientId: string,
  type?: EntityType
}

export interface MqttSessionInfo {
  clientInfo: MqttClientInfo
  persistent: boolean,
  serviceId: string,
  sessionId: string
}

export interface MqttClientSession {
  connected: boolean,
  sessionInfo: MqttSessionInfo,
  lastUpdateTime: number;
}

export interface MqttClientCredentials extends MqttClientInfo, MqttBaseData<string> {
  credentialsId: string,
  credentialsType: "MQTT_BASIC",
  credentialsValue: string
}

export interface MqttSubscription {
  qos: number,
  topic: string
}
