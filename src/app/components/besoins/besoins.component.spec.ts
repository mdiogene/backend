import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BesoinsComponent } from './besoins.component';

describe('BesoinsComponent', () => {
  let component: BesoinsComponent;
  let fixture: ComponentFixture<BesoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BesoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BesoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
