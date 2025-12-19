import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnerTabsPage } from './owner-tabs.page';

describe('OwnerTabsPage', () => {
  let component: OwnerTabsPage;
  let fixture: ComponentFixture<OwnerTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
