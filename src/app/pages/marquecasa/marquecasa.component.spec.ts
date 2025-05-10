import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarquecasaComponent } from './marquecasa.component';

describe('MarquecasaComponent', () => {
  let component: MarquecasaComponent;
  let fixture: ComponentFixture<MarquecasaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarquecasaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarquecasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
