import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: NestJS DI needs runtime import
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private anonClient: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor(config: ConfigService) {
    const url = config.getOrThrow<string>('SUPABASE_URL');
    this.anonClient = createClient(
      url,
      config.getOrThrow<string>('SUPABASE_ANON_KEY'),
    );
    this.adminClient = createClient(
      url,
      config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  get admin(): SupabaseClient {
    return this.adminClient;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.anonClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }

  async getUser(token: string) {
    const {
      data: { user },
      error,
    } = await this.anonClient.auth.getUser(token);
    if (error) throw new UnauthorizedException(error.message);
    return user;
  }
}
