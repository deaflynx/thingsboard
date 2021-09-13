import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HomeComponentsModule } from '@home/components/home-components.module';
import { MqttClientRoutingModule } from '@home/pages/mqtt-client/mqtt-client-routing.module';
import { MqttClientComponent } from '@home/pages/mqtt-client/mqtt-client.component';

@NgModule({
  declarations: [
    MqttClientComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeComponentsModule,
    MqttClientRoutingModule
  ]
})

export class MqttClientModule { }
