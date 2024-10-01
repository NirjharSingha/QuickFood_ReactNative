import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { CustomDrawer, DrawerHeader } from '@/components/Drawer';
import FoodBucket from '@/assets/images/FoodBucket.jpg';
import MenuDialog from '@/components/Dialogs/MenuDialog';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useGlobal } from '@/contexts/Globals';

export default function Layout() {
    const StyledView = styled(View);
    const StyledText = styled(Text);
    const pathname = usePathname();
    const router = useRouter();
    const { primaryBlue } = Colors.light;
    const [visible, setVisible] = useState(false);
    const { cartCount } = useGlobal();

    // Custom drawer content component
    const CustomDrawerContent = ({ }: { navigation: any }) => {
        return (
            <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                <StyledView className="bg-white p-4">
                    <MenuDialog visible={visible} setVisible={setVisible} menu={{ id: 0, name: '', category: '', price: 0, quantity: 0, image: '' }} />

                    <DrawerHeader image={FoodBucket} title="Orders" text="Manage your orders" />
                    <TouchableOpacity onPress={() => router.push("/order")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname.startsWith("/order") && !pathname.includes('/status') && !pathname.includes('/rating') && !pathname.includes('/cart') && !pathname.includes('/chat') ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                            <FontAwesome6 name="bowl-food" size={24} color={pathname.startsWith("/order") && !pathname.includes('/status') && !pathname.includes('/rating') && !pathname.includes('/cart') && !pathname.includes('/chat') ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname.startsWith("/order") && !pathname.includes('/status') && !pathname.includes('/rating') && !pathname.includes('/cart') && !pathname.includes('/chat') ? primaryBlue : 'gray', margin: 0 }}>Order Food</StyledText>
                        </StyledView>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/order/status")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/order/status" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                            <Ionicons name="stats-chart" size={24} color={pathname === "/order/status" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/order/status" ? primaryBlue : 'gray', margin: 0 }}>Order Status</StyledText>
                        </StyledView>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/order/rating")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/order/rating" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                            <AntDesign name="star" size={24} color={pathname === "/order/rating" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/order/rating" ? primaryBlue : 'gray', margin: 0 }}>Give Rating</StyledText>
                        </StyledView>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/order/cart")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/order/cart" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                            <FontAwesome5 name="shopping-cart" size={24} color={pathname === "/order/cart" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/order/cart" ? primaryBlue : 'gray', margin: 0 }}>Cart {`${cartCount > 0 ? `(${cartCount})` : ''}`}</StyledText>
                        </StyledView>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/order/chat")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/order/chat" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                            <Ionicons name="chatbubble-ellipses" size={24} color={pathname === "/order/chat" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/order/chat" ? primaryBlue : 'gray', margin: 0 }}>Chat Room</StyledText>
                        </StyledView>
                    </TouchableOpacity>
                </StyledView>
            </ScrollView >
        );
    };

    return (
        <CustomDrawer drawerContent={(props) => <CustomDrawerContent {...props} />} />
    );
}
