import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { TemplatesService } from './templates.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  templates: any[] = [];
  emailTypes: any[] = [];
  selectedTemplate: string = '';
  selectedEmailType: string = '';
  label: string = '';
  isSaving: boolean = false;
  errorMessage: string = '';
  emailVersions: any[]=[];
  selectedVersion:string='';
  sendTo: string= '';
  newEmailType:string='';
  newEmailTypePostmarkId:string='';


  constructor(private templateService: TemplatesService){
    this.templateService.getAllTemplates().subscribe(res=>{
      this.templates = res.templates.Templates;
    })
    this.templateService.getEmailTypes().subscribe(res=>{
      this.emailTypes = res.emailTypes;
    })
  }

  ngOnInit() {
  }

  createNewEmailType(){
    const data = {
      postmark_template_id: this.newEmailTypePostmarkId,
      email_type: this.newEmailType,
    }
    this.templateService.createNewEmailType(data).subscribe(res=>{
      console.log(res);
    })
  }

  onEmailTypeSelected(){
    this.setEmailType();
    console.log(this.selectedEmailType);
  }
  setEmailType(){
    this.templateService.getAllEmailVersions(this.selectedEmailType).subscribe(res=>{
      this.emailVersions = res.versions;
    })
  }

  isSendEmailFormValid(){
    return (
      this.selectedVersion !== '' &&
      this.selectedEmailType !== '' &&
      this.sendTo !== ''
    );
  }

  sendEmail(){
    // Hard coded the models for now 

    const data = {
      sendTo:this.sendTo,
      version_id:this.selectedVersion,
      email_type_id:this.selectedEmailType,
      model: {
        product_name: 'Product Name',
        name: 'Parth',
        action_url: 'https://www.myresumetailor.com',
        username:"Parth",
        trial_length:"5 days",
        trial_start_date:"today",
        trial_end_date:"Mon",
        support_email:"info@myresumetailor.com",
        live_chat_url:"info@myresumetailor.com",
        sender_name:"MyResumeTailor",
        help_url:"www.google.com",
        company_name:"MyResumeTailor",
        company_addres:"North Pole",
      },   
    }
    this.templateService.sendEmail(data).subscribe(res=>{
      console.log(res);
    })
  }

  handleSave() {
    const data = {
      postmark_template_id: this.selectedTemplate,
      email_type_id: this.selectedEmailType,
      version_label: this.label,
    };

    this.isSaving = true;
    this.errorMessage = '';

    this.templateService.createNewEmailVersion(data).subscribe({
      next:(res) => {
        alert(`New Version: ${this.label}, created for ${this.emailTypes}`)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 400) {
          // Handle specific error code 400
        } else if (error.status === 401) {
          // Handle specific error code 401
        } else if (error.status === 500) {
          alert(error);
          // This is the error code we're sending for now
        } else {
          // Handle other error codes
        }
        
      },complete:()=>{
        this.isSaving=false;
      }
  })
  }

  isFormValid() {
    return (
      this.selectedTemplate !== '' &&
      this.selectedEmailType !== '' &&
      this.label !== ''
    );
  }
}
