import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors,
  Validator, Validators
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { AuthorizationRulesMap } from '@home/components/mqtt-credentials-mqtt-ssl/authorization-rules-mapping/authorization-rules-mapping.component';

@Component({
  selector: 'tb-auth-rules',
  templateUrl: './auth-rules.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AuthRulesComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AuthRulesComponent),
      multi: true,
    }],
  styleUrls: []
})
export class AuthRulesComponent implements ControlValueAccessor, Validator, OnDestroy {

  @Input()
  disabled: boolean;

  rulesMappingFormGroup: FormGroup;
  rulesMappings: FormArray;

  private valueChangeSubscription: Subscription = null;
  private destroy$ = new Subject();
  private propagateChange = (v: any) => {};

  constructor(public fb: FormBuilder) {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.rulesMappingFormGroup.disable({emitEvent: false});
    } else {
      this.rulesMappingFormGroup.enable({emitEvent: false});
    }
  }

  validate(): ValidationErrors | null {
    return this.rulesMappingFormGroup.valid ? null : {
      deviceCredentialsMqttBasic: false
    };
  }

  writeValue(authorizationRulesMapping: any): void {
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
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
    this.valueChangeSubscription = this.rulesMappingFormGroup.valueChanges.subscribe((value) => {
      this.updateView(value);
    });
  }

  updateView(value: any) {
    this.rulesMappingFormGroup.patchValue(value, { emitEvent: false });
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

