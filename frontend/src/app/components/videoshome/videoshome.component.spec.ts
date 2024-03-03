import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoshomeComponent } from './videoshome.component';

describe('VideoshomeComponent', () => {
  let component: VideoshomeComponent;
  let fixture: ComponentFixture<VideoshomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoshomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoshomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
