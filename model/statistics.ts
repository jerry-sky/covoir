type OneMillionPopCases = string | null // `${number}` | null
type NewCases = string | null // `${'+'|'-'}${number}` | null
type TotalCases = number | null

type DatetimeString = string

export interface StatisticsResponseCountry {
    cases: {
        '1M_pop': OneMillionPopCases
        active: number
        critical: number
        new: NewCases
        recovered: number
        total: TotalCases
    }
    continent: string
    country: string
    day: string
    deaths: {
        '1M_pop': OneMillionPopCases
        new: NewCases
        total: TotalCases
    }
    population: number
    tests: {
        '1M_pop': OneMillionPopCases
        total: TotalCases
    }
    time: DatetimeString
}

export interface StatisticsResponse {
    errors: object[]
    get: string
    parameters: any[]
    response: StatisticsResponseCountry[]
}
