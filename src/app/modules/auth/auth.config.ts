import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider} from "angularx-social-login";
 
 
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("237476853855-k8io718ak80c7ri549qubohd9i0tieau.apps.googleusercontent.com", {
      scope: 'profile email',
      return_scopes: true,
      enable_profile_selector: true
    })
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("946636305541249", {
      scope: 'user_gender,user_hometown,user_birthday,pages_messaging,email',
      return_scopes: true,
      enable_profile_selector: true
    })
  }
]);

export function AuthConfig() {
  return config
}