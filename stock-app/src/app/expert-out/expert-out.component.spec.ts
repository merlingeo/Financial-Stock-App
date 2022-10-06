import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertOutComponent } from './expert-out.component';

describe('ExpertOutComponent', () => {
  let component: ExpertOutComponent;
  let fixture: ComponentFixture<ExpertOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
