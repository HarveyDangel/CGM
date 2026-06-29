import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: NestJS DI needs runtime import
import { SupabaseService } from '../supabase/supabase.service';
import type { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  signUp(dto: SignUpDto) {
    return this.supabase.signUp(dto.email, dto.password);
  }

  signIn(dto: SignInDto) {
    return this.supabase.signIn(dto.email, dto.password);
  }
}
