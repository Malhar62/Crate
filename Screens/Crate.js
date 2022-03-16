import React from 'react'
import { View, SafeAreaView, FlatList, Text, TouchableOpacity, TouchableHighlight, Animated, Keyboard, Image, PermissionsAndroid, Alert, } from 'react-native'
import { connect } from 'react-redux'
import CrateExtra from '../Component/CrateExtra'
import CrateMain from '../Component/CrateMain'
import Input from '../Component/Input'
import { CrateAction } from '../Redux/Actions/CrateAction'
import { galleryicon, media, plusicon, usericon } from '../Redux/Constants'
import Sheet from '../Component/Sheet'
import { vw, vh } from '../Component/Scale'
import { useIsFocused } from '@react-navigation/native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider, renderers
} from 'react-native-popup-menu';
import PopUp from '../Component/PopUp'
//import { Popover, PopoverController } from 'react-native-modal-popover';
import { Popover, Button, Box, Center, NativeBaseProvider } from "native-base"
import { db } from '../firebase/firebase-config'
import { collection, getDocs } from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
//import storage from '@react-native-firebase/storage';


// first, get a reference to the storage bucket for our app
const common = {
    width: vw(100), height: vh(50), backgroundColor: 'gold', justifyContent: 'center', alignItems: 'center'
}

