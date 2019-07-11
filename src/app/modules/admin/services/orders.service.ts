import { Observable, of } from "rxjs";
import { order } from "../models/vendor-members";
import { delay } from "rxjs/operators";
import { getOrders } from "./orders.mock.data";

export class OrdersService {
  getOrders(): Observable<order[]> {
    return of(getOrders()).pipe(delay(800));
  }
}