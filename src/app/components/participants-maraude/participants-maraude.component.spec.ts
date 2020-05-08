import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsMaraudeComponent } from './participants-maraude.component';

describe('ParticipantsMaraudeComponent', () => {
  let component: ParticipantsMaraudeComponent;
  let fixture: ComponentFixture<ParticipantsMaraudeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantsMaraudeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsMaraudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
