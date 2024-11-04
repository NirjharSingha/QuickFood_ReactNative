import { RestaurantAnalytics } from "@/app/(tabs)/restaurants/[id]/analytics"
import { useLocalSearchParams } from "expo-router"

const index = () => {
    const { id } = useLocalSearchParams() as { id?: string }

    return (
        <RestaurantAnalytics id={id as string} />
    )
}

export default index