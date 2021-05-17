import { NgModule } from '@angular/core'
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatButtonModule } from '@angular/material/button'
import { StatsTableComponent } from './stats-table/stats-table.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { MyHttpInterceptor } from './my-interceptor.interceptor'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'

@NgModule({
    declarations: [AppComponent, StatsTableComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
    ],
    providers: [
        MyHttpInterceptor,
        {
            provide: HTTP_INTERCEPTORS,
            useExisting: MyHttpInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'github',
            sanitizer.bypassSecurityTrustResourceUrl('../assets/github.svg')
        )
        iconRegistry.addSvgIcon(
            'jerry-sky',
            sanitizer.bypassSecurityTrustResourceUrl('../assets/jerry-sky.svg')
        )
    }
}
