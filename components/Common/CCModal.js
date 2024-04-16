import {
  Text,
  View,
  Modal,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {tw} from '@lib';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import FlashMessage, {FlashMessageManager} from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

export const CCModal = memo(
  ({visible = false, title = 'Modal', submitting, onClose, children}) => {
    const flashRef = useRef(null);

    const captureFlashMessageRef = useCallback(ref => {
      if (ref !== null) {
        FlashMessageManager.hold(ref);
        flashRef.current = ref;
      }
    }, []);

    function unholdFlashMessage() {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!flashRef.current) {
        FlashMessageManager.unhold();
      }
    }

    function closeModal() {
      unholdFlashMessage();
      onClose();
    }

    useEffect(() => {
      return () => unholdFlashMessage();
    }, []);

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={submitting ? null : closeModal}>
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
              <TouchableOpacity disabled={submitting} onPress={closeModal}>
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
        <FlashMessage ref={captureFlashMessageRef} position="top" icon="auto" />
      </Modal>
    );
  },
);
