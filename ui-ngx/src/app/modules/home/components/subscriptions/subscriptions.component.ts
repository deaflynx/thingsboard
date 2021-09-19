import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Component({
  selector: 'tb-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SubscriptionsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SubscriptionsComponent),
      multi: true
    }
  ]
})
export class SubscriptionsComponent implements OnInit, ControlValueAccessor, Validator {

  @Input()
  parentFormGroup: FormGroup;

  subscriptionsForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.subscriptionsForm = this.fb.group({
      cleanSession: [this.parentFormGroup ? this.parentFormGroup.value.subscription.cleanSession : '', []],
      subscriptionsCount: [this.parentFormGroup ? this.parentFormGroup.value.subscription.subscriptionsCount : '', []],
    });
  }

  onTouched: () => void = () => {};

  registerOnChange(fn: any): void {
    console.log("on change");
    this.subscriptionsForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.subscriptionsForm.disable() : this.subscriptionsForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log("sessionInfoForm validation", control);
    return this.subscriptionsForm.valid ? null : { invalidForm: { valid: false, message: "subscriptionsForm fields are invalid" } };
  }

}
