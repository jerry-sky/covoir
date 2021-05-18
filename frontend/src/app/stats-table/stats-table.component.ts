import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core'
import { CountriesCodesMap } from '../../../../model/countries'
import { BackendService } from '../services/backend.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort, MatSortable } from '@angular/material/sort'
import { BehaviorSubject } from 'rxjs'

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

    /**
     * Indicates whether the statistics have been loaded yet.
     */
    isLoading = true

    /**
     * Toggles between the standard set of columns (showing absolute statistics)
     * and the 1M variant (showing per 1M inhabitants statistics).
     */
    toggle1M = new BehaviorSubject(false)

    /**
     * Currently viewed set of columns in the table.
     */
    columns: Array<string> = COLUMNS_STANDARD

    /**
     * A map of countries’ names to countries’ codes.
     */
    countriesCodes: CountriesCodesMap = {}

    /**
     * COVID-19 statistics for all countries ready to be shown in the table.
     */
    statistics: Array<Record<string, any>> = []

    /**
     * Statistics, but in a MatTable-understandable form.
     */
    dataSource = new MatTableDataSource(this.statistics)

    /**
     * Pointer to the paginator element.
     */
    @ViewChild(MatPaginator) paginator: MatPaginator
    /**
     * Pointer to the sort part of this component.
     */
    @ViewChild(MatSort) sort: MatSort

    /**
     * Pointer to the table element itself.
     */
    @ViewChild('table', { read: ElementRef })
    table: ElementRef<HTMLTableElement>

    constructor(private backendService: BackendService) {}

    ngAfterViewInit() {
        // listen for the ‘show per 1M’ checkbox and swap columns sets accordingly
        this.toggle1M.subscribe({
            next: (status) =>
                (this.columns = status ? COLUMNS_1M : COLUMNS_STANDARD),
        })

        // get the countries map from the backend
        this.backendService.getCountries().subscribe({
            next: (data) => {
                this.countriesCodes = data
            },
        })

        // get the statistics list from the backend
        this.backendService.getStatistics().subscribe({
            next: (data) => {
                this.statistics = data.map((x) => {
                    // map the response to a table-viewable form
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
                // notify the elements of concern that the data has arrived
                this.updateTableDataSource()
                // hide the loading indicator
                this.isLoading = false
            },
        })
    }

    /**
     * Go to the top of the table.
     *
     * Useful when going between pages.
     */
    resetTableScroll() {
        this.table.nativeElement.scrollIntoView()
    }

    /**
     * Notify all elements that are affected by the data to update.
     */
    private updateTableDataSource() {
        this.dataSource = new MatTableDataSource(this.statistics)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        // by default, at start sort by total cases
        this.sort.sort({ id: 'totalCases', start: 'desc' } as MatSortable)
        // add a custom filter function that searches only in the countries’ column
        // allows for a comma-separated list
        this.dataSource.filterPredicate = (data, filter) => {
            for (const term of filter.split(',')) {
                if (term === '') continue
                if (data.country.toLowerCase().includes(term.trim())) {
                    return true
                }
            }
            return false
        }
    }

    /**
     * Filter through data with respect to the user-provided text filter.
     */
    applyFilter(event: Event) {
        // get the user-provided value
        const value = (event.target as HTMLInputElement).value
        // apply the filter
        this.dataSource.filter = value.trim().toLowerCase()
        // go to the first page
        this.dataSource.paginator?.firstPage()
    }

    /**
     * Get the URL to the country flag.
     */
    getCountryFlagURL(name: string) {
        const code = this.countriesCodes[name]
        if (code) {
            return 'https://www.countryflags.io/' + code + '/flat/64.png'
        } else {
            return ''
        }
    }
}
