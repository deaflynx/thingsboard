import { Component, OnInit } from '@angular/core';
import { EntityComponent } from '@home/components/entity/entity.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'tb-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  entityForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
