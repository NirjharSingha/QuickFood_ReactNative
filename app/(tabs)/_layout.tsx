import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePathname } from 'expo-router';

export default function TabLayout() {
    const [role, setRole] = useState('user');
    const pathname = usePathname();

    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue', tabBarLabelStyle: { fontWeight: 'bold' } }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: () => <FontAwesome name="home" size={26} color={pathname === "/home" ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="delivery"
                options={{
                    href: role === 'rider' ? '/delivery' : null,
                    title: 'Delivery',
                    tabBarIcon: () => <MaterialIcons name="delivery-dining" size={26} color={pathname.includes("/delivery") ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    href: role === 'admin' ? '/dashboard' : null,
                    title: 'Dashboard',
                    tabBarIcon: () => <MaterialIcons name="dashboard" size={26} color={pathname.includes("/dashboard") ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="order"
                options={{
                    href: role === 'user' ? '/order' : null,
                    title: 'Order',
                    tabBarIcon: () => <FontAwesome6 size={26} name="first-order-alt" color={pathname.includes("/order") ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="restaurants"
                options={{
                    href: role === 'user' ? '/restaurants' : null,
                    title: 'Restaurants',
                    tabBarIcon: () => <MaterialIcons name="local-restaurant" size={26} color={pathname.includes("/restaurants") ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: () => <MaterialIcons name="manage-accounts" size={26} color={pathname.includes("/account") ? 'blue' : 'gray'} />
                }}
            />
        </Tabs>
    );
}
