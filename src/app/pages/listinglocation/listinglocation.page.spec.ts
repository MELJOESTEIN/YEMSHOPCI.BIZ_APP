import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListinglocationPage } from './listinglocation.page';

describe('ListinglocationPage', () => {
  let component: ListinglocationPage;
  let fixture: ComponentFixture<ListinglocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListinglocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListinglocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
