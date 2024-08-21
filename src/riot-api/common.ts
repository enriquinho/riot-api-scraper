import { env } from 'node:process'
import axios from 'axios'
import pThrottle from 'p-throttle';

export enum API_SERVER_URLs {
  EUW = 'https://euw1.api.riotgames.com'
}

export enum API_REGION_URLs {
  EUROPE = 'https://europe.api.riotgames.com'
}

const getAPIServerURL = () => API_SERVER_URLs.EUW
const getAPIRegionURL = () => API_REGION_URLs.EUROPE

const logRequestError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.log('AxiosError:', error.message)
    const path = error.request?.path
    if (path) {
      console.log('  ↪ path:', error.request?.path)
    }
  } else if (error instanceof Error) {
    console.log('Error', error.message)
  } else {
    console.log('UnknownError', error)
  }
}


//RIOT API personal rate limits
//20 requests every 1 seconds(s)
//100 requests every 2 minutes(s)
const throttle20ReqPerSec = pThrottle({ limit: 15, interval: 1000, onDelay: () => console.log('Reached 20 req per sec limit, waiting...') })(() => { })
const throttle100ReqPer2Min = pThrottle({ limit: 95, interval: 2 * 60 * 1000, onDelay: () => console.log('Reached 100 req per 2 min limit, waiting...') })(() => { })

export const getAxiosInstance = (domain: 'server' | 'region') => {
  const axiosInstance = axios.create({
    baseURL: domain === 'server' ? getAPIServerURL() : getAPIRegionURL(),
    headers: {
      'X-Riot-Token': env.RIOT_API_KEY
    }
  })

  axiosInstance.interceptors.response.use(async (response) => {
    await Promise.all([throttle20ReqPerSec(), throttle100ReqPer2Min()])
    return response
  }, error => {
    logRequestError(error)
    return Promise.reject(error)
  })

  return axiosInstance
}
