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
import { MqttClient, MqttClientCredentials, MqttClientSession } from '@shared/models/mqtt.models';
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

  clients: MqttClient[];
  clientCredentials: MqttClientCredentials[];
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
    this.mqttClientSessionService.getClientSessionInfo(clientId).subscribe(
      (data) => this.clientSessionInfo = data
    );
  }

  clearClientSession(clientId: string) {
    this.mqttClientService.deleteMqttClient(clientId).subscribe(
      () => this.getClientSessionInfo(clientId)
    );
  }





}
