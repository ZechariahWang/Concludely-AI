# Appwrite Database Setup Guide

This guide will help you set up the necessary database collections and permissions in Appwrite for your journaling app.

## Prerequisites

1. An Appwrite account and project
2. Your project ID (already configured in `appwrite.js`)

## Step 1: Create Database

1. Go to your Appwrite Console
2. Navigate to **Databases** in the left sidebar
3. Click **Create Database**
4. Name it: `journaling-app-db`
5. Copy the Database ID and update it in `services/userProfile.js`

## Step 2: Create Collections

### Important: Unlimited Text Fields

When creating String attributes for content and bio fields, make sure to set the **Size** field to **"Unlimited"** instead of a specific character limit. This allows users to write journal entries of any length.

**How to set unlimited size:**
1. When creating a String attribute, you'll see a "Size" field with a text input and dropdown arrow
2. Click on the "Size" field (it shows "Enter size" as placeholder)
3. You have two options:
   - **Option 1**: Type a very large number like `1000000` (one million) to effectively make it unlimited
   - **Option 2**: Click the dropdown arrow and look for an "Unlimited" option
4. This applies to both the `content` field in journals and `bio` field in user profiles

### Collection 1: Users

1. In your database, click **Create Collection**
2. Name: `users`
3. Collection ID: `users`
4. Permissions: Set to **Document Owner** for all operations

**Attributes to add:**

| Name | Type | Required | Default | Array |
|------|------|----------|---------|-------|
| userId | String | Yes | - | No |
| name | String | Yes | - | No |
| email | String | Yes | - | No |
| profilePicture | String | No | - | No |
| bio | String | No | - | No | **Size: Unlimited** |
| dateOfBirth | String | No | - | No |
| preferences | String | No | `{"theme":"light","notifications":true,"privacy":"private"}` | No |
| createdAt | String | Yes | - | No |
| updatedAt | String | Yes | - | No |

### Collection 2: Journals

1. In your database, click **Create Collection**
2. Name: `journals`
3. Collection ID: `journals`
4. Permissions: Set to **Document Owner** for all operations

**Attributes to add:**

| Name | Type | Required | Default | Array |
|------|------|----------|---------|-------|
| userId | String | Yes | - | No |
| title | String | Yes | - | No |
| content | String | Yes | - | No | **Size: Unlimited** |
| mood | String | No | `neutral` | No |
| tags | String | No | - | Yes |
| isPrivate | Boolean | No | `false` | No |
| createdAt | String | Yes | - | No |
| updatedAt | String | Yes | - | No |

## Step 3: Update Configuration

Update the `DATABASE_ID` in `services/userProfile.js`:

```javascript
const DATABASE_ID = 'your-actual-database-id'; // Replace with your database ID
```

## Step 4: Set Up Permissions

### How to Configure Permissions:

1. **Go to your collection** (users or journals)
2. **Click on "Settings"** or find the "Permissions" section
3. **In the Permissions section**, you'll see a large empty box with a "+" icon and "Add a role to get started"
4. **Click the "+" icon** to add a new role
5. **Configure the following roles for each collection:**

### For Users Collection:

**Add these roles:**
- **Role**: Select **"All users"** from the dropdown menu
- **Permissions**: 
  - ✅ **Create** - Allow users to create their own profile
  - ✅ **Read** - Allow users to read their own profile
  - ✅ **Update** - Allow users to update their own profile
  - ✅ **Delete** - Allow users to delete their own profile

### For Journals Collection:

**Add these roles:**
- **Role**: Select **"All users"** from the dropdown menu
- **Permissions**:
  - ✅ **Create** - Allow users to create journal entries
  - ✅ **Read** - Allow users to read their own journal entries
  - ✅ **Update** - Allow users to update their own journal entries
  - ✅ **Delete** - Allow users to delete their own journal entries

### Document Security Setting:

1. **Find the "Document security" section**
2. **Toggle it ON** (enable document security)
3. **This ensures** that users can only access their own documents
4. **Click "Update"** to save the settings

### Important Notes:

- **Document security must be enabled** for user-specific permissions to work
- **Users can only access their own data** when document security is enabled
- **The `userId` field** in your documents determines ownership
- **Click "Update"** after making any permission changes

## Step 5: Create Indexes (Optional but Recommended)

### For Users Collection:
- Create index on `userId` (attribute)
- Create index on `email` (attribute)

### For Journals Collection:
- Create index on `userId` (attribute)
- Create index on `createdAt` (attribute)
- Create index on `mood` (attribute)
- Create full-text index on `title` (attribute)

## Step 6: Test the Setup

1. Run your app: `npm start`
2. Create a new account
3. Check if the user profile is created automatically
4. Try creating a journal entry
5. Verify data appears in your Appwrite console

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Make sure you've set the correct permissions for each collection
2. **Database Not Found**: Verify the database ID is correct in `userProfile.js`
3. **Collection Not Found**: Check that collection IDs match exactly
4. **Authentication Issues**: Ensure your project ID is correct in `appwrite.js`

### Error Messages:

- `Collection not found`: Check collection ID spelling
- `Database not found`: Verify database ID
- `Permission denied`: Review collection permissions
- `Invalid attribute`: Check attribute names and types

## Security Best Practices

1. **Always use document owner permissions** for user-specific data
2. **Validate data on the client side** before sending to Appwrite
3. **Use environment variables** for sensitive configuration
4. **Regularly review permissions** and access patterns
5. **Monitor usage** through Appwrite analytics

## Next Steps

Once your database is set up:

1. Test all CRUD operations
2. Add more features like:
   - File uploads for profile pictures
   - Search functionality
   - Data export/import
   - Backup and restore
3. Consider adding:
   - Real-time updates
   - Push notifications
   - Data analytics

## Support

If you encounter issues:

1. Check the [Appwrite Documentation](https://appwrite.io/docs)
2. Review the [Appwrite Console](https://console.appwrite.io/) for error logs
3. Test with the [Appwrite SDK Playground](https://appwrite.io/docs/sdks)
4. Join the [Appwrite Discord](https://discord.gg/appwrite) for community support
