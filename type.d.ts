

export interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    is_available: boolean;
    category_name: string;
    customizations: string[];
}


export interface User extends Models.Document {
    name: string;
    email: string;
    avatar: string;
}

export interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}

export interface GetMenuParams {
    category: string;
    query: string;
}