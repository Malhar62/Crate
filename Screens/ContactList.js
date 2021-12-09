import { connect } from "react-redux"
import { View, Button, FlatList, Text, TouchableOpacity,SafeAreaView, TouchableHighlight, SectionList, Animated, Keyboard, Image, PermissionsAndroid, StyleSheet, } from 'react-native'
import React from 'react';
import { vh, vw } from "../Component/Scale";
import { ActionTypes, usericon } from '../Redux/Constants/index'
import { CrateAction } from "../Redux/Actions/CrateAction";
import Loader from '../Component/Loader'
import ContactCard from "../Component/ContactCard";
import Input from "../Component/Input";
import { searchicon } from '../Redux/Constants'

function ContactList(props) {
    const {
        route, navigation, availablecontacts, selectContact, addContactToCrate, allcontacts
    } = props
    const [search, setSearch] = React.useState('')
    const [count, setCount] = React.useState(2)
    function Checker() {
        var isAny = 0;
        allcontacts.forEach(element => {
            element.data.forEach(sub => {
                if (sub.isSelected) {
                    isAny++;
                }
            })
        });
        if (isAny == 0) {
            return false;
        } else {
            return true;
        }
    }
    function Header({ section }) {
        return (
            <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{section.title}</Text>
            </View>
        )
    }
    function renderItem({ item, index, section }) {
        return (
            <ContactCard
                image={item.photoUrl}
                name={item.userName}
                selectContact={(id) => selectContact(id)}
                //index={index}
                id={item.id}
                isSelected={item.isSelected}
            />
        )
    }
    function getData() {
        return allcontacts
            .map((item) => {
                return {
                    data: item.data.filter(
                        (subItem) =>
                            subItem.userName
                                .toLowerCase()
                                .startsWith(search.toLowerCase())
                    ),
                    title: item.title,
                };
            })
            .filter((item) => item.data.length).slice(0, count)
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 20 }}>
            <Text style={{ fontSize: 18, textAlign: 'center' }}>SELECT CONTACTS YOU WANT TO ADD</Text>
            <Input
                value={search}
                onChangeText={data => setSearch(data)}
                label='search contact...'
                containerStyle={{ width: vw(300), alignSelf: 'center', borderWidth: 1, borderRadius: 5 }}
                righticon={search == '' ? searchicon : null}
                righttext={search == '' ? null : 'CLEAR'}
                rightPress={() => {
                    console.log('done')
                    if (search != '') {
                        setSearch('')
                    }
                }}
            />
            <SectionList
                sections={getData()}
                renderSectionHeader={Header}
                renderItem={renderItem}
                ListEmptyComponent={() => {
                    return (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>No contacts available</Text>
                        </View>
                    )
                }}
                containerStyle={{ height: vh(600) }}
                onEndReached={() => {
                    if (count < 26) {
                        setCount(count + 2)
                    }
                }}
                onEndReachedThreshold={0.5}
            />
            {/* <FlatList
                data={allcontacts[0].data}
                initialNumToRender={4}
                refreshing={Loader}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => selectContact(index)}>
                        <View style={[styles.main, { backgroundColor: item.isSelected ? 'rgba(104, 168, 237,0.8)' : '#fff' }]}>
                            <View>
                                <Image
                                    resizeMode='contain'
                                    source={item.thumbnailPath ? { uri: item.thumbnailPath } : usericon}
                                    style={{ width: vw(50), height: vh(50) }}
                                />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.userName}</Text>
                                <Text style={{ fontSize: 18 }}>{item.phoneNumbers.length ? item.phoneNumbers[0].number : 'Number not available'}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={index => index + Math.random()}
                contentContainerStyle={{ marginTop: 20, paddingBottom: 20, overflow: 'hidden' }}
            /> */}
            {Checker() ? <View style={styles.bottombtn}>
                <TouchableOpacity onPress={() => addContactToCrate(route.params.id, () => {
                    navigation.goBack()
                })}>
                    <Text style={{ fontSize: 20,  color: '#fff' }}>ADD TO CRATE</Text>
                </TouchableOpacity>
            </View> : null}
        </SafeAreaView>
    )
}
//getContactsMatchingString(string)
const mapStateToProps = (state) => ({
    allcontacts: state.crateReducer.allcontacts
})
const mapDispatchToProps = (dispatch) => ({
    selectContact: (id) => {
        dispatch(CrateAction.selectContact(id))
    },
    addContactToCrate: (id, callback) => {
        dispatch(CrateAction.addContactToCrate(id, callback))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ContactList)

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f1f1', paddingVertical: 10, paddingLeft: 10
    },
    bottombtn: {
        position: 'absolute', bottom: 10, left: 10, right: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#a455e0', height: 50, borderRadius: 10
    }
})