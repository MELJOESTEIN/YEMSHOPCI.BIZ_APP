import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, Platform} from '@ionic/angular';
import {LoginPage} from '../PopUps/login/login.page';
import {DomSanitizer} from '@angular/platform-browser';
import {AccountService} from '../services/account.service';
import {Storage} from '@ionic/storage';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {HelperService} from '../services/helper.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {AuthenticationService} from '../services/authentication.service';
import {SocialSharePage} from '../PopUps/social-share/social-share.page';

import {Camera, CameraOptions} from '@ionic-native/Camera/ngx';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer/ngx';
import {LaunchNavigator, LaunchNavigatorOptions} from '@ionic-native/launch-navigator/ngx';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {Environment, GoogleMap, GoogleMaps, HtmlInfoWindow, Marker} from '@ionic-native/google-maps/ngx';
import {ClaimPlainsPage} from '../PopUps/claim-plains/claim-plains.page';

@Component({
    selector: 'app-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
    listId: any;
    map: GoogleMap;
    listing;
    mapLoc;
    loadStatus = '';
    isSearchBarOpned = false;
    tabs: string;
    key: any;
    totalratings: any;
    cleanliness: any;
    location: any;
    taste: any;
    Service: any;
    title;
    description;
    schedule: any;
    categoryName;
    destination: string;
    start: string;
    googlemapUrl;
    expanded;
    apiUrl = 'https://emraancheema.com/listingpro-app/wordpress/';
    hideMe = false;
    hideHd;
    dis;
    events = [];
    phoneNumbr: any;
    claimhide = false;
    reviews = [];
    keys: any;
    deviceTime: any;
    userData: any;
    faqs = [];
    listingData;
    faqskeys = [];
    fqs: any;
    faqdta = [];
    buttonColor;
    menu: any;
    mapLocaion: [];
    lat;
    long;
    plansData = [];
    ann;
    rating;
    myImage;
    userPass;
    loginData;
    menudata = [];
    submnuData = [];
    Review = {
        listingid: '',
        post_author: '',
        post_title: '',
        post_content: '',
        rating: '',
    };

    Interest = {
        id: '',
        interest: '',
        restype: ''
    };
    Favourite = {
        post_id: '',
        user_id: ''
    };
    Report = {
        posttype: 'listing',
        postid: '',
        reportedby: ''
    };
    Claim = {
        post_title: '',
        post_url: '',
        firstname: '',
        lastname: '',
        bemail: '',
        phone: '',
        message: '',
        post_id: '',
        claim_username: '',
        claim_userpass: '',
        lp_claimed_plan: '',
        claim_type: ''
    };

    constructor(
        public call: CallNumber,
        private platform: Platform,
        public authentication: AuthenticationService,
        public route: ActivatedRoute,
        public router: Router,
        public navCtrl: NavController,
        public modalController: ModalController,
        public accountservice: AccountService,
        public storage: Storage,
        public socialShare: SocialSharing,
        public helper: HelperService,
        public sanitizer: DomSanitizer,
        private transfer: FileTransfer,
        private camera: Camera,
        private launchNav: LaunchNavigator,
        public apiService: AuthenticationService,
        public modalCtrl: ModalController) {
        this.listing = {};
        this.deviceTime = Date.now();
        this.storage.get('fav').then((data: any) => {
            if (data === this.listId) {
                console.log(data);
                this.buttonColor = 'Saved';
            }
        });
        this.accountservice.watchStorage().subscribe((resp) => {
            this.loginData = resp;
            console.log(resp);
            if (this.loginData !== 'removed') {
                this.userData = this.loginData;
            } else if (this.loginData === 'removed') {
                this.userData = null;
            }
        });
    }

    ngOnInit() {
        this.getLoginData();
        this.loadStatus = 'failed';
        this.listId = this.route.snapshot.paramMap.get('id');
        this.getListings(this.listId);
        SocialSharePage.responseid = this.route.snapshot.paramMap.get('id');
        this.tabs = 'Description';
        this.totalratings = '20';
        this.cleanliness = '0.8';
        this.location = '0.71`  ';
        this.taste = '0.5';
        this.Service = '0.8';
        this.start = '';
        this.destination = 'Westminster, London, UK';
        console.log(this.listId);
        this.paidClaims();
    }

    ionViewWillEnter() {
        this.map = GoogleMaps.create('map');
    }

    async loadLogin() {
        return await this.helper.presentPopUp(LoginPage, '');
    }

    async getLoginData() {
        return await this.accountservice.loggedIn().then((user: any) => {
            this.userData = user;
            console.log(this.userData);
        });
    }

    async loadSocial() {
        return await this.helper.presentPopUp(SocialSharePage, 'my-custom-modal-css');
    }

    openLink(link) {
        window.open(link);

    }

    public getKeys(data) {
        this.keys = Object.keys(data);
        console.log(this.keys);
        return true;
    }

    public getFaqs(data) {
        this.faqs = Object.keys(data);
        console.log(this.faqs);
        return true;
    }

    public getmenu(data) {
        this.menu = Object.keys(data);
        return true;
    }

    public getsubmenu(data) {
        console.log(data);
        this.menudata = Object.keys(data);
        console.log(this.menudata);
        return true;
    }

    public getsubmenuData(data) {
        this.submnuData = Object.values(data);
        console.log(this.submnuData);
        return true;
    }

    openDirections() {
        console.log(this.lat, this.long);
        const options: LaunchNavigatorOptions = {
            app: this.launchNav.APP.GOOGLE_MAPS
        };

        this.launchNav.navigate([this.lat, this.long], options).then((data) => {
        }, (error) => {
            this.helper.showAlert(error, 'error');
        });


    }

    strip(html: string) {
        return html.replace(/<(?:.|\n)*?>/gm, '');
    }

    replaceSign(signs: string) {
        return signs.replace(/&amp;/gm, '&');
    }

    async getListings(id) {
        console.log('det');
        await this.authentication.getData(`wp-json/get_listing/v1/data/${id}`).subscribe(async (response: any) => {
            this.loadStatus = 'success';
            this.listing = await response;
            this.title = await response.listing.post_title;
            this.categoryName = await this.replaceSign(response.category);
            this.description = await this.strip(response.listing.post_content);
            this.reviews = await response.reviews;
            this.events = await response.events;
            this.rating = await response.rating;
            this.rating = (this.rating / 5) * 100;
            this.lat = await parseFloat(response.latitude);
            this.long = await parseFloat(response.longitude);
            this.phoneNumbr = await response.Phone;
            this.listingData = await response.listing;
            console.log(response);
            console.log(this.rating);
            this.platform.ready().then(() => this.loadMap());
        });
        return this.listing;
    }

    loadTimings() {
        let response;
        if (this.schedule) {
            this.schedule = !this.schedule;
        } else {
            this.getListings(this.listId).then((data: any) => {
                response = data;
                console.log(response);
                this.schedule = response.business_hours;
            });

        }
        return this.schedule;
    }

    hide() {
        console.log(this.userData);
        if (this.userData) {
            if (this.hideMe) {
                this.hideMe = false;
            } else {
                this.hideMe = true;
            }
        } else {
            this.helper.showAlert('Kindly Login first to review', 'Error');
        }
    }

    hideData() {
        if (this.hideMe) {
            this.hideMe = false;
        } else {
            this.hideMe = true;
        }
    }

    hideDiscount() {
        if (this.dis) {
            this.dis = false;
        } else {
            this.dis = true;
        }
    }

    hideAnn() {
        if (this.ann) {
            this.ann = false;
        } else {
            this.ann = true;
        }
    }

    hideHeading() {
        if (this.hideHd) {
            this.hideHd = false;
        } else {
            this.hideHd = true;
        }
    }

    logRatingChange(rating) {
        console.log('changed rating: ', rating);
        this.Review.rating = rating;
        // do your stuff
    }

    async addReview() {
        this.helper.showLoading('Adding Review');
        let reviews;
        this.Review.post_author = this.userData.user_obj.data.ID;
        this.Review.listingid = this.listId;
        await this.apiService.postData('wp-json/review_submit/v1', this.Review).subscribe(async (resp: any) => {
            this.getListings(this.listId).then(async (data: any) => {
                reviews = data;
                this.reviews = await reviews.reviews;
                this.helper.dismissLoading();
                this.hideMe = false;
            });
        });
        return this.reviews;
    }

    async submitReact(id, count, type) {
        let reviews;
        this.Interest.id = id;
        this.Interest.interest = count;
        this.Interest.restype = type;
        await this.apiService.postData('wp-json/interest_submit/v1', this.Interest).subscribe(async (resp: any) => {
            this.getListings(this.listId).then((data: any) => {
                reviews = data;
                console.log(reviews);
                this.schedule = reviews.reviews;
            });
        });
        return this.schedule;
    }

    async favouriteListing() {

        if (this.userData) {
            this.Favourite.post_id = this.listId;
            this.Favourite.user_id = this.userData.user_obj.data.ID;
            await this.apiService.postData('wp-json/favourite_submit/v1', this.Favourite).subscribe(async (resp: any) => {
                if (resp.text === 'Saved') {
                    this.buttonColor = 'Saved';
                    this.storage.set('fav', this.listId);
                }

            });
        } else {
            this.buttonColor = 'Saved';
            this.storage.set('fav', this.listId);
        }
    }

    async submitReport() {
        // console.log(this.userData);
        if (this.userData) {
            this.Report.postid = this.listId;
            this.Report.reportedby = this.userData.user_obj.data.ID;
            await this.apiService.postData('wp-json/report_submit/v1', this.Report).subscribe(async (resp: any) => {
                this.helper.showAlert(resp.msg, resp.status);

            });
        } else {
            this.loadLogin();
        }
    }

    makeCall() {
        this.call.callNumber(this.phoneNumbr, true).then((data) => {
        }, (error) => {
            this.helper.showAlert(error, 'error');
        });
    }

    async submitClaim() {
        this.helper.showLoading('Submitting Claim');
        this.Claim.post_id = this.listId;
        this.Claim.post_title = this.title;
        this.Claim.post_url = this.listing.link;
        this.Claim.claim_username = this.userData.user_obj.data.user_nicename;
        this.Claim.claim_userpass = this.userData.password;
        await this.apiService.postData('wp-json/claim_submit/v1', this.Claim).subscribe(async (resp: any) => {
            this.claimhide = false;
            this.Claim.firstname = '';
            this.Claim.lastname = '';
            this.Claim.bemail = '';
            this.Claim.phone = '';
            this.Claim.message = '';
            this.Claim.claim_username = '';
            this.Claim.claim_userpass = '';

            this.helper.dismissLoading();
            this.helper.showAlert(resp.state, 'Message');

        });
    }

    hideClaim() {
        if (this.userData) {
            this.openClaimModal();
            if (this.claimhide) {
                this.claimhide = false;
            } else {
                this.claimhide = true;
            }
        } else {
            this.loadLogin();
        }
    }

    paidClaims() {
        this.authentication.getData('wp-json/get_claim_plan/v1').subscribe((resp) => {
            console.log(resp);
            this.plansData = resp.listings;
        });
    }

    async openClaimModal() {
        if (this.plansData !== null) {
            this.Claim.claim_type = 'paidclaims';
            const modal = await this.modalCtrl.create({
                component: ClaimPlainsPage,
            });

            modal.onDidDismiss()
                .then((data) => {
                    this.Claim.lp_claimed_plan = data.data;
                    this.claimhide = true;
                });

            return await modal.present();
        } else {
            this.Claim.claim_type = '';
            return;
        }
    }

    takePhoto() {
        const cameraOptions: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
            this.myImage = 'data:image/jpeg;base64,' + imageData;
        }, error => {
            console.log(error);
        });
    }

    expandItem(): void {
        if (this.expanded) {
            this.expanded = false;
        } else {
            this.expanded = true;
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    uploadImgs(image, ID, type) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const options: FileUploadOptions = {
            fileKey: type,
            fileName: type + this.getRandomInt(120) + '.jpg',
            chunkedMode: false,
            mimeType: 'image/jpeg',
            headers: {}
        };
        fileTransfer.upload(image, this.apiUrl + `wp-json/upload_img/v1/data/${ID}`, options).then((data: any) => {
        });
        // }

    }

    loadMap() {
        console.log(this.lat, this.long);
        this.map.clear();
        Environment.setEnv({
            API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyBfukd4Qqw3XTeQfBgDAyvzIuD4w-PtItw',
            API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyBfukd4Qqw3XTeQfBgDAyvzIuD4w-PtItw'
        });
        const htmlInfoWindow = new HtmlInfoWindow();
        // this.map.clear();
        // tslint:disable-next-line:prefer-for-of
        const frame: HTMLElement = document.createElement('div');
        const marker: Marker = this.map.addMarkerSync({
            position: {lat: this.lat, lng: this.long}
        });
        this.map.setOptions({
            camera: {
                target: {
                    lat: this.lat,
                    lng: this.long
                },
                zoom: 10
            }
        });
        // tslint:disable-next-line:only-arrow-functions no-shadowed-variable
        // marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        //     frame.innerHTML = [
        //         '<h3>' + this.finalList[i].name + '</h3>',
        //     ].join('');
        //     htmlInfoWindow.setContent(frame, {width: '80px', height: '80px'});
        //     htmlInfoWindow.open(marker);
        // });
    }

    gotoContact() {
        const navigationExtras: NavigationExtras = {
            state: {
                listing: this.listingData
            }
        };
        this.router.navigate(['contact'], navigationExtras);
    }
}

