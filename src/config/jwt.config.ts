export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'da0f624b767fc436623e9a8485e42fbe1e303478333f7a0ac9ced9db6c4ec46d69bc676c2e2fee055591456b624b85f3f485f66573e31d161ebb5328f5906b3f',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}; 