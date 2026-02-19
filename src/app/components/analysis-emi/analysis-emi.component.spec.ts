import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisEmiComponent } from './analysis-emi.component';

describe('AnalysisEmiComponent', () => {
  let component: AnalysisEmiComponent;
  let fixture: ComponentFixture<AnalysisEmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisEmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisEmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
