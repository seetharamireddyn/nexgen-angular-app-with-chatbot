import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvTraining } from './csv-training';

describe('CsvTraining', () => {
  let component: CsvTraining;
  let fixture: ComponentFixture<CsvTraining>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvTraining]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvTraining);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
