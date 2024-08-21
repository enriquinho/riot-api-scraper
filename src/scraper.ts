import { retrieveMatch, storeMatch } from "./database/match-db"
import { countSummoners, retrieveSummoners, storeSummoner } from "./database/summoner-db"
import { getChallengerSummonersByQueue } from "./riot-api/league-api"
import { getMatchById, getMatchesByPUUID } from "./riot-api/match-api"
import { getSummonerById } from "./riot-api/summoner-api"

export const scrapChallengerSummoners = async () => {
  console.log('Fetching summoners in challenger...')
  const summoners = await getChallengerSummonersByQueue()
  const summonersNum = summoners.entries.length
  console.log(`Retrieved ${summonersNum} summoner entries`)
  console.log('Fetching summoner data for each entry...')
  const entries = summoners.entries.concat()
  while (entries.length > 0) {
    const entry = entries.shift()
    if (entry) {
      console.log(`Fetching summoner ${summonersNum - entries.length}/${summonersNum} with id ${entry.summonerId}`)
      const summoner = await getSummonerById(entry.summonerId)
      console.log(`Retrieved summoner, puuid is: ${summoner.puuid}`)
      console.log(`Storing summoner in database...`)
      const id = await storeSummoner(summoner)
      if (id) {
        console.log(`Stored summoner with ${id}`)
      } else {
        console.log(`Summoner already present in database`)
      }
    } else {
      break
    }
  }
}

export const scrapSummonerMatches = async () => {
  console.log('Fetching matches for summoners in database...')
  const summonerCount = await countSummoners()
  console.log(`Found ${summonerCount} summoners in database...`)

  const matchesCache: Record<string, boolean> = {}
  const summoners = await retrieveSummoners()
  let count = 0
  while (await summoners.hasNext()) {
    count++
    console.log(`Fetching 100 last matches for summoner ${count}/${summonerCount}...`)
    const summoner = await summoners.next()
    if (summoner) {
      const matches = await getMatchesByPUUID(summoner?.puuid, { start: 0 })
      matches.forEach(match => matchesCache[match] = true)
    }
  }

  const matchIds = Object.keys(matchesCache)
  const matchNumber = matchIds.length
  console.log(`Found ${matchNumber} unique match ids`)

  let newStoredMatches = 0, alreadyStoredMatches = 0, failedMatches = 0
  while (matchIds.length > 0) {
    const matchId = matchIds.pop()
    if (matchId) {
      const storedMatch = await retrieveMatch(matchId)
      if (storedMatch) {
        console.log(`Match ${matchId} is already stored, skipping...`)
        alreadyStoredMatches++
        continue
      }
      console.log(`Fetching match data for match ${matchNumber - matchIds.length}/${matchNumber}...`)

      let match
      try {
        match = await getMatchById(matchId)
      } catch (error) {
        console.error(`Error retrieving match ${matchId}: ${error instanceof Error ? error.message : error}`)
        failedMatches++
        continue
      }
      console.log(`Retrieved match data for match ${matchId}`)

      const storeResult = await storeMatch(match)
      if (storeResult) {
        newStoredMatches++
        console.log(`Stored match data for match ${matchId}`)
      } else {
        alreadyStoredMatches++
        console.log(`Match ${matchId} was already stored`)
      }
    }
  }

  console.log(`Finished storing matches: new(${newStoredMatches}) duplicated(${alreadyStoredMatches}) failed(${failedMatches})`)
}

/*
/lol/match/v5/matches/EUW1_7041551236
data: {
      status: {
        message: 'Data not found - match file not found',
        status_code: 404
      }
    }
*/