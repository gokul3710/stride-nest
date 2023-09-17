import {
  Body,
  Controller,
  Patch,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserGuard } from '../../../core/guards/auth.guard';
import { usernameEditDto } from '../../../core/dtos/user/profile/username-edit.dto';
import { phoneEditDto } from '../../../core/dtos/user/profile/phone-edit.dto';
import { profileEditDto } from '../../../core/dtos/user/profile/profile-edit.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { passwordChangeDto } from '../../../core/dtos/user/profile/password-change.dto';

@Controller('user/profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Patch()
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  editProfile(@Request() request, @Body() data: profileEditDto) {
    return this.profileService.editProfile(request.user, data);
  }

  @Patch('username')
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  editUsername(@Request() request, @Body() { username }: usernameEditDto) {
    return this.profileService.editUsername(request.user, username);
  }

  @Patch('phone')
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  editPhone(@Request() request, @Body() { phone }: phoneEditDto) {
    return this.profileService.editPhone(request.user, phone);
  }

  @Patch('image')
  @UseGuards(UserGuard)
  @UseInterceptors(FilesInterceptor('image', null, multerConfig))
  @UsePipes(ValidationPipe)
  editImage(@Request() request, @UploadedFiles() image: Array<any>) {
    return this.profileService.editImage(request.user, image);
  }

  @Patch('password')
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  changePassword(@Request() request, @Body() passwords: passwordChangeDto) {
    return this.profileService.changePassword(request.user, passwords);
  }
}
