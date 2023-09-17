import { Injectable, HttpException } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import { addReviewDto } from '../../../core/dtos/user/review/add-review.dto';
import { collections } from 'src/core/constants/collections';
import { Collection, ObjectId } from 'mongodb';
import { OrderDocument } from 'src/core/models/order.model';
import { reviewDocument } from 'src/core/models/review.model';
import { ProductDocument } from 'src/core/interfaces/product/product-document.interface';

@Injectable()
export class ReviewService {
  private review: Collection<reviewDocument>;

  constructor(private readonly db: DatabaseService) {}

  async addReview(userId: string, review: addReviewDto) {

    this.review = this.db.getCollection(collections.REVIEW_COLLECTION)

    if(userId !== review.userId){
        throw new HttpException('Unauthorized attempt',401)
    }

    const product: ProductDocument = await this.db.getCollection(collections.ORDER_COLLECTION).findOne({_id: new ObjectId(review.productId)})
    if(!product){
      throw new HttpException('Unauthorized attempt',401)
    }

    const order: OrderDocument = await this.db.getCollection(collections.ORDER_COLLECTION).findOne({_id: new ObjectId(review.orderId)})
    if(!order){
      throw new HttpException('Unauthorized attempt',401)
    }
    if(order?.userId.toString() !== userId ){
      throw new HttpException('Unauthorized attempt',401)
    }
    if(!order.items.some(obj => obj._id.toString() === review.productId )){
      throw new HttpException('Unauthorized attempt',401)
    }

    let reviewObj: reviewDocument = {
      userId: new ObjectId(review.userId),
      productId: new ObjectId(review.productId),
      rating: Number(review.rating),
      review: review.review,
      createdAt: new Date(),
    }
    console.log(reviewObj);
    
    const reviewExits: reviewDocument =  await this.review.findOne({userId: new ObjectId(userId),productId: new ObjectId(review.productId)})

    if(reviewExits){
      await this.review.updateOne({userId: new ObjectId(userId),productId: new ObjectId(review.productId)},{
        $set: {
          rating: Number(review.rating),
          review: review.rating,
          createdAt: new Date()
        }
      })

      return {status: 'Done'}
    }

    await this.review.insertOne(reviewObj)
    return {status: 'Done'}
  }
}
