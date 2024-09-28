import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import axios, { AxiosError } from 'axios'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from '@expo/vector-icons/AntDesign';
import { styled } from 'nativewind'
import { FontAwesome6 } from '@expo/vector-icons'
import { MenuType } from '@/scripts/type'
import { usePathname } from 'expo-router'
import { useGlobal } from '@/contexts/Globals'
import { Button, Dialog, Portal } from 'react-native-paper'
import { Colors } from '@/constants/Colors'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledTouchableOpacity = styled(TouchableOpacity)

type Cart = {
    restaurantId: string;
    selectedMenu: {
        selectedMenuId: number;
        selectedMenuQuantity: number;
    }[]
}

interface MenuCardProps {
    menu: MenuType;
    setShowMenuDialog?: (value: boolean) => void;
    setMenuToEdit?: (menu: MenuType) => void;
}

interface AlertDialogProps {
    visible: boolean;
    setVisible: (value: boolean) => void;
    message: string;
    continueHandler: any;
    cancelHandler: any;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ visible, setVisible, message, cancelHandler, continueHandler }) => {
    const hideDialog = () => setVisible(false);
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12 }}>
                <Dialog.Content>
                    <StyledText style={{ fontSize: 14, color: Colors.light.primaryGray }}>{message}</StyledText>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={cancelHandler}>Cancel</Button>
                    <Button onPress={continueHandler}>Continue</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
};

