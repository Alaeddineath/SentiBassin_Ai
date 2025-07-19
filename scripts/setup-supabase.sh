#!/bin/bash

# Install Supabase dependencies
npm install @supabase/supabase-js

# Create environment variables file
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EOF

echo "✅ Supabase setup complete!"
echo "📝 Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Run the SQL schema in your Supabase SQL editor"
echo "3. Update .env.local with your Supabase URL and key"
echo "4. Replace imports in your API routes to use the new database"
