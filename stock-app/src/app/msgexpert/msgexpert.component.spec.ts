import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgexpertComponent } from './msgexpert.component';

describe('MsgexpertComponent', () => {
  let component: MsgexpertComponent;
  let fixture: ComponentFixture<MsgexpertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgexpertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgexpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
