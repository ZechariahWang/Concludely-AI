import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') 
    .setProject('68aa6487001bd857be83'); 

export const account = new Account(client);
export const databases = new Databases(client);

export default client;
