import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { addProductDto } from '../../../core/dtos/product/add-product.dto';
import { editProductDto } from '../../../core/dtos/product/edit-product.dto';
import { AdminGuard } from 'src/core/guards/admin.guard';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts() {
    return this.productService.allProducts();
  }

  @Get(':productId')
  getProductById(@Param() { productId }: { productId: string }) {
    return this.productService.productById(productId);
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('image', null, multerConfig))
  @UsePipes(ValidationPipe)
  addProduct(
    @Body() product: addProductDto,
    @UploadedFiles() images: Array<any>,
  ) {
    return this.productService.addProduct(product, images);
  }

  @Patch(':productId')
  @UseGuards(AdminGuard)
  @UsePipes(ValidationPipe)
  async editProduct(
    @Body() product: editProductDto,
    @Param('productId') productId: string,
  ) {
    return this.productService.editProduct({ ...product, _id: productId });
  }

  @Patch(':productId/image')
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('image', null, multerConfig))
  async editProductImage(
    @Param('productId') productId: string,
    @UploadedFiles() images: Array<any>,
  ) {
    return this.productService.editProductImage(productId, images);
  }

  @Delete(':productId')
  @UseGuards(AdminGuard)
  deletProduct(@Param('productId') productId: string) {
    this.productService.deleteProduct(productId);
  }

  @Post('filter/:page')
  getFilterProducts(@Param() { page }: { page: string }, @Body() data: any) {
    return this.productService.filterProducts(data, page);
  }

  @Post('search')
  getSearchProducts(@Body() { searchString }: { searchString: string }) {
    return this.productService.searchProducts(searchString);
  }
}
