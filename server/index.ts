import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import "dotenv/config";
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import { Pool } from 'pg';

const app = new Hono();

app.use('/*', cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                console.log("--------------------------------");
                console.log(`Check your email (OTP): ${email}`);
                console.log(`OTP Code: ${otp}`);
                console.log(`Type: ${type}`);
                console.log("--------------------------------");
            },
        }),
    ]
});

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
    return auth.handler(c.req.raw);
});

const port = 4000;
console.log(`Server is running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port
});
