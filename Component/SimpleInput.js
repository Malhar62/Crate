import React from 'react'
import { KeyboardAvoidingView, Text, TextInput, View, Button, TouchableWithoutFeedback, Image } from 'react-native';
import {
    TextField,
    FilledTextField,
    OutlinedTextField,
} from 'react-native-material-textfield';
import { images } from '../Redux/Constants';

const SimpleInput = React.forwardRef((props, ref) => {


    function LeftPart() {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    if (props.onLeftPress) {
                        props.onLeftPress()
                    } else {
                        console.log('not touch')
                    }
                }}
            >
                {props.lefticon ? <Image
                    source={{ uri: props.lefticon }}
                    style={{ width: 30, height: 30 }}
                /> :
                    props.lefttext ? <Text>
                        {props.lefttext}
                    </Text> : null}
            </TouchableWithoutFeedback>
        )
    }
    function RightPart() {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    if (props.onRightPress) {
                        props.onRightPress()
                    } else {
                        console.log('not touch')
                    }
                }}
            >
                {(props.righticon || props.pswd) ? <Image
                    resizeMode='contain'
                    source={{ uri: props.righticon ? props.righticon : props.pswd ? (props.open ? images.eyevisible : images.eyelock) : null }}
                    style={{ width: 40, height: 40 }}
                /> :
                    props.righttext ? <Text>
                        {props.righttext}
                    </Text> : null}
            </TouchableWithoutFeedback>
        )
    }
    return (
        <View>
            <TextField
                value={props.value}
                placeholder={props.placeholder}
                inputContainerStyle={{
                    height: 50,
                    borderRadius: 50,
                    paddingLeft: 16,
                }}
                onChangeText={data => props.onChangeText(data)}
                ref={props.ref}
                containerStyle={props.style}
                activeLineWidth={false}
                renderLeftAccessory={LeftPart}
                renderRightAccessory={RightPart}
                activeLineWidth={2}
                KeyboardAvoidingView={true}
                secureTextEntry={props.pswd ? !props.open : false}
                onPressOut={props.onPressOut}
            />
        </View>
    )
})
export default SimpleInput;