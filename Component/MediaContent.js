import React from 'react'
import { ScrollView, View, Button, FlatList, Text, TouchableOpacity, TouchableHighlight, Animated, Keyboard, Image, PermissionsAndroid, TouchableOpacityBase, } from 'react-native'
import { connect } from 'react-redux'
import { vw, vh } from './Scale'

const MediaArray = [
    {
        id: 1,
        name: 'Select From Gallery',
        icon: require('../Images/gallery.png')
    },
    {
        id: 2,
        name: 'Open Camera',
        icon: require('../Images/camera.png')
    },
    {
        id: 3,
        name: 'Add Contacts',
        icon: require('../Images/contact.png')
    },
    
]


export default function MediaContent({ onPress }) {
    return (
        <ScrollView
            contentContainerStyle={{ flex: 1, alignSelf: 'center', justifyContent: 'space-around' }}
            style={{ marginHorizontal: 10, width: vw(300), height: vh(150) }}>
            {MediaArray.map(item => {
                return (
                    <View key={item.id} style={{ alignItems: 'flex-start', }}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                onPress(item.id)
                            }}>
                            <Image
                                source={item.icon}
                                resizeMode='contain'
                                style={{ width: vw(40), height: vh(40) }}
                            />
                            <Text style={{ fontSize: 20, marginLeft: 10 }}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </ScrollView>
    )
}