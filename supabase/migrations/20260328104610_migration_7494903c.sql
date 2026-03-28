-- Update profiles table to add Telr customer ID
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telr_customer_id TEXT;

-- Update usage_limits table to add Telr order reference
ALTER TABLE usage_limits ADD COLUMN IF NOT EXISTS telr_order_ref TEXT;

-- Remove Stripe-specific columns
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE usage_limits DROP COLUMN IF EXISTS stripe_subscription_id;

-- Create index for Telr order lookups
CREATE INDEX IF NOT EXISTS idx_usage_limits_telr_order ON usage_limits(telr_order_ref);
CREATE INDEX IF NOT EXISTS idx_profiles_telr_customer ON profiles(telr_customer_id);