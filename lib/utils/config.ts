/* -------------------------------------------------------
   Type Definitions For Environment Variables
-------------------------------------------------------- */
interface Config {
  env: string;
  mongoose: {
    url: string;
    options: Record<string, unknown>;
  };
  jwt: {
    secret: string;
    accessExpirationMinutes: string | number;
    refreshExpirationDays: string | number;
  };
  email: {
    smtp: {
      host: string;
      port: number;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
  };
  next: {
    api: {
      baseUrl: string;
    }
  };
}

/* -------------------------------------------------------
   Exported Config Object
-------------------------------------------------------- */
const config: Config = {
  env: process.env.NODE_ENV || 'development',

  mongoose: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/re-estore-backend-api',
    options: {},
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'thisisasamplesecret',
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  email: {
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
    from: process.env.EMAIL_FROM || 'support@example.com',
  },

  next: {
    api: {
      baseUrl: process.env.NEXT_API_BASE_URL || "http://localhost:3000/api",
    }
  }
};

export default config;
