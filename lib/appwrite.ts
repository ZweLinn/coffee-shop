
import { CartCustomization, CreateOrderParams, GetMenuParams, OrderResult } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig ={
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform : "com.zwe.coffee_shop",
    project: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId : process.env.EXPO_PUBLIC_APPWRITE_DATABSE_ID!,
    bucketId : "69b12c2e002b2c07452e",
    usertableId : "user",
    categoriestableId : "categories",
    menutableId :"menu",
    customizationstableId : "customizations",
    menuCustomizationstableId : "menu_customizations",
    ordertableId : "order",
    orderItemstableId : "order_items"

}

export const client = new Client();
client
.setEndpoint(appwriteConfig.endpoint)
.setProject(appwriteConfig.project)
.setPlatform(appwriteConfig.platform)


export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
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
            appwriteConfig. usertableId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
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

export const signOut = async () => {
    try{
        await account.deleteSessions();
    }catch(e){
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
            appwriteConfig.usertableId,
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

export const getMenu = async({  category, query} : GetMenuParams ) =>{
    try{
        const queries  : string[]= [];
        
        if(category){
            queries.push(Query.equal("categories" , category));
        }
        if(query){
            queries.push(Query.search("name" , query));
        }

        const menus = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menutableId,
            queries,
        )

        return menus.documents;
    }catch (e){
        throw new Error(e as string);
    }

}

export const getMenuById = async (id: string) => {
    try {
        const menu = await database.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menutableId,
            id
        );

        return menu;
    } catch (e) {
        throw new Error(e as string);
    }
}
export const getMenuCustomizations = async (menuId: string) => {
  try {
    // Step 1: Get junction table rows for this menu
    const result = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCustomizationstableId,
      [Query.equal("menu", menuId)]
    );

    // Step 2: Extract customization IDs
    const customizationIds = result.documents.map((doc) => doc.customizations);

    if (customizationIds.length === 0) return [];

    // Step 3: Fetch all customization documents by their IDs
    const customizationDocs = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.customizationstableId,
      [Query.equal("$id", customizationIds)]
    );

    return customizationDocs.documents;
  } catch (e) {
    throw new Error(e as string);
  }
};


export const getCategories = async () => {
    try {
        const categories = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriestableId,
        )

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
    
}

export const createOrder = async ({
  userId,
  items,
  totalPrice,
  deliveryFee = 1000,
  discount = 500,
  note = "",
}: CreateOrderParams): Promise<OrderResult> => {
  try {
    // 1. Create the parent order document
    const order = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordertableId,   // add "orderstableId" to appwriteConfig
      ID.unique(),
      {
        userId,
        status: "pending",
        totalPrice,
        deliveryFee,
        discount,
        note,
      }
    );
 
    // 2. Create one order_item document per cart item (in parallel)
    const orderItemPromises = items.map((item) => {
      const customizationPrice =
        item.customizations?.reduce(
          (sum: number, c: CartCustomization) => sum + c.price,
          0
        ) ?? 0;
 
      const itemTotal = item.quantity * (item.price + customizationPrice);
 
      return database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.orderItemstableId, // add "orderItemstableId" to appwriteConfig
        ID.unique(),
        {
          order : order.$id,
          menuName: item.name,
          quantity: item.quantity,
          basePrice: item.price,
          // Store customizations as a JSON string (Appwrite has no array-of-objects type)
          customizations: item.customizations
            ? JSON.stringify(item.customizations)
            : "[]",
          itemTotal,
        }
      );
    });
 
    await Promise.all(orderItemPromises);
 
    return {
      orderId: order.$id,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.$createdAt,
    };
  } catch (e) {
    throw new Error(e as string);
  }
};
 