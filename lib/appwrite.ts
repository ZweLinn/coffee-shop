
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig ={
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform : "com.zwe.coffee_shop",
    project: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId : "69ae7fd30019eca95694",
    tableId : "user"
}

export const client = new Client();
client
.setEndpoint(appwriteConfig.endpoint)
.setProject(appwriteConfig.project)
.setPlatform(appwriteConfig.platform)


const account = new Account(client);
const database = new Databases(client);
const avatar = new Avatars(client);

interface CreateUserPrams {
    email: string;
    password: string;
    name: string;
    confirmPassword : string
}

interface SignInParams {
    email: string;
    password: string;
}



export const createUser = async ({email , password , name , confirmPassword}: CreateUserPrams) => {
    try{
        if(password !== confirmPassword){
            throw new Error("Password doesn't match");
        }
        const newAccount = await account.create(ID.unique(), email, password);
        if (!newAccount){
            throw new Error("Failed to create user");
        }
        await SignIn({email , password})

        const avatarUrl = await avatar.getInitialsURL(name);

          return await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig. tableId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avwatar: avatarUrl }
        );

        
    }catch(e){

        throw new Error(e as string);

    }
}

export const SignIn = async ({email , password}: SignInParams) => {
    try{
        const session = await account.createEmailPasswordSession(email , password);
        if(!session){
            throw new Error("Failed to sign in");
        }
        return session

    }catch (e){
        throw new Error(e as string);
    }
}

export const getCurrentUser = async() =>{
    try{
        const currentAccount = await account.get();
        if(!currentAccount){
            throw new Error("Failed to get current user");
        }
        
        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tableId,
            [
                Query.equal("accountId" , currentAccount.$id)
            ]
        );
        if(!currentUser){
            throw new Error("Failed to get current user");
        }

        return currentUser.documents[0];

    }catch(e){
        throw new Error(e as string);
    }
}
