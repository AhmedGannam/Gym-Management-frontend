import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterOwnerPage } from './register-owner.page';

describe('RegisterOwnerPage', () => {
  let component: RegisterOwnerPage;
  let fixture: ComponentFixture<RegisterOwnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
