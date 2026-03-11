
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