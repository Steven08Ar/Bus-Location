import { Controller, Get, Query } from '@nestjs/common';
import { EtaService } from './eta.service';

@Controller('eta')
export class EtaController {
  constructor(private readonly etaService: EtaService) {}

  @Get()
  getEta(@Query('from') from: string, @Query('to') to: string) {
    return this.etaService.getEta(from, to);
  }
}
