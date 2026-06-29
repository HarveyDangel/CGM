import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { SupabaseAuthGuard } from '../supabase/supabase.guard';
// biome-ignore lint/style/useImportType: NestJS DI needs runtime import
import { AuthService } from './auth.service';
// biome-ignore lint/style/useImportType: NestJS needs runtime import for ValidationPipe metatype resolution
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getMe(@Req() req: Request) {
    // biome-ignore lint/suspicious/noExplicitAny: set by SupabaseAuthGuard
    return (req as any).user;
  }
}
