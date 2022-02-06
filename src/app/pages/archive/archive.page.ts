import {Component, OnInit} from '@angular/core';
import {LoginPage} from '../PopUps/login/login.page';
import {HelperService} from '../services/helper.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MenuController, NavController} from '@ionic/angular';
import {AuthenticationService} from '../services/authentication.service';

@Component({
    selector: 'app-archive',
    templateUrl: './archive.page.html',
    styleUrls: ['./archive.page.scss'],
})
export class ArchivePage implements OnInit {
    response: any;
    isSearchBarOpned = false;
    listingsWithads = [];
    listingsWithoutads = [];
    loadStatus = '';
    exclusivepos = {
        initialSlide: 0,
        slidesPerView: 1.1,
        centeredSlides: false
    };
    data;
    loginData;
    userdata;
    dashHide = false;
    showRadiusBar = false;
    favourite = [];

    constructor(private activatedRoute: ActivatedRoute, private menu: MenuController, public authenticate: AuthenticationService, public helper: HelperService, public router: Router, public navController: NavController) {
        // tslint:disable-next-line:only-arrow-functions
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };

        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                // trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
                // if you need to scroll back to top, here is the right place
                window.scrollTo(0, 0);
            }
        });
        this.activatedRoute.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.data = this.router.getCurrentNavigation().extras.state.data;
                console.log(this.data);
            }
        });
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.loadStatus = 'failed';
        this.getListings(this.data);
    }


    async loadLogin() {
        await this.helper.presentPopUp(LoginPage, '');
    }

    gotoDetails(id) {

        this.router.navigate(['/details', id]);

    }

    getListings(data) {
        this.response = null;
        this.authenticate.postData('wp-json/search_home/v1', data).subscribe((listings: any) => {
            console.log(listings);
            this.response = listings;
            this.listingsWithoutads = listings.without_adds;
            this.listingsWithads = listings.ads;
            this.loadStatus = 'success';
            console.log(this.listingsWithoutads);
            console.log(this.listingsWithads);
        });
    }

    openUserDashboard() {
        if (this.dashHide) {
            this.dashHide = false;
        } else {
            this.dashHide = true;
        }
    }

    getFavourite(id) {
        this.authenticate.getData(`wp-json/get_favourite_listings/v1/data/${id}`).subscribe((data) => {
            this.favourite = data.favourite_listings;
        });
    }

    isFavourite(listing) {
        const isFav = this.favourite.includes(listing);
        return isFav;
    }

    openFirst() {
        this.menu.enable(true, 'first');
        this.menu.open('first');
    }

    openEnd() {
        this.menu.open('end');
    }

    openCustom() {
        this.menu.enable(true, 'custom');
        this.menu.open('custom');
    }

    loadFilters() {
        this.router.navigate(['filter']);
    }

    replaceSign(signs: string) {
        return signs.replace(/&#038;/gm, ' ');
    }

    replaceString(signs: string) {
        return signs.replace(/&amp;/gm, '&');
    }

    private radiusShow() {
        if (this.showRadiusBar) {
            this.showRadiusBar = false;
        } else {
            this.showRadiusBar = true;
        }
    }
}
