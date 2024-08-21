import type { SummonerDTO } from "../riot-api/types";
import { getDatabase } from "./connection";

const getCollection = async () => {
  const db = await getDatabase()
  return db.collection<SummonerDTO>('summoner')
}

export const storeSummoner = async (summoner: SummonerDTO) => {
  const collection = await getCollection()
  const existing = await collection.findOne({ id: summoner.id })
  if (existing) {
    return null
  }
  const result = await collection.insertOne(summoner)
  return result.insertedId
}

export const retrieveSummoners = async () => {
  const collection = await getCollection()
  return collection.find()
}

export const countSummoners = async () => {
  const collection = await getCollection()
  return collection.countDocuments()
}