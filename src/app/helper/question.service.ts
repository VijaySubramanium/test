import { Injectable } from '@angular/core';

import { DropdownQuestion } from './question-dropdown';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';
import { FileUploadQuestion } from './question-fileupload';
import { Observable, of } from 'rxjs';
import { CommonService } from 'src/app/common.service'; 
// import 'rxjs/add/operator/toPromise';

@Injectable()
export class QuestionService {
   testvalue=[
    {
        "value": "Aadhaar No",
        "key": "Aadhaar No",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Pan Card",
        "key": "Pan Card",
        "label": "First name",
        "required": false,
        "order": 2,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Aadhaar No",
        "key": "Aadhaar No",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Pan Card",
        "key": "Pan Card",
        "label": "First name",
        "required": false,
        "order": 2,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Aadhaar No",
        "key": "Aadhaar No",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Pan Card",
        "key": "Pan Card",
        "label": "First name",
        "required": false,
        "order": 2,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Pan Card",
        "key": "Pan Card",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Pan Card",
        "key": "Pan Card",
        "label": "First name",
        "required": false,
        "order": 2,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Aadhaar No1",
        "key": "Aadhaar No1",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Thameem",
        "key": "Thameem",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Aadhaar No",
        "key": "Aadhaar No",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Aadhaar No",
        "key": "Aadhaar No",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Aadhaar No1",
        "key": "Aadhaar No1",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Aadhaar No1",
        "key": "Aadhaar No1",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Aadhaar No1",
        "key": "Aadhaar No1",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Pan",
        "key": "Pan",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "!###1213xfds",
        "key": "!###1213xfds",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Pan",
        "key": "Pan",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "!###1213xfds",
        "key": "!###1213xfds",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Pan",
        "key": "Pan",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "!###1213xfds",
        "key": "!###1213xfds",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Pan",
        "key": "Pan",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "!###1213xfds",
        "key": "!###1213xfds",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "",
        "key": "",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "!###1213xfds",
        "key": "!###1213xfds",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "",
        "key": "",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "!###1213xfds",
        "key": "!###1213xfds",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "",
        "key": "",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "!###1213xfds",
        "key": "!###1213xfds",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "PAN",
        "key": "PAN",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "1232",
        "key": "1232",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "PAN",
        "key": "PAN",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "@$%%^",
        "key": "@$%%^",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "PAN",
        "key": "PAN",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "@$%%^",
        "key": "@$%%^",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "PAN",
        "key": "PAN",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "@$%%^",
        "key": "@$%%^",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "PAN",
        "key": "PAN",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "@$%%^",
        "key": "@$%%^",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "PAN",
        "key": "PAN",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "@$%%^",
        "key": "@$%%^",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "PAN",
        "key": "PAN",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ashwini",
        "key": "Ashwini",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ashwini",
        "key": "Ashwini",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "ADD",
        "key": "ADD",
        "label": "First name",
        "required": false,
        "order": 1,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "ADD 2 ",
        "key": "ADD 2 ",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "ADD",
        "key": "ADD",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Thameem",
        "key": "Thameem",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Tax Number",
        "key": "Income Tax Number",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card No",
        "key": "Ration Card No",
        "label": "First name",
        "required": false,
        "order": 3,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Ration Card Color",
        "key": "Ration Card Color",
        "label": "First name",
        "required": false,
        "order": 4,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Mentioned in Ration card",
        "key": "Income Mentioned in Ration card",
        "label": "First name",
        "required": false,
        "order": 5,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Fathers Name/Husband Name",
        "key": "Fathers Name/Husband Name",
        "label": "First name",
        "required": false,
        "order": 6,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Main Earning Member of Family",
        "key": "Main Earning Member of Family",
        "label": "First name",
        "required": false,
        "order": 7,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Occupation of the main earning of the Family",
        "key": "Occupation of the main earning of the Family",
        "label": "First name",
        "required": false,
        "order": 8,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Annual Income",
        "key": "Annual Income",
        "label": "First name",
        "required": false,
        "order": 9,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Income Proof Validity",
        "key": "Income Proof Validity",
        "label": "First name",
        "required": false,
        "order": 10,
        "controlType": "textbox",
        "type": "",
        "options": []
    },
    {
        "value": "Document Upload-Income Proof",
        "key": "Document Upload-Income Proof",
        "label": "First name",
        "required": false,
        "order": 11,
        "controlType": "textbox",
        "type": "",
        "options": []
    }
];
  constructor(public commonservice:CommonService) { }   
  // TODO: get from a remote source of question metadata

   getQuestionsTest(){
    let arrayObject:QuestionBase<string>[]=[];
    let tempObject:any=[];    
    this.commonservice.additionalFields(1)
    .subscribe(
      data => {                    
          data.data.projectAddtionalFields[0].fields.forEach((value: {value:string,fieldType: string;documentFieldName: string;fieldOrder: number; }) => {                       
              tempObject=new TextboxQuestion({
                key: value.documentFieldName,
                label: 'First name',
                value: value.documentFieldName,
                required: false,
                order: value.fieldOrder
              })
              arrayObject.push(tempObject);                  
          });        
        console.log(arrayObject)
        return (arrayObject)
      }
    )
    console.log('Return Common Values')
    console.log(arrayObject)        
    //return (arrayObject)
  }



   getQuestions() {
    let arrayObject:QuestionBase<string>[]=[];
    let tempObject:any=[];
    let questions: QuestionBase<string>[]=[]
    
    this.commonservice.additionalFields(1)
    .subscribe(
      data => {        
        //if(data.data.projectAddtionalFields[0].fields){       
          data.data.projectAddtionalFields[0].fields.forEach((value: {value:string,fieldType: string;documentFieldName: string;fieldOrder: number; }) => {            
           // if(value.fieldType=="Text"&&value.value!=''){
              tempObject=new TextboxQuestion({
                key: value.documentFieldName,
                label: 'First name',
                value: value.documentFieldName,
                required: false,
                order: value.fieldOrder
              })
              arrayObject.push(tempObject);     
           // }                 
          });          
        //}
        console.log(arrayObject)
        return of(arrayObject)
      }
    )
    console.log('Return Common Values')
    console.log(arrayObject);
  return of ([{
      "value": "Aadhaar No",
      "key": "Aadhaar No",
      "label": "First name",
      "required": false,
      "order": 1,
      "controlType": "textbox",
      "type": "",
      "options": []
  }]);   
  }
}
