import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store/index";
import { Auth } from "aws-amplify";

export interface IUserState {
  username: string;
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements IUserState {
  public username = "";

  @Mutation
  private setUsername(username: string): void {
    this.username = username;
  }

  @Action
  public init() {
    Auth.currentUserInfo().then((data) => {
      if (!Object.keys(data).length) {
        Auth.currentAuthenticatedUser().then((data) => {
          data.signOut();
        });
      } else this.setUsername(data.username);;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  @Action
  public logout() {
    Auth.signOut({global : true}).then(() => {
      this.setUsername("");
    });
  }
}

export const UserModule = getModule(User);
