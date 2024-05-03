import { Component, OnInit,Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../helper/question-base';
@Component({
  selector: 'app-dynamic-form-inputfields',
  templateUrl: './dynamic-form-inputfields.component.html',
  styleUrls: ['./dynamic-form-inputfields.component.css']
})
export class DynamicFormInputfieldsComponent implements OnInit {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }
  get isValid() {     
    console.log(this.form.controls[this.question.key].valid)
      return this.form.controls[this.question.key].valid;    
  }
  onFileChange(event:any) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        fileSource: file
      });
    }
  }

}
