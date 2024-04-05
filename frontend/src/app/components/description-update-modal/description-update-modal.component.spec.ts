import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionUpdateModalComponent } from './description-update-modal.component';

describe('DescriptionUpdateModalComponent', () => {
  let component: DescriptionUpdateModalComponent;
  let fixture: ComponentFixture<DescriptionUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionUpdateModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DescriptionUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
