// server/utils/use-database.ts
// MongoDB Collections utility

import { MongoClient, Db } from 'mongodb'
import { AffiliateLink, COLLECTIONS } from '~~/server/models'

let client: MongoClient
let db: Db

// Initialize MongoDB connection
export async function connectToDatabase() {
  if (!client) {
    const config = useRuntimeConfig()
    client = new MongoClient(config.mongodbUri)
    await client.connect()
    db = client.db(config.mongodbName)
  }
  return { client, db }
}

// Get all collections
export async function useCollections() {
  if (!db) {
    await connectToDatabase()
  }

  return {
    affiliateLinksCollection: db.collection<AffiliateLink>(COLLECTIONS.AFFILIATE_LINKS),
  }
}

// Create indexes for better performance
export async function createIndexes() {
  const collections = await useCollections()

  try {
    await collections.affiliateLinksCollection.createIndex({ createdAt: -1 })
    await collections.affiliateLinksCollection.createIndex({ originUrl: 1 })
  } catch (error) {
    console.error('Error creating indexes:', error)
  }
}
