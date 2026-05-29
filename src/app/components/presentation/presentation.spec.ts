import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Presentation } from './presentation';
import { provideRouter } from '@angular/router';

describe('Presentation', () => {
  let component: Presentation;
  let fixture: ComponentFixture<Presentation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Presentation],
      providers: [provideRouter([])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Presentation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});