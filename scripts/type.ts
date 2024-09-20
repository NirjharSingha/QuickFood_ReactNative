export type ProfileDataType = {
    name: string;
    address: string;
    phoneNum: string;
    image: string;
}

export type MenuType = {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    category: string;
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
    customerName?: string;
    riderName?: string;
    restaurantName?: string;
    paymentMethod?: string;
    orderPlaced?: any;
    deliveryTaken?: string;
    userNotified?: string;
    deliveryCompleted?: string;
    menuItems?: MenuType[];
};