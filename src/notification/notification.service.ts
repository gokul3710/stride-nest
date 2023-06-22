import { Injectable } from '@nestjs/common';
import { Collection, Document } from 'mongodb';
import { collections } from 'src/constants/collections';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class NotificationService {
  private notification: Collection<Document>;

  constructor(private readonly db: DatabaseService) {}

  async getNotifications() {
    this.notification = this.db.getCollection(
      collections.NOTIFICATION_COLLECTION,
    );
    const notifications = await this.notification
      .find()
      .sort({ date: -1 })
      .toArray();
    return notifications;
  }
}
