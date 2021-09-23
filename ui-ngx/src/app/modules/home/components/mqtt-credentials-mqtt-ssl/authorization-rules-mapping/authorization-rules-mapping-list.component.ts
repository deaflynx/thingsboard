import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { isDefinedAndNotNull, isEmptyStr } from '@core/utils';
import { DeviceCredentialMQTTBasic } from '@shared/models/device.models';
import { SslMqttCredentials } from '@shared/models/mqtt.models';

@Component({
  selector: 'tb-authorization-rules-mapping-list',
  templateUrl: './authorization-rules-mapping-list.component.html',
  styleUrls: ['./authorization-rules-mapping-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AuthorizationRulesMappingListComponent),
      multi: true
    }
  ]
})
export class AuthorizationRulesMappingListComponent implements ControlValueAccessor, OnInit {

  @Input() disabled: boolean;

  private propagateChange = (v: any) => {};

  authorizationRulesMappingListFormGroup: FormGroup;

  authorizationRulesMappings: FormArray;

  get authorizationRulesMapping() {
    return this.authorizationRulesMappingListFormGroup.get('authorizationRulesMapping') as FormArray;
  }

  constructor(protected store: Store<AppState>,
              private injector: Injector,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.authorizationRulesMappingListFormGroup = this.fb.group({
      authorizationRulesMapping: this.fb.array([this.createRule()])
    });
    this.authorizationRulesMappingListFormGroup.valueChanges.subscribe((value) => {
      this.updateView(value);
    });
  }

  createRule(): FormGroup {
    return this.fb.group({
      certificateMtcherRegex: ['', [Validators.required]],
      topicRule: ['', [Validators.required]]
    });
  }

  rulesFormArray(): FormArray {
    return this.authorizationRulesMappingListFormGroup.value;
  }

  addRule(): void {
    this.authorizationRulesMappings = this.authorizationRulesMappingListFormGroup.get('authorizationRulesMapping') as FormArray;
    this.authorizationRulesMappings.push(this.createRule());
  }

  removeRule(index: number) {
    (this.authorizationRulesMappingListFormGroup.get('authorizationRulesMapping') as FormArray).removeAt(index);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(authorizationRulesMapping: any): void {
    console.warn("authorizationRulesMapping writeValue", authorizationRulesMapping);
    if (authorizationRulesMapping) {
      this.authorizationRulesMappingListFormGroup.patchValue(authorizationRulesMapping, { emitEvent: false });
    }
  }

  updateView(value: SslMqttCredentials) {
    this.authorizationRulesMappingListFormGroup.patchValue(value, { emitEvent: false });
    this.propagateChange(this.prepareValues(value.authorizationRulesMapping));
  }

  private prepareValues(authorizationRulesMapping: any) {
    const newArray = [];
    authorizationRulesMapping.forEach( obj => {
      const key = obj.certificateMtcherRegex;
      const value = obj.topicRule;
      const newObj = {};
      newObj[key] = value;
      newArray.push(newObj);
    });
    const commaArray = newArray.join();
    return commaArray;
  }
}
