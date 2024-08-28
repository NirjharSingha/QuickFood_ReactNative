import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
    const [role, setRole] = useState('user');
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', tabBarLabelStyle: { fontWeight: 'bold' } }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome name="home" size={26} color={color} />,
                }}
            />
            <Tabs.Screen
                name="delivery"
                options={{
                    href: role === 'rider' ? '/delivery' : null,
                    title: 'Delivery',
                    tabBarIcon: ({ color }) => <MaterialIcons name="delivery-dining" size={26} color={color} />
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    href: role === 'admin' ? '/dashboard' : null,
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={26} color={color} />
                }}
            />
            <Tabs.Screen
                name="order"
                options={{
                    href: role === 'user' ? '/order' : null,
                    title: 'Order',
                    tabBarIcon: ({ color }) => <FontAwesome6 size={26} name="first-order-alt" color={color} />,
                }}
            />
            <Tabs.Screen
                name="restaurants"
                options={{
                    href: role === 'user' ? '/restaurants' : null,
                    title: 'Restaurants',
                    tabBarIcon: ({ color }) => <MaterialIcons name="local-restaurant" size={26} color={color} />,
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color }) => <MaterialIcons name="manage-accounts" size={26} color={color} />,
                }}
            />
        </Tabs>
    );
}
