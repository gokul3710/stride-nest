import { BrandService } from './brand.service';
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
import { AdminGuard } from 'src/guards/admin.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  getBrands() {
    return this.brandService.allBrands();
  }

  @Get(':brandId')
  getBrandById(@Param() { brandId }: { brandId: string }) {
    return this.brandService.brandById(brandId);
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('image', null, multerConfig))
  @UsePipes(ValidationPipe)
  addBrand(@Body() brand: any, @UploadedFiles() images: Array<any>) {
    return this.brandService.addBrand(brand, images);
  }

  @Patch(':brandId')
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('image', null, multerConfig))
  @UsePipes(ValidationPipe)
  updateBrand(
    @Param() { brandId }: { brandId: string },
    @Body() brand: any,
    @UploadedFiles() images: Array<any>,
  ) {
    return this.brandService.updateBrand({ ...brand, brandId }, images);
  }

  @Delete(':brandId')
  @UseGuards(AdminGuard)
  deleteBrand(@Param() { brandId }: { brandId: string }) {
    return this.brandService.deleteBrand(brandId);
  }
}
