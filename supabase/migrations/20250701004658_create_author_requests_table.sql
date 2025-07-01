-- Create author_requests table
CREATE TABLE author_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text,
  requested_author_name text NOT NULL,
  additional_notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'added', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create an index for faster queries
CREATE INDEX idx_author_requests_user_id ON author_requests(user_id);
CREATE INDEX idx_author_requests_status ON author_requests(status);
CREATE INDEX idx_author_requests_created_at ON author_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE author_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can insert their own requests
CREATE POLICY "Users can insert their own author requests" ON author_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own requests
CREATE POLICY "Users can view their own author requests" ON author_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Optional: Allow users to update their own pending requests
CREATE POLICY "Users can update their own pending requests" ON author_requests
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_author_requests_updated_at 
  BEFORE UPDATE ON author_requests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
