import { connect } from "react-redux"
import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Button, Image } from "react-native"
import { deleteTicked, ticker } from '../Redux/Actions'

function Editor(props) {
    const { items, ticker, deleteTicked, tagobj } = props;

    function giveOpacity() {
        var counter = items.filter(x => x.selected)
        if (counter.length == 0) {
            return 0.5;
        } else {
            return 1;
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <Text>{tagobj.game}</Text>
            <Text>{tagobj.obj1.obj2.obj3.tag}</Text>
            <FlatList
                data={items}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => {
                        var dupli = items.map((item, ind) => {
                            if (ind != index) {
                                item.selected = false;
                            }
                            return item
                        })
                        dupli[index].selected = !dupli[index].selected
                        ticker(dupli)
                    }}>
                        <View style={{ backgroundColor: '#f1f1f1', marginTop: 15, height: 50 }}>
                            <Text>{item.id}.{item.title}</Text>
                        </View>
                        <View style={{ position: 'absolute', right: 0, alignItems: 'center', height: 50, marginTop: 15 }}>
                            <Image
                                source={{ uri: item.selected ? 'https://cdn2.vectorstock.com/i/1000x1000/65/16/tick-icon-symbol-green-checkmark-isolated-vector-24026516.jpg' : 'data:image/png;base64,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' }}
                                style={{ width: 30, height: 30, borderRadius: 15 }}
                            />
                        </View>
                    </TouchableOpacity>
                )}
            />
            <View style={{ opacity: giveOpacity(), position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <Button
                    title='delete'
                    onPress={() => deleteTicked()}
                />
            </View>
        </View>
    )
}
const mapStateToProps = (state) => ({
    items: state.red.items,
    tagobj: state.red.obj
})
const mapDispatchToProps = (dispatch) => ({
    ticker: (data) => { dispatch(ticker(data)) },
    deleteTicked: () => { dispatch(deleteTicked()) }
})
export default connect(mapStateToProps, mapDispatchToProps)(Editor)