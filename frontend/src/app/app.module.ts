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
import { AboutComponent } from './about/about.component'
import { MatSortModule } from '@angular/material/sort'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FormsModule } from '@angular/forms'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
    declarations: [AppComponent, StatsTableComponent, AboutComponent],
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
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        FormsModule,
        MatTooltipModule,
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
