import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleUpdateModalComponent } from './title-update-modal.component';

describe('TitleUpdateModalComponent', () => {
  let component: TitleUpdateModalComponent;
  let fixture: ComponentFixture<TitleUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleUpdateModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TitleUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
