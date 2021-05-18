import { Injectable } from '@angular/core'
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { NotificationsService } from './services/notifications.service'
import { catchError } from 'rxjs/operators'

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
    constructor(private notificationsService: NotificationsService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((e) => {
                // send a simple notification that some HTTP error occurred
                this.notificationsService.httpError.next(true)
                return throwError(e)
            })
        )
    }
}
