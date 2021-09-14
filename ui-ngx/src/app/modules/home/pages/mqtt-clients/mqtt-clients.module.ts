import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HomeComponentsModule } from '@home/components/home-components.module';
import { MqttClientsComponent } from '@home/pages/mqtt-clients/mqtt-clients.component';
import { MqttClientsRoutingModule } from '@home/pages/mqtt-clients/mqtt-clients-routing.module';

@NgModule({
  declarations: [
    MqttClientsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeComponentsModule,
    MqttClientsRoutingModule
  ]
})

export class MqttClientsModule { }
