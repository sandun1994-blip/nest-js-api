import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor(private configService: ConfigService) {}
}
