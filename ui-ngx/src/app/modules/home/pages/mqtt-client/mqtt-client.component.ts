import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { MqttClient, MqttClientType, mqttClientTypeTranslationMap } from '@shared/models/mqtt.models';
import { EntityComponent } from '@home/components/entity/entity.component';
import { EntityTableConfig } from '@home/models/entity/entities-table-config.models';

@Component({
  selector: 'tb-mqtt-client',
  templateUrl: './mqtt-client.component.html',
  styleUrls: ['./mqtt-client.component.scss']
})
export class MqttClientComponent extends EntityComponent<MqttClient> {

  mqttClientTypes = Object.values(MqttClientType);

  mqttClientTypeTranslationMap = mqttClientTypeTranslationMap;

  constructor(protected store: Store<AppState>,
              @Inject('entity') protected entityValue: MqttClient,
              @Inject('entitiesTableConfig') protected entitiesTableConfigValue: EntityTableConfig<MqttClient>,
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
        name: [entity ? entity.name : '', [Validators.required]],
        clientId: [entity ? entity.clientId : '', [Validators.required]],
        type: [entity ? entity.type : MqttClientType.DEVICE, [Validators.required]],
      }
    );
  }

  updateForm(entity: MqttClient) {
    this.entityForm.patchValue({
      name: entity.name,
      clientId: entity.clientId,
      type: entity.type
    });
  }

}
