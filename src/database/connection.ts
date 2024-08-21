import { env } from 'node:process'

import { Db, MongoClient } from 'mongodb'

let client: MongoClient
export const getClient = async () => {
  if (!client) {
    if (!env.MONGODB_URI) {
      throw new Error('Could not get MONGODB_URI environment variable')
    }
    client = new MongoClient(env.MONGODB_URI)
    await client.connect()
  }
  return client
}

export const getDatabase = async (): Promise<Db> => {
  const client = await getClient()
  return client.db('riot-api-data')
}