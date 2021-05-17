import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { CountriesCodes } from '../../../../model/countries'
import { StatisticsResponse } from '../../../../model/statistics'
import { map } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class BackendService {
    constructor(private http: HttpClient) {}

    getCountries() {
        return this.http.get(
            environment.API_URL + 'countries'
        ) as Observable<CountriesCodes>
    }

    getStatistics() {
        return (
            this.http.get(
                environment.API_URL + 'statistics'
            ) as Observable<StatisticsResponse>
        ).pipe(map((response) => response.response))
    }
}
