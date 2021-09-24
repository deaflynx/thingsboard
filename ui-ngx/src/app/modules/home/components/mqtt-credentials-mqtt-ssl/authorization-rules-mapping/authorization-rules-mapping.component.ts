import { Component, forwardRef, Injector, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { SslMqttCredentials } from '@shared/models/mqtt.models';

export interface AuthorizationRulesMap {
  certificateMtcherRegex: string;
  topicRule: string;
}

@Component({
  selector: 'tb-authorization-rules-mapping',
  templateUrl: './authorization-rules-mapping.component.html',
  styleUrls: ['./authorization-rules-mapping.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AuthorizationRulesMappingComponent),
      multi: true
    }
  ]
})
export class AuthorizationRulesMappingComponent implements ControlValueAccessor, OnInit {

  @Input() disabled: boolean;

  @Input() authorizationRulesMapping;

  private propagateChange = (v: any) => {};

  authorizationRulesMappingFormGroup: FormGroup;

  authorizationRulesMappings: FormArray;

  constructor(protected store: Store<AppState>,
              private injector: Injector,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.authorizationRulesMappingFormGroup = this.fb.group({
      authorizationRulesMapping: this.fb.array([this.createRule()])
    });
    this.authorizationRulesMappingFormGroup.valueChanges.subscribe((value) => {
      this.updateView(value);
    });
  }

  createRule(): FormGroup {
    if (this.authorizationRulesMapping) {
      return this.fb.group({
        certificateMtcherRegex: ['', [Validators.required]],
        topicRule: ['', [Validators.required]]
      });
    } else {
      return this.fb.group({
        certificateMtcherRegex: ['', [Validators.required]],
        topicRule: ['', [Validators.required]]
      });
    }
  }

  rulesFormArray(): FormArray {
    return this.authorizationRulesMappingFormGroup.value;
  }

  addRule(): void {
    this.authorizationRulesMappings = this.authorizationRulesMappingFormGroup.get('authorizationRulesMapping') as FormArray;
    this.authorizationRulesMappings.push(this.createRule());
  }

  removeRule(index: number) {
    (this.authorizationRulesMappingFormGroup.get('authorizationRulesMapping') as FormArray).removeAt(index);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(authorizationRulesMapping: any): void {
    console.warn("authorizationRulesMapping writeValue", authorizationRulesMapping);
    if (authorizationRulesMapping) {
      this.authorizationRulesMappingFormGroup.patchValue(authorizationRulesMapping, { emitEvent: false });
    }
  }

  updateView(value: SslMqttCredentials) {
    this.authorizationRulesMappingFormGroup.patchValue(value, { emitEvent: false });
    this.propagateChange(this.prepareValues(value.authorizationRulesMapping));
  }

  private prepareValues(authorizationRulesMapping: any) {
    const newObj = {};
    authorizationRulesMapping.forEach( (obj: AuthorizationRulesMap) => {
      const key = obj.certificateMtcherRegex;
      newObj[key] = obj.topicRule;
    });
    return newObj;
  }
}
