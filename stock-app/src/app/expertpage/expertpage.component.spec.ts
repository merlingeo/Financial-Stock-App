import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertpageComponent } from './expertpage.component';

describe('ExpertpageComponent', () => {
  let component: ExpertpageComponent;
  let fixture: ComponentFixture<ExpertpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
