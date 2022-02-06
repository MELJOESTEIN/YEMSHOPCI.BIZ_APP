import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingPage } from './listing.page';

describe('ListingPage', () => {
  let component: ListingPage;
  let fixture: ComponentFixture<ListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
