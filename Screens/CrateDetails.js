import React from "react";
import { View, PermissionsAndroid, Text, FlatList, Image, TouchableHighlight, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlightBase, TouchableOpacity, Alert, ScrollView } from "react-native";
import { connect } from "react-redux";
import MediaContent from "../Component/MediaContent";
import { vh, vw } from "../Component/Scale";
import { CrateAction } from "../Redux/Actions/CrateAction";
import Sheet from '../Component/Sheet'
import ImagePicker from 'react-native-image-crop-picker';
import Contacts from 'react-native-contacts';
import { useIsFocused } from "@react-navigation/native";
import Accordion from 'react-native-collapsible/Accordion';
import { usericon, backicon } from '../Redux/Constants'

function CrateDetailScreen(props) {
    const { route, navigation, crates, addToFavorite, addPhoto, fetchContacts, all } = props
    const Similar = crates.filter(item => item.crateId === route.params.ID)
    const crateData = Similar[0]
    const sheetRef = React.createRef()
    const dotRef = React.createRef()
    const isFocused = useIsFocused()

    React.useEffect(() => {
        if (isFocused) {
            sheetRef.current.close()
            dotRef.current.close()
        }
    }, [isFocused])

    function fetchContactsFromRoot() {
        return new Promise((resolve, reject) => {
            Contacts.getAll()
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
    }

    function OpenContact(callback, errorCallback) {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                'title': 'Contacts',
                'message': 'This app would like to view your contacts.'
            }
        ).then(() => {
            //     Contacts.getAll()
            //         .then(res => {
            //             var extra = res.map((item) => {
            //                 let obj = {
            //                     ...item,
            //                     isSelected: false
            //                 }
            //                 return obj;
            //             })
            //             fetchContacts(extra, () => {
            //                 navigation.navigate('contactlist', { id: crateData.crateId })
            //             })
            //         })
            //         .catch((e) => {
            //             //console.warn(e)
            //             //sheetRef.current.close()
            //         })
            fetchContactsFromRoot()
                .then(contact => callback(contact))
                .catch(error => console.log(error))
        })
    }
    console.log('=====', crateData.contacts)
    function OpenGallery() {
        ImagePicker.openPicker({
            multiple: true
        }).then(images => {
            //console.log('response-->', images);
            let temp = images.map((item) => {
                let obj = {
                    ...item,
                    kind: 'gallery'
                }
                return obj;
            })
            temp.forEach(element => {
                addPhoto(element, () => {
                    sheetRef.current.close()
                })
            });
            navigation.navigate('imagescreen', { tag: 'gallery', id: crateData.crateId })
        })
    }
    function OpenCamera() {
        requestCameraPermission(() => {
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
            }).then(images => {
                //console.log(images)
                let obj = {
                    ...images,
                    kind: 'camera'
                }
                addPhoto(obj, () => {
                    sheetRef.current.close()
                    navigation.navigate('imagescreen', { tag: 'camera', id: crateData.crateId })
                })
            });
        })
    }
    const requestCameraPermission = async (callback) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //console.log("You can use the camera");
                callback()
            } else {
                //console.log("Camera permission denied");
            }
        } catch (err) {
            //console.warn(err);
        }
    }
    function HeaderIcons() {
        return (
            <View style={[styles.hdr, { width: '100%' }]}>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <Image
                        resizeMode='contain'
                        source={require('../Images/previous.png')}
                        style={styles.icon}
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => dotRef.current.open()}>
                    <Image
                        source={require('../Images/more.png')}
                        resizeMode='contain'
                        style={styles.icon}
                    />
                </TouchableWithoutFeedback>
            </View>
        )
    }
    function onMediaPress(id) {
        switch (id) {
            case 1:
                OpenGallery();
                break;
            case 2:
                requestCameraPermission(() => OpenCamera());
                break;
            case 3:
                OpenContact((res) => {
                    let Data = []
                    var extra = res.map((item) => {
                        let obj = {
                            userName: item.givenName,
                            photoUrl: item.thumbnailPath,
                            phoneNumbers: item.phoneNumbers,
                            emailAddresses: item.emailAddresses,
                            isSelected: false,
                            id: CrateAction.generateString(5)
                        }
                        return obj;
                    })
                    const MainArray = extra.sort(function (a, b) {
                        if (a.givenName < b.givenName) { return -1; }
                        if (a.givenName > b.givenName) { return 1; }
                        return 0;
                    })
                    for (var i = 65; i <= 90; i++) {
                        //$('#select_id_or_class').append('<option>' + String.fromCharCode(i) + '</option>');
                        Data.push({ title: String.fromCharCode(i), data: [] })
                    }
                    //console.log('alpha--', Data)
                    MainArray.forEach((item) => {
                        Data.forEach((element, index) => {
                            if (item.userName[0].toUpperCase() == element.title) {
                                element.data.push(item)
                            }
                        })
                    })
                    fetchContacts(Data, () => {
                        navigation.navigate('contactlist', { id: crateData.crateId })
                    })
                }, (text) => {
                    Alert.alert(text)
                })
            default:
                return null;
        }
    }
    function dotInside() {
        return (
            <View>
                {/* <TouchableOpacity onPress={() => {
                    dotRef.current.close();
                    sheetRef.current.open()
                }}>
                    <Text>Ad more</Text>
                </TouchableOpacity> */}
            </View>
        )
    }
    function Header({ name, id }) {
        return (
            <View>
                <View elevation={5} style={{ backgroundColor: '#fff', height: 50, width: vw(300), flexDirection: 'row', borderRadius: 7, alignItems: 'center', alignSelf: 'center', marginTop: 20, justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <TouchableOpacity onPress={() => {
                    }}>
                        <Text>{name}</Text>
                    </TouchableOpacity>
                    <Text>{'>'}</Text>
                </View>
                <Insider
                    name={name}
                />
            </View>
        )
    }
    function Insider({ name }) {
        var array = []
        var type = ''
        //console.log(name)
        switch (name) {
            case 'photo':
                type = 'photo'
                array = crateData.photos.map(item => {
                    let obj = {
                        title: "",
                        path: item.path,
                        kind: item.kind,
                        itemId: item.itemId
                    }
                    return obj
                })
                break;
            case 'contact':
                type = 'contact'
                array = crateData.contacts.map(item => {
                    let obj = {
                        title: item.userName,
                        path: item.photoUrl,
                        kind: 'contact',
                        itemId: item.itemId
                    }
                    return obj
                })
                break;
            default:
                return null;
        }
        //console.log('--', array, type)
        if (array.length == 0) {
            return (
                <View style={{ alignSelf: 'center', marginTop: vh(10) }}>
                    <Text>No {type}s available </Text>
                </View>
            )
        }
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

                {array.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                navigation.navigate('viewmedia', {
                                    kind: item.kind,
                                    crateId: crateData.crateId,
                                    itemId: item.itemId
                                })
                            }}
                        >
                            <View key={index}>
                                <View style={{ width: (Dimensions.get('screen').width / 2), height: vh(220), justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                    <Image
                                        resizeMode={item.kind == 'gallery' || item.kind == 'camera' ? 'cover' : 'contain'}
                                        source={item.path == 'undefined' || item.path == '' ? usericon : { uri: item.path }}
                                        style={{ width: vw(100), height: vh(150) }}
                                    />
                                    <Text>{item.title}</Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                    )
                })}
                {/* <FlatList
                    numColumns={2}
                    key={'#'}
                    showsVerticalScrollIndicator={false}
                    data={array}
                    renderItem={({ item, index }) => (
                        <View>
                            <View style={{ width: (Dimensions.get('screen').width / 2), height: vh(220), justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <Image
                                    resizeMode='contain'
                                    source={item.path == 'undefined' || item.path == '' ? usericon : { uri: item.path }}
                                    style={{ width: vw(100), height: vh(150) }}
                                />
                                <Text>{item.title}</Text>
                            </View>

                        </View>
                    )}
                    contentContainerStyle={{ marginTop: 20 }}
                    ItemSeparatorComponent={() =>
                        <View
                            style={{ width: 10 }}
                        />}
                    ListEmptyComponent={() =>
                        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                            <Text>Nothing To Show</Text>
                        </View>
                    }
                /> */}
            </View>
        )
    }
    return (
        <View style={{ flex: 1, paddingTop: 20, backgroundColor: '#f1f1f1', }}>
            <HeaderIcons />
            <View style={{ width: vw(300), alignSelf: 'center', marginTop: 20, borderBottomWidth: 1 }}>
                <Text style={styles.text} >{crateData.crateName}</Text>
            </View>
            <ScrollView>
                <View>
                    <Header
                        name='photo'
                        id={1}
                    />
                    <Header
                        name='contact'
                        id={2}
                    />
                </View>
            </ScrollView>
            {/* <FlatList
                numColumns={2}
                key={'#'}
                showsVerticalScrollIndicator={false}
                data={crateData.photos.slice()}
                renderItem={({ item, index }) => (
                    <View style={{ width: (Dimensions.get('screen').width / 2), height: vh(200), justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Image
                            source={{ uri: item.path }}
                            style={{ width: vw(150), height: vh(200) }}
                        />
                    </View>
                )}
                contentContainerStyle={{ marginTop: 20 }}
                ItemSeparatorComponent={() =>
                    <View
                        style={{ width: 10 }}
                    />}
                ListEmptyComponent={() =>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                        <Text>Nothing To Show</Text>
                    </View>
                }
                ListHeaderComponent={() =>
                    <View style={{ alignSelf: 'center', borderBottomWidth: 1 }}>
                        <Text>SAVED PHOTOS</Text>
                    </View>
                }
            /> */}
            <View
                elevation={5}
                style={{
                    position: 'absolute', bottom: vh(20), alignSelf: 'center'
                }}>
                <TouchableWithoutFeedback onPress={() => sheetRef.current.open()}>
                    <Image
                        resizeMode='contain'
                        source={require('../Images/plus.png')}
                        style={styles.plus}
                    />
                </TouchableWithoutFeedback>
            </View>

            <Sheet
                ref={sheetRef}
                data={() => {
                    return (
                        <MediaContent
                            onPress={id => onMediaPress(id)}
                        />
                    )
                }}
                closing={() => sheetRef.current.close()}
                height={200}
            />
            <Sheet
                ref={dotRef}
                data={dotInside}
                height={200}
            />
        </View>
    )
}
const mapStateToProps = (state) => ({
    crates: state.crateReducer.crates,
    allcontacts: state.crateReducer.allcontacts
})
const mapDispatchToProps = (dispatch) => ({
    addToFavorite: (id) => {
        dispatch(CrateAction.addToFavorite(id))
    },
    addPhoto: (data, callback) => {
        dispatch(CrateAction.addPhoto(data, callback))
    },
    fetchContacts: (data, callback) => {
        dispatch(CrateAction.fetchedContacts(data, callback))
    }

})
export default connect(mapStateToProps, mapDispatchToProps)(CrateDetailScreen)

const styles = StyleSheet.create({
    text: {
        fontSize: 30, fontFamily: 'font1', textAlign: 'center'
    },
    plus: {
        width: vw(70), height: vh(70), borderRadius: 35
    },
    main: {
        flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f1f1', paddingVertical: 10, paddingLeft: 10
    },
    icon: {
        width: vw(25), height: vh(25)
    },
    hdr: {
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center',
    }
})
/**
 *  <View>
                    <TouchableWithoutFeedback onPress={() => {
                        addToFavorite(crateData.crateId)
                    }}>
                        <Image
                            source={crateData.isFavorite ? require('../Images/star-selected.png') : require('../Images/star-notselected.png')}
                            style={{ width: vw(30), height: vh(30) }}
                        />
                    </TouchableWithoutFeedback>
                </View>
 */









/**
 *  <ScrollView>
<Accordion
activeSections={active}
sections={queStore.scores}
touchableComponent={TouchableOpacity}
expandMultiple={false}
renderHeader={renderHeader}
renderContent={renderContent}
duration={400}
containerStyle={{ paddingBottom: high + 20 }}
sectionContainerStyle={{ marginHorizontal: 10, marginTop: 20 }}
onChange={(id) => {
setActive(id);
}}
/>
</ScrollView>
 */