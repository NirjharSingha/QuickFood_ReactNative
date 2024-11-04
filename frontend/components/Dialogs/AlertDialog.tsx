import { Text } from 'react-native'
import React from 'react'
import { styled } from 'nativewind'
import { Button, Dialog, Portal } from 'react-native-paper'
import { Colors } from '@/constants/Colors'

const StyledText = styled(Text)

interface AlertDialogProps {
    visible: boolean;
    setVisible: (value: boolean) => void;
    title: string;
    message: string;
    continueHandler: any;
    cancelHandler: any;
    flag: boolean;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ visible, setVisible, title, message, cancelHandler, continueHandler, flag }) => {
    const hideDialog = () => setVisible(false);
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12 }}>
                <Dialog.Content>
                    <StyledText className='font-bold text-gray-700 mb-2' style={{ fontSize: 18 }}>{title}</StyledText>
                    <StyledText style={{ fontSize: 14, color: Colors.light.primaryGray }}>{message}</StyledText>
                </Dialog.Content>
                <Dialog.Actions style={{ marginTop: -12 }}>
                    {flag && <Button onPress={cancelHandler}>Go Back</Button>}
                    <Button onPress={continueHandler}>Continue</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
};