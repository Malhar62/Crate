import React from 'react';
import { connect } from "react-redux"
import { StatusBar, View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback, Linking, TouchableOpacity } from 'react-native'
import { vh, vw } from "../Component/Scale";
import { usericon } from '../Redux/Constants'
import ImageViewer from 'react-native-image-zoom-viewer';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider, renderers
} from 'react-native-popup-menu';
import Carousel from 'react-native-snap-carousel';
import { CrateAction } from '../Redux/Actions/CrateAction';
import Share from 'react-native-share';


function ViewMedia(props) {
    const { route, navigation, crates, deleteCrateItem } = props;
    const { crateId, itemId, kind } = route.params;

    var crateNum = crates.findIndex(x => x.crateId == crateId);
    var InitialItemIndex = kind == 'gallery' || kind == 'camera' ?
        crates[crateNum].photos.findIndex(x => x.itemId == itemId) : kind == 'contact' ? crates[crateNum].contacts.findIndex(x => x.itemId == itemId) : null;

    var itemDetail = kind == 'gallery' || kind == 'camera' ? crates[crateNum].photos[InitialItemIndex] : kind == 'contact' ? crates[crateNum].contacts[InitialItemIndex] : null
    var ImageArray = crates[crateNum].photos.map(item => {
        return {
            url: item.path,
            width: Dimensions.get('screen').width,
            height: vh(600)
        }
    })
    var contactArray = crates[crateNum].contacts
    const sheetRef = React.createRef()
    const [currentItem, setCurrentItem] = React.useState(itemId)

    function ContactDetails({ label, value }) {
        return (
            <View style={styles.contactdetail}>
                <Text style={[styles.txt, { color: 'blue' }]}>{label}</Text>
                <Text style={styles.txt}>{value}</Text>
            </View>
        )
    }
    //Linking.openURL(`tel:${phoneNumber}`);
    // const MediaHeader = React.useCallback(() => {
    //     return (
    //         <View style={[styles.hdr, { width: '100%', paddingBottom: 5 }]}>
    //             <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
    //                 <Image
    //                     resizeMode='contain'
    //                     source={require('../Images/previous.png')}
    //                     style={styles.icon}
    //                 />
    //             </TouchableWithoutFeedback>
    //             <Menu>
    //                 <MenuTrigger>
    //                     <Image
    //                         source={require('../Images/more.png')}
    //                         resizeMode='contain'
    //                         style={styles.icon}
    //                     />
    //                 </MenuTrigger>
    //                 <MenuOptions>
    //                     <MenuOption onSelect={() => { console.log('editing') }} >
    //                         <Text style={{ color: 'red' }}>Edit</Text>
    //                     </MenuOption>
    //                     <MenuOption onSelect={() => { console.log('sharing') }} >
    //                         <Text style={{ color: 'red' }}>Share</Text>
    //                     </MenuOption>
    //                     <MenuOption onSelect={() => {
    //                         //console.log('+++', currentItem, kind)
    //                         onDelete()
    //                     }} >
    //                         <Text style={{ color: 'red' }}>Delete</Text>
    //                     </MenuOption>
    //                 </MenuOptions>
    //             </Menu>
    //         </View>
    //     )
    // }),[crates]


    function onDelete() {
        deleteCrateItem(crateId, currentItem, kind, () => {
            if (kind == 'camera' || kind == 'gallery') {
                crates[crateNum].photos.length ? null : navigation.goBack()
            } else {
                if (kind == 'contact') {
                    crates[crateNum].contacts.length ? null : navigation.goBack()
                } else {
                    null
                }
            }
            //navigation.goBack()
        })
    }
    const Identity = React.useCallback(() => {

        function renderCors({ item, index }) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                    <Image
                        resizeMode='contain'
                        source={item.photoUrl ? { uri: item.photoUrl } : usericon}
                        style={{ width: vw(200), height: vh(200) }}
                    />
                    <TouchableOpacity onPress={() => {
                        Linking.openURL(`tel:${item.phoneNumbers[0].number}`)
                    }}>

                        <ContactDetails
                            label={'Name :'}
                            value={item.userName}
                        />
                        <ContactDetails
                            label={'Number :'}
                            value={item.phoneNumbers[0].number}
                        />
                    </TouchableOpacity>
                </View>
            )
        }

        if (kind == 'gallery' || kind == 'camera') {
            return (
                <View>
                    <ImageViewer
                        imageUrls={ImageArray}
                        backgroundColor='transparent'
                        renderIndicator={() => null}
                        onChange={index =>
                            setCurrentItem(crates[crateNum].photos[index].itemId)
                        }
                        index={InitialItemIndex != -1 ? InitialItemIndex : 0}
                        loadingRender={() => { }}
                        style={{ width: Dimensions.get('screen').width, height: vh(400) }}
                        renderImage={(props) =>
                            <View>
                                <Image
                                    resizeMode='contain'
                                    {...props}
                                />
                            </View>
                        }
                    />
                </View>
            )
        } else {
            if (kind == 'contact') {
                return (
                    <View style={{}}>
                        <Carousel
                            //ref={sheetRef}
                            layout='default'
                            data={contactArray}
                            renderItem={renderCors}
                            onSnapToItem={(index) => {
                                //console.log('changed to: ', index)
                                setCurrentItem(crates[crateNum].contacts[index].itemId)
                            }}
                            //index={InitialItemIndex}
                            firstItem={InitialItemIndex}
                            sliderWidth={vw(400)}
                            itemWidth={vw(250)}
                            itemHeight={vh(400)}
                            sliderHeight={vh(400)}
                            //    centerContent={true}
                            contentContainerCustomStyle={{ backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}
                        />
                    </View>
                )
            }
        }
    }, [crates])

    const onShare = (urls, callback) => {
        Share.open({
            message: urls.message,
            url: urls.link == '' ? null : urls.link
        })
            .then((result) => { console.log('result', result); callback() })
            .catch((errorMsg) => { console.log(errorMsg), callback() });
    }

    return (
        <View style={{ flex: 1, paddingTop: 40, backgroundColor: '#a0e0f2' }}>
            <StatusBar
                backgroundColor='transparent'
                translucent
            />
            <MenuProvider>
                <View style={[styles.hdr, { width: '100%' }]}>
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                        <Image
                            resizeMode='contain'
                            source={require('../Images/previous.png')}
                            style={styles.icon}
                        />
                    </TouchableWithoutFeedback>
                    <Menu>
                        <MenuTrigger>
                            <Image
                                source={require('../Images/more.png')}
                                resizeMode='contain'
                                style={styles.icon}
                            />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => {
                                var message = ''
                                var link = ''
                                // if (kind == 'gallery' || kind == 'camera') {
                                //     var ind = crates[crateNum].photos(x => x.itemId == currentItem);
                                //     message=
                                // } else {
                                //     if (kind == 'contact') {

                                //     }
                                // }
                                switch (kind) {
                                    case ('gallery' || 'camera'):
                                        var ind = crates[crateNum].photos.findIndex(x => x.itemId == currentItem);
                                        message = 'Photo has been shared'
                                        link = crates[crateNum].photos[ind].path
                                        break;
                                    case 'contact':
                                        var ind = crates[crateNum].contacts.findIndex(x => x.itemId == currentItem);
                                        message = `Contact has been shared ${crates[crateNum].contacts[ind].userName} :  ${crates[crateNum].contacts[ind].phoneNumbers[0].number}`
                                        link = ''
                                        break;
                                }
                                onShare({ message, link }, () => {
                                    navigation.goBack()
                                })
                            }} >
                                <Text style={{ color: 'green' }}>Share</Text>
                            </MenuOption>
                            <MenuOption onSelect={onDelete}>
                                <Text style={{ color: 'red' }}>Delete</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Identity />
                </View>
            </MenuProvider>
        </View>
    )
}
const mapStateToProps = (state) => ({
    crates: state.crateReducer.crates
})
const mapDispatchToProps = (dispatch) => ({
    deleteCrateItem: (crateId, itemId, kind, callback) => {
        dispatch(CrateAction.deleteCrateItem(crateId, itemId, kind, callback))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ViewMedia);

const styles = StyleSheet.create({
    txt: {
        fontSize: 18,
        
    },
    contactdetail:
    {
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10, borderBottomWidth: 0.5,
    },
    icon: {
        width: vw(30), height: vh(30)
    },
    hdr: {
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center',
    }
})