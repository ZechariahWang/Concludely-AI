import { Client, Account, Databases, Storage } from 'appwrite';
import {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    APPWRITE_DATABASE_ID,
    APPWRITE_USERS_COLLECTION_ID,
    APPWRITE_JOURNALS_COLLECTION_ID,
    APPWRITE_PROFILE_PICTURES_BUCKET_ID
} from '@env';

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export configuration constants
export const config = {
    endpoint: APPWRITE_ENDPOINT,
    projectId: APPWRITE_PROJECT_ID,
    databaseId: APPWRITE_DATABASE_ID,
    usersCollectionId: APPWRITE_USERS_COLLECTION_ID,
    journalsCollectionId: APPWRITE_JOURNALS_COLLECTION_ID,
    profilePicturesBucketId: APPWRITE_PROFILE_PICTURES_BUCKET_ID
};

export default client;
