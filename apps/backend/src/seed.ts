import { ConflictException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Profile } from './profiles/entities/profile.entity';
import { SupabaseService } from './supabase/supabase.service';

const DEV_EMAIL = 'dev@cgm.local';
const DEV_PASSWORD = 'devpassword123';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const supabase = app.get(SupabaseService);
  const profileRepository = app.get<Repository<Profile>>(
    getRepositoryToken(Profile),
  );

  // Check if dev profile already exists
  const existingProfile = await profileRepository.findOneBy({
    email: DEV_EMAIL,
  });
  if (existingProfile) {
    console.log('Dev user profile already exists, skipping.');
    await app.close();
    return;
  }

  // Create Supabase auth user
  let userId: string;
  try {
    const result = await supabase.signUp(DEV_EMAIL, DEV_PASSWORD);
    userId = result.user.id;
    console.log('Supabase auth user created:', userId);
  } catch (err: unknown) {
    if (err instanceof ConflictException) {
      // User exists in Supabase but not in profiles — fetch id from sign-in
      console.log(
        'Supabase auth user already exists, signing in to get user id...',
      );
      const result = await supabase.signIn(DEV_EMAIL, DEV_PASSWORD);
      userId = result.user.id;
    } else {
      throw err;
    }
  }

  // Create profile row
  await profileRepository.save({
    id: userId,
    email: DEV_EMAIL,
    display_name: 'Dev User',
  });
  console.log('Profile created for dev user:', userId);

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
