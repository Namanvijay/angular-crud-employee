import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from './../../shared/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";


export interface Subject {
  name: string;
}

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})

export class AddEmployeeComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('chipList', { static: true }) chipList;
  @ViewChild('resetEmployeeForm', { static: true }) myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  employeeForm: FormGroup;
  subjectArray: Subject[] = [];
  SectioinArray: any = ['Assistant', 'Associate', 'Accountant', 'Analyst', 'Office Associate','Advisor','Business Analyst'];
  Evaluationtype:any=['probation(90 days)','Ending probation(150 days)','Annual Review'];
  Rating=[
    {name:"Punctuality/Discipline",rate:5},
    {name:"Team-work",rate:5},
    {name:"Communication",rate:5},
    {name:"Quality of work",rate:5},
    {name:"Presonal Development",rate:5},
    {name:"Leadership",rate:5},
    {name:"Initiative",rate:5},
    {name:"Overall rating",rate:5},
    
  ]
  

  ngOnInit() {
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private employeeApi: ApiService
  ) { }

  /* Reactive book form */
  submitBookForm() {
    this.employeeForm = this.fb.group({
      employee_name: ['', [Validators.required]],
      employee_email: ['', [Validators.required]],
      section: ['', [Validators.required]],
      empcode:['',[Validators.required]],
      subjects: [this.subjectArray],
      doj: ['', [Validators.required]],
      mobile:['',[Validators.required]],
      dept:['',[Validators.required]],
      or:[this.Rating[7].rate],
      punc:[this.Rating[0].rate],
      comm:[this.Rating[0].rate],
      tw:[this.Rating[0].rate],
      pd:[this.Rating[0].rate],
      ls:[this.Rating[0].rate],
      
      
      
      
      gender: ['Male'],
      sp:['Yes']
    })
  }
  
  /* Add dynamic skills */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add skills
    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray.push({ name: value.trim() })
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove dynamic skills*/
  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }
  }  

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.employeeForm.get('doj').setValue(convertDate, {
      onlyself: true
    })
  }  

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.employeeForm.controls[controlName].hasError(errorName);
  }  

  /* Submit book */
  submitEmployeeForm() {
    if (this.employeeForm.valid) {
      this.employeeForm.controls.or.setValue(this.Rating[7].rate);
      this.employeeForm.controls.punc.setValue(this.Rating[0].rate);
      this.employeeForm.controls.comm.setValue(this.Rating[2].rate);
      this.employeeForm.controls.tw.setValue(this.Rating[1].rate);
      this.employeeForm.controls.ls.setValue(this.Rating[5].rate);
      this.employeeForm.controls.pd.setValue(this.Rating[4].rate);
      

      
      
      this.employeeApi.AddEmployee(this.employeeForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/employees-list'))
      });
    }
  }

}