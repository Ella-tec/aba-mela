-- Mela authenticator MFA schema update.
-- Apply this script to existing PostgreSQL databases before deploying the MFA-enabled API.
ALTER TABLE "Users"
    ADD COLUMN IF NOT EXISTS "AuthenticatorSecretProtected" text NULL;

ALTER TABLE "Users"
    ADD COLUMN IF NOT EXISTS "AuthenticatorEnabled" boolean NOT NULL DEFAULT false;
