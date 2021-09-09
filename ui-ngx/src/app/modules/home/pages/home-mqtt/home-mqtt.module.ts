import { NgModule } from '@angular/core';
import { HomeMqttComponent } from '@home/pages/home-mqtt/home-mqtt.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HomeMqttRoutingModule } from '@home/pages/home-mqtt/home-mqtt-routing.module';

@NgModule({
  declarations: [
    HomeMqttComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeMqttRoutingModule
  ]
})

export class HomeMqttModule { }
