import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeBesoinsComponent } from './type-besoins.component';

describe('TypeBesoinsComponent', () => {
  let component: TypeBesoinsComponent;
  let fixture: ComponentFixture<TypeBesoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeBesoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeBesoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
