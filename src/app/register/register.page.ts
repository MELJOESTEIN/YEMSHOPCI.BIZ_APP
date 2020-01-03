import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {LoginPage} from '../login/login.page';
import {AccountService, User} from '../services/account.service';
import {Router} from '@angular/router';
import {HelperService} from '../services/helper.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    UserData = {id: 0, username: '', name: '', email: '', password: ''} as User;
    validation = false;
    users: User[];
    data: any;
    loginpage: LoginPage;

    // tslint:disable-next-line:max-line-length
    constructor(public helper: HelperService, private modalcontroller: ModalController, public accountService: AccountService,
                public navControler: NavController, public router: Router) {
    }

    ngOnInit() {

    }

    public async closeRegister() {
        await this.modalcontroller.dismiss({
            dismissed: true,
        });
    }

    public async openLogin() {
        this.closeRegister();

        const loginModal = await this.modalcontroller.create({
            component: LoginPage
        });
        return await loginModal.present();
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
        } else if (this.UserData.name.length === 0) {
            this.helper.showAlert('Name is required', 'Error');
            this.validation = false;
        } else {
            this.validation = true;
        }
    }

    public addUser() {
        this.validate();
        if (this.validation === true) {
            this.UserData.id = Date.now();
            this.accountService.registerUser(this.UserData).then(user => {
                this.UserData = user;
                this.closeRegister();
                this.helper.showLoading('Registering User', 1000);
                this.router.navigate(['home']);
            });
            this.accountService.registration(this.UserData);
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