export const MenuCard: React.FC<MenuCardProps> = ({ menu, setShowMenuDialog, setMenuToEdit }) => {
    const router = useRouter();
    const [rating, setRating] = useState('');
    const [flag, setFlag] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const pathname = usePathname();
    const { setCartCount } = useGlobal()
    const [showCartAlert, setShowCartAlert] = useState(false)

    useEffect(() => {
        const getRating = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/review/menuRating?menuId=${menu.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setFlag(true);
                    const stringData: string = String(response.data);
                    setRating(stringData);
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router);
            }
        };
        getRating();
    }, []);

    const addToCart = async () => {
        let temp = await AsyncStorage.getItem("cart");
        let cart;

        if (temp) {
            cart = JSON.parse(temp);
        } else {
            cart = { restaurantId: menu.restaurantId, selectedMenu: [] };
        }

        if (cart.restaurantId !== menu.restaurantId) {
            setShowCartAlert(true);
            return;
        }

        // Check if the menu already exists in the cart
        const existingMenu = cart.selectedMenu.find(
            (item: { selectedMenuId: number, selectedMenuQuantity: number }) => item.selectedMenuId === menu.id
        );

        if (existingMenu) {
            // If the menu exists, update its quantity
            existingMenu.selectedMenuQuantity++;
        } else {
            // If the menu doesn't exist, push a new entry into the array
            cart.selectedMenu.push({
                selectedMenuId: menu.id,
                selectedMenuQuantity: 1,
            });
        }

        await AsyncStorage.setItem("cart", JSON.stringify(cart));
        setQuantity(1);
        setCartCount((prev) => prev + 1);
    };

    const updateQuantity = async (isAdd: boolean) => {
        let temp = await AsyncStorage.getItem("cart");
        if (!temp) {
            return
        }
        let cart: Cart = JSON.parse(temp);

        cart.selectedMenu.forEach((item) => {
            if (item.selectedMenuId === menu.id) {
                if (isAdd) {
                    item.selectedMenuQuantity += 1;
                } else {
                    item.selectedMenuQuantity -= 1;
                    if (item.selectedMenuQuantity === 0) {
                        cart.selectedMenu = cart.selectedMenu.filter(
                            (menu) => menu.selectedMenuId !== item.selectedMenuId
                        );
                        setCartCount((prev) => prev - 1);
                    }
                }
                setQuantity(item.selectedMenuQuantity);
            }
        });

        await AsyncStorage.setItem("cart", JSON.stringify(cart));
    };

    const cancelHandler = () => setShowCartAlert(false);

    const continueHandler = async () => {
        const resId = pathname.split("/").pop();
        let cart = {
            restaurantId: resId,
            selectedMenu: [
                { selectedMenuId: menu.id, selectedMenuQuantity: 1 },
            ],
        };
        await AsyncStorage.setItem("cart", JSON.stringify(cart));
        setCartCount(1);
        setQuantity(1);
        setShowCartAlert(false);
    };

    useEffect(() => {
        const updateQuantity = async () => {
            if (pathname.includes("/order")) {
                let temp = await AsyncStorage.getItem("cart");
                if (temp) {
                    let cart: Cart = JSON.parse(temp);
                    cart.selectedMenu.forEach((item) => {
                        if (item.selectedMenuId === menu.id) {
                            setQuantity(item.selectedMenuQuantity);
                        }
                    });
                }
            }
        }
        updateQuantity();
    }, []);

    return (
        <StyledView className={`w-full max-w-[280px] mx-auto rounded-lg shadow-md bg-base-100 border-2 border-gray-200 bg-white pb-[14px] mb-3`}>
            <StyledImage
                source={menu.image ? { uri: `data:image/jpeg;base64,${menu.image}` } : require("@/assets/images/Menu.jpg")}
                alt="logo"
                className="bg-red-100 w-full h-[170px] rounded-tl-lg rounded-tr-lg border-b-2 border-b-gray-200"
            />
            <StyledText className="font-bold text-gray-700 mt-2 pl-3 pr-3" style={{ fontSize: 18 }}>
                {menu.name}
            </StyledText>
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Category :{" "}
                {menu.category
                    ? menu.category === "NON_VEG"
                        ? "NON-VEG"
                        : menu.category
                    : "Category Not Available"}
            </StyledText>
            {!pathname.includes("/order") &&
                <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                    Quantity :{" "}
                    {menu.quantity > 0 ? menu.quantity : "Not Available"}
                </StyledText>
            }
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Price : {`${menu.price} Tk`}
            </StyledText>
            <StyledView className={`flex-row items-center justify-between p-3 pb-0 ${pathname.includes('/order') ? 'mt-[2px]' : ''}`}>
                {!pathname.includes("/order") &&
                    <TouchableOpacity onPress={() => {
                        setMenuToEdit && setMenuToEdit(menu);
                        setShowMenuDialog && setShowMenuDialog(true);
                    }}>
                        <FontAwesome6 name="pen" size={18} color="#2CA4D4" />
                    </TouchableOpacity>
                }
                {pathname.includes("/order") && quantity === 0 &&
                    <StyledTouchableOpacity className="mb-1 flex-row justify-center items-center font-bold bg-white border-2 border-blue-500 rounded-[4.5px] px-[6px] py-[2px]" onPress={addToCart}>
                        <AntDesign name="pluscircle" size={14} color="#3B82F6" />
                        <StyledText className='font-bold text-blue-500 ml-1' style={{ fontSize: 12 }}>Add to Cart</StyledText>
                    </StyledTouchableOpacity>
                }
                {pathname.includes("/order") && quantity !== 0 &&
                    <StyledView className="flex-row items-center justify-between border-2 border-gray-400 rounded-[4.5px] py-[2px] mb-1">
                        <TouchableOpacity style={{ paddingLeft: 8, paddingRight: 12 }} onPress={() => updateQuantity(false)} >
                            <AntDesign name="minuscircle" size={14} color='#374151' />
                        </TouchableOpacity>
                        <StyledText className="text-gray-700" style={{ fontSize: 12 }}>{quantity}</StyledText>
                        <TouchableOpacity style={{ paddingLeft: 12, paddingRight: 8 }} onPress={() => updateQuantity(true)} >
                            <AntDesign name="pluscircle" size={14} color='#3B82F6' />
                        </TouchableOpacity>
                    </StyledView>
                }
                {flag === true &&
                    <View>
                        {rating === '' && <StyledText className='mt-2 flex-row gap-1 justify-center items-center font-bold text-white bg-green-700 ml-auto rounded-[4.5px] px-2 py-1' style={{ fontSize: 12 }}>No Rating</StyledText>}
                        {rating !== '' &&
                            <StyledView className="mt-2 flex-row gap-1 justify-center items-center font-bold text-white bg-green-700 ml-auto rounded-[4.5px] px-2 pb-1">
                                <StyledText className='font-bold text-white' style={{ fontSize: 13 }}>{parseFloat(rating).toFixed(2)}</StyledText>
                                <AntDesign name="star" size={15} color="white" />
                            </StyledView>
                        }
                    </View>
                }
            </StyledView>
            <AlertDialog visible={showCartAlert} setVisible={setShowCartAlert} message="You cannot order food from different restaurants at the same time. If you select this food item, the previous items will be removed from the cart. Do you want to continue?" cancelHandler={cancelHandler} continueHandler={continueHandler} />
        </StyledView>
    );
};