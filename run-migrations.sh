#!/bin/bash
# Bash script to run migrations
# Usage: ./run-migrations.sh

echo "=== Mini QMS Database Migration Script ==="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ] && [ -z "$POSTGRES_URL" ]; then
    echo "❌ No DATABASE_URL or POSTGRES_URL found!"
    echo ""
    echo "Please either:"
    echo "1. Set DATABASE_URL environment variable, OR"
    echo "2. Pull from Vercel: vercel env pull .env.local"
    echo "3. Or provide URL when running:"
    echo "   DATABASE_URL='your-url' ./run-migrations.sh"
    exit 1
fi

# Use POSTGRES_URL if DATABASE_URL not set
if [ -z "$DATABASE_URL" ] && [ -n "$POSTGRES_URL" ]; then
    echo "✅ POSTGRES_URL found, using it as DATABASE_URL"
    export DATABASE_URL="$POSTGRES_URL"
fi

echo ""
echo "Step 1: Pushing Prisma schema to database..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Schema push failed!"
    exit 1
fi

echo ""
echo "Step 2: Seeding ISO 9001 clauses..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Seed failed!"
    exit 1
fi

echo ""
echo "✅ Migrations completed successfully!"
echo ""
echo "Next steps:"
echo "1. Create your first user (via Prisma Studio or SQL)"
echo "2. Deploy to Vercel or run locally"
