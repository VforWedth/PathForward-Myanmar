-- Fix Application table schema
-- This removes old foreign key columns and ensures the polymorphic relationship is correct

-- First, drop the old foreign key constraints if they exist
ALTER TABLE applications
DROP CONSTRAINT IF EXISTS applications_studentId_fkey;

ALTER TABLE applications
DROP CONSTRAINT IF EXISTS applications_freelancerId_fkey;

-- Drop the old columns if they exist
ALTER TABLE applications
DROP COLUMN IF EXISTS "studentId";

ALTER TABLE applications
DROP COLUMN IF EXISTS "freelancerId";

-- Verify the table now has the correct polymorphic structure
-- It should have: applicantId (UUID) and applicantType (ENUM)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'applications'
ORDER BY ordinal_position;
