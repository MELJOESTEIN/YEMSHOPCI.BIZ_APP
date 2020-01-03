import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {LoginPage} from '../login/login.page';
import {AccountService} from '../services/account.service';
import {Storage} from '@ionic/storage';
import {ActivatedRoute} from '@angular/router';
import {PreferenceService} from '../services/preference.service';
import {HelperService} from '../services/helper.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

@Component({
    selector: 'app-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
    listId: any;
    LISTINGS = 'all-listings';
    listings;
    isSearchBarOpned = false;
    tabs: string;
    data: any;
    rating: any;
    status: any;
    promotion: any;
    totalratings: any;
    cleanliness: any;
    location: any;
    taste: any;
    Service: any;
    booking: any;
    currentTime: any;
    schedule: any = [];
    day: any;
    today: any;
    days: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    deviceTime: any;

    constructor(public preferService: PreferenceService,
                public route: ActivatedRoute,
                public navCtrl: NavController,
                public modalController: ModalController,
                public accountservice: AccountService,
                public storage: Storage,
                public socialShare: SocialSharing,
                public helper: HelperService) {
        this.listings = {};
        this.tabs = 'Description';
        this.rating = 4.0;
        this.status = '';
        this.promotion = '50%';
        this.totalratings = '20';
        this.cleanliness = '0.8';
        this.location = '0.71`  ';
        this.taste = '0.5';
        this.Service = '0.8';
        this.booking = 'Claim Now';
        this.deviceTime = Date.now();
        this.currentTime = new Date();
        this.day = this.currentTime.getDay();
        this.today = this.days[this.day];

    }

    ionViewWillEnter() {
        this.checkStatus();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.listId = params.id;
        });
        if (this.preferService.loaded) {
            this.listings = this.preferService.getListing(this.listId);
        } else {
            this.preferService.load().then(() => {
                this.listings = this.preferService.getListing(this.listId);
            });
        }
    }

    async loadLogin() {
        this.helper.presentPopUp(LoginPage);
    }

    shareWithFb(title, img, link) {
        this.socialShare.shareViaFacebook(title, img, link).then(() => {

        }).catch(e => {
            console.log(e);
        });

    }

    shareWithTwitter(title, img, link) {
        this.socialShare.shareViaTwitter(title, img, link).then(() => {

        }).catch(e => {
            console.log(e);
        });

    }

    shareWithPin(title, img, link) {
        this.socialShare.shareVia('Pinterest', null, title, img, link).then(() => {

        }).catch(e => {
            console.log(e);
        });

    }

    loadTimings() {
        let response;
        if (this.schedule.length > 0) {
            this.schedule = !this.schedule;
        } else {
            response = this.preferService.getListing(this.listId);
            this.schedule = response.businessHours;

        }
    }

    checkStatus() {
        this.preferService.load().then(() => {
            this.listings = this.preferService.getListing(this.listId);
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.listings.businessHours.length; i++) {
                const a = this.listings.businessHours[i].day;
                const b = new Date(this.listings.businessHours[i].startTime);
                const c = new Date(this.listings.businessHours[i].endTime);
                if (a === this.today && b.getTime() <= this.deviceTime && c.getTime() >= this.deviceTime) {
                    this.status = 'Open Now';
                } else {
                    this.status = 'Closed Now';
                }
            }
        });
    }

}

