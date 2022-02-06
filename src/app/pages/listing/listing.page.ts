import {Component, OnInit, ChangeDetectorRef, EventEmitter, Output, NgZone} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/Camera/ngx';
import {
    ActionSheetController,
    Platform,
} from '@ionic/angular';
import {FilePath} from '@ionic-native/file-path/ngx';
import {File} from '@ionic-native/File/ngx';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Base64} from '@ionic-native/base64/ngx';
import {google} from 'google-maps';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {HelperService} from '../services/helper.service';
import {PreferenceService} from '../services/preference.service';
import {HttpClient} from '@angular/common/http';
import {AccountService} from '../services/account.service';
import * as moment from 'moment';
import {Dialogs} from '@ionic-native/dialogs/ngx';

declare var google;

@Component({
    selector: 'app-listing',
    templateUrl: './listing.page.html',
    styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
    imgType = 'listImgs';
    ftrdImg = 'featuredImg';
    banner = 'BannerImgs';
    tabs = 'Search By Google';
    faqsTab = '';
    galleryPhotos = [];
    fieldsStatus = '';
    checkedbtn = false;
    allTimeOpen;
    apiUrl = 'https://emraancheema.com/listingpro-app/wordpress/';
    localUrl = 'http://192.168.10.3/wordpress/wp-json/';
    @Output() buttonClicked = new EventEmitter();
    // tslint:disable-next-line:max-line-length
    Listing = {
        user_id: '',
        post_title: '',
        tagline_text: '',
        location: '',
        gAddress: '',
        phone: '',
        website: '',
        business_hours: [],
        category: '',
        price_status: '',
        priceFrom: '',
        priceTo: '',
        post_content: '',
        faq: [],
        faqans: [],
        twitter: '',
        facebook: '',
        linkedin: '',
        google_plus: '',
        youtube: '',
        instagram: '',
        list_tags: '',
        postVideo: '',
        file: [],
        bannerFile: [],
        lp_featuredimage: '',
        businessLogo: '',
        email: '',
        latitude: '',
        longitude: '',
        plan_id: '',
        gAddresscustom: ''
    };
    apiKey: any;
    faqArray: any = [];
    priceRange: any;
    listingCategories: any;
    images = [];
    banners = [];
    featuredImage;
    loginData;
    IMGS = 'all-imgs';
    BANNERS = 'all-banners';
    FEATURED_IMAGES = 'featured-imgs';
    TIMINGS = 'days-timing';
    GoogleAutocomplete: google.maps.places.AutocompleteService;
    autocomplete: { input: string; };
    autocompleteItems: any[];
    validation = false;
    // tslint:disable-next-line:ban-types
    dayname = 'Monday';
    strattime = '';
    etime = '';
    timings: any = [];
    myImage;
    bannerImgs;
    gallerImage;
    ftrdImage;
    userData: any;
    planId;
    pricingPlans = [];

    // tslint:disable-next-line:max-line-length
    constructor(public ionStorage: Storage,
                private base64: Base64,
                private accountService: AccountService,
                private webview: WebView,
                private accitvatedRouter: ActivatedRoute,
                private plt: Platform,
                private transfer: FileTransfer,
                private camera: Camera,
                private http: HttpClient,
                private file: File,
                private actionSheetcontroller: ActionSheetController,
                private platform: Platform,
                private filePath: FilePath,
                private ref: ChangeDetectorRef,
                public zone: NgZone,
                private apiService: AuthenticationService,
                private router: Router,
                public alert: Dialogs,
                private helper: HelperService,
                private preference: PreferenceService) {

        this.priceRange = ['Not to say', '$ - Inexpensive', ' $$ - Moderate', '$$$ - Pricey', ' $$$$ - Ultra High'];
        this.apiKey = 'AIzaSyDQIbsz2wFeL42Dp9KaL4o4cJKJu4r8Tvg';
        // this.initLocation();
        this.loadLocation();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
        this.ionStorage.remove(this.TIMINGS);
        this.Listing.category = 'Automotive';
        this.Listing.price_status = 'Not to say';
        const script = document.createElement('script');
        script.id = 'mapElement';
        if (this.apiKey) {
            script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + this.apiKey + '&sensor=false';
        } else {
            script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=';
        }

        document.body.appendChild(script);
        this.timings = [{day: 'Monday', open: '09:30 am', close: '05:30 pm'}];
        // this.timings = [{day: {startTime: '2019-10-30T09:30:36.755-07:00', endTime: '2019-10-30T17:30:33.144-07:00'}}];
        this.featuredImage = [];
        this.getLoginData();
        this.faqArray.push({faq: '', faqans: ''});
        this.accountService.watchStorage().subscribe((resp) => {
            this.loginData = resp;
            if (this.loginData !== 'removed') {
                this.userData = this.loginData;
            } else if (this.loginData === 'removed') {
                this.userData = null;
            }
        });
    }

    ngOnInit() {
        this.getListingCat();
        this.planId = this.accitvatedRouter.snapshot.paramMap.get('id');
        this.getPlansFields(this.planId);
    }


    async getLoginData() {
        return await this.accountService.loggedIn().then((user: any) => {
            this.userData = user;
            console.log(user);
        });
    }

    public async addListing() {
        this.validateListing();
        if (this.validation === true) {
            this.helper.showLoading('Saving Listing');
            this.Listing.user_id = this.userData.user_obj.data.ID;
            this.Listing.plan_id = this.planId;
            for (const faqs of this.faqArray) {
                if (faqs.faq.length > 0 && faqs.faqans.length > 0) {
                    this.Listing.faq.push(faqs.faq);
                    this.Listing.faqans.push(faqs.faqans);
                }
            }
            // this.alert.alert(this.ftrdImage, 'imageData');
            // this.alert.alert(this.bannerImgs, 'banner');
            this.apiService.postData('wp-json/submit_listing/v1', this.Listing).subscribe((resp: any) => {
                console.log(resp);
                if (resp.status === 'success') {
                    console.log(resp);
                    if (this.ftrdImage !== null || this.galleryPhotos.length !== 0 || this.bannerImgs !== null) {
                        this.uploadImgs(this.ftrdImage, resp.listing_data.id);
                        this.uploadBanner(this.bannerImgs, resp.listing_data.id);

                        this.uploadGalleryImgs(this.galleryPhotos, resp.listing_data.id);
                    } else {
                        this.helper.dismissLoading();
                        this.helper.presentToast('Listing Saved', 1500);
                        this.router.navigate(['/home']);
                    }
                }
                // this.helper.dismissLoading();
                // this.helper.presentToast('Listing Saved', 1500);
            }, (error) => {
                console.log(error);
            });
        }

    }

    addFaq() {
        this.faqArray.push({faq: '', faqans: ''});
    }

    async getListingCat() {
        await this.apiService.getData('wp-json/wp/v2/listing-category').subscribe(categories => {
            this.listingCategories = categories;
            console.log(this.listingCategories);
        });
    }

    async getPlansFields(id) {
        return await this.apiService.getData('wp-json/get_plan_fields/v1/data/' + id).subscribe(async (resp: any) => {
            this.pricingPlans = await resp.fields;
            console.log(this.pricingPlans);
        });
    }

    replaceSign(signs: string) {
        return signs.replace(/&amp;/gm, '&');
    }

    async selectImage(type) {
        if (type === this.imgType) {
            this.ionStorage.remove(this.IMGS);
        } else if (type === this.ftrdImg) {
            this.ionStorage.remove(this.FEATURED_IMAGES);
        } else if (type === this.banner) {
            this.ionStorage.remove(this.BANNERS);
        }
        const listingactionsheet = await this.actionSheetcontroller.create({
            header: 'Select Image From',
            buttons: [{
                text: 'Gallery',
                handler: () => {
                    this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY, type);
                }
            },
                {
                    text: 'Camera',
                    handler: () => {
                        this.takePhoto(this.camera.PictureSourceType.CAMERA, type);
                    }

                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }]
        });
        await listingactionsheet.present();
    }


    takePhoto(pictureSource: PictureSourceType, imgType) {
        const cameraOptions: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: pictureSource,
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
            this.myImage = 'data:image/jpeg;base64,' + imageData;
            this.updateStoredImages(this.myImage, imgType);
            if (imgType === this.imgType) {
                this.gallerImage = 'data:image/jpeg;base64,' + imageData;
                this.galleryPhotos.push(this.gallerImage);
                // this.listingPhotos.push(this.gallerImage);
            } else if (imgType === this.banner) {
                this.bannerImgs = 'data:image/jpeg;base64,' + imageData;
            } else if (imgType === this.ftrdImg) {
                this.ftrdImage = 'data:image/jpeg;base64,' + imageData;
            }
        }, error => {
        });
        this.loadStoredImages(imgType);
    }

    updateStoredImages(name, typimg) {
        switch (typimg) {
            case 'listImgs':
                this.ionStorage.get(this.IMGS).then(images => {
                    this.images = this.preference.storeImageInStorage(name, this.IMGS, images);
                    this.Listing.file = this.images;
                    this.ref.detectChanges();
                });
                break;
            case 'featuredImg':
                this.ionStorage.get(this.FEATURED_IMAGES).then(banners => {
                    this.featuredImage = this.preference.storeFeaturedAndBanner(name, this.FEATURED_IMAGES);
                    this.Listing.lp_featuredimage = this.featuredImage;
                    this.ref.detectChanges(); // trigger change detection cycle
                });
                break;
            case 'BannerImgs':
                this.ionStorage.get(this.BANNERS).then(banners => {
                    this.banners = this.preference.storeFeaturedAndBanner(name, this.BANNERS);
                    this.Listing.bannerFile = this.banners;
                    this.ref.detectChanges(); // trigger change detection cycle
                });
                break;
        }

    }

    deleteImage(imgEntry, position) {

        this.images.splice(position, 1);

        this.ionStorage.get(this.IMGS).then(images => {

            const arr = JSON.parse(images);
            const filtered = arr.filter(name => name !== imgEntry.name);
            this.ionStorage.set(this.IMGS, JSON.stringify(filtered));

            const correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

            this.file.removeFile(correctPath, imgEntry.name).then(res => {
                this.helper.presentToast('File removed.', 1500);
            });
        });

    }

    checkStatus(e) {
        this.fieldsStatus = e.detail.checked;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    uploadGalleryImgs(image, ID) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const options: FileUploadOptions = {
            fileKey: 'listingfiles',
            fileName: 'listingfiles' + this.getRandomInt(120) + '.jpg',
            chunkedMode: false,
            mimeType: 'image/jpeg',
            headers: {}
        };
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < image.length; i++) {
            fileTransfer.upload(image[i], this.apiUrl + 'wp-json/upload_gallery/v1/data/' + ID, options).then((data: any) => {
            });
        }

    }

    uploadImgs(image, ID) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const options: FileUploadOptions = {
            fileKey: 'lp-featuredimage',
            fileName: 'lp-featuredimage' + this.getRandomInt(120) + '.jpg',
            chunkedMode: false,
            mimeType: 'image/jpeg',
            headers: {}
        };
        fileTransfer.upload(image, this.apiUrl + 'wp-json/upload_img/v1/data/' + ID, options).then((data) => {
            this.helper.dismissLoading();
            this.helper.presentToast('Listing Saved', 1500);
            this.router.navigate(['/home']);

            // this.helper.showAlert(JSON.stringify(data), 'img');
        }, (err) => {
            this.helper.dismissLoading();
            // this.helper.showAlert(JSON.stringify(err), 'error');
            // error
        });
        // }

    }

    uploadBanner(image, ID) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const options: FileUploadOptions = {
            fileKey: 'business_logo',
            fileName: 'business_logo' + this.getRandomInt(120) + '.jpg',
            chunkedMode: false,
            mimeType: 'image/jpeg',
            headers: {}
        };
        fileTransfer.upload(image, this.apiUrl + 'wp-json/upload_banner/v1/data/' + ID, options).then((data) => {
            this.helper.dismissLoading();
            this.router.navigate(['/home']);
            // this.helper.showAlert(JSON.stringify(data), 'Banner');
        }, (err) => {
            this.helper.dismissLoading();
            // this.helper.showAlert(JSON.stringify(err), 'error');
            // error
        });
        // }

    }


    loadStoredImages(imgType) {
        switch (imgType) {
            case 'listImgs':
                this.preference.loadImagesData(this.IMGS, this.images);
                break;
            case 'featuredImg':
                this.preference.loadImagesData(this.FEATURED_IMAGES, this.featuredImage);
                break;
            case 'BannerImgs':
                this.preference.loadImagesData(this.BANNERS, this.banners);
                break;
        }
    }

    deleteFeatured() {
        this.featuredImage.length = 0;
        this.myImage = null;
    }


    loadLocation() {
        setTimeout(() => {
            this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        }, 2000);
    }

    updateSearchResults() {
        // this.initLocation();
        if (this.autocomplete.input === '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({input: this.autocomplete.input},
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
    }

    close() {
        this.autocompleteItems.length = 0;
    }

    selectSearchResult(item) {
        this.autocomplete.input = item.description;
        this.Listing.gAddress = this.autocomplete.input;
        this.close();
    }

    deleteTime(post) {
        const index = this.timings.indexOf(post);

        if (index > -1) {
            this.timings.splice(index, 1);
        }
    }

    addListingTime() {
        this.validate();
        if (this.validation === true) {
            if (this.timings.some(time => time.day === this.dayname)) {
                this.helper.showAlert('Sorry! ' + this.dayname + ' Already Added', 'Error');
            } else if (this.allTimeOpen) {
                this.timings.push({
                    day: this.dayname,
                    allTime: this.allTimeOpen
                });
            } else {
                this.timings.push({
                    day: this.dayname,
                    open: moment(this.strattime).format('hh:mm a'),
                    close: moment(this.etime).format('hh:mm a')
                });
                const timesArray: any = [];

                for (const times of this.timings) {
                    timesArray.push({[times.day]: {open: times.open, close: times.close}});


                }
                this.Listing.business_hours = timesArray;
            }
        }
    }

    onTimeCheckbox(e) {
        console.log(e.detail.checked);
        if (e.detail.checked) {
            this.allTimeOpen = '24 Hours Open';
        } else if (!e.detail.checked) {
            this.allTimeOpen = null;
        }
    }

    validate() {
        if (this.dayname.length === 0) {
            this.helper.showAlert('Please select Day', 'Error');
            this.validation = false;
        } else {
            this.validation = true;
        }
        // else if (this.strattime.length === 0) {
        //     this.helper.showAlert('Please select Start Time', 'Error');
        //     this.validation = false;
        // } else if (this.etime.length === 0) {
        //     this.helper.showAlert('Please select End Time', 'Error');
        //     this.validation = false;
        // }
    }

    validateListing() {
        if (this.Listing.post_title.length === 0) {
            this.helper.showAlert('Please Enter title', 'Error');
            this.validation = false;
        } else if (this.Listing.category.length === 0) {
            this.helper.showAlert('Please Enter category.', 'Error');
            this.validation = false;
        } else if (this.Listing.post_content.length === 0) {
            this.helper.showAlert('Please Enter Description', 'Error');
            this.validation = false;
        } else {
            this.validation = true;
        }
    }

}
