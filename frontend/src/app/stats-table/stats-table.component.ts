import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core'
import { CountriesCodesMap } from '../../../../model/countries'
import { BackendService } from '../services/backend.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort, MatSortable } from '@angular/material/sort'
import { BehaviorSubject } from 'rxjs'
import { delay } from 'rxjs/operators'

const COLUMNS_STANDARD = [
    'country',
    'activeCases',
    'newCases',
    'totalRecovered',
    'totalCases',
    'totalTests',
    'totalDeaths',
]

const COLUMNS_1M = [
    'country',
    'activeCases',
    'newCases',
    'totalRecovered',
    'totalCases1M',
    'totalTests1M',
    'totalDeaths1M',
]

@Component({
    selector: 'app-stats-table',
    templateUrl: './stats-table.component.html',
    styleUrls: ['./stats-table.component.scss'],
})
export class StatsTableComponent implements AfterViewInit {
    /**
     * A pointer to the currently opened element.
     */
    expandedElement = null

    isLoading = true

    toggle1M = new BehaviorSubject(false)

    columns: Array<string> = COLUMNS_STANDARD

    countriesCodes: CountriesCodesMap = {}

    statistics: Array<Record<string, any>> = []

    dataSource = new MatTableDataSource(this.statistics)

    @ViewChild(MatPaginator) paginator: MatPaginator
    @ViewChild(MatSort) sort: MatSort

    @ViewChild('table', { read: ElementRef })
    table: ElementRef<HTMLTableElement>

    constructor(private backendService: BackendService) {}

    ngAfterViewInit() {
        this.toggle1M.subscribe({
            next: (status) =>
                (this.columns = status ? COLUMNS_1M : COLUMNS_STANDARD),
        })

        this.backendService.getCountries().subscribe({
            next: (data) => {
                this.countriesCodes = data
            },
        })

        this.backendService.getStatistics().subscribe({
            next: (data) => {
                this.statistics = data.map((x) => {
                    return {
                        country: x.country,
                        totalCases: x.cases.total,
                        activeCases: x.cases.active,
                        newCases: x.cases.new ? parseInt(x.cases.new) : null,
                        totalRecovered: x.cases.recovered,
                        totalCases1M: x.cases['1M_pop'],
                        totalDeaths: x.deaths.total,
                        totalDeaths1M: x.deaths['1M_pop'],
                        totalTests: x.tests.total,
                        totalTests1M: x.tests['1M_pop'],
                    }
                })
                this.updateTableDataSource()
                this.isLoading = false
            },
        })
    }

    resetTableScroll() {
        this.table.nativeElement.scrollIntoView()
    }

    private updateTableDataSource() {
        this.dataSource = new MatTableDataSource(this.statistics)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.sort.sort({ id: 'totalCases', start: 'desc' } as MatSortable)
    }

    applyFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value
        this.dataSource.filter = value.trim().toLowerCase()
        this.dataSource.filterPredicate = (data, filter) => {
            for (const term of filter.split(',')) {
                if (term === '') continue
                if (data.country.toLowerCase().includes(term.trim())) {
                    return true
                }
            }
            return false
        }
        this.dataSource.paginator?.firstPage()
    }

    getCountryCode(name: string) {
        const code = this.countriesCodes[name]
        if (code) {
            return 'https://www.countryflags.io/' + code + '/flat/64.png'
        } else {
            return ''
        }
    }
}
