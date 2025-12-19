import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMembershipPlanPage } from './add-membership-plan.page';

describe('AddMembershipPlanPage', () => {
  let component: AddMembershipPlanPage;
  let fixture: ComponentFixture<AddMembershipPlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMembershipPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
