import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionForm } from './session-form';
import { provideRouter } from '@angular/router';

describe('SessionForm', () => {
  let component: SessionForm;
  let fixture: ComponentFixture<SessionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionForm],
      providers: [provideRouter([])] 
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});