import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingListPage } from './listing-list.page';

describe('ListingListPage', () => {
  let component: ListingListPage;
  let fixture: ComponentFixture<ListingListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
