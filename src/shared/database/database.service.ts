import { Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { Collection, Db, MongoClient } from 'mongodb';

@Injectable({ scope: Scope.DEFAULT })
export class DatabaseService implements OnModuleInit {
  private client: MongoClient;
  private db: Db;

  async onModuleInit() {
    await this.connect();
  }

  private async connect(): Promise<void> {
    this.client = new MongoClient(process.env.MONGODB_URL);
    await this.client.connect();
    this.db = this.client.db(process.env.MONGODB_DATABASE);
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  getClient(): MongoClient {
    return this.client;
  }

  getDb(): Db {
    return this.db;
  }

  getCollection(collection: string): Collection<any> {
    return this.db.collection(collection);
  }
}
