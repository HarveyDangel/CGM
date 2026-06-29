import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
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

  async getUser(token: string) {
    const {
      data: { user },
      error,
    } = await this.anonClient.auth.getUser(token);
    if (error) throw new UnauthorizedException(error.message);
    return user;
  }
}
