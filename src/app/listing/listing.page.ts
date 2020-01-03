import {Component, OnInit, ChangeDetectorRef, EventEmitter, Output, NgZone} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/Camera/ngx';
import {
    ActionSheetController,
    LoadingController,
    Platform,
    ToastController
} from '@ionic/angular';
import {FilePath} from '@ionic-native/file-path/ngx';
import {File} from '@ionic-native/File/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Base64} from '@ionic-native/base64/ngx';
import {google} from 'google-maps';
import {Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {HelperService} from '../services/helper.service';

declare var google;

@Component({
    selector: 'app-listing',
    templateUrl: './listing.page.html',
    styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
    inputName = '';
    @Output() buttonClicked = new EventEmitter();
    // tslint:disable-next-line:max-line-length
    Listing = {
        listingId: 0,
        title: '',
        type: '',
        city: '',
        fulladdress: '',
        phone: '',
        website: '',
        businessHours: [{day: '', startTime: '', endTime: ''}],
        category: '',
        pricerange: '',
        priceFrom: '',
        priceTo: '',
        description: '',
        faq: [{questions: '', answers: ''}],
        answer: '',
        twitterUrl: '',
        facebookUrl: '',
        linkedInUrl: '',
        googlePlusUrl: '',
        youtubeUrl: '',
        instagramUrl: '',
        tags: '',
        videoLink: '',
        file: [],
        bannerFile: [],
        featuredImage: [],
        businessLogo: '',
        contactEmail: ''
    };
    locinitialized = false;
    apiKey: any;
    priceRange: any;
    listingCategories: any;
    images = [];
    banners = [];
    featuredImage;
    LISTINGS = 'all-listings';
    IMGS = 'all-imgs';
    BANNERS = 'all-banners';
    FEATURED_IMAGES = 'featured-imgs';
    TIMINGS = 'days-timing';
    FAQS = 'faqs';
    GoogleAutocomplete: google.maps.places.AutocompleteService;
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    validation = false;
    // tslint:disable-next-line:ban-types
    listingFaqs = {questions: '', answers: ''};
    dayname = 'Monday';
    strattime = '';
    etime = '';
    timings;
    priceR;
    myImage;
    listingsImgs;
    croppedImage: any;

    // tslint:disable-next-line:max-line-length
    constructor(public ionStorage: Storage,
                private base64: Base64,
                private webview: WebView,
                private plt: Platform,
                private camera: Camera,
                private file: File,
                private actionSheetcontroller: ActionSheetController,
                private platform: Platform,
                private filePath: FilePath,
                private ref: ChangeDetectorRef,
                public zone: NgZone,
                private apiService: AuthenticationService,
                private router: Router,
                private helper: HelperService) {

        this.priceRange = ['Not to say', '$ - Inexpensive', ' $$ - Moderate', '$$$ - Pricey', ' $$$$ - Ultra High'];
        this.apiKey = 'AIzaSyDQIbsz2wFeL42Dp9KaL4o4cJKJu4r8Tvg';
        // this.initLocation();
        this.loadLocation();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
        this.ionStorage.remove(this.TIMINGS);
        this.ionStorage.remove(this.FAQS);
        this.Listing.category = 'Automotive';
        this.Listing.pricerange = '$ - Inexpensive';
        const script = document.createElement('script');
        script.id = 'mapElement';
        if (this.apiKey) {
            script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + this.apiKey + '&sensor=false';
        } else {
            script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=';
        }

        document.body.appendChild(script);
        // @ts-ignore
    }

    ngOnInit() {
        this.getListingCat();
        this.timings = [{day: 'Monday', startTime: '2019-10-30T09:30:36.755-07:00', endTime: '2019-10-30T17:30:33.144-07:00'}];
        this.featuredImage = [];
    }

    addListing() {
        // this.validateListing();
        // if (this.validation === true) {
        this.Listing.listingId = Date.now();
        this.ionStorage.get(this.LISTINGS).then(listings => {
            if (listings) {
                listings.push(this.Listing);
                return this.ionStorage.set(this.LISTINGS, listings);
                console.log(listings);
            } else {
                return this.ionStorage.set(this.LISTINGS, [this.Listing]);
            }
        });
        this.helper.showLoading('Saving Listing', 1000);
        this.helper.presentToast('Listing Saved', 1500);
        this.router.navigate(['/listing-list']);
        // }
    }

    getListingCat() {
        this.apiService.getData('wp-json/wp/v2/listing-category').subscribe(categories => {
            this.listingCategories = categories;
            console.log(this.listingCategories);
        });
    }

    replaceSign(signs: string) {
        return signs.replace(/&amp;/gm, '&');
    }


    async selectImage() {
        this.ionStorage.remove(this.IMGS);
        const listingactionsheet = await this.actionSheetcontroller.create({
            header: 'Select Image From',
            buttons: [{
                text: 'Gallery',
                handler: () => {
                    this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: 'Camera',
                    handler: () => {
                        this.takePhoto(this.camera.PictureSourceType.CAMERA);
                    }

                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }]
        });
        await listingactionsheet.present();
    }

    takePhoto(pictureSource: PictureSourceType) {
        const options: CameraOptions = {
            quality: 100,
            sourceType: pictureSource,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(imagePath => {
            if (this.platform.is('android') && pictureSource === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
            } else {
                const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        });
        this.loadStoredImages();
    }

    createFileName() {
        const d = new Date(),
            n = d.getTime(),
            newFileName = n + '.jpg';
        return newFileName;
    }

    copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
            this.updateStoredImages(newFileName);
        }, error => {
            this.helper.showAlert('Error while storing file.', 'Error');
        });
    }

    updateStoredImages(name) {
        this.ionStorage.get(this.IMGS).then(images => {

            const arr = JSON.parse(images);
            if (!arr) {
                const newImages = [name];
                this.ionStorage.set(this.IMGS, JSON.stringify(newImages));
            } else {
                arr.push(name);
                this.ionStorage.set(this.IMGS, JSON.stringify(arr));
            }

            const filePath = this.file.dataDirectory + name;
            const resPath = this.pathForImage(filePath);

            const newEntry = {
                name,
                path: resPath,
                filePath
            };

            this.images = [newEntry, ...this.images];
            this.Listing.file = this.images;
            this.ref.detectChanges();
        });
    }

    pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            const converted = this.webview.convertFileSrc(img);
            return converted;
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

    loadStoredImages() {
        this.ionStorage.get(this.IMGS).then(images => {

            if (images) {
                const arr = JSON.parse(images);
                this.images = [];
                for (const img of arr) {
                    const filePath = this.file.dataDirectory + img;
                    const resPath = this.pathForImage(filePath);
                    this.images.push({name: img, path: resPath, filePath});
                }
            }
        });
    }


    async selectBanner() {
        this.ionStorage.remove(this.BANNERS);
        const listingactionsheet = await this.actionSheetcontroller.create({
            header: 'Select Image From',
            buttons: [{
                text: 'Select from Gallery',
                handler: () => {
                    this.takeBanner(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: 'Select from Camera',
                    handler: () => {
                        this.takeBanner(this.camera.PictureSourceType.CAMERA);
                    }

                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }]
        });
        await listingactionsheet.present();
    }

    takeBanner(pictureSource: PictureSourceType) {
        const options: CameraOptions = {
            quality: 100,
            sourceType: pictureSource,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(imagePath => {
            if (this.platform.is('android') && pictureSource === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.copyBannerToLocalDir(correctPath, currentName, this.createFileName());
                    });
            } else {
                const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyBannerToLocalDir(correctPath, currentName, this.createFileName());
            }
        });
        this.loadBanners();
    }

    copyBannerToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
            this.updateStoredBanner(newFileName);
        }, error => {
            this.helper.showAlert('Cannot store Image', 'Error');
        });
    }

    updateStoredBanner(name) {
        this.ionStorage.get(this.BANNERS).then(banners => {
            if (!name) {
                const newImages = [name];
                this.ionStorage.set(this.BANNERS, JSON.stringify(newImages));
            }
            const filePath = this.file.dataDirectory + name;
            const resPath = this.pathForImage(filePath);

            const newEntry = {
                name,
                path: resPath,
                filePath
            };

            this.banners = [newEntry];
            this.Listing.bannerFile = this.banners;

            this.ref.detectChanges(); // trigger change detection cycle
        });
    }

    loadBanners() {
        this.ionStorage.get(this.BANNERS).then(banners => {
            if (banners) {
                const arr = JSON.parse(banners);
                this.banners = [];
                for (const img of arr) {
                    const filePath = this.file.dataDirectory + img;
                    const resPath = this.pathForImage(filePath);
                    this.banners = [{name: img, path: resPath, filePath}];
                }
            }
        });
    }


    async selectFeatured() {
        const listingactionsheet = await this.actionSheetcontroller.create({
            header: 'Select Image From',
            buttons: [{
                text: 'Select from Gallery',
                handler: () => {
                    this.takeFeatured(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: 'Select from Camera',
                    handler: () => {
                        this.takeFeatured(this.camera.PictureSourceType.CAMERA);
                    }

                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }]
        });
        await listingactionsheet.present();
    }

    takeFeatured(pictureSource: PictureSourceType) {
        const cameraOptions: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: pictureSource,
        };

        this.camera.getPicture(cameraOptions).then((imageData) => {
            this.myImage = 'data:image/jpeg;base64,' + imageData;
            this.updateStoredFeatured(this.myImage);

        });
        this.loadFeatured();

    }

    updateStoredFeatured(name) {
        this.ionStorage.get(this.FEATURED_IMAGES).then(banners => {
            if (!name) {
                const newImages = [name];
                this.ionStorage.set(this.FEATURED_IMAGES, JSON.stringify(newImages));
            }

            const newEntry = {
                path: name,

            };
            this.featuredImage = [newEntry];
            this.Listing.featuredImage = this.featuredImage;
            this.ref.detectChanges(); // trigger change detection cycle
        });
    }

    //
    loadFeatured() {
        this.ionStorage.get(this.FEATURED_IMAGES).then(featured => {
            if (featured) {
                const arr = JSON.parse(featured);
                this.featuredImage = [];
                for (const img of arr) {
                    this.featuredImage = [{path: img}];
                }
            }
        });
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
        console.log(item);
        this.location = item;
        this.autocomplete.input = item.description;
        this.Listing.fulladdress = this.autocomplete.input;
    }

    addFaqs() {
        this.ionStorage.get(this.FAQS).then(faqs => {
            if (!faqs) {
                this.ionStorage.set(this.FAQS, [this.listingFaqs]);
                this.Listing.faq = [this.listingFaqs];
            } else {

                faqs.push(this.listingFaqs);
                this.ionStorage.set(this.FAQS, faqs);
                this.Listing.faq = faqs;
                console.log(this.Listing.faq);
            }
        });
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
            } else {
                this.timings.push({day: this.dayname, startTime: this.strattime, endTime: this.etime});
                this.Listing.businessHours = this.timings;
            }
        }
    }

    validate() {
        if (this.dayname.length === 0) {
            this.helper.showAlert('Please select Day', 'Error');
            this.validation = false;
        } else if (this.strattime.length === 0) {
            this.helper.showAlert('Please select Start Time', 'Error');
            this.validation = false;
        } else if (this.etime.length === 0) {
            this.helper.showAlert('Please select End Time', 'Error');
            this.validation = false;
        } else {
            this.validation = true;
        }
    }

    validateListing() {
        if (this.Listing.title.length === 0) {
            this.helper.showAlert('Please Enter title', 'Error');
            this.validation = false;
        } else if (this.Listing.type.length === 0) {
            this.helper.showAlert('Please Enter Listing type', 'Error');
            this.validation = false;
        } else if (this.Listing.city.length === 0) {
            this.helper.showAlert('Please Enter city', 'Error');
            this.validation = false;
        } else if (this.Listing.fulladdress.length === 0) {
            this.helper.showAlert('Please Enter Full Address', 'Error');
            this.validation = false;
        } else if (this.Listing.phone.length === 0) {
            this.helper.showAlert('Please Enter Phone number.', 'Error');
            this.validation = false;
        } else if (this.Listing.website.length === 0) {
            this.helper.showAlert('Please Enter website.', 'Error');
            this.validation = false;
        } else if (this.Listing.category.length === 0) {
            this.helper.showAlert('Please Enter category.', 'Error');
            this.validation = false;
        } else if (this.Listing.pricerange.length === 0) {
            this.helper.showAlert('Please Enter price range.', 'Error');
            this.validation = false;
        } else if (this.Listing.priceFrom.length === 0) {
            this.helper.showAlert('Please Enter Price From', 'Error');
            this.validation = false;
        } else if (this.Listing.priceTo.length === 0) {
            this.helper.showAlert('Please Enter Price to', 'Error');
            this.validation = false;
        } else if (this.Listing.description.length === 0) {
            this.helper.showAlert('Please Enter Description', 'Error');
            this.validation = false;
        } else if (this.Listing.facebookUrl.length === 0) {
            this.helper.showAlert('Please enter Facebook url', 'Error');
            this.validation = false;
        } else if (this.Listing.twitterUrl.length === 0) {
            this.helper.showAlert('Please enter twitter url', 'Error');
            this.validation = false;
        } else if (this.Listing.linkedInUrl.length === 0) {
            this.helper.showAlert('Please enter linked in URL', 'Error');
            this.validation = false;
        } else if (this.Listing.googlePlusUrl.length === 0) {
            this.helper.showAlert('Please Enter google plus URL', 'Error');
            this.validation = false;
        } else if (this.Listing.youtubeUrl.length === 0) {
            this.helper.showAlert('Please Enter Youtube Url', 'Error');
            this.validation = false;
        } else if (this.Listing.instagramUrl.length === 0) {
            this.helper.showAlert('Please Enter instagram URL', 'Error');
            this.validation = false;
        } else if (this.Listing.tags.length === 0) {
            this.helper.showAlert('Please enter tags', 'Error');
            this.validation = false;
        } else if (this.Listing.videoLink.length === 0) {
            this.helper.showAlert('Please enter video link', 'Error');
            this.validation = false;
        } else if (this.Listing.contactEmail.length === 0) {
            this.helper.showAlert('Please enter contact Email ', 'Error');
            this.validation = false;
        } else {
            this.validation = true;
        }
    }

}
