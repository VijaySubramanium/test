import { QuestionBase } from './question-base';

export class FileUploadQuestion extends QuestionBase<string> {
  override controlType = 'fileupload';
}
