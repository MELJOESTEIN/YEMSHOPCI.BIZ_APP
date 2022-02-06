import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AlertController, IonRouterOutlet, ModalController, NavController, Platform} from '@ionic/angular';
import {LoginPage} from '../PopUps/login/login.page';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AccountService} from '../services/account.service';
import {Network} from '@ionic-native/network/ngx';
import {HelperService} from '../services/helper.service';
import {AuthenticationService} from '../services/authentication.service';
import {MenuController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {PreferenceService} from '../services/preference.service';

const LOGED_DATA = 'loggedIn_user';

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
export class HomePage implements OnInit {
    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
    loginSaveStatus;
    tabs: any;
    userdata: any;
    srchhide;
    catId;
    loadStatus = '';
    dashHide = false;
    locfilter = [];
    catgNames = [];
    listingData = [];
    categoryDropDown = [];
    headerpadding = '18px';
    margin = '10px 30px 0px 30px';
    categoryImgs = [];
    selectedLoc;
    selectedCat;
    favourite = [];
    categories: any = [];
    exculsive = [];
    news = [];
    lochide = false;
    catsix = {
        initialSlide: 0,
        slidesPerView: 4.2,
        loop: false,
        centeredSlides: false
    };
    alllocations = [];
    selectLoc = [];
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
    HomeFlter = {
        s: 'home',
        lp_s_cat: '',
        lp_s_loc: '',
        lp_s_tag: '',
        select: ''
    };
    loginData;

    // tslint:disable-next-line:max-line-length
    constructor(private network: Network, private pref: PreferenceService, private menu: MenuController, public storage: Storage, private routerlink: ActivatedRoute, private alertController: AlertController, private platform: Platform, public navController: NavController, public router: Router, public modalController: ModalController, public accountservice: AccountService, public helper: HelperService, public authenticationService: AuthenticationService) {
        this.accountservice.watchStorage().subscribe((resp) => {
            this.loginData = resp;
            if (this.loginData !== 'removed') {
                this.userdata = this.loginData;
            } else if (this.loginData === 'removed') {
                this.userdata = null;
            }
        });
        this.getLoginData();
        this.srchhide = false;
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
                                if (this.loginSaveStatus === false) {
                                    this.storage.remove(LOGED_DATA);
                                }
                                (navigator as NavigatorCordova).app.exitApp();
                                this.storage.remove('hideItem');
                                this.storage.remove('hidesec');
                            }
                        }
                    ]
                });

                await alert.present();
            }
        });
        this.categoryImgs = [
            {img: '../../../assets/tools.png'},
        ];
        this.getTabsData();
    }

    ngOnInit() {
        this.loadStatus = 'failed';
        this.authenticationService.getData('wp-json/wp/v2/listing-category').subscribe(categories => {
            this.categories = categories;
            console.log(this.categories);
        });
        this.authenticationService.getData('wp-json/wp/v2/location').subscribe(loc => {
            this.alllocations = loc;
        });
        this.getListingsByLoc();
        this.getExclusive();
        this.getNews();
    }

    ionViewWillEnter() {
        this.loginSaveStatus = LoginPage.responseData;
    }

    doRefresh(refresh) {
        this.getTabsData();
        this.getListingsByLoc();
        this.getExclusive();
        this.getNews();
        setTimeout(() => {
            refresh.target.complete();
        }, 2000);
    }

    getFavourite(id) {
        console.log('called');
        this.authenticationService.getData(`wp-json/get_favourite_listings/v1/data/${id}`).subscribe((data) => {
            this.favourite = data.favourite_listings;
            console.log(this.favourite);
        });
    }

    isFavourite(listing) {
        const isFav = this.favourite.includes(listing);
        return isFav;
    }

    async loadLogin() {
        return await this.helper.presentPopUp(LoginPage, '');
    }

    gotoDetails(id) {
        this.router.navigate(['/details', id]);
    }

    signout() {
        this.accountservice.logout().then((resp) => {
            this.dashHide = false;
        });
    }

    openFirst() {
        this.menu.enable(true, 'first');
        this.menu.open('first');
    }

    openEnd() {
        this.menu.open('end');
    }

    gotoDash() {
        this.router.navigate(['/dashboard']);
        this.dashHide = false;
    }

    openCustom() {
        this.menu.enable(true, 'custom');
        this.menu.open('custom');
    }

    showConnection() {
        this.network.onDisconnect().subscribe(() => {
            this.helper.showAlert('Internet Disconnected', 'Error');
        });

    }

    openUserDashboard() {
        if (this.dashHide) {
            this.dashHide = false;
        } else {
            this.dashHide = true;
        }
    }

    closeDashbrd() {
        if (this.dashHide) {
            this.dashHide = false;
        }
    }

    async getLoginData() {
        await this.accountservice.loggedIn().then((user: any) => {
            if (this.userdata) {
                this.getFavourite(user.user_obj.data.ID);
            }
            this.userdata = user;
            console.log(user);
        });
    }

    gotoLocationDetails(loc) {
        const navigationExtras: NavigationExtras = {
            state: {
                location: loc
            }
        };
        this.router.navigate(['location-detail'], navigationExtras);
    }

    gotoCatDetails(category) {
        const navigationExtras: NavigationExtras = {
            state: {
                catgry: category
            }
        };
        this.router.navigate(['cat-detail'], navigationExtras);
    }

    hideSearch() {
        this.headerpadding = '0px';
        this.margin = '0px';
        if (this.srchhide) {
            this.categoryDropDown = [];
            this.srchhide = false;
            this.headerpadding = '18px';
            this.margin = '0px 30px 0px 30px';
        } else {
            this.srchhide = true;
            this.categoryDropDown = this.categories;
            this.selectLoc = [];
        }
    }

    locSearch() {
        if (this.lochide) {
            this.lochide = false;
            this.selectLoc = [];

        } else {
            this.lochide = true;
            this.selectLoc = this.alllocations;
            this.categoryDropDown = [];
        }
    }

    replaceSign(data: string) {
        return data.replace(/&amp;/gm, '&');
    }
    replaceString(signs: string) {
        return signs.replace(/&#038;/gm, ' ');
    }
    close() {
        this.categoryDropDown = [];
    }

    selectSearchResult(item) {
        this.catId = item.id;
        this.selectedCat = this.replaceSign(item.name);
        this.close();
    }

    closeLoc() {
        this.selectLoc = [];
    }

    selectSearchLoc(item) {
        this.selectedLoc = this.replaceSign(item.name);
        this.closeLoc();

    }

    addListing() {
        this.accountservice.loggedIn().then((user: any) => {
            if (user) {
                this.router.navigate(['/pricing-plan']);
            } else {
                this.loadLogin();
            }
        });
    }

    searchItem() {
        this.HomeFlter.select = this.selectedCat;
        this.HomeFlter.lp_s_cat = this.catId;
        this.HomeFlter.lp_s_loc = this.selectedLoc;
        const filterdata: NavigationExtras = {
            state: {
                data: this.HomeFlter
            }
        };
        this.router.navigate(['archive'], filterdata);
    }

    async getListingsByLoc() {
        await this.authenticationService.getData('wp-json/get_all_listings/v1').subscribe(async (locations: any) => {
            this.locfilter = await locations;
            // this.loadStatus = 'success';
        });
        return this.locfilter;
    }

    async getExclusive() {
        await this.authenticationService.getData('wp-json/get_excl_listings/v1').subscribe(async (exclusive: any) => {
            this.exculsive = await exclusive;
            this.loadStatus = 'success';
            console.log(this.exculsive);
        });
        return this.exculsive;
    }

    async getNews() {
        await this.authenticationService.getData('wp-json/get_news/v1').subscribe(async (nws: any) => {
            this.news = await nws;
            this.loadStatus = 'success';
        });
        return this.news;
    }

    async getTabsData() {
        return await this.authenticationService.getData('wp-json/get_tabs/v1').subscribe(async (resp: any) => {
            this.catgNames = await resp.Categories;
            console.log(resp.Categories);
            this.getListinData(this.catgNames[0].term_id);
            this.tabs = this.replaceSign(this.catgNames[0].name);
            this.loadStatus = 'success';
        });
    }

    async getListinData(id) {
        return await this.authenticationService.getData(`wp-json/get_tabs_listing/v1/data/${id}`).subscribe(async (resp: any) => {
            this.listingData = await resp.listings;
            console.log(resp.listings);
        });
    }

    gotoNewsDetails(id) {
        this.router.navigate(['/blog-post', id]);
    }

}
