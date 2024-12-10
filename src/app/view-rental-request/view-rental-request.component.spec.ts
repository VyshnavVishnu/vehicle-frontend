import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRentalRequestComponent } from './view-rental-request.component';

describe('ViewRentalRequestComponent', () => {
  let component: ViewRentalRequestComponent;
  let fixture: ComponentFixture<ViewRentalRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRentalRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRentalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
