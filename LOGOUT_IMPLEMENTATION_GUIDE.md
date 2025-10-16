# Logout System Implementation Guide

## Overview
This guide explains how to implement the enhanced logout system across all dashboards in the application.

## Features Implemented

### 1. Logout Confirmation Dialog
- Similar to Gmail, Facebook, LinkedIn
- Prevents accidental logouts
- Shows loading state during logout process

### 2. Session Timeout Warning
- Warns users 5 minutes before session expires (configurable)
- Allows users to extend their session
- Similar to enterprise applications (Gmail, AWS Console, etc.)

### 3. Smooth UX
- Preserves "Remember Me" email after logout
- Stores redirect URL for seamless return after login
- Loading indicators and smooth transitions

## How to Implement in Other Dashboards

### Step 1: Import Required Components

```tsx
import LogoutConfirmDialog from "@/components/LogoutConfirmDialog";
import { useLogout } from "@/hooks/useLogout";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";
```

### Step 2: Replace Direct Logout Calls

**Before:**
```tsx
const { logout } = useAuthStore();

<button onClick={logout}>Logout</button>
```

**After:**
```tsx
const { initiateLogout, confirmLogout, cancelLogout, showConfirm, isLoggingOut } = useLogout();

<button onClick={initiateLogout}>Logout</button>

<LogoutConfirmDialog
  isOpen={showConfirm}
  onConfirm={confirmLogout}
  onCancel={cancelLogout}
  isLoading={isLoggingOut}
/>
```

### Step 3: Add Session Timeout Warning

Add this at the top level of your dashboard (inside AuthGuard):

```tsx
<AuthGuard requiredRole="your-role">
  <SessionTimeoutWarning />
  {/* rest of your dashboard */}
</AuthGuard>
```

## Configuration Options

### Session Timeout Warning
You can customize the timeout behavior:

```tsx
<SessionTimeoutWarning
  warningTimeMinutes={5}      // Show warning 5 minutes before timeout
  sessionTimeoutMinutes={60}   // 60 minute sessions
/>
```

## Files to Update

Apply the pattern shown in `src/app/university/dashboard/page.tsx` to:

1. ✅ `src/app/university/dashboard/page.tsx` - **DONE**
2. `src/app/admin/dashboard/page.tsx`
3. `src/app/student/dashboard/page.tsx`
4. `src/app/company/dashboard/page.tsx`
5. `src/app/freelancer/dashboard/page.tsx`

For sidebar components:
1. `src/components/ui/company/app-sidebar.tsx`
2. `src/components/ui/university/app-sidebar.tsx`
3. `src/components/ui/freelancer/freelancer-nav.tsx`

## Key Components

### LogoutConfirmDialog
- Location: `src/components/LogoutConfirmDialog.tsx`
- Props: `isOpen`, `onConfirm`, `onCancel`, `isLoading`

### useLogout Hook
- Location: `src/hooks/useLogout.ts`
- Returns: `initiateLogout`, `confirmLogout`, `cancelLogout`, `showConfirm`, `isLoggingOut`

### SessionTimeoutWarning
- Location: `src/components/SessionTimeoutWarning.tsx`
- Props: `warningTimeMinutes` (optional), `sessionTimeoutMinutes` (optional)

## Real-World Behavior Achieved

✅ Users stay logged in across page refreshes
✅ Logout requires confirmation (prevents accidents)
✅ Loading state during logout process
✅ Remember Me email persists after logout
✅ Session timeout warnings (like enterprise apps)
✅ Smooth redirects without jarring page reloads
✅ Return to previous page after login

## Testing

1. **Logout Confirmation**: Click logout → Should show confirmation dialog
2. **Cancel Logout**: Click cancel → Should dismiss dialog and stay logged in
3. **Confirm Logout**: Click "Yes, Logout" → Should show loading, then redirect to login
4. **Session Persistence**: Login → Refresh page (F5) → Should stay logged in
5. **Session Timeout**: Wait until warning appears → Click "Stay Logged In" → Should extend session
6. **Remember Me**: Login with "Remember Me" → Logout → Email should still be filled

## Notes

- The logout confirmation dialog is mobile-responsive
- Session timeout uses localStorage timestamps
- All animations are smooth and professional
- Follows accessibility best practices
