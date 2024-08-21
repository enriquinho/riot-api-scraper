import { getAxiosInstance } from './common'
import type { LeagueListDTO } from './types'

const axios = getAxiosInstance('server')

export const getChallengerSummonersByQueue = async (queue: string = 'RANKED_SOLO_5x5'): Promise<LeagueListDTO> => {
  const response = await axios.get(`/lol/league/v4/challengerleagues/by-queue/${queue}`)
  return response.data as LeagueListDTO
}