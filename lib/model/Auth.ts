import {GoogleOAuthProviderToUser, User} from "../schema/User";
import {db} from "../../service/spa/express";


interface FindOrCreateInterface {
    did_create: boolean;
    data: any;
}

export function isAuthenticated(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}

export function serializeUserInternal(profile, cb) {

    let internal_user;
    let auth_provider;
    let auth_provider_id;

    if (profile.provider === 'google') {
        internal_user = GoogleOAuthProviderToUser(profile);
        auth_provider = internal_user.oauth_provider;
        auth_provider_id = internal_user.oauth_provider_id;
    }

    db.findOrCreate('user', {
        oauth_provider: auth_provider,
        oauth_provider_id: auth_provider_id
    }, internal_user).then(function (document: FindOrCreateInterface) {
        let user = new User(document.data);

        if (document.did_create) {
            user.is_first_login = true;
            console.log('CREATED USER', user);
        }else{
            console.log('Loaded USER', user);
        }
        cb(null, user);

    }).catch((err) => {
        console.log('Loaded USER');
        console.log(err);
        cb(null, null);
    });

    //transforms input from auth provider into session savable data
}