import Dotenv from 'dotenv'

// Dotenv behaves not appropriately when deployed on Heroku.
// All environment variables have been defined through the Heroku dashboard.
if (process.env.NODE_ENV !== 'production') {
    Dotenv.config()
}

/**
 * All expected NodeJS process variables.
 */
interface EnvironmentVariables {
    API_KEY: string
    API_HOST: string
    NODE_ENV: string
}

/**
 * All expected NodeJS process variables.
 */
export const Environment = process.env as unknown as EnvironmentVariables
