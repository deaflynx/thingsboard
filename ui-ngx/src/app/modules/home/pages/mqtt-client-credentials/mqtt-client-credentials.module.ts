import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HomeComponentsModule } from '@home/components/home-components.module';
import { MqttClientCredentialsComponent } from '@home/pages/mqtt-client-credentials/mqtt-client-credentials.component';
import { MqttClientCredentialsRoutingModule } from '@home/pages/mqtt-client-credentials/mqtt-client-credentials-routing.module';

@NgModule({
  declarations: [
    MqttClientCredentialsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeComponentsModule,
    MqttClientCredentialsRoutingModule
  ]
})

export class MqttClientCredentialsModule { }
