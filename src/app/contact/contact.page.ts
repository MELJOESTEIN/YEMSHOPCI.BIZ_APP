import { Component, OnInit } from '@angular/core';
import {EmailComposer} from '@ionic-native/email-composer/ngx';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  EmailContent = {name: '', emailAddress: '', subject: '', message: ''};
  constructor(private email: EmailComposer) { }

  ngOnInit() {
  }

  sendEmail() {
    const email = {
      to: 'alishaikh095@gmail.com',
      cc: [],
      bcc: [],
      attachment: [],
      subject: this.EmailContent.subject,
      body: this.EmailContent.message + '<html> <br> Regards <br> </html>' + this.EmailContent.name,
      from: this.EmailContent.emailAddress,
      isHtml: true
    };
    this.email.open(email);
  }

}
