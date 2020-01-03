import {Component, OnInit} from '@angular/core';
import {LoginPage} from '../login/login.page';
import {AccountService} from '../services/account.service';
import {HelperService} from '../services/helper.service';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-archive',
    templateUrl: './archive.page.html',
    styleUrls: ['./archive.page.scss'],
})
export class ArchivePage implements OnInit {
    exculsive: any = [];
    userdata: any;
    listings: any = [];
    isSearchBarOpned = false;
    exclusivepos = {
        initialSlide: 0,
        slidesPerView: 1.1,
        loop: false,
        centeredSlides: false
    };

    constructor(public accountservice: AccountService, public helper: HelperService, public router: Router, public navController: NavController) {
        this.exculsive = [
            {img: '../../../assets/first.jpg', cat: 'Bars', city: 'Boston', name: 'Maccheroni Republic', rating: '3.0'},
            {img: '../../../assets/second.png', cat: 'Cocktail Bars', city: 'New York', name: 'Listing Pro Testing', rating: '4.0'},

            {img: '../../../assets/first.jpg', cat: 'Bars', city: 'Boston', name: 'Maccheroni Republic', rating: '3.3'},
            {img: '../../../assets/second.png', cat: 'Cocktail Bars', city: 'New York', name: 'Listing Pro Testing', rating: '2.0'}
        ];
        this.listings = [
            {img: '../../../assets/first.jpg', cat: 'Bars', city: 'Boston', name: 'Maccheroni Republic', rating: '3.0'},
            {img: '../../../assets/second.png', cat: 'Cocktail Bars', city: 'New York', name: 'Listing Pro Testing', rating: '4.0'},

            {img: '../../../assets/first.jpg', cat: 'Bars', city: 'Boston', name: 'Maccheroni Republic', rating: '3.3'},
            {img: '../../../assets/second.png', cat: 'Cocktail Bars', city: 'New York', name: 'Listing Pro Testing', rating: '2.0'}
        ];
    }

    ngOnInit() {
    }

    async loadLogin() {
        await this.helper.presentPopUp(LoginPage);
    }
    gotoDetails(id) {
        this.accountservice.loggedIn().then(loggeduser => {
            this.userdata = loggeduser;
            if (this.userdata) {
                this.router.navigate(['/details', 'id']);
            } else {
                this.loadLogin();
            }
            console.log(this.userdata);
        });
    }
}
