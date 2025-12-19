import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStaffPage } from './add-staff.page';

describe('AddStaffPage', () => {
  let component: AddStaffPage;
  let fixture: ComponentFixture<AddStaffPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStaffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
