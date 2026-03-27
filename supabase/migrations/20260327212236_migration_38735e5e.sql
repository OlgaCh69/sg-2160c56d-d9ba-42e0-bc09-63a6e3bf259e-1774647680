-- Add Stripe-related columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add Stripe-related columns to usage_limits table
ALTER TABLE usage_limits ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE usage_limits ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMP WITH TIME ZONE;

-- Create index for faster Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_usage_limits_stripe_subscription ON usage_limits(stripe_subscription_id);