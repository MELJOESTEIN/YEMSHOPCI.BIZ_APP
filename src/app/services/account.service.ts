import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
}

const USERS_DATA = 'users';
const LOGED_DATA = 'loggedIn_user';


@Injectable({
    providedIn: 'root'
})
export class AccountService {
    loginData: any;

    constructor(public storage: Storage) {
    }

    registerUser(user: User) {
        return this.storage.get(USERS_DATA).then((users: User[]) => {
            if (users) {
                users.push(user);
                return this.storage.set(USERS_DATA, users);
            } else {
                return this.storage.set(USERS_DATA, [user]);

            }
        });
    }

    registration(user: User) {
        this.storage.set(LOGED_DATA, user);
    }

    login(username, password) {
        return this.storage.get(USERS_DATA).then((users: User[]) => {
            console.log(users);
            if (!users || users.length === 0) {
                return null;
            }
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < users.length; i++) {
               if (users[i].username === username && users[i].password === password) {
                   this.loginData = users[i];
                   this.storage.set(LOGED_DATA, this.loginData);
                   return this.loginData;
               }
            }
        });
    }


    loggedIn() {
        return this.storage.get(LOGED_DATA);
    }

    logout() {
        return this.storage.remove(LOGED_DATA);
    }


}
