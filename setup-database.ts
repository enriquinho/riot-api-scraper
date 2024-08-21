import 'dotenv/config'

import { getClient, getDatabase } from "./src/database/connection";
import { SummonerDTO, MatchDTO } from "./src/riot-api/types"

const finish = async () => {
  const client = await getClient()
  client.close()
}

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
  ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
  : `${Key}`;
}[keyof ObjectType & (string | number)];

type SummonerDTOIndex = Record<NestedKeyOf<SummonerDTO>, any>
type MatchDTOIndex = Record<NestedKeyOf<MatchDTO>, any>

const setupDatabase = async () => {
  const db = await getDatabase()

  let collection = db.collection('summoner')
  await collection.createIndex({ id: 1 } as SummonerDTOIndex)
  await collection.createIndex({ puuid: 1 } as SummonerDTOIndex)

  collection = db.collection('match')
  await collection.createIndex({ 'metadata.matchId': 1 } as MatchDTOIndex)

  finish()
}

setupDatabase()