import { AxiosError } from "axios";

const unauthorized = async (axiosError: AxiosError, Toast: any, AsyncStorage: any, router: any) => {
    if (axiosError.response) {
        const { status, data } = axiosError.response;
        if (status === 401) {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("role");
            Toast.show({
                type: 'error',
                text1: 'Session Expired',
                text2: 'Your current session has expired. Please login again.',
                visibilityTime: 6000,
            });
            router.push("/auth/login");
        } else {
            console.log(data);
        }
    }
}

export default unauthorized;