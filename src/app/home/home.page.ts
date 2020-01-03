import {Component, QueryList, ViewChildren} from '@angular/core';
import {AlertController, IonRouterOutlet, ModalController, NavController, Platform} from '@ionic/angular';
import {LoginPage} from '../login/login.page';
import {Router} from '@angular/router';
import {AccountService} from '../services/account.service';
import {Network} from '@ionic-native/network/ngx';
import {HelperService} from '../services/helper.service';

interface NavigatorCordova extends Navigator {
    app: {
        exitApp: () => any; // Or whatever is the type of the exitApp function
    };
}

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
    tabs: any;
    userdata: any;
    categories: any = [];
    locations: any = [];
    exculsive: any = [];
    listings: any = [];
    hotels: any = [];
    catsix = {
        initialSlide: 0,
        slidesPerView: 4.2,
        loop: false,
        centeredSlides: false
    };
    locpos = {
        initialSlide: 0,
        slidesPerView: 3.2,
        loop: false,
        centeredSlides: false
    };
    exclusivepos = {
        initialSlide: 0,
        slidesPerView: 1.1,
        loop: false,
        centeredSlides: false
    };

    // tslint:disable-next-line:max-line-length
    constructor(private network: Network, private alertController: AlertController, private platform: Platform, public navController: NavController, public router: Router, public modalController: ModalController, public accountservice: AccountService, public helper: HelperService) {
        this.showConnection();
        this.platform.backButton.subscribe(async () => {
            if (this.router.isActive('/home', true) && this.router.url === '/home') {
                const alert = await this.alertController.create({
                    header: 'Close app?',
                    buttons: [
                        {
                            text: 'Cancel',
                            role: 'cancel'
                        }, {
                            text: 'Close',
                            handler: () => {
                                (navigator as NavigatorCordova).app.exitApp();
                            }
                        }
                    ]
                });

                await alert.present();
            }
        });


        this.tabs = 'Hotels';
        this.categories = [
            {img: '../../../assets/tools.png', name: 'tools'},
            {img: '../../../assets/retuarant.png', name: 'Restaurant'},

            {img: '../../../assets/download.png', name: 'Food'},
            {img: '../../../assets/retuarant.png', name: 'Restaurant'},
            {img: '../../../assets/tools.png', name: 'tools'},
            {img: '../../../assets/download.png', name: 'Food'},

            {img: '../../../assets/tools.png', name: 'tools'},
            {img: '../../../assets/retuarant.png', name: 'Restaurant'}
        ];
        this.locations = [
            {img: '../../../assets/newyork.jpg', name: 'New York', listings: '4 Listings'},
            {img: '../../../assets/chicago.jpeg', name: 'Chicago', listings: '2 Listings'},

            {img: '../../../assets/losangles.jpg', name: 'Los Angeles', listings: '1 Listings'},
            {img: '../../../assets/san fransisco.jpg', name: 'San Fransisco', listings: '3 Listings'},
            {img: '../../../assets/newyork.jpg', name: 'New York', listings: '4 Listings'},
            {img: '../../../assets/chicago.jpeg', name: 'Chicago', listings: '2 Listings'},

            {img: '../../../assets/losangles.jpg', name: 'Los Angeles', listings: '1 Listings'},
            {img: '../../../assets/san fransisco.jpg', name: 'San Fransisco', listings: '3 Listings'}
        ];
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
        this.hotels = [{img: '../../../assets/first.jpg', cat: 'Bars', city: 'Boston', name: 'Maccheroni Republic', rating: '3.0'},
            {img: '../../../assets/second.png', cat: 'Cocktail Bars', city: 'New York', name: 'Listing Pro Testing', rating: '4.0'},

            {img: '../../../assets/first.jpg', cat: 'Bars', city: 'Boston', name: 'Maccheroni Republic', rating: '3.3'},
            {img: '../../../assets/second.png', cat: 'Cocktail Bars', city: 'New York', name: 'Listing Pro Testing', rating: '2.0'}];
    }

    async loadLogin() {
        this.helper.presentPopUp(LoginPage);
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
    gotoList() {
        this.router.navigate(['/listing-list']);
    }

    showConnection() {
        this.network.onDisconnect().subscribe(() => {
            this.helper.showAlert('Internet Disconnected', 'Error');
        });

    }
}
