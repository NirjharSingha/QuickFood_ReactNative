import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { CustomDrawer, DrawerHeader } from '@/components/Drawer';
import Delivery from '@/assets/images/deliveryHeader.jpg'

export default function Layout() {
    const StyledView = styled(View);
    const StyledText = styled(Text);
    const pathname = usePathname();
    const router = useRouter();
    const { primaryBlue } = Colors.light;

    // Custom drawer content component
    const CustomDrawerContent = ({ }: { navigation: any }) => {
        return (
            <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                <StyledView className="bg-white p-4">
                    <DrawerHeader image={Delivery} title="Delivery" text="Manage Your Deliveries" />

                    <TouchableOpacity onPress={() => router.push("/delivery")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === '/delivery' ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                            <MaterialIcons name="delivery-dining" size={24} color={pathname === "/delivery" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/delivery" ? primaryBlue : 'gray', margin: 0 }}>Your Delivery</StyledText>
                        </StyledView>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/delivery/chat")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/delivery/chat" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                            <Ionicons name="chatbubble-ellipses" size={24} color={pathname === "/delivery/chat" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/delivery/chat" ? primaryBlue : 'gray', margin: 0 }}>Chat Room</StyledText>
                        </StyledView>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/delivery/analytics")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/delivery/analytics" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                            <MaterialIcons name="analytics" size={26} color={pathname === "/delivery/analytics" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/delivery/analytics" ? primaryBlue : 'gray', margin: 0 }}>Analytics</StyledText>
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
