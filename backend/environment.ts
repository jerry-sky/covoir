import Dotenv from 'dotenv'

Dotenv.config()

/**
 * All expected NodeJS process variables.
 */
interface EnvironmentVariables extends NodeJS.ProcessEnv {
    API_KEY: string
    API_HOST: string
}

/**
 * All expected NodeJS process variables.
 */
export const Environment = process.env as EnvironmentVariables

if (Object.keys(Environment).length === 0) {
    throw new Error('.env file not found')
}
