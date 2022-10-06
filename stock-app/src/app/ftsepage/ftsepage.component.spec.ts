import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtsepageComponent } from './ftsepage.component';

describe('FtsepageComponent', () => {
  let component: FtsepageComponent;
  let fixture: ComponentFixture<FtsepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FtsepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FtsepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
