import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Mark a route as public — skips JwtAuthGuard entirely
// Usage: @Public() on login, send-password, or any unauthenticated endpoint
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
