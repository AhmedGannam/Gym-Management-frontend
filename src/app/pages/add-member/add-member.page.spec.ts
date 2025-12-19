import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMemberPage } from './add-member.page';

describe('AddMemberPage', () => {
  let component: AddMemberPage;
  let fixture: ComponentFixture<AddMemberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
