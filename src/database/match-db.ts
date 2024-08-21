import type { MatchDTO, ParticipantDTO } from "../riot-api/types";
import { getDatabase } from "./connection";

const getCollection = async () => {
  const db = await getDatabase()
  return db.collection<MatchDTO>('match')
}

const PARTICIPANT_IGNORED_FIELDS: Array<keyof ParticipantDTO> = ['challenges', 'missions', 'perks']

export const storeMatch = async (match: MatchDTO) => {
  const collection = await getCollection()
  const matchId = match.metadata.matchId
  const existing = await retrieveMatch(matchId)
  if (existing) {
    return null
  }
  match.info.participants.forEach((participant) => {
    PARTICIPANT_IGNORED_FIELDS.forEach((field) => {
      delete participant[field]
    })
  })
  const result = await collection.insertOne(match)
  return result.insertedId
}

export const retrieveMatch = async (matchId: string) => {
  const collection = await getCollection()
  return collection.findOne({ 'metadata.matchId': matchId })
}