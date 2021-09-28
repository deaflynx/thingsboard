import { Component, forwardRef, Injector, Input, OnChanges, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { TopicSubscription } from '@shared/models/mqtt.models';
import { PageComponent } from '@shared/components/page.component';
import { Subscription } from 'rxjs';
import { AppState } from '@core/core.state';
import { Store } from '@ngrx/store';

export const mqttQoSTypes = [
  {
    value: 0,
    name: 'mqtt-client-session.qos-at-most-once'
  },
  {
    value: 1,
    name: 'mqtt-client-session.qos-at-least-once'
  },
  {
    value: 2,
    name: 'mqtt-client-session.qos-exactly-once'
  }];


@Component({
  selector: 'tb-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SubscriptionsComponent),
    multi: true
  }]
})
export class SubscriptionsComponent extends PageComponent implements ControlValueAccessor, OnInit {

  @Input() disabled: boolean;

  topicListFormGroup: FormGroup;
  mqttQoSTypes = mqttQoSTypes;

  private propagateChange = null;

  private valueChangeSubscription: Subscription = null;

  get topicFilters() {
    return this.topicListFormGroup.get('subscriptions').value;
  }

  constructor(protected store: Store<AppState>,
              private injector: Injector,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.topicListFormGroup = this.fb.group({});
    this.topicListFormGroup.addControl('subscriptions',
      this.fb.array([]));
  }

  subscriptionsFormArray(): FormArray {
    return this.topicListFormGroup.get('subscriptions') as FormArray;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.topicListFormGroup.disable({emitEvent: false});
    } else {
      this.topicListFormGroup.enable({emitEvent: false});
    }
  }

  writeValue(subscriptions: TopicSubscription[]): void {
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
    const subscriptionsControls: Array<AbstractControl> = [];
    if (subscriptions) {
      for (const topic of subscriptions) {
        const topicControl = this.fb.group(topic);
        if (this.disabled) {
          topicControl.disable();
        }
        subscriptionsControls.push(topicControl);
      }
    }
    this.topicListFormGroup.setControl('subscriptions', this.fb.array(subscriptionsControls));
    this.valueChangeSubscription = this.topicListFormGroup.valueChanges.subscribe(() => {
      this.updateModel();
    });
  }

  public removeTopic(index: number) {
    (this.topicListFormGroup.get('subscriptions') as FormArray).removeAt(index);
  }

  public addTopic() {
    const subscriptionsFormArray = this.topicListFormGroup.get('subscriptions') as FormArray;
    subscriptionsFormArray.push(this.fb.group({
      topic: [null, [Validators.required]],
      qos: [null, [Validators.required]]
    }));
  }

  private updateModel() {
    // const TopicList: {topic: Resource; qos: Operation[]}[] = this.topicListFormGroup.get('subscriptions').value;
    // const subscriptions: TopicSubscription = {};
    // TopicList.forEach((entry) => {
    //   Topics[entry.resource] = entry.operations;
    // });
    this.propagateChange(this.topicListFormGroup.get('subscriptions').value);
  }


}
