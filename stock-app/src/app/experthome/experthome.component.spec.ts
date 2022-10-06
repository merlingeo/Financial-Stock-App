import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperthomeComponent } from './experthome.component';

describe('ExperthomeComponent', () => {
  let component: ExperthomeComponent;
  let fixture: ComponentFixture<ExperthomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperthomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperthomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
