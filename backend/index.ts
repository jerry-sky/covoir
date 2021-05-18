import Express from 'express'
import Axios, { AxiosRequestConfig } from 'axios'
import { Environment } from './environment'
import { countriesCodes } from './countries/countries'
import { CountriesCodesMap } from '../model/countries'

const port = process.env.PORT || 3000

const apiHost = Environment.API_HOST

const express = Express()
express.set('trust proxy', 1)
// origin access: check if origin is approved to connect
express.use((req, res, next) => {
    const origin = req.headers.origin
    if (!origin) {
        res.end()
        return
    }
    const originsWithAccess = ['covoir.jerry-sky.me']
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
type Data = Record<string, unknown> | null
let statisticsCache: Data = null

let cacheSetupTime = Date.now()
const isCacheExpired = () => {
    return Date.now() >= cacheSetupTime + cacheLongevity
}

express.get('/statistics', async (_, res, next) => {
    let data: Data = null
    if (statisticsCache != null && !isCacheExpired()) {
        data = statisticsCache
    } else {
        const response = await Axios.request({
            ...options,
            url: composeUrl(apiHost, 'statistics'),
        })
        data = response.data
        statisticsCache = data
        cacheSetupTime = Date.now()
    }
    res.json(data)
    next()
})

express.get('/countries', async (_, res, next) => {
    const data = countriesCodes
    const map: CountriesCodesMap = {}
    data.forEach((c) => (map[c.name] = c.code))
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
