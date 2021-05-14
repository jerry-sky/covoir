import Express from 'express'
import Axios, { AxiosRequestConfig } from 'axios'
import { Environment } from './environment'

const express = Express()
const port = 3000

const apiHost = Environment.API_HOST

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
let countriesCache: Data = null

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
    let data: Data = null
    if (countriesCache != null && !isCacheExpired()) {
        data = countriesCache
    } else {
        const response = await Axios.request({
            ...options,
            url: composeUrl(apiHost, 'countries'),
        })
        data = response.data
        countriesCache = data
        cacheSetupTime = Date.now()
    }
    res.json(data)
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
