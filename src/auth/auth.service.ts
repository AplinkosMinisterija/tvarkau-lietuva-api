//import { JwtService } from '@nestjs/jwt';

import { Injectable } from '@nestjs/common';
import { LogInDto } from './dto/log-in.dto';
import axios, { AxiosResponse } from 'axios';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(microsoftToken: string): Promise<LogInDto | null> {
    const response: AxiosResponse | null =
      await this.checkMicrosoftToken(microsoftToken);
    if (response == null) {
      return null;
    }

    const name = response.data.displayName;
    const email = response.data.mail;
    const payload = { email: email };
    if (name == null || email == null) {
      return null;
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env['JWT_SECRET'],
    });

    return new LogInDto(name, email, accessToken);
  }

  async checkMicrosoftToken(
    microsoftToken: string,
  ): Promise<AxiosResponse | null> {
    let returnValue: AxiosResponse | null = null;
    await axios
      .get('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: 'Bearer ' + microsoftToken },
      })
      .then((response) => {
        if (response.status == 200) {
          const email = response.data.mail;
          if (email.includes('@aad.am.lt')) {
            returnValue = response;
          } else {
            returnValue = null;
          }
        } else {
          returnValue = null;
        }
      });
    return returnValue;
  }
}
