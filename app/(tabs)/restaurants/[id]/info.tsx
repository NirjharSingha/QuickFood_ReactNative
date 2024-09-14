import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
    const { id } = useLocalSearchParams();

    useEffect(() => {
        const saveProp = async () => {
            const idStr = id as string;
            await AsyncStorage.setItem('YourRestaurant', idStr);
        }

        saveProp();
    }, [])

    return (
        <View>
            <Text>index : {id}</Text>
        </View>
    )
}

export default index