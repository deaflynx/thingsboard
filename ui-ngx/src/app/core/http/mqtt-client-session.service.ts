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
import { defaultHttpOptionsFromConfig, RequestConfig } from './http-utils';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PageLink } from '@shared/models/page/page-link';
import { PageData } from '@shared/models/page/page-data';
import { ClientType, ConnectionState, DetailedClientSessionInfoDto, MqttQoS } from '@shared/models/mqtt.models';
import { EntityType } from '@shared/models/entity-type.models';

@Injectable({
  providedIn: 'root'
})
export class MqttClientSessionService {

  constructor(
    private http: HttpClient
  ) { }

  public getClientSessionInfo(clientId: string, config?: RequestConfig): Observable<DetailedClientSessionInfoDto> {
    // return this.http.get<DetailedClientSessionInfoDto>(`/api/client-session/${clientId}`, defaultHttpOptionsFromConfig(config));
    return of({
      id: {
        id: '123124151251251651612',
        entityType: EntityType.MQTT_CLIENT
      },
      clientId: clientId,
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
      disconnectedAt: 987654321
    })
  }

  public getClientSessionInfos(pageLink: PageLink, config?: RequestConfig): Observable<PageData<DetailedClientSessionInfoDto>> {
    // return this.http.get<PageData<DetailedClientSessionInfoDto>>(`/api/client-session${pageLink.toQuery()}`, defaultHttpOptionsFromConfig(config));
    return of({
      data: [
        {
          id: {
            id: '123124151251251651612',
            entityType: EntityType.MQTT_CLIENT
          },
          clientId: '1',
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
          disconnectedAt: 987654321
        },
        {
          id: {
            id: '6432743743757457436',
            entityType: EntityType.MQTT_CLIENT
          },
          clientId: '2',
          connectionState: ConnectionState.DISCONNECTED,
          clientType: ClientType.APPLICATION,
          nodeId: '2',
          persistent: false,
          username: 'username 2',
          subscriptions: {
            topic: 'topic1',
            qos: MqttQoS.EXACTLY_ONCE
          },
          keepAliveSeconds: 60,
          connectedAt: 123456789,
          disconnectedAt: 987654321
        }
      ],
      totalElements: 2,
      totalPages: 1,
      hasNext: false
    })
  }

  public clearClientSession(clientId: string, config?: RequestConfig) {
    return this.http.delete(`/api/client-session/${clientId}/clear`, defaultHttpOptionsFromConfig(config));
  }

}
