import React from 'react'
import { View, FlatList, Text, TouchableOpacity, TouchableHighlight, Animated, Keyboard, Image, PermissionsAndroid, Alert, StyleSheet, Linking, TouchableOpacityBase } from 'react-native'
import { vw, vh } from '../Component/Scale'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider, renderers
} from 'react-native-popup-menu';
import { Popover, Button, Box, Center, NativeBaseProvider } from "native-base"

export default function PopUp(props) {
    const { item } = props;
    return (
        <Box w='100%' h='100%' alignItems="center">
            <Popover
                trigger={(triggerProps) => {
                    return (
                        <Text {...triggerProps} colorScheme="danger">
                            {item.title}
                        </Text>
                    )
                }}
            >
                <Popover.Content w="56">
                   
                    <Popover.Body >
                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.number}`)}>
                            <Text>{item.number}</Text>
                        </TouchableOpacity>
                    </Popover.Body>
                </Popover.Content>
            </Popover>
        </Box>
    )
}
const styles = StyleSheet.create({
    app: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c2ffd2',
    },
    content: {
        padding: 16,
        backgroundColor: 'pink',
        borderRadius: 8,
    },
    arrow: {
        borderTopColor: 'pink',
    },
    background: {
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
    },
});
// <Menu
        //     renderer={Popover}
        //     style={{}}
        //     rendererProps={{ placement: 'top', preferredPlacement: 'top', }}

        // >
        //     <MenuTrigger>
        //         <Text>:</Text>
        //     </MenuTrigger>
        //     <MenuOptions style={{ backgroundColor: '#f1f1f1' }}>
        //         <MenuOption onSelect={() => { }} >
        //             <Text style={{ color: 'red' }}>Delete</Text>
        //         </MenuOption>
        //     </MenuOptions>
        // </Menu>