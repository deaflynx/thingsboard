import { Component, forwardRef, Input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup, NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors, Validators,
} from '@angular/forms';
import { isDefinedAndNotNull, isEmptyStr } from '@core/utils';
import { BasicMqttCredentials } from '@shared/models/mqtt.models';

@Component({
  selector: 'tb-mqtt-credentials-mqtt-ssl',
  templateUrl: './mqtt-credentials-mqtt-ssl.component.html',
  styleUrls: ['./mqtt-credentials-mqtt-ssl.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MqttCredentialsMqttSslComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MqttCredentialsMqttSslComponent),
      multi: true
    }
  ],
})
export class MqttCredentialsMqttSslComponent implements ControlValueAccessor, Validators {

  @Input()
  disabled: boolean;

  credentialsMqttSslFormGroup: FormGroup;

  private propagateChange = null;
  private onTouched: () => void = () => {};

  constructor(public fb: FormBuilder) {
    this.credentialsMqttSslFormGroup = this.fb.group({
      parentCertCommonName: ['', [Validators.required]],
      authorizationRulesMapping: ['']
    });
  }

  writeValue(credentialsValue: string): void {
    if (isDefinedAndNotNull(credentialsValue) && !isEmptyStr(credentialsValue)) {
      const value = JSON.parse(credentialsValue);
      this.credentialsMqttSslFormGroup.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
    this.credentialsMqttSslFormGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateView(value: BasicMqttCredentials) {
    this.credentialsMqttSslFormGroup.patchValue(value, { emitEvent: false });
    const formValue = JSON.stringify(value);
    this.propagateChange(formValue);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.credentialsMqttSslFormGroup.valid ? null : {
      credentialsMqttSsl: {valid: false}
    };
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
