import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffListPage } from './staff-list.page';

describe('StaffListPage', () => {
  let component: StaffListPage;
  let fixture: ComponentFixture<StaffListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
