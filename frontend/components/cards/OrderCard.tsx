import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { styled } from 'nativewind'
import { OrderCardType } from '@/scripts/type'
import { useGlobal } from '@/contexts/Globals'
import { useRouter, usePathname } from 'expo-router'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)

interface OrderCardProps {
    order: OrderCardType;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const { setSelectedOrder, setShowOrderDialog } = useGlobal()
    const pathname = usePathname()
    const router = useRouter()

    const handlePress = () => {
        if (pathname === "/order/rating") {
            router.push(`/order/rating/${order.id}`)
            return;
        }
        setSelectedOrder(order.id);
        setShowOrderDialog(true);
    }

    return (
        <StyledView className={`w-full max-w-[280px] mx-auto rounded-lg shadow-md bg-base-100 border-2 border-gray-200 bg-white pb-[6px] mb-3`}>
            <StyledImage
                source={order.restaurantPic ? { uri: `data:image/jpeg;base64,${order.restaurantPic}` } : require("@/assets/images/Restaurant.jpeg")}
                alt="logo"
                className="bg-red-100 w-full h-[170px] rounded-tl-lg rounded-tr-lg border-b-2 border-b-gray-200"
            />
            <StyledText className="font-bold text-gray-700 mt-2 pl-3 pr-3" style={{ fontSize: 18 }}>
                {order.restaurantName}
            </StyledText>
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Total : {order.price} Tk
            </StyledText>
            {pathname !== '/order/rating' &&
                <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                    Payment : {order.paymentMethod === "COD" ? "COD" : "Done"}
                </StyledText>
            }
            {pathname === '/order/rating' &&
                <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                    Payment Method : {order.paymentMethod === "COD" ? "COD" : "Online"}
                </StyledText>
            }
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Date : {new Date(order.timestamp).toLocaleString()}
            </StyledText>
            <TouchableOpacity style={{ padding: 3, marginTop: 4, marginHorizontal: 4 }} onPress={handlePress}>
                <StyledView className='flex-row bg-blue-500 py-[3px] items-center justify-center rounded-md'>
                    <StyledText className='text-white font-bold text-base' style={{ fontSize: 13 }}>{pathname === '/order/rating' ? 'Give Rating' : 'Show Details'}</StyledText>
                </StyledView>
            </TouchableOpacity>
        </StyledView>
    );
};