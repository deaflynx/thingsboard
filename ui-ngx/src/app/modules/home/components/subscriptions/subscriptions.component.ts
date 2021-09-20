import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TopicSubscription } from '@shared/models/mqtt.models';

@Component({
  selector: 'tb-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  @Input()
  subscriptions: TopicSubscription[];

  entityForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
