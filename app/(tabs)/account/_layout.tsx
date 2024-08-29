import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { styled } from 'nativewind';
import { View } from 'react-native';

export default function Layout() {
    const StyledView = styled(View);
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={({ navigation }) => ({
                    drawerPosition: 'right', // Set the drawer to open from the right
                    header: () =>
                        <StyledView className="bg-[#D6C5B7] px-2 py-1 flex-row justify-between items-center w-full">
                            <Header />
                            <MaterialIcons
                                name="menu"
                                size={24}
                                onPress={() => navigation.toggleDrawer()}
                            />
                        </StyledView>
                })}
            />
        </GestureHandlerRootView>
    );
}
