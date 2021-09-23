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
import { Client } from '@shared/models/mqtt.models';

@Component({
  selector: 'tb-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SessionComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SessionComponent),
      multi: true
    }
  ]
})
export class SessionComponent implements OnInit, ControlValueAccessor, Validator {

  onChange: (value: any) => void;

  sessionForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.sessionForm = this.fb.group({
      cleanSession: ['', []],
      subscriptionsCount: ['', []]
    });
    this.sessionForm.valueChanges.subscribe((data) => {
      this.writeValue(data);
    })
  }

  onTouched: () => void = () => {};

  registerOnChange(fn: any): void {
    console.log("on change");
    // this.sessionForm.valueChanges.subscribe(fn);
    this.onChange = fn;
    // this.onChange2 = fn;
  }

  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    // this.sessionForm.setValue(obj);
    console.warn("sessionForm: ", this.sessionForm);
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.sessionForm.disable() : this.sessionForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log("sessionInfoForm validation", control);
    return this.sessionForm.valid ? null : { invalidForm: { valid: false, message: "sessionForm fields are invalid" } };
  }

}
