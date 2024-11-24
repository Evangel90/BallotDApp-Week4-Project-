import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contract-address')
  getContractAddress(){
    return {result: this.appService.getContractAddress()};
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body:MintTokenDto) {
    return {result: await this.appService.mintTokens(body.address)};
  }
}
