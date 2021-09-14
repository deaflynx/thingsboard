import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HomeComponentsModule } from '@home/components/home-components.module';
import { MqttClientInfoRoutingModule } from '@home/pages/mqtt-client-info/mqtt-client-info-routing.module';
import { MqttClientInfoComponent } from '@home/pages/mqtt-client-info/mqtt-client-info.component';

@NgModule({
  declarations: [
    MqttClientInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeComponentsModule,
    MqttClientInfoRoutingModule
  ]
})

export class MqttClientInfoModule { }