function Crate(props) {
    const { crateName, crateDescription,
        changeCrateName,
        changeCrateDescription,
        crates,
        addCrate,
        emptyName,
        navigation, addPhoto, fetchContacts
    } = props
    const sheetRef = React.createRef()
    const imageRef = React.createRef()
    const [list, setList] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const isFocused = useIsFocused()
    React.useEffect(() => {
        if (isFocused) {
            emptyName()
            fingerAuth()
        }
    }, [isFocused])
    function fingerAuth(){
        FingerprintScanner.authenticate({ title:'login_via_fingerprint' })
        .then((data) => {
          //getRefreshToken();
          console.log('success',data)
        })
        .catch(error => {
          if (
            error.name === 'DeviceLocked' ||
            error.name === 'DeviceLockedPermanent'
          ) {
          } else {
            console.log('Fingerprint Authentication failed');
          }
        });
    }
    // const getDataBase = async () => {
    //     // const citiesCol = collection(db, 'mvp');
    //     // const citySnapshot = await getDocs(citiesCol);
    //     // const cityList = citySnapshot.docs.map(doc => doc.data());

    //     const q = query(collection(db, "mvp"), where("crateTime", "==", ""));

    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //     });
    // }
   // console.log(getDataBase())
    function Initial() {
        return (
            <View style={{ width: vw(300), alignSelf: 'center', alignItems: 'center', height: vh(150), justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Confirm want to add '{crateName}'</Text>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 10 }}>
                    <TouchableOpacity
                        style={common}
                        onPress={() => {
                            addCrate(() => {
                                emptyName()
                                Keyboard.dismiss()
                                sheetRef.current.close()
                            })
                        }}>
                        <Text>YES,ADD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={common}
                        onPress={() => {
                            sheetRef.current.close()
                        }}>
                        <Text>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    function renderItem({ item, index }) {
        const animatedValue = new Animated.Value(0);
        return (
            <Animated.FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={[item]}
                renderItem={(item) => renderSubItem(item, animatedValue)}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: animatedValue } } }],
                    { useNativeDriver: false },
                )}
                scrollEventThrottle={16}
                keyExtractor={(item, index) => item + index + Math.random()}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
        )
    }
    function renderSubItem({ item, index }, animatedValue) {
        return (
            <View style={{ marginTop: vh(30), flexDirection: 'row' }}>
                <CrateMain
                    anime={animatedValue}
                    item={item}
                    onCratePress={(id) => navigation.navigate('cratedetail', { ID: id })}
                />
                <CrateExtra
                    item={item}
                    anime={animatedValue}
                    onimagepress={(data, crateId, text) => {
                        if (text == 'photo') {
                            var Temp = data.map(item => {
                                return {
                                    path: item.path,
                                    itemId: item.itemId,
                                    crateId: crateId,
                                    title: '',
                                    kind: item.kind
                                }
                            })
                        } else {
                            if (text == 'contact') {
                                var Temp = data.map(item => {
                                    return {
                                        path: item.photoUrl,
                                        itemId: item.itemId,
                                        crateId: crateId,
                                        title: item.userName,
                                        kind: 'contact',
                                        number: item.phoneNumbers.length != 0 ? item.phoneNumbers[0].number : ''
                                    }
                                })
                            }
                        }
                        imageRef.current.open()
                        setList(Temp)
                    }}
                />
            </View>
        )
    }

    function BottomItems() {
        return (
            <View>
                <View style={{ alignSelf: 'center', marginTop: 10 }}>
                    <TouchableOpacity style={[common, { width: 300, borderRadius: 10 }]} onPress={() => imageRef.current.close()}>
                        <Text>CLOSE</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={list}
                    showsHorizontalScrollIndicator={false}
                    horizontal={list.length ? true : false}
                    renderItem={({ item, index }) => (
                        <View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                    imageRef.current.close()
                                    navigation.navigate('viewmedia', {
                                        kind: item.kind,
                                        crateId: item.crateId,
                                        itemId: item.itemId
                                    })
                                    console.log(item.number)
                                }
                                }>
                                    <Image
                                        resizeMode={item.kind == 'image' ? 'cover' : 'contain'}
                                        source={item.path ? { uri: item.path } : usericon}
                                        style={{ width: vw(120), height: vh(150) }}
                                    />
                                </TouchableOpacity>
                            </View>
                            {item.kind == 'contact' && <PopUp
                                opended={open}
                                item={item}
                            />}
                        </View>
                    )}
                    contentContainerStyle={{ marginTop: 10 }}
                    ItemSeparatorComponent={() =>
                        <View
                            style={{ width: 10 }}
                        />}
                    ListEmptyComponent={() =>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Nothing To Show</Text>
                        </View>
                    }
                />
            </View>
        )
    }
    //const { SlideInMenu, Popover } = renderers
   // const storage = getStorage();


    // finally, upload the file to the reference
    async function Send() {
        let url = "file:///data/user/0/com.saga/cache/react-native-image-crop-picker/IMG-20211211-WA0000.jpg"
        let blob = await fetch(url).then((r) => r.blob());
        console.log(blob)
        const usersCollection = ref(storage, 'IMG-20211211-WA0000.jpg');
        const metadata = {
            contentType: 'image/jpeg',
        };
        uploadBytes(usersCollection, url, metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            getDownloadURL(ref(storage, 'IMG-20211211-WA0000.jpg'))
                .then((url) => {
                    // `url` is the download URL for 'images/stars.jpg'

                    // This can be downloaded directly:
                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = (event) => {
                        const blob = xhr.response;
                    };
                    xhr.open('GET', url);
                    xhr.send();
                    console.log(url)
                })
                .catch((error) => {
                    console.log(error)
                });
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', height: vh(50), marginTop: 20 }}>

                <Input
                    value={crateName}
                    onChangeText={changeCrateName}
                    // ref={nameref}
                    label='crate name here...'
                    containerStyle={{ width: vw(300), borderRadius: 20, marginRight: 10, backgroundColor: '#f1f1f1', borderWidth: 0.1 }}
                />
                <TouchableHighlight
                    onPress={() => {
                        // if (crateName != '') {
                        //     Keyboard.dismiss()
                        //     sheetRef.current.open()
                        // } else {
                        //     Alert.alert('Enter valid name!')
                        // }
                        Send()
                    }}
                >
                    <Image
                        source={{ uri: plusicon }}
                        resizeMode='contain'
                        style={{ width: vw(50), height: vh(50), borderRadius: 25 }}
                    />
                </TouchableHighlight>
            </View>



            <FlatList
                data={crates}
                renderItem={renderItem}
                keyExtractor={(item, index) => item + index + Math.random()}
            />
            <Sheet
                ref={sheetRef}
                data={Initial}
                closing={() => { }}
                height={vh(200)}
            />
            <Sheet
                ref={imageRef}
                data={() => BottomItems()}
                height={vh(300)}
            />
        </SafeAreaView>

    )
}
const mapStateToProps = (state) => ({
    crateName: state.crateDetailReducer.crateName,
    crateDescription: state.crateDetailReducer.crateDescription,
    crates: state.crateReducer.crates,
})
const mapDispatchToProps = (dispatch) => ({
    changeCrateName: (data) => {
        dispatch(CrateAction.changeCrateName(data))
    },
    addCrate: (callback) => {
        dispatch(CrateAction.addCrate(callback))
    },
    emptyName: () => {
        dispatch(CrateAction.emptyName())
    },
    addPhoto: (data, callback) => {
        dispatch(CrateAction.addPhoto(data, callback))
    },
    fetchContacts: (data, callback) => {
        dispatch(CrateAction.fetchedContacts(data, callback))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(Crate)

