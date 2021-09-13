import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttClientComponent } from './mqtt-client.component';

describe('HomeMqttComponent', () => {
  let component: MqttClientComponent;
  let fixture: ComponentFixture<MqttClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
