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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageComponent } from '@shared/components/page.component';
import {
  INSTANCES_ID_VALUE_MAX,
  INSTANCES_ID_VALUE_MIN
} from '@home/components/profile/device/lwm2m/lwm2m-profile-config.models';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { MqttClientService } from '@core/http/mqtt-client.service';
import { Client, ClientCredentials } from '@shared/models/mqtt.models';
import { PageLink } from '@shared/models/page/page-link';
import { concatMap, map } from 'rxjs/operators';
import { MqttClientCredentialsService } from '@core/http/mqtt-client-credentials.service';
import { MqttAppInfoService } from '@core/http/mqtt-app-info.service';
import { MqttClientSessionService } from '@core/http/mqtt-client-session.service';

@Component({
  selector: 'tb-home-mqtt',
  templateUrl: './home-mqtt.component.html',
  styleUrls: ['./home-mqtt.component.scss']
})
export class HomeMqttComponent extends PageComponent implements OnInit {

  mqttClientForm: FormGroup;

  clients: Client[];
  clientCredentials: ClientCredentials[];
  clientSessionInfo: any;
  actorIds: any[];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private mqttClientService: MqttClientService,
              private mqttClientCredentialsService: MqttClientCredentialsService,
              private mqttAppInfoService: MqttAppInfoService,
              private mqttClientSessionService: MqttClientSessionService) {
    super(store);
  }

  ngOnInit(): void {
    this.buildForms();
  }

  buildForms() {
    this.buildClientForm();
  }

  private buildClientForm() {
    this.mqttClientForm = this.fb.group({
      name: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });
  }

  addClient() {
    this.mqttClientService.saveMqttClient(this.mqttClientForm.value).subscribe(() => this.getClients());
  }

  getClients() {
    this.mqttClientService.getMqttClients(new PageLink(10, 0)).subscribe(
      (data) => this.clients = data.data
    )
  }

  removeClient(clientId: string) {
    this.mqttClientService.deleteMqttClient(clientId).subscribe(() => this.getClients());
  }

  getClientCredentials() {
    this.mqttClientCredentialsService.getMqttClientsCredentials(new PageLink(10,0)).subscribe(
      (data) => this.clientCredentials = data.data
    )
  }

  getAllActorsIds() {
    this.mqttAppInfoService.getAllActorIds().subscribe(
      (data) => this.actorIds = data
    );
  }

  getClientSessionInfo(clientId: string) {
  }

  clearClientSession(clientId: string) {
  }





}
