import countriesCodesRaw from './countries.json'

type ICountriesCodes = { code: string; name: string }[]

export const CountriesCodes = countriesCodesRaw as ICountriesCodes
