import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { StudentService } from './student.service';
import { Student } from './student.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;

  const mockStudents: Student[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', course: 'Angular' },
    { id: 2, name: 'Bob', email: 'bob@example.com', course: 'Java' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('StudentService', ['getStudents', 'addStudent', 'deleteStudent']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule],
      providers: [{ provide: StudentService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    studentServiceSpy = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    studentServiceSpy.getStudents.and.returnValue(of(mockStudents));

    component.ngOnInit();

    expect(component.students.length).toBe(2);
    expect(component.students).toEqual(mockStudents);
  });

  it('should add a new student', () => {
    const newStudent: Student = { id: 3, name: 'Charlie', email: 'charlie@example.com', course: 'React' };

    studentServiceSpy.addStudent.and.returnValue(of(newStudent));

    component.newStudent = newStudent;
    component.addStudent();

    expect(component.students).toContain(newStudent);
    expect(component.newStudent.name).toBe('');
  });

  it('should delete a student', () => {
    component.students = [...mockStudents];
    studentServiceSpy.deleteStudent.and.returnValue(of());

    component.deleteStudent(1);

    expect(component.students.find(s => s.id === 1)).toBeUndefined();
  });
});
