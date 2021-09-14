import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttClientCredentialsComponent } from './mqtt-client-credentials.component';

describe('HomeMqttComponent', () => {
  let component: MqttClientCredentialsComponent;
  let fixture: ComponentFixture<MqttClientCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttClientCredentialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttClientCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
