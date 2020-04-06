import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmationDialogComponent } from './dialog-confirmation-dialog.component';

describe('DialogConfirmationDialogComponent', () => {
  let component: DialogConfirmationDialogComponent;
  let fixture: ComponentFixture<DialogConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
