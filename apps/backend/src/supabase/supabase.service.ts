import {
  BadRequestException,
  ConflictException,
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

  async signUp(email: string, password: string) {
    const { data: userData, error: createError } =
      await this.adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
    if (createError) {
      if (createError.code === 'email_exists')
        throw new ConflictException('A user with this email already exists');
      throw new BadRequestException(createError.message);
    }
    const { data: signInData } = await this.anonClient.auth.signInWithPassword({
      email,
      password,
    });
    return {
      user: {
        id: userData.user?.id,
        email: userData.user?.email,
      },
      ...(signInData.session && {
        session: {
          access_token: signInData.session.access_token,
          token_type: signInData.session.token_type,
          expires_in: signInData.session.expires_in,
          refresh_token: signInData.session.refresh_token,
        },
      }),
    };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.anonClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.code === 'invalid_credentials')
        throw new UnauthorizedException('Invalid email or password');
      throw new UnauthorizedException(error.message);
    }
    return {
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      session: {
        access_token: data.session?.access_token,
        token_type: data.session?.token_type,
        expires_in: data.session?.expires_in,
        refresh_token: data.session?.refresh_token,
      },
    };
  }

  async getUser(token: string) {
    const {
      data: { user },
      error,
    } = await this.anonClient.auth.getUser(token);
    if (error || !user) throw new UnauthorizedException(error?.message);
    return { id: user.id, email: user.email };
  }
}
