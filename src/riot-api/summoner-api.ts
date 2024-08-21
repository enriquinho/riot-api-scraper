import { getAxiosInstance } from './common'
import type { SummonerDTO } from './types'

const axios = getAxiosInstance('server')

export const getSummonerById = async (id: string): Promise<SummonerDTO> => {
  const response = await axios.get(`/lol/summoner/v4/summoners/${id}`)
  return response.data as SummonerDTO
}