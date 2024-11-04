import { ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { styled } from 'nativewind';
import { Dialog, Portal } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface RatingProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    menuId: number;
    setRating: any;
}

const StyledTouchableOpacity = styled(TouchableOpacity);

const RatingDialog: React.FC<RatingProps> = ({ visible, setVisible, menuId, setRating }) => {
    const hideDialog = () => setVisible(false);
    const classnames = 'flex-row items-center px-2 py-1 w-full bg-slate-100 rounded-md mb-2'

    const handleClicked = (value: number) => {
        setRating((prevRatings: { menuId: number, rating: number }[]) => {
            const ratingIndex = prevRatings.findIndex((item) => item.menuId === menuId);

            if (ratingIndex !== -1) {
                // If the menuId exists, update the rating
                return prevRatings.map((item, index) =>
                    index === ratingIndex ? { ...item, rating: value } : item
                );
            } else {
                // If the menuId does not exist, add a new entry
                return [...prevRatings, { menuId, rating: value }];
            }
        });
        setVisible(false);
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12, marginVertical: 80, minHeight: 200, paddingHorizontal: 20, paddingBottom: 16 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(0.5)}>
                        <FontAwesome name='star-half-empty' size={24} color='gold' />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(1.0)}>
                        <FontAwesome name='star' size={24} color='gold' />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(1.5)}>
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star-half-empty' size={24} color='gold' />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(2.0)}>
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(2.5)}>
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star-half-empty' size={24} color='gold' />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(3.0)}>
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(3.5)}>
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star-half-empty' size={24} color='gold' />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(4.0)}>
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(4.5)}>
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star-half-empty' size={24} color='gold' />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className={classnames} onPress={() => handleClicked(5.0)}>
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' style={{ marginRight: 8 }} />
                        <FontAwesome name='star' size={24} color='gold' />
                    </StyledTouchableOpacity>
                </ScrollView>
            </Dialog>
        </Portal>
    );
}

export default RatingDialog