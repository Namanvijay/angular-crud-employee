import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from './../../shared/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})

export class EditEmployeeComponent implements OnInit {
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
    this.updateBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private employeeApi: ApiService
  ) { 
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.employeeApi.GetEmployee(id).subscribe(data => {
      console.log(data.subjects)
      this.subjectArray = data.subjects;
      this.employeeForm = this.fb.group({
        employee_name: [data.employee_name, [Validators.required]],
        employee_email: [data.employee_email, [Validators.required]],
        section: [data.section, [Validators.required]],
       
        subjects: [data.subjects],
        doj: [data.doj, [Validators.required]],
        mobile:[data.mobile,[Validators.required]],
        dept:[data.dept,[Validators.required]],
        or:[data.or],
        punc:[data.punc],
        comm:[data.comm],
        tw:[data.tw],
        pd:[data.pd],
        ls:[data.ls],
       
        gender: [data.gender],
        empcode:[data.empcode,[Validators.required]],
        sp: [data.sp]
      })      
    })    
  }

  /* Reactive book form */
  updateBookForm() {
    this.employeeForm = this.fb.group({
      employee_name: ['', [Validators.required]],
      employee_email: ['', [Validators.required]],
      section: ['', [Validators.required]],
      empcode:['',[Validators.required]],
      subjects: [this.subjectArray],
      doj: ['', [Validators.required]],
      mobile:['',[Validators.required]],
      
      or:[this.Rating[0].rate],
      punc:[this.Rating[0].rate],
      comm:[this.Rating[2].rate],
      tw:[this.Rating[1].rate],
      pd:[this.Rating[4].rate],
      ls:[this.Rating[5].rate],
      

      
    
      dept:['',[Validators.required]],
      gender: ['Male'],
      sp: ['Yes']
    })
  }

  /* Add dynamic titles */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add title
    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray.push({ name: value.trim() })
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove dynamic titles */
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

  /* Update book */
  updateEmployeeForm() {
    console.log(this.employeeForm.value)
    this.employeeForm.controls.or.setValue(this.Rating[7].rate);
    this.employeeForm.controls.punc.setValue(this.Rating[0].rate);
    this.employeeForm.controls.comm.setValue(this.Rating[2].rate);
    this.employeeForm.controls.pd.setValue(this.Rating[4].rate);
    this.employeeForm.controls.ls.setValue(this.Rating[5].rate);
    this.employeeForm.controls.tw.setValue(this.Rating[1].rate);
    var id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.employeeApi.UpdateEmployee(id, this.employeeForm.value).subscribe( res => {
        this.ngZone.run(() => this.router.navigateByUrl('/employees-list'))
      });
    }
  }
  
}
