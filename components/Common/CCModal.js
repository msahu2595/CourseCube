import {tw} from '@lib';
import React, {memo} from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

export const CCModal = memo(
  ({visible = false, title = 'Modal', submitting, onClose, children}) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={submitting ? null : onClose}>
      <View
        style={tw`flex-1 bg-black bg-opacity-75 items-center justify-center`}>
        <View
          style={tw.style('bg-white rounded-lg px-3 pt-2 pb-3', {
            width: width - 64,
            maxWidth: 480,
            maxHeight: height - height * 0.2,
          })}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-lg text-black font-avReg`}>{title}</Text>
            <TouchableOpacity disabled={submitting} onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={28}
                color={tw.color('black')}
              />
            </TouchableOpacity>
          </View>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  ),
);
