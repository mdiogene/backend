import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsBesoinsComponent } from './participants-besoins.component';

describe('ParticipantsBesoinsComponent', () => {
  let component: ParticipantsBesoinsComponent;
  let fixture: ComponentFixture<ParticipantsBesoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantsBesoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsBesoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
