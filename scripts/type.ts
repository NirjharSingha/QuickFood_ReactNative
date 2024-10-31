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

export type RatingPageType = {
    restaurantName: string;
    restaurantPic: string;
    menuItems: {
        id: number;
        name: string;
        image: string;
    }[];
} | null;

export type ChatFileType = {
    id?: number;
    data: string;
    fileType: string;
}

export type ChatCardType = {
    id: number;
    roomId: number;
    message: string;
    senderId: string;
    receiverId: string;
    timestamp: any;
    isEdited: boolean;
    isSeen: boolean;
    reaction: string | null;
    files: {
        id: number;
        data: string;
        fileType: string;
    }[];
    prevFiles: number[];
}

export type MenuItemType = {
    menuId: number
    menuName: string,
    price: number,
    image: string,
    quantity: number
}

export type stackData = {
    stacks: { value: number, color: string }[],
    label: string
}

export type deliverData = {
    name: string;
    successDeliveries: number;
    lateDeliveries: number;
    complaintDeliveries: number;
    bothIssues: number;
}