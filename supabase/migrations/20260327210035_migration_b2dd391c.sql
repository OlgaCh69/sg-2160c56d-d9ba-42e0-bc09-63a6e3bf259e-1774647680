-- Create generations table to track AI photo generations
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  input_photos JSONB NOT NULL, -- Array of uploaded photo URLs
  output_photos JSONB NOT NULL, -- Array of generated photo URLs
  generation_type TEXT NOT NULL CHECK (generation_type IN ('free', 'premium')),
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create generated_content table for bios and messages
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('bio_funny', 'bio_confident', 'bio_simple', 'opening_message')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage_limits table to track free tier usage
CREATE TABLE usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  free_generations_used INTEGER NOT NULL DEFAULT 0,
  free_generations_limit INTEGER NOT NULL DEFAULT 3,
  subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'cancelled')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create profile_scores table to track before/after scores
CREATE TABLE profile_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  before_score DECIMAL(3,1) NOT NULL CHECK (before_score >= 1.0 AND before_score <= 10.0),
  after_score DECIMAL(3,1) NOT NULL CHECK (after_score >= 1.0 AND after_score <= 10.0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generated_content_generation_id ON generated_content(generation_id);
CREATE INDEX idx_usage_limits_user_id ON usage_limits(user_id);
CREATE INDEX idx_profile_scores_generation_id ON profile_scores(generation_id);

-- Enable RLS on all tables
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for generations
CREATE POLICY "Users can view their own generations" ON generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own generations" ON generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own generations" ON generations FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for generated_content
CREATE POLICY "Users can view their own content" ON generated_content FOR SELECT 
USING (EXISTS (SELECT 1 FROM generations WHERE generations.id = generated_content.generation_id AND generations.user_id = auth.uid()));
CREATE POLICY "Users can create content" ON generated_content FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM generations WHERE generations.id = generated_content.generation_id AND generations.user_id = auth.uid()));

-- RLS Policies for usage_limits
CREATE POLICY "Users can view their own usage limits" ON usage_limits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own usage limits" ON usage_limits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own usage limits" ON usage_limits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for profile_scores
CREATE POLICY "Users can view their own scores" ON profile_scores FOR SELECT 
USING (EXISTS (SELECT 1 FROM generations WHERE generations.id = profile_scores.generation_id AND generations.user_id = auth.uid()));
CREATE POLICY "Users can create scores" ON profile_scores FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM generations WHERE generations.id = profile_scores.generation_id AND generations.user_id = auth.uid()));