import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttClientsComponent } from './mqtt-clients.component';

describe('HomeMqttComponent', () => {
  let component: MqttClientsComponent;
  let fixture: ComponentFixture<MqttClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
