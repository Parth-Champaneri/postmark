import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllTemplates(): Observable<any> {
    const url = `${this.baseUrl}/template/getAllTemplates`;
    return this.http.get<any>(url)
  }

  getEmailTypes(): Observable<any> {
    const url = `${this.baseUrl}/template/emailTypes`;
    return this.http.get<any>(url)
  }

  getTemplateTags(postmarkTemplateId: string): Observable<any> {
    const url = `${this.baseUrl}/template/getTempTags/${postmarkTemplateId}`;
    return this.http.get<any>(url)
  }

  getAllEmailVersions(email_type_id:any):Observable<any>{
    const url = `${this.baseUrl}/template/getAllEmailVersions/${email_type_id}`;
    return this.http.get<any>(url)
  }

  createNewEmailType(data: any): Observable<any> {
    const url = `${this.baseUrl}/template/newEmailType`;
    return this.http.post<any>(url, data)
  }

  createNewEmailVersion(data: any): Observable<any> {
    const url = `${this.baseUrl}/template/newEmailVersion`;
    return this.http.post<any>(url, data)
  }

  sendEmail(data:any): Observable<any>{
    const url = `${this.baseUrl}/email/sendEmail`;
    return this.http.post<any>(url, data);
  }
}
