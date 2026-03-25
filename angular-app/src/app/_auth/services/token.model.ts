export class TokenModel {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number,
    public readonly expiresAt: Date = new Date(Date.now() + expiresIn * 1000)
  ) {}
}
