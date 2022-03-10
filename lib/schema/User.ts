import {v4 as uuidv4} from 'uuid';

export enum UserRank {
    MEMBER = 0,
    MODERATOR = 1,
    ADMIN = 2,
    SUPER = 3
}

export class User {

    _id: any;
    email: string;
    locale: string;
    name: string;
    _hash: string;

    _rank: UserRank;

    _oauth_provider: string;
    _oauth_provider_id: string;

    _registration_date: number;
    _last_login_date: number;
    is_first_login: boolean;
    uuid;
    _uuid;

    email_unsubscribe: boolean;

    liked_resources: string[];

    constructor(literal?) {
        this._hash = literal._hash || "";
        this.uuid = literal.uuid || uuidv4();
        this._uuid = literal._uuid || uuidv4();
        this._rank = literal._rank || UserRank.MEMBER;
        this._id = literal._id;
        this.email = literal.email;
        this.locale = literal.locale;
        this.name = literal.name;
        this._oauth_provider = literal._oauth_provider;
        this._oauth_provider_id = literal._oauth_provider_id;
        this.liked_resources = literal.liked_resources || [];

        this._registration_date = literal._registration_date || Date.now();// || moment().unix();
        this.is_first_login = literal.is_first_login;
        this.email_unsubscribe = literal.email_unsubscribe || false;
        this._last_login_date = Date.now();//moment().unix();
    }

}

export function GoogleOAuthProviderToUser(obj) {
    return new User({
        name: obj._json.given_name,
        email: obj._json.email,
        locale: obj._json.locale,
        _oauth_provider: 'google',
        _oauth_provider_id: obj.id
    });
}
