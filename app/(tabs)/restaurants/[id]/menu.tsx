import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const menu = () => {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Text>menu : {id}</Text>
        </View>
    )
}

export default menu