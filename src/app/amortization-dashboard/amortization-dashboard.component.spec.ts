import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmortizationDashboardComponent } from './amortization-dashboard.component';

describe('AmortizationDashboardComponent', () => {
  let component: AmortizationDashboardComponent;
  let fixture: ComponentFixture<AmortizationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmortizationDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmortizationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
