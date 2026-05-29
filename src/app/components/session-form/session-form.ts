import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session';
import { CookieService } from '../../services/cookie.service'; 

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './session-form.html',
  styleUrls: ['./session-form.css']
})
export class SessionForm implements OnInit {
  sessionForm!: FormGroup;
  
  showTypeModal = false;
  showInstructorModal = false;
  tempInstructor = '';
  isEditMode = false;      
  editSessionId: any; 

  availableDates: any[] = [];
  currentMonthYear: string = '';
  
  availableTimes = [
    '07:00 AM', '08:00 AM', '09:00 AM', 
    '10:00 AM', '11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM', '04:00 PM', '05:00 PM', 
    '06:00 PM', '07:00 PM'
  ];
  
  sessionTypes = [
    { id: 'Mat Session', title: 'Mat Session', desc: 'Traditional mat-based Pilates focusing on bodyweight exercises and core strengthening.' }, 
    { id: 'Reformer Session', title: 'Reformer Session', desc: 'Equipment-based training using the Pilates reformer for resistance and dynamic movements.' }
  ];
  
  instructors = [
    { name: 'Sarah Mitchell', desc: 'Certified Pilates instructor with 10+ years of experience specializing in rehabilitation and core strength.' }, 
    { name: 'James Chen', desc: 'Expert in classical Pilates methods with a focus on precision and proper form for optimal results.' }, 
    { name: 'Maria Rodriguez', desc: 'Specialized in reformer training and dynamic movement patterns for all fitness levels.' }
  ];

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService 
  ) {}

  ngOnInit(): void {
    this.generateDates();

    this.sessionForm = this.fb.group({
      type: ['', Validators.required],
      instructor: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      status: ['Upcoming', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.editSessionId = params['id']; 
        this.sessionService.getSessions().subscribe(sessions => {
          const sessionToEdit = sessions.find(s => s.id == this.editSessionId);
          if (sessionToEdit) {
            this.sessionForm.patchValue(sessionToEdit);
            this.tempInstructor = sessionToEdit.instructor;
          }
        });
      }
    });
  }

  generateDates() {
    const today = new Date();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.currentMonthYear = `${months[today.getMonth()]} ${today.getFullYear()}`;

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const dayName = days[d.getDay()];
      const dayNum = d.getDate().toString().padStart(2, '0');
      const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const fullDate = `${year}-${monthNum}-${dayNum}`;
      const monthYear = `${months[d.getMonth()]} ${year}`;

      this.availableDates.push({ 
        day: dayName, 
        num: dayNum, 
        full: fullDate, 
        monthYear: monthYear 
      });
    }
  }

  selectDate(dateObj: any) { 
    this.sessionForm.patchValue({ date: dateObj.full }); 
    this.currentMonthYear = dateObj.monthYear;
  }

  selectTime(timeSlot: string) { 
    if (!this.sessionForm.value.date) { alert("Please select a date first."); return; }
    this.sessionForm.patchValue({ time: timeSlot }); 
    this.showTypeModal = true; 
  }

  selectType(typeId: string) { 
    this.sessionForm.patchValue({ type: typeId }); 
    this.showTypeModal = false; 
    this.showInstructorModal = true; 
  }

  selectTempInstructor(name: string) { 
    this.tempInstructor = name; 
    this.sessionForm.patchValue({instructor: name});
  }

  confirmInstructor() {
    this.sessionForm.patchValue({ instructor: this.tempInstructor });
    this.showInstructorModal = false;
    this.onSubmit(); 
  }

  onSubmit(): void {
    if (this.sessionForm.valid) {
      this.cookieService.setCookie('preferredSession', this.sessionForm.value.type, 30);

      if (this.isEditMode) {
        const updatedSession = { id: this.editSessionId, ...this.sessionForm.value };
        this.sessionService.updateSession(updatedSession).subscribe(() => {
          this.router.navigate(['/sessions']);
        });
      } else {
        this.sessionService.addSession(this.sessionForm.value).subscribe(() => {
          this.router.navigate(['/sessions']);
        });
      }
    }
  }
}