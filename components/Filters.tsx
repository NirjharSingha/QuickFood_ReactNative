import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors';
import { styled } from 'nativewind';
import { InputGroup, SelectInput } from './MenuDialog';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledText = styled(Text);

interface FilterProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    nameFilter: string;
    setNameFilter: (name: string) => void;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    priceFilter: string;
    setPriceFilter: (price: string) => void;
    ratingFilter: string;
    setRatingFilter: (rating: string) => void;
    setSendRequest: (sendRequest: boolean) => void;
    setPage: (page: number) => void
}

const Filters: React.FC<FilterProps> = ({ visible, setVisible, nameFilter, setNameFilter, categoryFilter, setCategoryFilter, priceFilter, setPriceFilter, ratingFilter, setRatingFilter, setSendRequest, setPage }) => {
    const { light } = Colors;
    const [name, setName] = useState<string | undefined>(nameFilter);
    const [category, setCategory] = useState<string | undefined>(categoryFilter);
    const [price, setPrice] = useState<string | undefined>(priceFilter);
    const [rating, setRating] = useState<string | undefined>(ratingFilter);
    const [warning, setWarning] = useState("");

    const hideDialog = () => {
        setVisible(false);
    }

    const handleSubmit = () => {
        if (price && parseFloat(price) <= 0) {
            setWarning("Price must be a positive value");
            return;
        }
        if (rating && (parseFloat(rating) < 0 || parseFloat(rating) > 5)) {
            setWarning("Rating must be between 0 and 5");
            return;
        }
        setNameFilter(name ? name : '');
        setCategoryFilter(category ? category : '');
        setPriceFilter(price ? price : '');
        setRatingFilter(rating ? rating : '');
        setSendRequest(true)
        setPage(0)
        hideDialog();
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12, marginHorizontal: 8 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StyledView className='flex-row justify-center items-center gap-3 mb-4'>
                        <Ionicons name="filter-circle-sharp" size={38} color={light.primaryGray} style={{ textAlign: 'center' }} />
                        <StyledText style={styles.title}>Filters</StyledText>
                    </StyledView>
                    <Dialog.Content>
                        {warning !== "" && <Text variant="bodyMedium" className='text-red-400 text-center mb-2'>{warning}</Text>}
                        <InputGroup flag={false} title='Name' value={name ? name : ''} setValue={setName} placeholder='Enter name' setWarning={setWarning} keyboardType='default' />
                        <SelectInput flag={false} title='Category' value={category ? category : ''} setValue={setCategory} placeholder='Select category' setWarning={setWarning} texts={["Veg", "Non-veg", "Vegan", "Drink"]} values={['VEG', 'NON_VEG', 'VEGAN', 'DRINK',]} />
                        <InputGroup flag={false} title='Price' value={price ? price.toString() : ''} setValue={setPrice} placeholder='Enter maximum price' setWarning={setWarning} keyboardType='numeric' />
                        <InputGroup flag={false} title='Rating' value={rating ? rating.toString() : ''} setValue={setRating} placeholder='Enter minimum rating' setWarning={setWarning} keyboardType='numeric' />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleSubmit} style={{ marginTop: -20 }}>Apply</Button>
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

export default Filters