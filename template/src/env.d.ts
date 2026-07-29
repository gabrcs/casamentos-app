/// <reference types="astro/client" />

type D1Database = import('@cloudflare/workers-types').D1Database;

interface CloudflareEnv {
  DB: D1Database;
  ASSETS: unknown;
  PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  ADMIN_EMAILS: string;
  PIX_KEY: string;
  PIX_MERCHANT_NAME: string;
  PIX_MERCHANT_CITY: string;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: CloudflareEnv;
    };
  }
}
