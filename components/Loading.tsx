import LottieView from "lottie-react-native"
import { View } from "react-native"

const Loading = () => {
    return (
        <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
                autoPlay
                style={{
                    width: 38,
                    height: 38
                }}
                source={require('@/assets/animations/loading.json')}
            />
        </View>
    )
}

export const Loading2 = () => {
    return (
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', marginTop: 6, marginBottom: 20 }}>
            <LottieView
                autoPlay
                style={{
                    width: 38,
                    height: 38
                }}
                source={require('@/assets/animations/loading.json')}
            />
        </View>
    )
}

export default Loading