import {Injectable} from '@angular/core';
import {AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(public alertControler: AlertController, public modalController: ModalController, public loadingController: LoadingController, public toastController: ToastController) {
    }

    async showAlert(msg, hdr) {
        const alert = await this.alertControler.create({
            header: hdr,
            message: msg,
            buttons: ['Ok']
        });
        await alert.present();
    }

    async showLoading(msg, dur) {
        const loader = await this.loadingController.create({
            message: msg,
            duration: dur,
            spinner: 'circular',
            translucent: true
        });
        return await loader.present();
    }

    async presentToast(text, dur) {
        const toast = await this.toastController.create({
            message: text,
            position: 'bottom',
            duration: dur
        });
        toast.present();
    }

    async presentPopUp(comp) {
        const popup = await this.modalController.create({
            component: comp
        });
        return await popup.present();
    }
}
