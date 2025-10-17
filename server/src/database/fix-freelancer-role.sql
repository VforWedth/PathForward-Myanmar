-- Check current role for freelancer1@gmail.com
SELECT id, email, role, "isVerified", "isActive", "createdAt"
FROM users
WHERE email = 'freelancer1@gmail.com';

-- If the role is wrong (not 'freelancer'), update it:
UPDATE users
SET role = 'freelancer'
WHERE email = 'freelancer1@gmail.com' AND role != 'freelancer';

-- Verify the update
SELECT id, email, role, "isVerified", "isActive"
FROM users
WHERE email = 'freelancer1@gmail.com';

-- Check if freelancer profile exists
SELECT f.id, f."userId", f."firstName", f."lastName", f.skills, f."verificationStatus"
FROM freelancers f
INNER JOIN users u ON f."userId" = u.id
WHERE u.email = 'freelancer1@gmail.com';
