import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatButtonModule } from '@angular/material/button'
import { StatsTableComponent } from './stats-table/stats-table.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { MyHttpInterceptor } from './my-interceptor.interceptor'
import { MatIconModule } from '@angular/material/icon'

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
export class AppModule {}
