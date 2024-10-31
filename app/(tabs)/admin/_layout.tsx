import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { CustomDrawer, DrawerHeader } from '@/components/Drawer';
import Admin from '@/assets/images/admin.png'

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
                    <DrawerHeader image={Admin} title="Admin" text="Options for Admin" />

                    <TouchableOpacity onPress={() => router.push("/admin")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === '/admin' ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                            <MaterialIcons name="dashboard" size={24} color={pathname === "/admin" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/admin" ? primaryBlue : 'gray', margin: 0 }}>Dashboard</StyledText>
                        </StyledView>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/admin/restaurants")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/admin/restaurants" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                            <MaterialIcons name="analytics" size={26} color={pathname === "/admin/restaurants" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/admin/restaurants" ? primaryBlue : 'gray', margin: 0 }}>Restaurants</StyledText>
                        </StyledView>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/admin/riders")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === '/admin/riders' ? 'bg-blue-100' : ''} rounded-full m-0 mt-3`} style={{ gap: 10 }}>
                            <MaterialIcons name="delivery-dining" size={26} color={pathname === "/admin/riders" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/admin/riders" ? primaryBlue : 'gray', margin: 0 }}>Riders</StyledText>
                        </StyledView>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/admin/addRider")}>
                        <StyledView className={`flex-row items-center px-4 py-2 ${pathname === "/admin/addRider" ? 'bg-blue-100' : ''} rounded-full m-0 mt-2`} style={{ gap: 10 }}>
                            <Ionicons name="add-circle" size={26} color={pathname === "/admin/addRider" ? primaryBlue : 'gray'} style={{ margin: 0 }} />
                            <StyledText className='font-bold text-base' style={{ color: pathname === "/admin/addRider" ? primaryBlue : 'gray', margin: 0 }}>Add Rider</StyledText>
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
