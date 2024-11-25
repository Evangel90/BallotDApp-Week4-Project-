import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';
import { resourceUsage } from 'process';
import { CheckRoleDto } from './dtos/checkRole.dto';
import { DelegateDto } from './dtos/delegat.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token-contract-address')
  getBDTContractAddress(){
    return {result: this.appService.getBDTContractAddress()};
  }

  @Get('ballot-contract-address')
  getBallotContractAddress(){
    return {result: this.appService.getBallotContractAddress()};
  }

  @Get('token-details')
  async getTokenDetails(){
    return {result: await this.appService.getTokenDetails()};
  }

  @Post('check-role')
  async checkRole(@Body() body:CheckRoleDto){
    return {result: await this.appService.checkRole(body.address)};
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body:MintTokenDto) {
    return {result: await this.appService.mintTokens(body.address)};
  }

  @Post('delegate')
  async delegateToken(@Body() body:DelegateDto) {
    return {result: await this.appService.delegateTokens(body.address)};
  }
}
