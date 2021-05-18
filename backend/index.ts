import Express from 'express'
import Axios, { AxiosRequestConfig } from 'axios'
import { Environment } from './environment'
import { countriesCodes } from './countries/countries'
import { CountriesCodesMap } from '../model/countries'
import { StatisticsResponse } from '../model/statistics'

/**
 * Port which will the server run on.
 *
 * Heroku can provide a different port.
 */
const port = process.env.PORT || 3000

/**
 * The base URL to the COVID-19 API.
 */
const apiHost = Environment.API_HOST

// initialize the express app
const express = Express()

// Heroku will probably have the server running *somewhere* locally,
// and route the ports around, so we need to give them our trust
// in doing it correctly
express.set('trust proxy', 1)

// origin access: check if origin is approved to connect
express.use((req, res, next) => {
    // the Origin header is required
    const origin = req.headers.origin
    if (!origin) {
        res.end()
        return
    }

    const originsWithAccess = ['https://covoir.jerry-sky.me']
    // optional origins with access for local testing
    if (Environment.NODE_ENV !== 'production') {
        originsWithAccess.push('http://localhost:4200')
        originsWithAccess.push('https://web.postman.co/')
    }
    // check if origin is on the list
    if (originsWithAccess.indexOf(origin) > -1) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Credentials', 'true')
        res.header('Access-Control-Allow-Headers', 'Content-Type,X-XSRF-TOKEN')
        res.header('X-Content-Type-Options', 'nosniff')
        res.header(
            'Access-Control-Allow-Methods',
            'POST, OPTIONS, GET, DELETE, PUT'
        )
        res.header('Accept', 'application/json')
    }

    next()
})

/**
 * Default abstract Axios request options.
 */
const options: Partial<AxiosRequestConfig> = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': Environment.API_KEY,
        'x-rapidapi-host': apiHost,
    },
}

/**
 * Concatenates the host with the HTTPS protocol and the path.
 */
const composeUrl = (host: string, path: string) => {
    return 'https://' + host + '/' + path
}

/**
 * The cache lifetime.
 *
 * (6h)
 */
const cacheLongevity = 1000 * 60 * 60 * 6

// Pass through all necessary API endpoints.

// Cache the results.
type Data = StatisticsResponse | null
let statisticsCache: Data = null

let cacheSetupTime = Date.now()
const isCacheExpired = () => {
    return Date.now() >= cacheSetupTime + cacheLongevity
}

// The main statistics API route.
express.get('/statistics', async (_, res, next) => {
    let data: Data = null
    if (statisticsCache != null && !isCacheExpired()) {
        // use cache if available and not stale
        data = statisticsCache
    } else {
        // otherwise request new set of data from the COVID-19 API
        const response = await Axios.request({
            ...options,
            url: composeUrl(apiHost, 'statistics'),
        })
        data = response.data
        // sort the response by country name
        data?.response.sort((a, b) =>
            a.country < b.country ? -1 : a.country > b.country ? 1 : 0
        )
        // save to cache for later
        statisticsCache = data
        cacheSetupTime = Date.now()
    }
    // send it
    res.json(data)
    next()
})

// A map between countries’ names and their codes.
// Used for determining the URL to countries’ flags.
express.get('/countries', async (_, res, next) => {
    const data = countriesCodes
    const map: CountriesCodesMap = {}
    // map it
    data.forEach((c) => (map[c.name] = c.code))
    // send it
    res.json(map)
    next()
})

// Start the server.
express.listen(port, () => {
    const date = new Date()
    console.log(
        '\n\x1b[1mNew server run\x1b[0m',
        '\ninitialized on',
        date.toString(),
        '\n'
    )
})
