# Leidingsportaal Role-Based Access Control Setup

## Overview

The leidingsportaal (leadership portal) is now protected with role-based access control. Only users with the "leiding" or "admin" role can access these pages.

## Available Roles

### 1. "leiding" Role
- Access to all leidingsportaal pages
- Can manage members, groups, and work years
- Standard leadership permissions

### 2. "admin" Role
- **Full access to any page** (including leidingsportaal)
- Can access any part of the application
- Highest level of permissions
- Can perform any administrative action

## How to Set Up Roles in Clerk

### 1. Access Clerk Dashboard
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application

### 2. Configure User Metadata
1. Navigate to **Users** in the sidebar
2. Select a user who should have leidingsportaal access
3. Click on **Metadata** tab
4. Add a new metadata field:
   - **Key**: `role`
   - **Value**: `leiding` OR `admin`
5. Save the changes

### 3. Alternative: Use Clerk's Role System (Recommended)
1. Navigate to **Roles & Permissions** in the sidebar
2. Create roles called "leiding" and "admin"
3. Assign these roles to users who should have access

## Role Hierarchy

```
admin > leiding > no access
```

- **admin** users can access everything
- **leiding** users can access leidingsportaal pages
- Users without these roles cannot access protected pages

## How It Works

### Authentication Flow
- Users are redirected to `/sign-in` if not authenticated
- The sign-in page uses Clerk's built-in `SignIn` component with catch-all routing
- After successful authentication, users are redirected back to the original page
- Role checking happens after authentication at the page level

### Server-Side Protection
- All leidingsportaal pages use `requireLeidingAuth()` to check user roles
- This function checks for both "leiding" AND "admin" roles
- If a user doesn't have either role, they're redirected to `/unauthorized`
- This happens before any sensitive data is loaded

### Protected Routes
The following routes are now protected:
- `/leidingsportaal` - Main portal
- `/leidingsportaal/inschrijven` - Member registration
- `/leidingsportaal/leden` - Member list
- `/leidingsportaal/leden/[id]` - Member details
- `/leidingsportaal/groepen` - Group management
- `/leidingsportaal/groepen/[id]` - Group details
- `/leidingsportaal/werkjaren` - Work year management

### Authentication Pages
- `/sign-in/[[...sign-in]]` - Clerk's sign-in component (catch-all route)
- `/sign-up/[[...sign-up]]` - Clerk's sign-up component (catch-all route)
- `/unauthorized` - Custom unauthorized access page

### Middleware Configuration
- Uses Clerk's basic middleware for authentication
- No custom route protection in middleware to avoid conflicts
- All role-based access control is handled at the page level
- This prevents redirect loops and ensures proper Clerk integration

### Unauthorized Access
- Users without the required roles see a friendly unauthorized page
- They can navigate back to the homepage or try again
- No sensitive information is exposed

## Security Benefits

1. **Data Protection**: Member information, medical data, and contact details are protected
2. **Role-Based Access**: Only authorized leadership members can access sensitive data
3. **Admin Override**: Admin users have full access for emergency situations
4. **Audit Trail**: Clerk provides logging of authentication attempts
5. **Easy Management**: Roles can be managed through Clerk's dashboard
6. **Secure Authentication**: Uses Clerk's battle-tested authentication system
7. **Proper Clerk Integration**: Uses catch-all routes as recommended by Clerk

## Troubleshooting

### User Can't Access Leidingsportaal
1. Check if the user is signed in
2. Verify the user has either "leiding" or "admin" role in their metadata
3. Check Clerk logs for any authentication issues

### Role Not Working
1. Ensure the metadata key is exactly `role`
2. Ensure the metadata value is exactly `leiding` or `admin`
3. Clear browser cache and try again
4. Check if the user is properly authenticated

### Admin Access Issues
1. Verify the admin user has the exact role value `admin`
2. Check if there are any conflicting role assignments
3. Ensure the user is properly authenticated

### Sign-In Issues
1. Verify Clerk is properly configured in your environment
2. Check that the sign-in page is accessible at `/sign-in`
3. Ensure Clerk's publishable key is set correctly
4. Verify the catch-all route structure: `/sign-in/[[...sign-in]]/page.tsx`

### Clerk Component Errors
1. Ensure you're using catch-all routes for sign-in and sign-up
2. Check that middleware isn't blocking auth routes
3. Verify Clerk environment variables are set correctly
4. Clear browser cache and try again

## Future Enhancements

- Add more granular permissions (e.g., read-only vs. full access)
- Implement audit logging for data access
- Add role-based UI elements (show/hide certain features)
- Create admin interface for role management
- Add role-based feature flags for different functionality levels
- Customize Clerk's sign-in/sign-up appearance to match your brand 