import React from "react";
import { View, PermissionsAndroid, Text, SafeAreaView, FlatList, Image, TouchableHighlight, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlightBase, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
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
import Input from "../Component/Input";

function CrateDetailScreen(props) {
    const { route, navigation, crates, addToFavorite, addPhoto, fetchContacts, editCrate } = props
    const Similar = crates.filter(item => item.crateId === route.params.ID)
    const crateData = Similar[0]
    const sheetRef = React.createRef()
    const dotRef = React.createRef()
    const isFocused = useIsFocused()
    const isEdit = route.params.isEdit ? true : false
    React.useEffect(() => {
        if (isFocused) {
            sheetRef.current.close()
            dotRef.current.close()
        }
    }, [isFocused])
    const [editname, setEditname] = React.useState(crateData.crateName)
    const [editphoto, setEditphoto] = React.useState(crateData.photos)
    const [editcontact, setEditcontact] = React.useState(crateData.contacts)
    function fetchContactsFromRoot() {
        return new Promise((resolve, reject) => {
            Contacts.getAll()
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
    }

    function OpenContact(callback, errorCallback) {
        Platform.OS == 'ios' ? fetchContactsFromRoot()
            .then(contact => {
                sheetRef.current.close()
                callback(contact)
            })
            .catch(error => console.log(error)) :
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'Contacts',
                    'message': 'This app would like to view your contacts.'
                }
            ).then(() => {

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
    function editChanges() {
        editCrate({ crateName: editname, photos: editphoto, contacts: editcontact, crateId: crateData.crateId }, () => {
            navigation.navigate('crate')
        })
    }
    function showConfirm() {
        Alert.alert(
            'Confirm',
            'Are you sure to edit changes?',
            [
                {
                    text: 'YES',
                    onPress: () => editChanges()
                }, {
                    text: 'CANCEL',
                    style: 'cancel'
                }
            ]
        )
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
                <TouchableWithoutFeedback onPress={() => {
                    if (isEdit) {
                        showConfirm()
                    } else {
                        dotRef.current.open()
                    }
                }}>
                    {isEdit ?
                        <Text>EDIT</Text>
                        : <Image
                            source={require('../Images/more.png')}
                            resizeMode='contain'
                            style={styles.icon}
                        />}
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
                <TouchableOpacity onPress={() => {
                    dotRef.current.close();
                    sheetRef.current.close();
                    navigation.navigate('cratedetail', {
                        ID: crateData.crateId,
                        isEdit: true
                    })
                }}>
                    <Text>Edit Crate</Text>
                </TouchableOpacity>
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
                array =
                    isEdit ?
                        editphoto.map(item => {
                            let obj = {
                                title: "",
                                path: item.path,
                                kind: item.kind,
                                itemId: item.itemId
                            }
                            return obj
                        })
                        :
                        crateData.photos.map(item => {
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
                array =
                    isEdit ?
                        editcontact.map(item => {
                            let obj = {
                                title: item.userName,
                                path: item.photoUrl,
                                kind: 'contact',
                                itemId: item.itemId
                            }
                            return obj
                        })
                        :
                        crateData.contacts.map(item => {
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
                                if (!isEdit) {
                                    navigation.navigate('viewmedia', {
                                        kind: item.kind,
                                        crateId: crateData.crateId,
                                        itemId: item.itemId
                                    })
                                }
                            }}
                        >
                            <View style={{ width: (Dimensions.get('screen').width / 2), height: vh(220), justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <View style={{ width: vw(100), height: vh(150) }}>
                                    <Image
                                        resizeMode={item.kind == 'gallery' || item.kind == 'camera' ? 'cover' : 'contain'}
                                        source={item.path == 'undefined' || item.path == '' ? usericon : { uri: item.path }}
                                        style={{ width: vw(100), height: vh(150) }}
                                    />
                                    <Text>{item.title}</Text>
                                    {isEdit ? <TouchableHighlight
                                        style={{ position: 'absolute', top: -5, right: -5 }}
                                        onPress={() => {
                                            if (type == 'photo') {
                                                var tempPhoto = [...editphoto];
                                                tempPhoto.splice(index, 1)
                                                setEditphoto(tempPhoto)
                                            } else {
                                                if (type == 'contact') {
                                                    var tempContact = [...editcontact];
                                                    tempContact.splice(index, 1)
                                                    setEditcontact(tempContact)
                                                }
                                            }
                                        }}
                                    >
                                        <Image
                                            source={require('../Images/cancel.png')}
                                            style={{ width: 20, height: 20 }}
                                        />
                                    </TouchableHighlight> : null}
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
        <SafeAreaView style={{ flex: 1, paddingTop: 20, backgroundColor: '#f1f1f1', }}>
            <HeaderIcons />
            <View style={{ width: vw(300), alignSelf: 'center', marginTop: 20, borderBottomWidth: 1 }}>
                {isEdit ?
                    <Input
                        value={editname}
                        label='Enter crate name'
                        onChangeText={(data) => setEditname(data)}
                        containerStyle={{ borderWidth: 0.2, borderRadius: 5 }}
                        righttext={editname != '' ? 'ClEAR' : null}
                        rightPress={() => {
                            if (editname != '') {
                                setEditname('')
                            }
                        }}
                        righticon={
                            editname == '' ?
                                { uri: 'data:image/png;base64,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' }
                                : null
                        }
                    //
                    />
                    : <Text style={styles.text} >{crateData.crateName}</Text>}
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
            {!isEdit ? <View
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
            </View> : null}

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
        </SafeAreaView>
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
    },
    editCrate: (data, callback) => {
        dispatch(CrateAction.editCrate(data, callback))
    }

})
export default connect(mapStateToProps, mapDispatchToProps)(CrateDetailScreen)

const styles = StyleSheet.create({
    text: {
        fontSize: 30, textAlign: 'center'
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