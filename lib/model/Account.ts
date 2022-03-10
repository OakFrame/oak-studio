import {AccountHandler} from "./AccountHandler";
import {User} from "../schema/User";

export class Account implements AccountHandler {
    user:User;
    constructor(props?) {
       // let user_model = new User();
        if (props){
            this.user = new User(props);
        }
    }

    isAuthenticated(): boolean {
        return !!this.user;
    }
}
