import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionList } from './session-list';
import { provideRouter } from '@angular/router';

describe('SessionList', () => {
  let component: SessionList;
  let fixture: ComponentFixture<SessionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionList],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});