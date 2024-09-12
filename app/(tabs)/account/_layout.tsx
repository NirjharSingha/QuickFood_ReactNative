import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { styled } from 'nativewind';
import { SafeAreaView, View, ScrollView, TouchableOpacity, Button, Image, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { usePathname, useRouter } from 'expo-router';
import UserImage from '@/assets/images/user.png';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState } from 'react';
import Password from '@/components/password';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
    const StyledView = styled(View);
    const StyledText = styled(Text);
    const pathname = usePathname();
    const router = useRouter();
    const { primaryBlue } = Colors.light;
    const [visible, setVisible] = useState(false);

    // Custom drawer content component
    const CustomDrawerContent = ({ }: { navigation: any }) => {
        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
                <Password visible={visible} setVisible={setVisible} />
                {/* First Row: Scrollable Content */}
                <ScrollView style={{ flex: 1 }}>
                    <StyledView className="bg-white p-4">
                        {/* Account Section */}
                        <StyledView className='m-1 rounded-lg bg-gray-300 shadow-md shadow-gray-400 pt-3 pb-3'>
                            <StyledView className="flex-row justify-center items-center mb-2 gap-3">
                                <Image source={UserImage} style={{ width: 35, height: 35, borderRadius: 9999 }} />
                                <StyledText className="text-center text-gray-600 text-lg sm:text-xl font-bold">
                                    Account
                                </StyledText>
                            </StyledView>
                            <StyledView className="mb-2 w-full flex-row gap-2 justify-center items-center" style={{ marginLeft: -4 }}>
                                <StyledView className="w-[35%] h-[2px] bg-gray-600 rounded-full" />
                                <Entypo name="code" size={24} color="rgb(75,85,99)" />
                                <StyledView className="w-[35%] h-[2px] bg-gray-600 rounded-full" />
                            </StyledView>
                            <StyledText className="text-center text-gray-600 text-xs sm:text-sm font-bold">
                                Manage Your Account
                            </StyledText>
                        </StyledView>

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
                                <StyledText className='font-bold text-base' style={{ color: pathname === "/account/notifications" ? primaryBlue : 'gray', margin: 0 }}>Notifications</StyledText>
                            </StyledView>
                        </TouchableOpacity>
                    </StyledView>
                </ScrollView>

                {/* Second Row: Logout Button */}
                <TouchableOpacity style={{ padding: 6 }} onPress={async () => {
                    await AsyncStorage.removeItem("token");
                    await AsyncStorage.removeItem("role");
                    router.replace("/auth/login");
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={({ navigation }) => ({
                    drawerPosition: 'right',
                    header: () =>
                        <StyledView className="bg-[#D6C5B7] px-3 py-1 flex-row justify-between items-center w-full">
                            <Header />
                            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                                <MaterialIcons
                                    name="menu"
                                    size={28}
                                />
                            </TouchableOpacity>
                        </StyledView>
                })}
                drawerContent={(props) => <CustomDrawerContent {...props} />} // Custom drawer content
            />
        </GestureHandlerRootView>
    );
}
