import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilebasepageComponent } from './profilebasepage.component';

describe('ProfilebasepageComponent', () => {
  let component: ProfilebasepageComponent;
  let fixture: ComponentFixture<ProfilebasepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilebasepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilebasepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
