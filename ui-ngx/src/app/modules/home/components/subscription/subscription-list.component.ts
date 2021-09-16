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

  constructor(protected store: Store<AppState>,
              private injector: Injector,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.subscriptionListFormGroup = this.fb.group({});
  }

  subscriptionsFormArray(): FormArray {
    return this.subscriptionListFormGroup.get('subscriptions') as FormArray;
  }

  public addSubscription() {
    const subscriptionsFormArray = this.subscriptionListFormGroup.get('subscriptions') as FormArray;
    subscriptionsFormArray.push(this.fb.group({
      topic: [null, [Validators.required]],
      qos: [null, [Validators.required]]
    }));
  }

  public removeSubscription(index: number) {
    (this.subscriptionListFormGroup.get('subscriptions') as FormArray).removeAt(index);
  }

}
