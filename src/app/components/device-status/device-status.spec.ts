import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceStatus } from './device-status';

describe('DeviceStatus', () => {
  let component: DeviceStatus;
  let fixture: ComponentFixture<DeviceStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
