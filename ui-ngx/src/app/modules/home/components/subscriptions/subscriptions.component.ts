import { Component, OnInit } from '@angular/core';
import { EntityComponent } from '@home/components/entity/entity.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'tb-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  entityForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
