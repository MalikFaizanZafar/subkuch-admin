// /**
//  * Created by egonzalez<edgard.gonzalez@aurea.com> on 03/01/2017.
//  */
// import { Injectable } from '@angular/core';
// import {
//   Headers,
//   Http,
//   Request,
//   RequestMethod,
//   RequestOptions,
//   Response,
//   URLSearchParams
// } from '@angular/http';
// import { Observable } from 'rxjs/internal/Observable';
// import { Subject } from 'rxjs/internal/Subject';
// import { IsToasterService } from '../../../toaster/toast.service';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

// export const API_URL = {
//   API: '/api',
//   AUTH: '/proxy/oauth'
// };

// @Injectable()
// export class IsHttpService {
//   private headers: Headers;
//   private _onError: Subject<any> = new Subject();

//   static getResponseErrorMsg( error: Response | any ) {
//     let errMsg = '';
//     if (error instanceof Response) {
//       const body = error.json() || '';
//       errMsg = body.message || body.error || JSON.stringify(body);
//     } else {
//       errMsg = error.message ? error.message : error.toString();
//     }

//     return errMsg;
//   }

//   get onError$(): Observable<any> {
//     return this._onError.asObservable();
//   }

//   constructor( private http: Http,
//                private toastr: IsToasterService ) {}

//   /**
//    * Make http request
//    * @param url resource url
//    * @param method http method
//    * @param data request parameters or body
//    */
//   request( url: string, method: RequestMethod,
//            data?: URLSearchParams | Object ): Observable<Response> {
//     const options = new RequestOptions({
//       method: method,
//       url: url
//     });

//     if (this.headers) {
//       options.headers = this.headers;
//     }

//     if (data) {
//       if (method === RequestMethod.Get) {
//         options.params = data as URLSearchParams;
//       } else {
//         options.body = data;
//       }
//     }

//     return this.http.request(new Request(options));
//   }

//   /**
//    * Make GET http request
//    * @param url resource url
//    * @param data url query string
//    */
//   get( url: string, data?: URLSearchParams ): Observable<Response> {
//     return this.request(url, RequestMethod.Get, data);
//   }

//   /**
//    * Make POST http request
//    * @param url resource url
//    * @param data request body
//    */
//   post( url: string, data?: Object ): Observable<Response> {
//     return this.request(url, RequestMethod.Post, data);
//   }

//   /**
//    * Set global headers that will be applied to all requests
//    * @param headers key value pair object of headers to be applied
//    */
//   setHeaders( headers: Object ) {
//     this.headers = new Headers();

//     for (const key in headers) {
//       if (headers.hasOwnProperty(key)) {
//         this.headers.append(key, headers[key]);
//       }
//     }
//   }

//   /**
//    * Clear global headers
//    */
//   clearHeaders() {
//     this.headers = null;
//   }

//   /**
//    * Add api prefix to url
//    * @param url
//    * @param prefix api prefix
//    * @example
//    * let url = httpService.createUrl('/branch/1/commits');
//    * // returns: /api/branch/1/commits
//    */
//   createUrl( url: string, prefix = API_URL.API ): string {
//     return prefix + url;
//   }

//   /**
//    * Handle http error and show toast error and print error on console, emits
//    * onError event
//    * @example
//    * httpService.get('/api/branch/1/commits')
//    *   .catch(httpService.handleError());
//    */
//   handleError() {
//     const self = this;
//     const toastr = this.toastr;
//     return function( error: Response | any ) {
//       // In a real world app, we might use a remote logging infrastructure
//       const errMsg = IsHttpService.getResponseErrorMsg(error);
//       console.error(errMsg);
//       toastr.popError(errMsg);
//       self._onError.next(error);

//       return ErrorObservable.create(errMsg);
//     };
//   }

// }
