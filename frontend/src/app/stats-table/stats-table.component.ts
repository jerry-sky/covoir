import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { CountriesCodesMap } from '../../../../model/countries'
import { BackendService } from '../services/backend.service'
import { StatisticsResponseCountry } from '../../../../model/statistics'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'

@Component({
    selector: 'app-stats-table',
    templateUrl: './stats-table.component.html',
    styleUrls: ['./stats-table.component.scss'],
})
export class StatsTableComponent implements OnInit {
    columns: Array<keyof StatisticsResponseCountry> = ['country', 'cases']

    /**
     * A pointer to the currently opened element.
     */
    expandedElement = null

    countriesCodes: CountriesCodesMap = {}

    statistics: Array<Partial<Record<keyof StatisticsResponseCountry, any>>> =
        []

    dataSource = new MatTableDataSource(this.statistics)

    @ViewChild(MatPaginator) paginator: MatPaginator
    @ViewChild('table', { read: ElementRef })
    table: ElementRef<HTMLTableElement>

    constructor(private backendService: BackendService) {}

    ngOnInit() {
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
                        cases: x.cases.total,
                    }
                })
                this.updateTableDataSource()
            },
        })
    }

    resetTableScroll() {
        this.table.nativeElement.scrollIntoView()
    }

    private updateTableDataSource() {
        this.dataSource = new MatTableDataSource(this.statistics)
        this.dataSource.paginator = this.paginator
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
