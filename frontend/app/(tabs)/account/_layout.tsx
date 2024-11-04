import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { SafeAreaView, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { usePathname, useRouter } from 'expo-router';
import UserImage from '@/assets/images/user.png';
import React, { useState } from 'react';
import Password from '@/components/Dialogs/Password';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomDrawer, DrawerHeader } from '@/components/Drawer';
import { useGlobal } from '@/contexts/Globals';

export default function Layout() {
    const StyledView = styled(View);
    const StyledText = styled(Text);
    const pathname = usePathname();
    const router = useRouter();
    const { primaryBlue } = Colors.light;
    const [visible, setVisible] = useState(false);
    const { setCartCount, setUnseenNotificationCount, unseenNotificationCount } = useGlobal();

    // Custom drawer content component
    const CustomDrawerContent = ({ }: { navigation: any }) => {
        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
                <Password visible={visible} setVisible={setVisible} />
                {/* First Row: Scrollable Content */}
                <ScrollView style={{ flex: 1 }}>
                    <StyledView className="bg-white p-4">
                        <DrawerHeader image={UserImage} title="Account" text="Manage Your Account" />

                        {/* Profile Option */}
                        <TouchableOpacity onPress={() => router.push("/account")}>
                            <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/account" ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                                <MaterialIcons name="account-circle" size={26} color={pathname === "/account" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                                <StyledText className='font-bold text-base' style={{ color: pathname === "/account" ? primaryBlue : 'gray', margin: 0 }}>Profile</StyledText>
                            </StyledView>
                        </TouchableOpacity>

                        {/* Password Option */}
                        <TouchableOpacity onPress={() => setVisible(true)}>
                            <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/account/password" ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                                <MaterialIcons name="password" size={26} color={pathname === "/account/password" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                                <StyledText className='font-bold text-base' style={{ color: pathname === "/account/password" ? primaryBlue : 'gray', margin: 0 }}>Password</StyledText>
                            </StyledView>
                        </TouchableOpacity>

                        {/* Notifications Option */}
                        <TouchableOpacity onPress={() => router.push("/account/notifications")}>
                            <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/account/notifications" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                                <Ionicons name="notifications-circle" size={26} color={pathname === "/account/notifications" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                                <StyledText className='font-bold text-base' style={{ color: pathname === "/account/notifications" ? primaryBlue : 'gray', margin: 0 }}>Notifications {`${unseenNotificationCount > 0 ? `(${unseenNotificationCount})` : ''}`}</StyledText>
                            </StyledView>
                        </TouchableOpacity>
                    </StyledView>
                </ScrollView>

                {/* Second Row: Logout Button */}
                <TouchableOpacity style={{ padding: 6 }} onPress={async () => {
                    setCartCount(0);
                    setUnseenNotificationCount(0);
                    await AsyncStorage.removeItem("token");
                    await AsyncStorage.removeItem("role");
                    await AsyncStorage.removeItem("cart");
                    await AsyncStorage.removeItem("YourRestaurant");
                    router.push("/auth/login");
                }}>
                    <StyledView className='flex-row bg-blue-500 py-[6px] items-center justify-center rounded-md mb-1'>
                        <StyledText className='text-white font-bold mr-3 text-base'>Logout</StyledText>
                        <MaterialIcons name="logout" size={24} color="white" />
                    </StyledView>
                </TouchableOpacity>
            </SafeAreaView>
        );
    };

    return (
        <CustomDrawer drawerContent={(props) => <CustomDrawerContent {...props} />} />
    );
}
