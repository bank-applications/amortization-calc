import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmortisationReportComponent } from './amortisation-report.component';

describe('AmortisationReportComponent', () => {
  let component: AmortisationReportComponent;
  let fixture: ComponentFixture<AmortisationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmortisationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmortisationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
