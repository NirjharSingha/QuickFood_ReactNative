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

export default Loading