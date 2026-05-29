import { TestBed } from '@angular/core/testing';
import { SessionService } from './session';
import { Session } from '../models/session';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
    service.sessions = []; 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new session (CREATE)', () => {
    const newSession: Session = { id: 1, type: 'Mat Session', instructor: 'Sarah Mitchell', date: '2026-04-01', time: '10:00 AM', status: 'Upcoming' };
    
    service.addSession(newSession);
    
    expect(service.getSessions().length).toBe(1);
    expect(service.getSessions()[0].instructor).toBe('Sarah Mitchell');
  });

  it('should retrieve all sessions (READ)', () => {
    const session1: Session = { id: 1, type: 'Mat Session', instructor: 'Sarah Mitchell', date: '2026-04-01', time: '10:00 AM', status: 'Upcoming' };
    const session2: Session = { id: 2, type: 'Reformer Session', instructor: 'James Chen', date: '2026-04-02', time: '08:00 AM', status: 'Upcoming' };
    
    service.addSession(session1);
    service.addSession(session2);
    
    expect(service.getSessions().length).toBe(2);
  });

  it('should update an existing session (UPDATE)', () => {
    const session: Session = { id: 1, type: 'Mat Session', instructor: 'Sarah Mitchell', date: '2026-04-01', time: '10:00 AM', status: 'Upcoming' };
    service.addSession(session);
    
    const updatedSession: Session = { ...session, instructor: 'Maria Rodriguez' };
    service.updateSession(updatedSession);
    
    expect(service.getSessions()[0].instructor).toBe('Maria Rodriguez');
  });

  it('should delete a session by id (DELETE)', () => {
    const session: Session = { id: 1, type: 'Mat Session', instructor: 'Sarah Mitchell', date: '2026-04-01', time: '10:00 AM', status: 'Upcoming' };
    service.addSession(session);
    
    expect(service.getSessions().length).toBe(1);
    
    service.deleteSession(1);
    expect(service.getSessions().length).toBe(0);
  });
});