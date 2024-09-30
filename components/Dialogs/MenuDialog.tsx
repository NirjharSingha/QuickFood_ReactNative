import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { useGlobal } from '@/contexts/Globals';
import Toast from 'react-native-toast-message';
import { InputGroup_2 as InputGroup } from '../input/TextInput';
import { ImageInput } from '../input/ImagePicker';
import { SelectInput } from '../input/SelectInput';

const StyledView = styled(View);
const StyledText = styled(Text);

interface MenuDialogProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    menu: { id: number; name: string; category: string; price: number; quantity: number, image: string } | undefined;
}

const MenuDialog: React.FC<MenuDialogProps> = ({ visible, setVisible, menu }) => {
    const hideDialog = () => setVisible(false);
    const [name, setName] = useState<string | undefined>('');
    const [category, setCategory] = useState<string | undefined>('');
    const [warning, setWarning] = useState("");
    const [price, setPrice] = useState<string | undefined>('');
    const [quantity, setQuantity] = useState<string | undefined>('');
    const [imgStream, setImgStream] = useState<string | undefined>('');
    const [flag, setFlag] = useState(false);
    const { light } = Colors;
    const router = useRouter();
    const { setMenu } = useGlobal();

    useEffect(() => {
        const isAdd = menu?.id === 0;

        if (!isAdd) {
            setName(menu?.id === 0 ? "" : menu?.name)
            setCategory(menu?.id === 0 ? "" : menu?.category)
            setPrice(menu?.id === 0 ? "" : menu?.price.toString())
            setQuantity(menu?.id === 0 ? "" : menu?.quantity.toString())
            setImgStream(menu?.id === 0 ? "" : menu?.image)
        }
    }, [menu])

    const uploadImage = async () => {
        setWarning('')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImgStream(imageUri);
            setFlag(true);
        }
    };

    const handleSubmit = async () => {
        if (name === "" || category === "" || price === "" || quantity === "") {
            setWarning("Fill the required fields");
            return;
        }

        const priceNum = parseFloat(price as string);
        const quantityNum = parseInt(quantity as string);

        if (isNaN(priceNum) || priceNum < 0) {
            setWarning("Invalid price");
            return;
        }

        if (isNaN(quantityNum) || quantityNum < 0) {
            setWarning("Invalid quantity");
            return;
        }

        const data = new FormData();
        if (menu?.id !== 0) {
            data.append('id', menu?.id as any);
        }
        data.append('name', name as string);
        data.append('category', category as string);
        data.append('price', price as string);
        data.append('quantity', quantity as string);
        if (flag) {
            data.append("file", { uri: imgStream, name: "image.jpeg", type: "image/jpeg" } as any);
        } else {
            data.append("file", null as any);
        }

        const resId = await AsyncStorage.getItem('YourRestaurant');
        data.append('restaurantId', resId as string);

        const token = await AsyncStorage.getItem('token');
        try {
            if (menu?.id === 0) {
                const response = await axios.post(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/menu/addMenu`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                            Accept: 'application/json',
                        },
                    }
                );
                if (response.status == 200) {
                    Toast.show({
                        type: 'success',
                        text1: 'Add Menu',
                        text2: 'New menu added successfully',
                        visibilityTime: 4000,
                    })
                    setMenu((prev) => [response.data, ...prev]);
                    setVisible(false)
                }
            } else {
                const response = await axios.put(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/menu/updateMenu`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                            Accept: 'application/json',
                        },
                    }
                );
                if (response.status == 200) {
                    Toast.show({
                        type: 'success',
                        text1: 'Update Menu',
                        text2: 'Menu updated successfully',
                        visibilityTime: 4000,
                    })
                    setMenu((prev) => {
                        const index = prev.findIndex(
                            (item) => item.id === menu?.id
                        );
                        prev[index] = response.data;
                        return prev;
                    });
                    setVisible(false)
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const { status, data } = axiosError.response;
                if (status === 401) {
                    await AsyncStorage.removeItem("token");
                    await AsyncStorage.removeItem("role");
                    Toast.show({
                        type: 'error',
                        text1: 'Session Expired',
                        text2: 'Your current session has expired. Please login again.',
                        visibilityTime: 4000,
                    });
                    router.push("/auth/login");
                } else if (status === 400) {
                    setWarning('Duplicate Menu name');
                } else {
                    console.log(data);
                }
            };
        }
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12, marginHorizontal: 8 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StyledView className='flex-row justify-center items-center gap-3 mb-4'>
                        <MaterialIcons name="list-alt" size={35} color={light.primaryGray} style={{ textAlign: 'center' }} />
                        <StyledText style={styles.title}>{menu?.id === 0 ? "Add Menu" : "Update Menu"}</StyledText>
                    </StyledView>
                    <Dialog.Content>
                        {warning !== "" && <Text variant="bodyMedium" className='text-red-400 text-center mb-2'>{warning}</Text>}
                        <InputGroup flag={true} title='Name' value={name ? name : ''} setValue={setName} placeholder='Enter name' setWarning={setWarning} keyboardType='default' />
                        <SelectInput flag={true} title='Category' value={category ? category : ''} setValue={setCategory} placeholder='Select category' setWarning={setWarning} texts={["Veg", "Non-veg", "Vegan", "Drink"]} values={['VEG', 'NON_VEG', 'VEGAN', 'DRINK',]} />
                        <InputGroup flag={true} title='Price' value={price ? price.toString() : ''} setValue={setPrice} placeholder='Enter price' setWarning={setWarning} keyboardType='numeric' />
                        <InputGroup flag={true} title='Quantity' value={quantity ? quantity.toString() : ''} setValue={setQuantity} placeholder='Enter quantity' setWarning={setWarning} keyboardType='numeric' />
                        <ImageInput imgStream={imgStream ? imgStream : ''} uploadImage={uploadImage} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleSubmit} style={{ marginTop: -8 }}>{menu?.id === 0 ? 'Add Menu' : 'Update Menu'}</Button>
                    </Dialog.Actions>
                </ScrollView>
            </Dialog>
        </Portal>
    );
}


const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: Colors.light.primaryGray,
        fontSize: 24,
        fontWeight: 'bold',
    },
})

export default MenuDialog;