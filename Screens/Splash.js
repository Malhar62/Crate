import React, { useEffect } from 'react';
import { View, Text, Image, FlatList, Button, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { connect } from 'react-redux';

import ActionButton from '../Component/ActionButton';
import { CrateAction } from '../Redux/Actions/CrateAction';
import getApiCall from '../services/webservice';
const utube = 'data:image/jpeg;base64,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'
const array = [
    { name: '1', flag: false },
    { name: '2', flag: false },
    { name: '3', flag: false },
    { name: '4', flag: false },
    { name: '5', flag: false },
    { name: '6', flag: false },
    { name: '7', flag: false },
    { name: '8', flag: false },
]

function Splash({ navigation, getCall }) {

    const [list, setList] = React.useState(array)

    function renderItem({ item, index }) {
        return (
            <View style={{ flexDirection: 'row' }}>
                <BouncyCheckbox
                    size={25}
                    fillColor="red"
                    unfillColor="#FFFFFF"
                    //text="Custom Checkbox"
                    iconStyle={{ borderColor: "red" }}
                    textStyle={{}}
                    onPress={(isChecked) => { }}
                />
                <TouchableOpacity onPress={() => {
                    var dupli = [...list]
                    let obj = {
                        ...item,
                        flag: !item.flag
                    }
                    dupli.splice(index, 1, obj)
                    setList(dupli)
                }}>
                    <Text style={{
                        color: item.flag ? 'green' : 'black', fontSize: 18, marginTop: 10, marginLeft: 10, fontWeight: 'bold',
                        fontFamily: 'Rayjoe'

                    }}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    const onClick = React.useCallback(() => {
        console.log('clicked')
    }, [])

    const anime = new Animated.Value(0)
    useEffect(() => {
        //getCall('0')
        setTimeout(() => {
            Animated.timing(anime, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false
            }).start()
        }, 2000)
        setTimeout(() => {
            navigation.navigate('crate')
        }, 4000)
    }, [])
    return (
        <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'pink' }}>
            {/* <ActionButton onClick={onClick} />

            <FlatList
                data={list}
                renderItem={renderItem}
            /> */}
        
          <Animated.View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Animated.Image
                    source={{ uri: utube }}
                    resizeMode='contain'
                    style={{
                        width: 120, height: 100, position: 'absolute', marginLeft: 20,backgroundColor:'pink',
                        transform: [
                            {
                                translateX: anime.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -70],
                                    extrapolate: 'clamp',
                                })
                            }
                        ]
                    }}
                />
                <Animated.Text style={{
                    fontSize: 40, fontWeight: 'bold', fontFamily: 'rayjoe',
                    opacity: anime.interpolate({
                        inputRange: [0, 0.9, 1],
                        outputRange: [0, 0, 1],
                        extrapolate: 'clamp'
                    }),
                    transform: [
                        {
                            translateX: anime.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 60],
                                extrapolate: 'clamp',
                            })
                        }
                    ]
                }}>Crate It</Animated.Text>
              </Animated.View>
        </Animated.View>
    )
}
const mapStateToProps = () => ({

})
const mapDispatchToProps = (dispatch) => ({
    getCall: (text) => {
        dispatch(CrateAction.getCall(text))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(Splash)