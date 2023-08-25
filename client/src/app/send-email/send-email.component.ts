import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../templates.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

  sendTo: string = '';

  constructor(private templateService: TemplatesService) { 

  }

  ngOnInit(): void {
  }

}
