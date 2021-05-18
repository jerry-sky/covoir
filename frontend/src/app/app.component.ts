import { Component, OnInit } from '@angular/core'
import {
    MatSnackBar,
    MatSnackBarRef,
    TextOnlySnackBar,
} from '@angular/material/snack-bar'
import { NotificationsService } from './services/notifications.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    private snackBarRef: MatSnackBarRef<TextOnlySnackBar>

    constructor(
        private notificationsService: NotificationsService,
        private snackBarService: MatSnackBar
    ) {}

    ngOnInit() {
        // watch for HTTP errors
        this.notificationsService.httpError.subscribe({
            next: (status) => {
                // either way dismiss the snackbar
                this.snackBarRef?.dismiss()
                if (status) {
                    // recreate it if there is a new error, or another one
                    this.snackBarRef = this.snackBarService.open(
                        'An error occurred. Please try again later by refreshing the page.',
                        'Close'
                    )
                }
            },
        })
    }
}
