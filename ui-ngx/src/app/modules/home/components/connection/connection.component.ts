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
  selector: 'tb-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConnectionComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ConnectionComponent),
      multi: true
    }
  ]
})
export class ConnectionComponent implements OnInit, ControlValueAccessor, Validator {

  @Input()
  parentFormGroup: FormGroup;

  connectionForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.connectionForm = this.fb.group({
      nodeId: [this.parentFormGroup ? this.parentFormGroup.value.connection.nodeId : '', []],
      clientId: [this.parentFormGroup ? this.parentFormGroup.value.connection.clientId : '', []],
      username: [this.parentFormGroup ? this.parentFormGroup.value.connection.username : '', []],
      note: [this.parentFormGroup ? this.parentFormGroup.value.connection.note : '', []],
      keepAliveSeconds: [this.parentFormGroup ? this.parentFormGroup.value.connection.keepAliveSeconds : '', []],
      connectedAt: [this.parentFormGroup ? this.parentFormGroup.value.connection.connectedAt : '', []],
      connectionState: [this.parentFormGroup ? this.parentFormGroup.value.connection.connectionState : '', []]
    });
  }

  onTouched: () => void = () => {};

  registerOnChange(fn: any): void {
    console.log("on change");
    this.connectionForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.connectionForm.disable() : this.connectionForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log("connectionForm validation", control);
    return this.connectionForm.valid ? null : { invalidForm: { valid: false, message: "connectionForm fields are invalid" } };
  }

}
