import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';

@Component({
    selector: 'app-listing-list',
    templateUrl: './listing-list.page.html',
    styleUrls: ['./listing-list.page.scss'],
})
export class ListingListPage implements OnInit {
    LISTINGS = 'all-listings';
    listings: any;

    constructor(public storage: Storage, public router: Router, public platform: Platform) {
        this.platform.backButton.subscribe(async () => {
                this.router.navigate(['/home']);
        });
    }

    ionViewWillEnter() {
        this.storage.get(this.LISTINGS).then((allListings) => {
            this.listings = allListings;
        });
    }

    ngOnInit() {
    }


    getListingId(id: number) {
        this.router.navigate(['/details', id]);
        console.log(id);
    }
}
