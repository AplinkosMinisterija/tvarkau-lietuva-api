import { Controller, Post, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LogInDto } from './dto/log-in.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description: 'Login successful',
    type: LogInDto,
  })
  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<LogInDto> {
    const logInDto = await this.authService.login(loginRequestDto.accessKey);
    if (!logInDto) throw new UnauthorizedException('Unauthorized login');

    return logInDto;
  }
}
