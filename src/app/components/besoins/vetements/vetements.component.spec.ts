import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VetementsComponent } from './vetements.component';

describe('VetementsComponent', () => {
  let component: VetementsComponent;
  let fixture: ComponentFixture<VetementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VetementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
