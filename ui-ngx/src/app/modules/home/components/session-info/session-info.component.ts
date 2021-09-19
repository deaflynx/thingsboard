import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator, Validators
} from '@angular/forms';

@Component({
  selector: 'tb-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SessionInfoComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SessionInfoComponent),
      multi: true
    }
  ]
})
export class SessionInfoComponent implements OnInit, ControlValueAccessor, Validator {

  @Input()
  parentFormGroup: FormGroup;

  sessionInfoForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.sessionInfoForm = this.fb.group({
      nodeId: [this.parentFormGroup ? this.parentFormGroup.value.connectionInfo.nodeId : '', []],
      clientId: [this.parentFormGroup ? this.parentFormGroup.value.connectionInfo.clientId : '', []],
      username: [this.parentFormGroup ? this.parentFormGroup.value.connectionInfo.username : '', []],
      note: [this.parentFormGroup ? this.parentFormGroup.value.connectionInfo.note : '', []],
      keepAliveSeconds: [this.parentFormGroup ? this.parentFormGroup.value.connectionInfo.keepAliveSeconds : '', []],
      connectedAt: [this.parentFormGroup ? this.parentFormGroup.value.connectionInfo.connectedAt : '', []],
      connectionState: [this.parentFormGroup ? this.parentFormGroup.value.connectionInfo.connectionState : '', []]
    });
  }

  onTouched: () => void = () => {};

  registerOnChange(fn: any): void {
    console.log("on change");
    this.sessionInfoForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.sessionInfoForm.disable() : this.sessionInfoForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log("sessionInfoForm validation", control);
    return this.sessionInfoForm.valid ? null : { invalidForm: { valid: false, message: "sessionInfoForm fields are invalid" } };
  }

}
