import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator, ValidatorFn, Validators
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { DeviceCredentialMQTTBasic } from '@shared/models/device.models';
import { Subject } from 'rxjs';
import { isDefinedAndNotNull, isEmptyStr } from '@core/utils';

@Component({
  selector: 'tb-mqtt-credentials-mqtt-basic',
  templateUrl: './mqtt-credentials-mqtt-basic.component.html',
  styleUrls: ['./mqtt-credentials-mqtt-basic.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MqttCredentialsMqttBasicComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MqttCredentialsMqttBasicComponent),
      multi: true,
    }
  ],
})
export class MqttCredentialsMqttBasicComponent implements ControlValueAccessor, Validator {

  @Input()
  disabled: boolean;

  credentialsMqttBasicFormGroup: FormGroup;

  private propagateChange = (v: any) => {};

  constructor(public fb: FormBuilder) {
    this.credentialsMqttBasicFormGroup = this.fb.group({
        clientId: [''],
        userName: [''],
        password: ['']
      },
      {
        validators: this.atLeastOne(Validators.required, ['clientId', 'userName'])
      }
    );
    this.credentialsMqttBasicFormGroup.valueChanges.subscribe((value) => {
      this.updateView(value);
    });
  }

  writeValue(mqttBasic: any): void {
    if (isDefinedAndNotNull(mqttBasic) && !isEmptyStr(mqttBasic)) {
      const value = JSON.parse(mqttBasic);
      this.credentialsMqttBasicFormGroup.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(): ValidationErrors | null {
    return this.credentialsMqttBasicFormGroup.valid ? null : {
      credentialsMqttBasic: false
    };
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.credentialsMqttBasicFormGroup.disable({ emitEvent: false });
    } else {
      this.credentialsMqttBasicFormGroup.enable({ emitEvent: false });
    }
  }

  updateView(value: DeviceCredentialMQTTBasic) {
    this.credentialsMqttBasicFormGroup.patchValue(value, { emitEvent: false });
    const formValue = JSON.stringify(value);
    this.propagateChange(formValue);
  }

  passwordChanged() {
    const value = this.credentialsMqttBasicFormGroup.get('password').value;
    if (value !== '') {
      this.credentialsMqttBasicFormGroup.get('userName').setValidators([Validators.required]);
    } else {
      this.credentialsMqttBasicFormGroup.get('userName').setValidators([]);
    }
    this.credentialsMqttBasicFormGroup.get('userName').updateValueAndValidity({emitEvent: false});
  }

  private atLeastOne(validator: ValidatorFn, controls: string[] = null) {
    return (group: FormGroup): ValidationErrors | null => {
      if (!controls) {
        controls = Object.keys(group.controls);
      }
      const hasAtLeastOne = group?.controls && controls.some(k => !validator(group.controls[k]));

      return hasAtLeastOne ? null : {atLeastOne: true};
    };
  }

}
