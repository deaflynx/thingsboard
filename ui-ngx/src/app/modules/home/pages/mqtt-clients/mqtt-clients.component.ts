import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import {
  MqttClient, MqttClientSession,
  MqttClientType,
  mqttClientTypeTranslationMap
} from '@shared/models/mqtt.models';
import { EntityComponent } from '@home/components/entity/entity.component';
import { EntityTableConfig } from '@home/models/entity/entities-table-config.models';
import { MqttClientSessionService } from '@core/http/mqtt-client-session.service';

@Component({
  selector: 'tb-mqtt-clients',
  templateUrl: './mqtt-clients.component.html',
  styleUrls: ['./mqtt-clients.component.scss']
})
export class MqttClientsComponent extends EntityComponent<MqttClient> {

  mqttClientTypes = Object.values(MqttClientType);

  mqttClientTypeTranslationMap = mqttClientTypeTranslationMap;

  clientSession: MqttClientSession;

  constructor(protected store: Store<AppState>,
              @Inject('entity') protected entityValue: MqttClient,
              @Inject('entitiesTableConfig') protected entitiesTableConfigValue: EntityTableConfig<MqttClient>,
              private mqttClientSessionService: MqttClientSessionService,
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

  buildForm(entity: MqttClient): FormGroup {
    return this.fb.group(
      {
        clientId: [entity ? entity.clientId : '', [Validators.required]],
        type: [entity ? entity.type : MqttClientType.DEVICE, [Validators.required]],
      }
    );
  }

  updateForm(entity: MqttClient) {
    if (entity) {
      this.mqttClientSessionService.getClientSessionInfo(entity.clientId).subscribe(
        (data) => this.clientSession = data
      );
    }
    this.entityForm.patchValue({
      clientId: entity.clientId,
      type: entity.type
    });
  }

}
