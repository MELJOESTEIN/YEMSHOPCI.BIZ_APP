import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {RegisterPage} from '../register/register.page';
import {AccountService, User} from '../services/account.service';
import {Router} from '@angular/router';
import {HelperService} from '../services/helper.service';
import {AuthenticationService} from '../services/authentication.service';
import {Storage} from '@ionic/storage';
import {ForgotPasswordPage} from '../forgot-password/forgot-password.page';
import {Facebook} from '@ionic-native/facebook/ngx';

const LOGED_DATA = 'loggedIn_user';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})

export class LoginPage {
    static responseData: any;
    UserData = {username: '', password: ''} as User;
    data: any;
    validation = false;
    password;
    // tslint:disable-next-line:max-line-length
    constructor(private modalController: ModalController, private facebook: Facebook, public storage: Storage, private accountService: AccountService, public authentication: AuthenticationService, public router: Router, public helper: HelperService) {
        this.getUser();
    }

    public async closeLoginPop() {
        await this.modalController.dismiss({
            dismissed: true,
        });
    }

    public async loadRegisteration() {
        this.closeLoginPop();
        return await this.helper.presentPopUp(RegisterPage, '');
    }
    validate() {
        if (this.UserData.username.length === 0) {
            this.helper.showAlert('User Name is required', 'Error');
            this.validation = false;
        } else if (this.UserData.password.length === 0) {
            this.helper.showAlert('Password is required', 'Error');
            this.validation = false;
        } else {
            this.validation = true;
        }
    }

    async loginWithFacebook() {
        this.password = 'asdf' + Date.now();
        await this.facebook.login(['public_profile', 'email'])
            .then(res => {
                // tslint:disable-next-line:max-line-length
                this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
                    // tslint:disable-next-line:max-line-length
                    this.authentication.registration('wp-json/register-user-social/v1/data/' + profile.first_name + '/' + this.password + '/' + profile.email)
                        .subscribe(async (resp: any) => {
                            await this.helper.showLoading('User Logging');
                            if (resp.status === 'error') {
                                this.helper.dismissLoading();
                                this.helper.showAlert('Cannot Login', 'Error');
                                // alert(resp.status);
                            } else {
                                // alert(resp.status);
                                this.helper.dismissLoading();
                                this.storage.set(LOGED_DATA, resp);
                                this.closeLoginPop();
                                // alert(LOGED_DATA);
                            }
                        }, error => {
                        });
                });
            })
            .catch(e => console.log(e));

    }


    public async loginUser() {
        this.validate();
        if (this.validation === true) {
            await this.helper.showLoading('User Logging');
            await this.authentication.authenticate('wp-json/login-user/v1/data/' + this.UserData.username + '/' + this.UserData.password)
                .subscribe(async (resp: any) => {
                    console.log(resp);
                    if (resp.status === 'error') {
                        this.helper.dismissLoading();
                        this.helper.showAlert('User Does not exist', 'Error');
                    } else {
                        this.helper.dismissLoading();
                        this.accountService.loginUser(resp);
                        this.closeLoginPop();

                    }
                }, error => {
                });
        }
    }

    async getUser() {
        await this.accountService.loggedIn().then(async loggeduser => {
            this.data = await loggeduser;
            console.log(this.data);

        });
        return this.data;
    }

    async loggedoutUser() {
        await this.accountService.logout();
        this.closeLoginPop();
    }

    public async loadForgotPage() {
        this.closeLoginPop();
        return await this.helper.presentPopUp(ForgotPasswordPage, '');
    }

    saveLogin(e) {
        LoginPage.responseData = e.detail.checked;
    }
}
