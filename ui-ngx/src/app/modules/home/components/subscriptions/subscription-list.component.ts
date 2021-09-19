import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageComponent } from '@shared/components/page.component';
import { AppState } from '@core/core.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tb-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent extends PageComponent implements OnInit {

  @Input() disabled: boolean;

  subscriptionListFormGroup: FormGroup;

  subscriptions: FormArray;

  constructor(protected store: Store<AppState>,
              private injector: Injector,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.subscriptionListFormGroup = this.fb.group({
      subscriptions: this.fb.array([this.createSubscription()])
    });
  }

  createSubscription(): FormGroup {
    return this.fb.group({
      topic: ['', [Validators.required]],
      qos: ['', [Validators.required]]
    });
  }

  subscriptionsFormArray(): FormArray {
    return this.subscriptionListFormGroup.value;
  }

  addSubscription(): void {
    this.subscriptions = this.subscriptionListFormGroup.get('subscriptions') as FormArray;
    this.subscriptions.push(this.createSubscription());
  }

  removeSubscription(index: number) {
    (this.subscriptionListFormGroup.get('subscriptions') as FormArray).removeAt(index);
  }

}
