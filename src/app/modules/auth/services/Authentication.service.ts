import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';

const baseUrl = environment.baseUrl;
@Injectable()
export class SocialAuthService {
  private URL : string = "/api/auth/signup/fb"
  private resetURL : string ;

  constructor(private http : HttpClient){}

  facebookSignup(user : any){
    let graphAPI = `https://graph.facebook.com/v2.9/me?access_token=${user.authToken}&fields=gender,birthday,hometown%2Cage_range&method=get&pretty=0&sdk=joey&suppress_http_code=1`;
    this.http.get(graphAPI).subscribe(data => {
      let facebookUser = {
        id: user.id,
        token: user.authToken,
        name : user.name,
        email: user.email,
        photo: user.photoUrl,
        ...data
      }
    })
  }

  googleSignup(user : any){
    let googleAPI = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.authToken}`;
    this.http.get(googleAPI).subscribe(data => {
      let googleUser = {
        id: user.id,
        token: user.authToken,
        name : user.name,
        email: user.email,
        photo: user.photoUrl,
        ...data
      }
    })
  }

  forgotPassowrd( email : String){
    let emailStr = Object.values(email)[0]
    this.http.get(`${baseUrl}/api/auth/login/forgot-password?email=${emailStr}`, {responseType: 'text'}).subscribe(data => {
      this.resetURL = data;
    })
  }

  ResetPassowrd( password : String){
    let passwordStr = Object.values(password)[0]
    this.http.post(this.resetURL, { password: passwordStr}, {responseType: 'text'}).subscribe(data => {
      // this.resetURL = data;
    })
  }
}