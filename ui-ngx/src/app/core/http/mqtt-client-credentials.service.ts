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
import { Client, ClientCredentials, ClientCredentialsType } from '@shared/models/mqtt.models';
import { EntityType } from '@shared/models/entity-type.models';

@Injectable({
  providedIn: 'root'
})
export class MqttClientCredentialsService {

  constructor(
    private http: HttpClient
  ) { }

  public saveMqttClientCredentials(mqttClientCredentials: ClientCredentials, config?: RequestConfig): Observable<ClientCredentials> {
    return this.http.post<ClientCredentials>('/api/mqtt/client/credentials', mqttClientCredentials, defaultHttpOptionsFromConfig(config));
  }

  public deleteMqttClientCredentials(credentialsId: string, config?: RequestConfig) {
    return this.http.delete(`/api/mqtt/client/credentials/${credentialsId}`, defaultHttpOptionsFromConfig(config));
  }

  public getMqttClientsCredentials(pageLink: PageLink, config?: RequestConfig): Observable<PageData<ClientCredentials>> {
    // return this.http.get<PageData<ClientCredentials>>(`/api/mqtt/client/credentials${pageLink.toQuery()}`, defaultHttpOptionsFromConfig(config));
    return of({
      data: [
          {
            id: {
              id: '34926-03928634-4363463463',
              entityType: EntityType.MQTT_CLIENT
            },
            clientId: '676',
            type: ClientCredentialsType.SSL,
            credentialsId: 'credentialsId',
            credentialsValue: 'credentialsValue',
            username: 'usernmae 2',
            password: 'pass_2',
            authorizationRulePattern: 76
          },
          {
            id: {
                id: '34926-03928634-4363463463',
                entityType: EntityType.MQTT_CLIENT
            },
            clientId: '1243',
            type: ClientCredentialsType.MQTT_BASIC,
            credentialsId: '125325123',
            credentialsValue: 'credentials124',
            username: 'usernmae',
            password: 'pass',
            authorizationRulePattern: 2
          }
        ],
        hasNext: true,
        totalPages: 1,
        totalElements: 2,
    });
  }

  public getMqttClientCredentials(clientId: string, config?: RequestConfig): Observable<ClientCredentials> {
    // return this.http.get<ClientCredentials>(`/api/mqtt/client/credentials/${clientId}`, defaultHttpOptionsFromConfig(config));
    return of({
      id: {
        id: '34926-03928634-4363463463',
        entityType: EntityType.MQTT_CLIENT
      },
      clientId: '1243',
      type: ClientCredentialsType.MQTT_BASIC,
      credentialsId: '125325123',
      credentialsValue: 'credentials124',
      username: 'usernmae',
      password: 'pass',
      authorizationRulePattern: 2
    });
  }

}
