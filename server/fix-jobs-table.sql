-- Add missing columns to jobs table
-- Run this with: psql -d your_database_name -f fix-jobs-table.sql

-- Add targetUniversities column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'targetUniversities'
    ) THEN
        ALTER TABLE jobs 
        ADD COLUMN "targetUniversities" UUID[] DEFAULT ARRAY[]::UUID[];
        
        COMMENT ON COLUMN jobs."targetUniversities" IS 
            'Array of university IDs that can see this job posting';
        
        RAISE NOTICE 'Added targetUniversities column';
    ELSE
        RAISE NOTICE 'targetUniversities column already exists';
    END IF;
END $$;

-- Add isPublic column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'isPublic'
    ) THEN
        ALTER TABLE jobs 
        ADD COLUMN "isPublic" BOOLEAN DEFAULT true;
        
        COMMENT ON COLUMN jobs."isPublic" IS 
            'If true, job is visible to all. If false, only target universities can see it';
        
        RAISE NOTICE 'Added isPublic column';
    ELSE
        RAISE NOTICE 'isPublic column already exists';
    END IF;
END $$;

-- Verify the columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name IN ('targetUniversities', 'isPublic');
