import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMqttComponent } from './home-mqtt.component';

describe('HomeMqttComponent', () => {
  let component: HomeMqttComponent;
  let fixture: ComponentFixture<HomeMqttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeMqttComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMqttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
