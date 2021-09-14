import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttClientInfoComponent } from './mqtt-client-info.component';

describe('HomeMqttComponent', () => {
  let component: MqttClientInfoComponent;
  let fixture: ComponentFixture<MqttClientInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttClientInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttClientInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
