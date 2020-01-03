import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class PreferenceService {
    LISTINGS = 'all-listings';
    listings: any = [];
    public loaded = false;

    constructor(private storage: Storage) {
        this.storage.get(this.LISTINGS).then((list) => {
            this.listings = list;
            console.log(this.listings);
        });
    }

    load(): Promise<boolean> {
        return new Promise((resolve) => {
            this.storage.get(this.LISTINGS).then((listings) => {
                if (listings != null) {
                    this.listings = listings;
                }
                this.loaded = true;
                resolve(true);

            });

        });

    }

    getListing(id) {
        const resp = this.listings.find(list => {
            return list.listingId == id;
        });
        console.log(resp);
        return resp;
    }


}
