import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { styled } from 'nativewind';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';

interface DrawerHeaderProps {
    image: any;
    title: string;
    text: string;
}

interface CustomDrawerProps {
    drawerContent: (props: any) => React.ReactNode;
}

const StyledView = styled(View)
const StyledText = styled(Text)

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ image, title, text }) => {
    return (
        <StyledView className='m-1 rounded-lg bg-gray-300 shadow-md shadow-gray-400 pt-3 pb-3'>
            <StyledView className="flex-row justify-center items-center mb-2 gap-3">
                <Image source={image} style={{ width: 35, height: 35, borderRadius: 9999 }} />
                <StyledText className="text-center text-gray-600 text-lg sm:text-xl font-bold">
                    {title}
                </StyledText>
            </StyledView>
            <StyledView className="mb-2 w-full flex-row gap-2 justify-center items-center" style={{ marginLeft: -4 }}>
                <StyledView className="w-[35%] h-[2px] bg-gray-600 rounded-full" />
                <Entypo name="code" size={24} color="rgb(75,85,99)" />
                <StyledView className="w-[35%] h-[2px] bg-gray-600 rounded-full" />
            </StyledView>
            <StyledText className="text-center text-gray-600 text-xs sm:text-sm font-bold">
                {text}
            </StyledText>
        </StyledView>
    )
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({ drawerContent }) => {
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
                drawerContent={drawerContent} // Use the passed drawerContent prop
            />
        </GestureHandlerRootView>
    );
}
