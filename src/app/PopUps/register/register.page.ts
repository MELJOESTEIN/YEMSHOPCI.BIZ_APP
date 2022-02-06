import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {LoginPage} from '../login/login.page';
import {AccountService, User} from '../services/account.service';
import {Router} from '@angular/router';
import {HelperService} from '../services/helper.service';
import {AuthenticationService} from '../services/authentication.service';
import {Storage} from '@ionic/storage';

const LOGED_DATA = 'loggedIn_user';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
    UserData = {id: 0, username: '', name: '', email: '', password: ''} as User;
    validation = false;
    users: User[];
    data: any;

    // tslint:disable-next-line:max-line-length
    constructor(public helper: HelperService, private modalcontroller: ModalController, public accountService: AccountService, public navControler: NavController, public router: Router, public authentication: AuthenticationService, public storage: Storage) {
        this.getUser();
    }

    public async closeRegister() {
        await this.modalcontroller.dismiss({
            dismissed: true,
        });
    }

    public async openLogin() {
        this.closeRegister();
        this.helper.presentPopUp(LoginPage, '');
    }

    validate() {
        if (this.UserData.username.length === 0) {
            this.helper.showAlert('User Name is required', 'Error');
            this.validation = false;
        } else if (this.UserData.password.length === 0) {
            this.helper.showAlert('Password is required', 'Error');
            this.validation = false;
        } else if (this.UserData.email.length === 0) {
            this.helper.showAlert('Email is required', 'Error');
            this.validation = false;
        } else {
            this.validation = true;
        }
    }


    public async addUser() {
        this.validate();
        if (this.validation === true) {
            this.helper.showLoading('User Registering');
            await this.authentication.registration('wp-json/register-user/v1/data/' + this.UserData.username + '/' + this.UserData.password + '/' + this.UserData.email)
                .subscribe((resp: any) => {
                    console.log(resp);
                    if (resp.status === 'error') {
                        this.helper.dismissLoading();
                        this.helper.showAlert('Cannot Register', 'Error');
                    } else {
                        this.helper.dismissLoading();
                        this.storage.set(LOGED_DATA, resp);
                        console.log(LOGED_DATA);
                        this.closeRegister();
                        this.router.navigate(['/home']);
                    }
                }, error => {
                    console.log(error);
                });
        }
    }

    getUser() {
        this.accountService.loggedIn().then(loggeduser => {
            this.data = loggeduser;
            console.log(this.data);
        });
    }

    loggedoutUser() {
        this.accountService.logout();
        this.router.navigate(['/home']);
        this.closeRegister();
    }
}
