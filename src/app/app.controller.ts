import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Res() response): Promise<void> {
    response.sendFile('index.html', { root: 'src' });
  }
}
