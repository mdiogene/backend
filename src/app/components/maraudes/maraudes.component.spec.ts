import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaraudesComponent } from './maraudes.component';

describe('MaraudesComponent', () => {
  let component: MaraudesComponent;
  let fixture: ComponentFixture<MaraudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaraudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaraudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
