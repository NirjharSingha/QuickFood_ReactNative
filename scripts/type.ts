export type ProfileDataType = {
    name: string;
    address: string;
    phoneNum: string;
    image: string;
}

export type MenuType = {
    id: number;
    restaurantId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    category: string;
}

export type RestaurantCardType = {
    id: string;
    name: string;
    address: string;
    image: string;
}

export type OrderCardType = {
    id: number;
    restaurantName: string;
    restaurantPic: string;
    price: number;
    paymentMethod: string;
    timestamp: string | number | Date;
}

export type OrderDetailsType = {
    customerName: string;
    riderName: string;
    restaurantName: string;
    paymentMethod: string;
    orderPlaced: any;
    deliveryTaken: any;
    userNotified: any;
    deliveryCompleted: any;
    deliveryAddress: string;
    isPrepared: boolean;
    price: number;
    deliveryFee: number;
    menuItems: MenuType[];
} | null;

export type CartType = {
    restaurantId: string;
    selectedMenu: {
        selectedMenuId: number;
        selectedMenuQuantity: number;
    }[]
    total?: number;
}

export type OrderTableType = {
    id: number
    name: string
    price: number
    image: string
    quantity: number
}