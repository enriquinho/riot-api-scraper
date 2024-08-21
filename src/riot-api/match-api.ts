import { getAxiosInstance } from './common'
import type { MatchDTO } from './types'

const axios = getAxiosInstance('region')

//https://static.developer.riotgames.com/docs/lol/queues.json
enum QUEUES {
  '5v5_Ranked_Solo' = 420
}

type GetMatchesByPuuidOptions = {
  startTime?: number
  endTime?: number
  queue?: number
  type?: string
  start?: number
  count?: number
}
const defaults: GetMatchesByPuuidOptions = {
  start: 0,
  count: 100,
  queue: QUEUES['5v5_Ranked_Solo']
}
export const getMatchesByPUUID = async (puuid: string, options?: GetMatchesByPuuidOptions): Promise<Array<string>> => {
  const params = { ...defaults, ...options }
  const response = await axios.get(`/lol/match/v5/matches/by-puuid/${puuid}/ids`, { params })
  return response.data as Array<string>
}

export const getMatchById = async (id: string): Promise<MatchDTO> => {
  const response = await axios.get(`/lol/match/v5/matches/${id}`)
  return response.data as MatchDTO
}