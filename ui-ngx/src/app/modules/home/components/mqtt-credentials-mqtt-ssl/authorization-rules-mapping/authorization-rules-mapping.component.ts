import { Component, forwardRef, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { SslMqttCredentials } from '@shared/models/mqtt.models';
import { Subscription } from 'rxjs';

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

  @Input() authorizationRulesMapping: FormGroup;

  rulesMappingFormGroup: FormGroup;

  rulesMappings: FormArray;

  private propagateChange = null;
  private valueChangeSubscription: Subscription = null;

  constructor(protected store: Store<AppState>,
              private injector: Injector,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.rulesMappingFormGroup = this.fb.group({});
    this.rulesMappingFormGroup.addControl('authorizationRulesMapping',
      this.fb.array([]));
    this.rulesMappingFormGroup.get('authorizationRulesMapping').valueChanges.subscribe((value) => {
      this.updateView(value);
    });
  }

  rulesFormArray(): FormArray {
    return this.rulesMappingFormGroup.get('authorizationRulesMapping') as FormArray;
  }

  addRule(): void {
    this.rulesMappings = this.rulesMappingFormGroup.get('authorizationRulesMapping') as FormArray;
    this.rulesMappings.push(this.fb.group({
      certificateMtcherRegex: ['', [Validators.required]],
      topicRule: ['', [Validators.required]]
    }));
  }

  removeRule(index: number) {
    (this.rulesMappingFormGroup.get('authorizationRulesMapping') as FormArray).removeAt(index);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(authorizationRulesMapping: any): void {
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
      console.warn("writeValue unsubscribe");
    }
    const rulesControls: Array<AbstractControl> = [];
    if (authorizationRulesMapping) {
      for (const rule of Object.keys(authorizationRulesMapping)) {
        const rulesControl = this.fb.group({
          certificateMtcherRegex: [rule, [Validators.required]],
          topicRule: [authorizationRulesMapping[rule], [Validators.required]]
        });
        if (this.disabled) {
          rulesControl.disable();
        }
        rulesControls.push(rulesControl);
      }
    }
    this.rulesMappingFormGroup.setControl('authorizationRulesMapping', this.fb.array(rulesControls));
    console.warn("getRawValue()", this.rulesMappingFormGroup.getRawValue());
    this.valueChangeSubscription = this.rulesMappingFormGroup.valueChanges.subscribe((value) => {
      console.warn("valueChangeSubscription", value)
      this.updateView(value);
    });
  }

  updateView(value: SslMqttCredentials) {
    this.rulesMappingFormGroup.patchValue(value, { emitEvent: false });
    this.propagateChange(this.prepareValues(value.authorizationRulesMapping));
  }

  private prepareValues(authorizationRulesMapping: any) {
    const newObj = {};
    authorizationRulesMapping.forEach( (obj: AuthorizationRulesMap) => {
      const key = obj.certificateMtcherRegex;
      newObj[key] = obj.topicRule;
    });
    console.warn("prepareValues", newObj);
    return newObj;
  }
}
