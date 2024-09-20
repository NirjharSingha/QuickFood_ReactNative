import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { Password as PassInput } from '@/app/auth/signup';
import { Colors } from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { View } from 'react-native';
import { styled } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios, { AxiosError } from 'axios';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import unauthorized from '@/scripts/unauthorized';

interface PasswordProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const StyledView = styled(View);
const StyledText = styled(Text);

const Password: React.FC<PasswordProps> = ({ visible, setVisible }) => {
    const hideDialog = () => setVisible(false);
    const [warning, setWarning] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const { light } = Colors;
    const router = useRouter();

    const updatePassword = async () => {
        if (password === "" || confirmPassword === "") {
            setWarning("Please fill all the fields");
            return;
        }
        if (password !== confirmPassword) {
            setWarning("Passwords do not match");
            return;
        }

        const token = await AsyncStorage.getItem("token");

        if (token !== null && token !== undefined) {
            const data = {
                id: jwtDecode(token).sub,
                password: password,
            };
            try {
                const response = await axios.put(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/user/updatePassword`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token + "abcd"}`,
                        },
                    }
                );
                if (response.status == 200) {
                    hideDialog();
                    Toast.show({
                        type: 'success',
                        text1: 'Password Updated',
                        text2: 'Your password has been updated successfully.',
                        visibilityTime: 4000,
                    });
                }
            } catch (error) {
                hideDialog();
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router);
            }
        }
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12 }}>
                <StyledView className='flex-row justify-center items-center gap-3 mb-4'>
                    <FontAwesome5 name="lock" size={35} color={light.primaryGray} style={{ textAlign: 'center' }} />
                    <StyledText style={styles.title}>Password</StyledText>
                </StyledView>
                <Dialog.Content>
                    {warning !== "" && <Text variant="bodyMedium" className='text-red-400 text-center mb-2'>{warning}</Text>}
                    <PassInput
                        password={password}
                        setPassword={setPassword}
                        showPass={showPass}
                        setShowPass={setShowPass}
                        placeholder="Enter new password"
                        setWarning={setWarning}
                    />
                    <PassInput
                        password={confirmPassword}
                        setPassword={setConfirmPassword}
                        showPass={showConfirmPassword}
                        setShowPass={setShowConfirmPassword}
                        placeholder="Confirm new password"
                        setWarning={setWarning}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={updatePassword} style={{ marginTop: -16 }}>Update Password</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: Colors.light.primaryGray,
        fontSize: 24,
        fontWeight: 'bold',
    },
})

export default Password;