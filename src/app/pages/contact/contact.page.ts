import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {HelperService} from '../services/helper.service';


@Component({
    selector: 'app-contact',
    templateUrl: './contact.page.html',
    styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
    data: any;
    Email = {post_id: '', name: '', email: '', phone: '', message: '', author_id: ''};

    constructor(private route: ActivatedRoute, private router: Router, private api: AuthenticationService, private helper: HelperService) {
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.data = this.router.getCurrentNavigation().extras.state.listing;
                this.Email.post_id = this.data.ID;
                this.Email.author_id = this.data.post_author;
            }
        });
    }

    ngOnInit() {
    }

    sendEmail() {
        this.helper.showLoading('Sending Email');
        this.api.postData('wp-json/post_contact_form/v1/', this.Email).subscribe((response) => {
            this.helper.dismissLoading();
            this.helper.showAlert(response.status, 'Status');
            console.log(response);
        });

    }
}
