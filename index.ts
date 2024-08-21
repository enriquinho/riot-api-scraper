import 'dotenv/config'

import { scrapChallengerSummoners, scrapSummonerMatches } from './src/scraper'
import { getClient } from './src/database/connection'

const finish = async () => {
  const client = await getClient()
  client.close()
}

const scrap = async () => {
  await scrapChallengerSummoners()
  await scrapSummonerMatches()
  finish()
}

scrap()
