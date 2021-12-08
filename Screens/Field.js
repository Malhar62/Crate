import React from 'react'
import { KeyboardAvoidingView, Text, View, Button, TouchableWithoutFeedback, Keyboard, ScrollView, FlatList } from 'react-native';
import {
    TextField,
    FilledTextField,
    OutlinedTextField,
} from 'react-native-material-textfield';
import { connect } from 'react-redux';
import Sheet from '../Component/Sheet';
import SimpleInput from '../Component/SimpleInput';
import { save, add, remove } from '../Redux/Actions/extra'
import { double, edit } from '../Redux/Actions';
import { images } from '../Redux/Constants';
import Input from '../Component/Input';
import Share from 'react-native-share';
import ImagePicker from 'react-native-image-crop-picker';

function Field({ tag, save, list, add, remove, edit, realme, double }) {
    const fieldRef = React.createRef()
    const sheetref = React.createRef()
    const [val, setVal] = React.useState('')
    const Inside = () => {
        return (
            <View>
                <OutlinedTextField
                    label='name'
                    ref={fieldRef}
                    tintColor='navy'
                    value={val}
                    onChangeText={data => setVal(data)}
                    containerStyle={{ width: 300, alignSelf: 'center', marginTop: 20 }}
                />
                <Button
                    title='save'
                    onPress={() => {
                        save(val)
                        setVal('')
                        sheetref.current.close()
                    }}
                />
            </View>
        )
    }
    const [name, setName] = React.useState('')
    const [see, setSee] = React.useState(false)
    const [isedit, setIsedit] = React.useState(false)
    const [id, setId] = React.useState(null)
    const emailref = React.createRef()
    const goodTime = `${new Date().getHours()}:${new Date().getMinutes()}`;
    return (
        <ScrollView
            // onPress={() => {
            //     Keyboard.dismiss()
            // }}
            keyboardShouldPersistTaps='handled'
            scrollEnabled={false}
            style={{ flex: 1, backgroundColor: '#fff' }}
        >
            <View style={{}}>
                <Button
                    title='open sheet'
                    onPress={() => {
                        //sheetref.current.open()
                        double(name, () => {
                            setName('')
                        })
                    }}
                />

                <Text>{tag}</Text>
                <Text>{name}</Text>
                <SimpleInput
                    value={name}
                    placeholder='enter name'
                    onChangeText={data => {
                        setName(data)
                    }}
                    ref={emailref}
                    style={{ width: 300, alignSelf: 'center', }}
                    lefticon={images.search}
                    onLeftPress={() => console.log('go left')}
                    //pswd={true}
                    //open={see}
                    righticon={images.location}
                    onRightPress={() => setSee(!see)}
                    onPressOut={() => emailref.current.blur()}
                />
                <Button
                    title='add'
                    onPress={() => {
                        //fieldRef.current.focus()
                        if (isedit && id != null) {
                            edit({ data: { text: name, time: goodTime }, index: id })
                        } else {
                            add({ text: name, time: goodTime })
                            setName('')
                        }
                        setIsedit(false)
                        setId(null)
                    }
                    }
                />
                <Text>{realme}</Text>
                {list.map((item, index) => {
                    return (
                        <View style={{ marginTop: 20, flexDirection: 'row', width: 300, borderWidth: 1 }} key={index}>
                            <Text>{item.text}</Text>
                            <Text>{item.time}</Text>
                            <View style={{ position: 'absolute', right: 0 }}>
                                <TouchableWithoutFeedback
                                    onPress={() => remove(index)}
                                >
                                    <Text>x</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{ position: 'absolute', right: 10 }}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setIsedit(true)
                                        setName(item.text)
                                        setId(index)
                                    }}
                                >
                                    <Text>E</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    )
                })}
            </View>
            <Sheet
                data={Inside}
                ref={sheetref}
            />

            <Input
                value={name}
                onChangeText={data => setName(data)}
                label='enter here...'
            />
           
        </ScrollView>
    )
}
const mapStateToProps = (state) => ({
    tag: state.news.tag,
    list: state.news.list,
    realme: state.red.redname
})
const mapDispatchToProps = (dispatch) => ({
    save: (obj) => { dispatch(save(obj)) },
    add: (text) => { dispatch(add(text)) },
    remove: (id) => { dispatch(remove(id)) },
    edit: (obj) => { dispatch(edit(obj)) },
    double: (name, callback) => { dispatch(double(name, callback)) }
})
export default connect(mapStateToProps, mapDispatchToProps)(Field)
