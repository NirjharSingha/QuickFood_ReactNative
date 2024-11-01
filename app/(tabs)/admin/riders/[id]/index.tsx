import { DeliveryAnalytics } from "@/app/(tabs)/delivery/analytics"
import { useLocalSearchParams } from "expo-router"

const index = () => {
    const { id } = useLocalSearchParams() as { id?: string }

    return (
        <DeliveryAnalytics riderId={id as string} />
    )
}

export default index