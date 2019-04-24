import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  Request,
  RequestMethod,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import { Observable, Subject, throwError } from 'rxjs';
import { IsToasterService } from '../../../toaster/toast.service';

/**
 * Default API URL object
 */
export enum API_URL {
  API = '/api',
  AUTH = '/proxy/oauth'
}

/**
 * Http service class
 */
@Injectable()
export class IsHttpService {
  /**
   * Headers
   */
  private headers: Headers;

  /**
   * On error subject
   */
  private _onError: Subject<any> = new Subject();

  /**
   * Returns response error message
   * @param error
   */
  static getResponseErrorMsg( error: Response | any ): string {
    let errMsg: string = '';
    if (error instanceof Response) {
      const body: any = error.json() || '';
      errMsg = body.message || body.error || JSON.stringify(body);
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return errMsg;
  }

  /**
   * Error observable getter
   */
  get onError$(): Observable<any> {
    return this._onError.asObservable();
  }

  /**
   * Creates an instance of IsHttpService.
   * @param http Http
   * @param toastr object of IsToasterService
   */
  constructor( private http: Http,
               private toastr: IsToasterService ) {}

  /**
   * Make http request
   * @param url resource url
   * @param method http method
   * @param data request parameters or body
   */
  request( url: string, method: RequestMethod,
           data?: URLSearchParams | object ): Observable<Response> {
    const options: RequestOptions = new RequestOptions({
      method,
      url
    });

    if (this.headers) {
      options.headers = this.headers;
    }

    if (data) {
      if (method === RequestMethod.Get) {
        options.params = data as URLSearchParams;
      } else {
        options.body = data;
      }
    }

    return this.http.request(new Request(options));
  }

  /**
   * Make GET http request
   * @param url resource url
   * @param data url query string
   */
  get( url: string, data?: URLSearchParams ): Observable<Response> {
    return this.request(url, RequestMethod.Get, data);
  }

  /**
   * Make POST http request
   * @param url resource url
   * @param data request body
   */
  post( url: string, data?: object ): Observable<Response> {
    return this.request(url, RequestMethod.Post, data);
  }

  /**
   * Set global headers that will be applied to all requests
   * @param headers key value pair object of headers to be applied
   */
  setHeaders( headers: object ): void {
    this.headers = new Headers();

    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        const property: any = headers;
        this.headers.append(key, property[key]);
      }
    }
  }

  /**
   * Clear global headers
   */
  clearHeaders(): void {
    this.headers = null;
  }

  /**
   * Add api prefix to url
   * @param url
   * @param prefix api prefix
   * @example
   * let url = httpService.createUrl('/branch/1/commits');
   * // returns: /api/branch/1/commits
   */
  createUrl( url: string, prefix: API_URL = API_URL.API ): string {
    return prefix + url;
  }

  /**
   * Handle http error and show toast error and print error on console, emits
   * onError event
   * @example
   * httpService.get('/api/branch/1/commits')
   *   .catch(httpService.handleError());
   */
  handleError(): (error: any) => Observable<never> {
    const toastr: IsToasterService = this.toastr;
    return ( error: Response | any ): Observable<never> => {
      // In a real world app, we might use a remote logging infrastructure
      const errMsg: string = IsHttpService.getResponseErrorMsg(error);
      console.error(errMsg);
      toastr.popError(errMsg);
      this._onError.next(error);

      return throwError(errMsg);
    };
  }

}
