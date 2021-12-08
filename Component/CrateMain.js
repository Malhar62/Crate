import React from "react"
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { vh, vw } from "./Scale";

export default function CrateMain(props) {
    const Top = 130;
    const Bottom = 70;
    const Total = 200;
    return (
        <View style={{ height: vh(Total), width: vw(150) }}>
            <TouchableOpacity onPress={() => props.onCratePress(props.item.crateId)}>
                <View style={{ height: vh(Top), width: '100%', backgroundColor: '#f5dfec', justifyContent: 'center', borderTopEndRadius: 10, borderTopStartRadius: 10 }}>
                    <Text numberOfLines={4} style={{ fontSize: 18, marginLeft: 5 }}>{props.item.crateName}</Text>
                </View>
                <View style={{
                    height: vh(Bottom), width: '100%', backgroundColor: '#f0bb51', justifyContent: 'center',
                    borderBottomEndRadius: 10, borderBottomStartRadius: 10
                }}>
                    <Text style={{ fontSize: 18, marginLeft: 5 }}>{props.item.photos.length+props.item.contacts.length} {'Items'}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}