import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { styled } from 'nativewind';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { CustomDrawer, DrawerHeader } from '@/components/Drawer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ResIcon from '@/assets/images/resIcon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
    const StyledView = styled(View);
    const StyledText = styled(Text);
    const pathname = usePathname();
    const router = useRouter();
    const { primaryBlue } = Colors.light;

    // Custom drawer content component
    const CustomDrawerContent = ({ }: { navigation: any }) => {
        const [id, setId] = useState('');
        useEffect(() => {
            const getProp = async () => {
                const idStr = await AsyncStorage.getItem('YourRestaurant');
                setId(idStr as string);
            }
            getProp();
        }, [])
        return (
            <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                <StyledView className="bg-white p-4">
                    <DrawerHeader image={ResIcon} title="Restaurants" text="Manage Your Restaurants" />

                    {(pathname === '/restaurants' || pathname === '/restaurants/addRestaurant') &&
                        <View>
                            <TouchableOpacity onPress={() => router.push("/restaurants")}>
                                <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/restaurants" ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                                    <FontAwesome name="home" size={26} color={pathname === "/restaurants" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                                    <StyledText className='font-bold text-base' style={{ color: pathname === "/restaurants" ? primaryBlue : 'gray', margin: 0 }}>Your Restaurants</StyledText>
                                </StyledView>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => router.push("/restaurants/addRestaurant")}>
                                <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/restaurants/addRestaurant" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                                    <Ionicons name="add-circle" size={26} color={pathname === "/restaurants/addRestaurant" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                                    <StyledText className='font-bold text-base' style={{ color: pathname === "/restaurants/addRestaurant" ? primaryBlue : 'gray', margin: 0 }}>Add Restaurant</StyledText>
                                </StyledView>
                            </TouchableOpacity>
                        </View>
                    }

                    {pathname !== '/restaurants' && pathname !== '/restaurants/addRestaurant' &&
                        <View>
                            <TouchableOpacity onPress={() => {
                                if (id !== '') {
                                    router.push(`/restaurants/${id}/info`)
                                }
                            }}>
                                <StyledView className={`flex-row items-center px-4 py-2 ${pathname.includes("/info") ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                                    <MaterialIcons name="info" size={26} color={pathname.includes("/info") ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                                    <StyledText className='font-bold text-base' style={{ color: pathname.includes("/info") ? primaryBlue : 'gray', margin: 0 }}>Info</StyledText>
                                </StyledView>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                if (id !== '') {
                                    router.push(`/restaurants/${id}/menu`)
                                }
                            }}>
                                <StyledView className={`flex-row items-center px-4 py-2 ${pathname.includes("/menu") ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                                    <MaterialIcons name="list-alt" size={26} color={pathname.includes("/menu") ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                                    <StyledText className='font-bold text-base' style={{ color: pathname.includes("/menu") ? primaryBlue : 'gray', margin: 0 }}>Menu Items</StyledText>
                                </StyledView>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                if (id !== '') {
                                    router.push(`/restaurants/${id}/pendingOrders`)
                                }
                            }}>
                                <StyledView className={`flex-row items-center px-4 py-2 ${pathname.includes("/pendingOrders") ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                                    <MaterialIcons name="pending" size={26} color={pathname.includes("/pendingOrders") ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                                    <StyledText className='font-bold text-base' style={{ color: pathname.includes("/pendingOrders") ? primaryBlue : 'gray', margin: 0 }}>Pending Orders</StyledText>
                                </StyledView>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                if (id !== '') {
                                    router.push(`/restaurants/${id}/analytics`)
                                }
                            }}>
                                <StyledView className={`flex-row items-center px-4 py-2 ${pathname.includes("/analytics") ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                                    <MaterialIcons name="analytics" size={26} color={pathname.includes("/analytics") ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                                    <StyledText className='font-bold text-base' style={{ color: pathname.includes("/analytics") ? primaryBlue : 'gray', margin: 0 }}>Analytics</StyledText>
                                </StyledView>
                            </TouchableOpacity>
                        </View>
                    }
                </StyledView>
            </ScrollView >
        );
    };

    return (
        <CustomDrawer drawerContent={(props) => <CustomDrawerContent {...props} />} />
    );
}
