import React, { useEffect, useState } from 'react';
import { KeyboardTypeOptions, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Icon } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { useMenu } from '@/contexts/Menu';
import Toast from 'react-native-toast-message';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput)

interface MenuDialogProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    menu: { id: number; name: string; category: string; price: number; quantity: number, image: string } | undefined;
}

interface InputGroupProps {
    flag: boolean;
    title: string;
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    setWarning: (value: string) => void;
    keyboardType: KeyboardTypeOptions;
}

interface ImageInputProps {
    uploadImage: any;
    imgStream: string;
}

interface SelectInputProps {
    flag: boolean;
    title: string;
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    setWarning: (value: string) => void;
    texts: string[];
    values: string[];
}

export const InputGroup: React.FC<InputGroupProps> = ({ flag, title, value, setValue, placeholder, setWarning, keyboardType = "default" }) => {
    return (
        <StyledView className={`overflow-x-hidden mt-2 flex-row items-center justify-between mr-[6px]`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 16 }}>
                {title}:{flag && <StyledText className="text-red-500">*</StyledText>}
            </StyledText>
            <StyledInput
                className="border-b-[1px] border-gray-400 mb-4 w-[55%] pl-1 outline-none cursor-pointer bg-white"
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={value}
                style={{ fontSize: 14 }}
                onChangeText={(text) => {
                    setValue(text);
                    setWarning("");
                }}
            />
        </StyledView>
    )
}

export const ImageInput: React.FC<ImageInputProps> = ({ imgStream, uploadImage }) => {
    return (
        <StyledView className={`overflow-x-hidden mt-4 flex-row items-center justify-between mr-[6px]`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 16 }}>
                Image:
            </StyledText>
            <TouchableOpacity className='w-[55%] bg-slate-500 rounded-md' onPress={uploadImage}>
                <StyledView className="w-full flex-row justify-center items-center">
                    <StyledView className="py-[3px] w-full flex-row justify-center items-center cursor-pointer rounded-md border-[1px] border-gray-900 overflow-hidden">
                        <StyledText className="mr-1 h-full text-white flex-row justify-center items-center text-center font-bold mb-[1.5px]" style={{ fontSize: 14 }}>
                            {imgStream === "" ? "No image" : "Image chosen"}
                        </StyledText>
                        <Icon
                            source="camera"
                            color={'white'}
                            size={17}
                        />
                    </StyledView>
                </StyledView>
            </TouchableOpacity>
        </StyledView>
    )
}

export const SelectInput: React.FC<SelectInputProps> = ({ flag, title, value, setValue, placeholder, setWarning, texts, values }) => {
    const [visible, setVisible] = useState(false);
    const [textValue, setTextValue] = useState('');

    useEffect(() => {
        if (value !== "") {
            const index = values.indexOf(value);
            setTextValue(texts[index]);
        }
    }, [value, values, texts])

    return (
        <StyledView className={`overflow-x-hidden mt-5 mb-4 flex-row items-center justify-between mr-[6px]`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 16 }}>
                {title}:{flag && <StyledText className="text-red-500">*</StyledText>}
            </StyledText>
            <StyledView className='relative w-[55%]'>
                <TouchableOpacity className='w-full flex-row items-center justify-between px-[6px] py-[3px] border-[1.5px] border-gray-300 bg-white rounded-md' onPress={() => {
                    setVisible((prev) => !prev)
                    setWarning('')
                }}>
                    <StyledText className="text-gray-500 mb-[1.5px]" style={{ fontSize: 14 }}>
                        {value === "" ? placeholder : textValue}
                    </StyledText>
                    <FontAwesome5 name={visible ? "chevron-down" : "chevron-up"} size={12} color="gray" />
                </TouchableOpacity>
                {visible &&
                    <StyledView className='w-full min-h-[50px] absolute top-[100%] rounded-md left-0 z-10 bg-slate-100'>
                        {texts.map((text, index) => (
                            <TouchableOpacity key={index} className={`w-full flex-row items-center justify-between px-3 py-[2.5px] ${index !== texts.length - 1 ? 'border-b-[0.5px] border-b-gray-400' : ''}`}
                                onPress={() => {
                                    setValue(values[index])
                                    setTextValue(text)
                                    setVisible(false)
                                    setWarning("")
                                }}
                            >
                                <StyledText className={`text-gray-500 mb-[1.5px]`} style={{ fontSize: 14 }}>
                                    {text}
                                </StyledText>
                            </TouchableOpacity>
                        ))}
                    </StyledView>
                }
            </StyledView>
        </StyledView>
    )
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
    const { setMenu } = useMenu();

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