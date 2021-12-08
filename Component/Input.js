import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { vh, vw } from './Scale';

const Input = ({ label, onChangeText, value, style, lefticon, righticon, leftPress, rightPress, righttext, containerStyle }) => {
  return (
    <View style={{ ...containerStyle, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, overflow: 'hidden' }}>
      <TouchableOpacity onPress={leftPress}>
        {lefticon ? <Image
          resizeMode='contain'
          source={lefticon ? lefticon : null}
          style={{ width: vw(20), height: vh(20) }}
        /> : null}
      </TouchableOpacity>
      <TextInput
        style={[styles.input, style, { width: '80%' }]}
        value={value}
        onChangeText={(data) => onChangeText(data)}
        placeholder={label}
        maxLength={30}
      />
      <TouchableOpacity onPress={rightPress}>
        {righticon ?
          <Image
            resizeMode='contain'
            source={righticon ? righticon : null}
            style={{ width: vw(20), height: vh(20) }}
          /> :
          <Text>{righttext ? righttext : ''}</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  label: {
    color: 'red',
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingLeft: 10,

  },
  inputFocused: {
    borderBottomColor: 'blue',
  },
});

export default Input;
