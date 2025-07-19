-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bassins table
CREATE TABLE bassins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  fish_type VARCHAR(100) NOT NULL,
  capacity VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'excellent' CHECK (status IN ('excellent', 'good', 'warning', 'poor')),
  description TEXT,
  date_created DATE DEFAULT CURRENT_DATE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Water quality readings table
CREATE TABLE water_quality_readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bassin_id UUID REFERENCES bassins(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  temperature DECIMAL(5,2) NOT NULL,
  turbidity DECIMAL(5,2) NOT NULL,
  dissolved_oxygen DECIMAL(5,2) NOT NULL,
  bod DECIMAL(5,2) NOT NULL,
  co2 DECIMAL(5,2) NOT NULL,
  ph DECIMAL(4,2) NOT NULL,
  alkalinity DECIMAL(6,2) NOT NULL,
  hardness DECIMAL(6,2) NOT NULL,
  calcium DECIMAL(6,2) NOT NULL,
  ammonia DECIMAL(6,3) NOT NULL,
  nitrite DECIMAL(6,3) NOT NULL,
  phosphorus DECIMAL(5,2) NOT NULL,
  h2s DECIMAL(6,3) NOT NULL,
  plankton INTEGER NOT NULL,
  water_quality VARCHAR(20) NOT NULL CHECK (water_quality IN ('Excellent', 'Good', 'Fair', 'Poor')),
  status VARCHAR(20) NOT NULL,
  active_alerts INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bassin_id UUID REFERENCES bassins(id) ON DELETE CASCADE,
  bassin_name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('danger', 'warning', 'info')),
  category VARCHAR(50) NOT NULL CHECK (category IN ('water_quality', 'system', 'maintenance', 'alert')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  parameters JSONB,
  action_required BOOLEAN DEFAULT false,
  auto_generated BOOLEAN DEFAULT false,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_bassins_user_id ON bassins(user_id);
CREATE INDEX idx_bassins_is_active ON bassins(is_active);
CREATE INDEX idx_water_quality_bassin_id ON water_quality_readings(bassin_id);
CREATE INDEX idx_water_quality_timestamp ON water_quality_readings(timestamp DESC);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp DESC);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bassins ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_quality_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own bassins" ON bassins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bassins" ON bassins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bassins" ON bassins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bassins" ON bassins FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view readings for own bassins" ON water_quality_readings FOR SELECT 
  USING (bassin_id IN (SELECT id FROM bassins WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert readings for own bassins" ON water_quality_readings FOR INSERT 
  WITH CHECK (bassin_id IN (SELECT id FROM bassins WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON alerts FOR DELETE USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO users (id, email, name, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@aquaculture.com', 'John Doe', 'Farm Manager'),
  ('550e8400-e29b-41d4-a716-446655440001', 'manager@aquaculture.com', 'Jane Smith', 'Operations Manager'),
  ('550e8400-e29b-41d4-a716-446655440002', 'operator@aquaculture.com', 'Mike Johnson', 'System Operator');

INSERT INTO bassins (id, name, location, fish_type, capacity, status, description, user_id) VALUES 
  ('bassin-1', 'Bassin Alpha', 'North Section', 'Salmon', '50,000L', 'excellent', 'Primary salmon breeding bassin', '550e8400-e29b-41d4-a716-446655440000'),
  ('bassin-2', 'Bassin Beta', 'East Section', 'Trout', '35,000L', 'good', 'Secondary trout cultivation bassin', '550e8400-e29b-41d4-a716-446655440000'),
  ('bassin-3', 'Bassin Gamma', 'South Section', 'Bass', '42,000L', 'warning', 'Bass breeding facility', '550e8400-e29b-41d4-a716-446655440000');
