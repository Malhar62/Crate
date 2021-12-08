
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { usericon } from '../Redux/Constants'
import { vw, vh } from './Scale';

interface Props {
    name: string,
    image: string,
    selectContact: (arg: string) => {},
    id: string,
    isSelected: boolean
}

class ContactCard extends React.Component<Props> {
    shouldComponentUpdate(nextProps: Props) {
        if (this.props.isSelected !== nextProps.isSelected) {
            return true;
        }
        return false;
    }
    render() {
        const { name, image, selectContact, id, isSelected } = this.props
        return (
            <TouchableOpacity onPress={() => selectContact(id)}>
                <View style={[styles.main, { backgroundColor: isSelected ? 'rgba(84, 191, 227,0.8)' : '#fff' }]}>
                    <View>
                        <Image
                            resizeMode='contain'
                            source={image ? { uri: image } : usericon}
                            style={{ width: vw(50), height: vh(50) }}
                        />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
};

export default ContactCard;

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f1f1', paddingVertical: 10, paddingLeft: 10
    },
    bottombtn: {
        position: 'absolute', bottom: 10, left: 10, right: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#a455e0', height: 50, borderRadius: 10
    }
})