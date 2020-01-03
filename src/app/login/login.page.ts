import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';
import {RegisterPage} from '../register/register.page';
import {AccountService, User} from '../services/account.service';
import {Router} from '@angular/router';
import {HelperService} from '../services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  UserData = {username: '', password: ''} as User;
  data: any;
  validation = false;
  // tslint:disable-next-line:max-line-length
  constructor(private modalController: ModalController, private accountService: AccountService, public router: Router, public helper: HelperService) {
  this.getUser();
  }

  ngOnInit() {
  }
  public async closeLoginPop() {
    await this.modalController.dismiss({
      dismissed: true,
    });
  }
  public async loadRegisteration() {
    this.closeLoginPop();
    const registermodel = await this.modalController.create({
      component: RegisterPage,
    });
    return await registermodel.present();
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
  public loginUser() {
    this.validate();
    if (this.validation === true) {
      this.accountService.login(this.UserData.username, this.UserData.password).then(users => {
        if (!users) {
          this.helper.showAlert('User Not Found', 'Error');

        } else {
          this.helper.showLoading('User Logging', 1000);
          this.closeLoginPop();
          this.router.navigate(['/home']);

        }
        console.log(users);
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
    this.closeLoginPop();
  }
}
