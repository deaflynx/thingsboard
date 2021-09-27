import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  ControlValueAccessor, FormArray,
  FormBuilder, FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { DeviceCredentialMQTTBasic } from '@shared/models/device.models';
import { isDefinedAndNotNull, isEmptyStr } from '@core/utils';
import { BasicMqttCredentials, ClientCredentialsType, SslMqttCredentials } from '@shared/models/mqtt.models';

@Component({
  selector: 'tb-mqtt-credentials-mqtt-ssl',
  templateUrl: './mqtt-credentials-mqtt-ssl.component.html',
  styleUrls: ['./mqtt-credentials-mqtt-ssl.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MqttCredentialsMqttSslComponent),
      multi: true
    }
  ],
})
export class MqttCredentialsMqttSslComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled: boolean;

  credentialsMqttSslFormGroup: FormGroup;

  authorizationRulesMappingData;

  private propagateChange = null;

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    this.credentialsMqttSslFormGroup = this.fb.group({
      parentCertCommonName: [''],
      authorizationRulesMapping: ['']
    });
    this.credentialsMqttSslFormGroup.valueChanges.subscribe((value) => {
      this.updateView(value);
    });
  }

  writeValue(mqttSsl: string): void {
    if (isDefinedAndNotNull(mqttSsl) && !isEmptyStr(mqttSsl)) {
      const value = JSON.parse(mqttSsl);
      this.authorizationRulesMappingData = value.authorizationRulesMapping;
      this.credentialsMqttSslFormGroup.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  updateView(value: BasicMqttCredentials) {
    this.credentialsMqttSslFormGroup.patchValue(value, { emitEvent: false });
    const formValue = JSON.stringify(value);
    this.propagateChange(formValue);
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.credentialsMqttSslFormGroup.disable({ emitEvent: false });
    } else {
      this.credentialsMqttSslFormGroup.enable({ emitEvent: false });
    }
  }

}
