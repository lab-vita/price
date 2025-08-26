import jwt from 'jsonwebtoken';

const ALGORITHM = 'HS512';

class JwtTokenService {
  private static instance: JwtTokenService;
  private readonly identity: string;
  private readonly secretKey: string;
  private readonly tokenExpirationTime: number;
  private token: string | null = null;
  private updateTokenPromise: Promise<string> | null = null;

  private constructor(identity: string, secretKey: string, tokenExpirationTime: number) {
    this.identity = identity;
    this.secretKey = secretKey;
    this.tokenExpirationTime = tokenExpirationTime;

    this.getToken = this.getToken.bind(this);
    this.updateToken = this.updateToken.bind(this);
    this.initialize();
  }

  public static getInstance(): JwtTokenService {
    if (!JwtTokenService.instance) {
      JwtTokenService.instance = new JwtTokenService(
        process.env.MEDODS_IDENTITY as string,
        process.env.MEDODS_SECRET_KEY as string,
        Number(process.env.MEDODS_TOKEN_EXPIRATION || 300)
      );
    }
    return JwtTokenService.instance;
  }

  private initialize() {
    const interval = (this.tokenExpirationTime / 2) * 1000;
    setInterval(this.updateToken, interval);
    this.updateToken();
  }

  public getToken(): Promise<string> {
    if (this.token) return Promise.resolve(this.token);
    return this.updateTokenPromise!;
  }

  private updateToken(): Promise<string> {
    if (this.updateTokenPromise) return this.updateTokenPromise;

    this.token = null;
    this.updateTokenPromise = new Promise((resolve, reject) => {
      const iss = this.identity;
      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + this.tokenExpirationTime;

      jwt.sign({ iss, iat, exp }, this.secretKey, { algorithm: ALGORITHM }, (err, token) => {
        if (err || !token) reject(err);
        else resolve(token);
      });
    });

    this.updateTokenPromise
      .then((token) => (this.token = token))
      .catch((err) => console.error(err))
      .finally(() => (this.updateTokenPromise = null));

    return this.getToken();
  }
}

export default JwtTokenService;
