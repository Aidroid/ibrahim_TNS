import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { Student } from './student.model';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  const mockStudents: Student[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', course: 'Angular' },
    { id: 2, name: 'Bob', email: 'bob@example.com', course: 'Java' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentService]
    });

    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch students', () => {
    service.getStudents().subscribe((students) => {
      expect(students.length).toBe(2);
      expect(students).toEqual(mockStudents);
    });

    const req = httpMock.expectOne('http://localhost:3000/students');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  it('should add a student', () => {
    const newStudent: Student = { id: 3, name: 'Charlie', email: 'charlie@example.com', course: 'React' };

    service.addStudent(newStudent).subscribe((student) => {
      expect(student).toEqual(newStudent);
    });

    const req = httpMock.expectOne('http://localhost:3000/students');
    expect(req.request.method).toBe('POST');
    req.flush(newStudent);
  });

  it('should delete a student', () => {
    const studentId = 1;

    service.deleteStudent(studentId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`http://localhost:3000/students/${studentId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
