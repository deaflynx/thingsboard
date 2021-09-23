import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MqttCredentialsMqttBasicComponent } from '@home/components/mqtt-credentials-mqtt-basic/mqtt-credentials-mqtt-basic.component';


describe('MqttCredentialsMqttBasicComponent', () => {
  let component: MqttCredentialsMqttBasicComponent;
  let fixture: ComponentFixture<MqttCredentialsMqttBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttCredentialsMqttBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttCredentialsMqttBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
