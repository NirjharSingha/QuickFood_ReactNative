import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const analytics = () => {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Text>analytics : {id}</Text>
        </View>
    )
}

export default analytics