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
import { BannerService } from './banner.service';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Controller('banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get()
  getBanners() {
    return this.bannerService.allBanners();
  }

  @Get('active')
  getActiveBanners() {
    return this.bannerService.activeBanners();
  }

  @Get(':bannerId')
  getBannerById(@Param() { bannerId }: { bannerId: string }) {
    return this.bannerService.bannerById(bannerId);
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('image', null, multerConfig))
  @UsePipes(ValidationPipe)
  addBanner(@Body() banner: any, @UploadedFiles() images: Array<any>) {
    return this.bannerService.addBanner(banner, images);
  }

  @Patch(':bannerId')
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('image', null, multerConfig))
  @UsePipes(ValidationPipe)
  updateBanner(
    @Param() { bannerId }: { bannerId: string },
    @Body() banner: any,
    @UploadedFiles() images: Array<any>,
  ) {
    return this.bannerService.updateBanner({ ...banner, bannerId }, images);
  }

  @Delete(':bannerId')
  @UseGuards(AdminGuard)
  deleteBanner(@Param() { bannerId }: { bannerId: string }) {
    return this.bannerService.deleteBanner(bannerId);
  }

  @Patch(':bannerId/activate')
  @UseGuards(AdminGuard)
  activateBanner(@Param() { bannerId }: { bannerId: string }) {
    return this.bannerService.activateBanner(bannerId);
  }

  @Patch(':bannerId/inactivate')
  @UseGuards(AdminGuard)
  inActivateBanner(@Param() { bannerId }: { bannerId: string }) {
    return this.bannerService.inActivateBanner(bannerId);
  }
}
