import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GoogleMaps, GoogleMap, Environment, Marker, GoogleMapsEvent, HtmlInfoWindow} from '@ionic-native/google-maps/ngx';
import {Platform} from '@ionic/angular';

declare var google;

@Component({
    selector: 'app-listinglocation',
    templateUrl: './listinglocation.page.html',
    styleUrls: ['./listinglocation.page.scss'],
})
export class ListinglocationPage implements OnInit {
    map: GoogleMap;
    locations: any;
    pageList: any;
    numberPerpage: any;
    totalPages: any;
    currentPage = 1;
    finalList: any;

    constructor(private platform: Platform) {
        this.locations = [
            {name: 'Lahore', lat: 31.4618039, long: 73.9211365, pos: 11},
            {name: 'Multan', lat: 30.1811818, long: 71.3345704, pos: 10},
            {name: 'Islamabad', lat: 33.6158004, long: 72.8059095, pos: 9},
            {name: 'Sheikhupura', lat: 31.710944, long: 73.9409464, pos: 5},
            {name: 'Murree', lat: 33.9037159, long: 73.3609268, pos: 4},
            {name: 'Lahore', lat: 31.4618039, long: 73.9211365, pos: 11},
            {name: 'Multan', lat: 30.1811818, long: 71.3345704, pos: 10},
            {name: 'Islamabad', lat: 33.6158004, long: 72.8059095, pos: 9},
            {name: 'Sheikhupura', lat: 31.710944, long: 73.9409464, pos: 5},
            {name: 'Murree', lat: 33.9037159, long: 73.3609268, pos: 4},
            {name: 'Lahore', lat: 31.4618039, long: 73.9211365, pos: 11},
            {name: 'Multan', lat: 30.1811818, long: 71.3345704, pos: 10},
            {name: 'Islamabad', lat: 33.6158004, long: 72.8059095, pos: 9},
            {name: 'Sheikhupura', lat: 31.710944, long: 73.9409464, pos: 5},
            {name: 'Murree', lat: 33.9037159, long: 73.3609268, pos: 4},
            {name: 'Islamabad', lat: 33.6158004, long: 72.8059095, pos: 9},
            {name: 'Sheikhupura', lat: 31.710944, long: 73.9409464, pos: 5},
            {name: 'Murree', lat: 33.9037159, long: 73.3609268, pos: 4},
            {name: 'Lahore', lat: 31.4618039, long: 73.9211365, pos: 11},
            {name: 'Islamabad', lat: 33.6158004, long: 72.8059095, pos: 9},
            {name: 'Sheikhupura', lat: 31.710944, long: 73.9409464, pos: 5},
            {name: 'Murree', lat: 33.9037159, long: 73.3609268, pos: 4},
            {name: 'Lahore', lat: 31.4618039, long: 73.9211365, pos: 11},
            {name: 'Multan', lat: 30.1811818, long: 71.3345704, pos: 10}

        ];
        this.numberPerpage = 4;
        this.pageList = [];
        this.totalPages = [];
        this.finalList = [{name: '', lat: '', long: '', pos: ''}];

        this.loadList();

    }

    async ngOnInit() {
        this.map = GoogleMaps.create('map');
        this.pageList = Math.ceil(this.locations.length / this.numberPerpage);
        for (let j = 1; j <= this.pageList; j++) {
            this.totalPages.push(j);
        }
        this.platform.ready().then(() => this.loadMap());
    }

    loadMap() {
        this.map.clear();
        this.loadList();
        Environment.setEnv({
            API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyBfukd4Qqw3XTeQfBgDAyvzIuD4w-PtItw',
            API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyBfukd4Qqw3XTeQfBgDAyvzIuD4w-PtItw'
        });
        const htmlInfoWindow = new HtmlInfoWindow();
        this.map.clear();
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.finalList.length; i++) {
            const frame: HTMLElement = document.createElement('div');
            const marker: Marker = this.map.addMarkerSync({
                position: {lat: this.finalList[i].lat, lng: this.finalList[i].long}
            });
            this.map.setOptions({
                camera: {
                    target: {
                        lat: this.finalList[i].lat,
                        lng: this.finalList[i].long
                    },
                    zoom: 10
                }
            });
            // tslint:disable-next-line:only-arrow-functions no-shadowed-variable
            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                frame.innerHTML = [
                    '<h3>' + this.finalList[i].name + '</h3>',
                ].join('');
                htmlInfoWindow.setContent(frame, {width: '80px', height: '80px'});
                htmlInfoWindow.open(marker);
            });
        }
    }

    loadList() {
        const begin = ((this.currentPage - 1) * this.numberPerpage);
        const end = begin + this.numberPerpage;

        this.finalList = this.locations.slice(begin, end);
    }

    nextPage(index) {
        this.currentPage = index;
        this.loadMap();

    }
}
