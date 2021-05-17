import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AboutComponent } from './about/about.component'
import { StatsTableComponent } from './stats-table/stats-table.component'

const routes: Routes = [
    {
        path: '',
        component: StatsTableComponent,
    },
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/',
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
