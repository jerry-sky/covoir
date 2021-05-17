import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { environment } from '../../environments/environment'
import { CountriesCodesMap } from '../../../../model/countries'
import {
    StatisticsResponse,
    StatisticsResponseCountry,
} from '../../../../model/statistics'
import { map, tap } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class BackendService {
    constructor(private http: HttpClient) {}

    countriesCodes: CountriesCodesMap | null = null
    statistics: StatisticsResponseCountry[] | null = null

    getCountries() {
        if (this.countriesCodes === null) {
            return (
                this.http.get(
                    environment.API_URL + 'countries'
                ) as Observable<CountriesCodesMap>
            ).pipe(
                tap((data) => {
                    this.countriesCodes = data
                })
            )
        } else {
            return of(this.countriesCodes)
        }
    }

    getStatistics() {
        if (this.statistics === null) {
            return (
                this.http.get(
                    environment.API_URL + 'statistics'
                ) as Observable<StatisticsResponse>
            ).pipe(
                map((response) => {
                    this.statistics = response.response
                    return response.response
                })
            )
        } else {
            return of(this.statistics)
        }
    }
}
