

export interface MenuItem {
    $id: string;
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
    $createdAt : string
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

export interface Category {
    $id: string;
    name: string;
    description: string;
}

export interface CartStore {
    items: CartItemType[];
    addItem: (item: Omit<CartItemType, "quantity">) => void;
    removeItem: (id: string, customizations: CartCustomization[]) => void;
    increaseQty: (id: string, customizations: CartCustomization[]) => void;
    decreaseQty: (id: string, customizations: CartCustomization[]) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}


export interface CartCustomization {
    id: string;
    name: string;
    price: number;
    type: string;
}


export interface PaymentInfoStripeProps {
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
}
