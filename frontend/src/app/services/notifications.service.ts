import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    /**
     * Indicates whether there has been a server error.
     */
    httpError = new BehaviorSubject(false)

    constructor() {}
}
