import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Approach } from './approach';

describe('Approach', () => {
  let component: Approach;
  let fixture: ComponentFixture<Approach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Approach]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Approach);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
