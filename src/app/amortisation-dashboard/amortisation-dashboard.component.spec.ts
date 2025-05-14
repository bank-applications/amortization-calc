import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmortisationDashboardComponent } from './amortisation-dashboard.component';

describe('AmortisationDashboardComponent', () => {
  let component: AmortisationDashboardComponent;
  let fixture: ComponentFixture<AmortisationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmortisationDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmortisationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
