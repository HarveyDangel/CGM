import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, type Repository } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';
// biome-ignore lint/style/useImportType: NestJS DI needs runtime import
import { SupabaseService } from '../supabase/supabase.service';
import type { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabase: SupabaseService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async signUp(dto: SignUpDto) {
    const result = await this.supabase.signUp(dto.email, dto.password);
    try {
      await this.profileRepository.save({
        id: result.user.id,
        email: result.user.email,
      });
    } catch (err: unknown) {
      if (
        err instanceof QueryFailedError &&
        (err as unknown as Record<string, unknown>).code === '23505'
      ) {
        throw new ConflictException('A profile for this user already exists');
      }
      throw new InternalServerErrorException('Failed to create profile');
    }
    return result;
  }

  signIn(dto: SignInDto) {
    return this.supabase.signIn(dto.email, dto.password);
  }
}
