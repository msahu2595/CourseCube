import React, {
  memo,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useCallback,
} from 'react';
import dayjs from 'dayjs';
import tw from '@lib/tailwind';
import {MediaItem} from '@components';
import {CCSearchInput} from './Common';
import {useQuery} from '@apollo/client';
import {DOCUMENTS, TESTS, VIDEOS} from '@queries';
import {showMessage} from 'react-native-flash-message';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {BottomModal, ModalContent, ModalTitle} from 'react-native-modals';

const SelectMediaModal = ({type, visible, onSelect, onClose}) => {
  const bottomModalRef = useRef(null);

  const MediaList = useMemo(() => {
    switch (type) {
      case 'Video':
        return () => <MediaVideoList onPress={onSelect} />;
      case 'Test':
        return () => <MediaTestList onPress={onSelect} />;
      case 'Document':
        return () => <MediaDocumentList onPress={onSelect} />;
      default:
        return () => <MediaEmptyList message="Please select media type!!" />;
    }
  }, [type, onSelect]);

  return (
    <CCBottomModal
      ref={bottomModalRef}
      title="Select Media"
      visible={visible}
      onClose={onClose}>
      <MediaList />
    </CCBottomModal>
  );
};

export default SelectMediaModal;

const CCBottomModal = memo(
  forwardRef(({visible = false, title = 'Modal', onClose, children}, ref) => {
    return (
      <BottomModal
        ref={ref}
        height={0.8}
        rounded={true}
        visible={visible}
        onSwipeOut={onClose}
        modalTitle={
          <ModalTitle
            title={title}
            align="flex-start"
            hasTitleBar={false}
            style={tw`px-3 pt-2 pb-0`}
            textStyle={tw`text-lg text-black font-avReg`}
          />
        }>
        <ModalContent style={tw`flex-1 p-0`}>{children}</ModalContent>
      </BottomModal>
    );
  }),
);

const MediaEmptyList = memo(({message}) => (
  <View style={tw`py-4 items-center`}>
    <Text style={tw`text-xs text-gray-600 font-avSemi`}>{message}</Text>
  </View>
));

const MediaVideoList = memo(({onPress}) => {
  const [search, setSearch] = useState('');

  const {loading, data, refetch, fetchMore} = useQuery(VIDEOS, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const onChangeSearchText = useCallback(
    text => {
      console.log(text);
      setSearch(text);
      if (text.length > 2) {
        refetch({search: text});
      } else {
        refetch({search: ''});
      }
    },
    [refetch],
  );

  const clearSearchText = useCallback(() => {
    setSearch('');
    refetch({search: ''});
  }, [refetch]);

  const _renderItem = useCallback(
    ({item}) => (
      <MediaItem
        item={item}
        label={item.time}
        title={item.title}
        image={item.thumbnail}
        onPress={() => onPress(item)}
      />
    ),
    [onPress],
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <CCSearchInput
        value={search}
        searching={loading}
        onChangeText={onChangeSearchText}
        onClear={clearSearchText}
      />
      <FlatList
        bounces={true}
        numColumns={2}
        //
        data={data?.videos?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-1`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={tw`h-1`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.videos?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </View>
  );
});

const MediaTestList = memo(({onPress}) => {
  const [search, setSearch] = useState('');

  const {loading, data, refetch, fetchMore} = useQuery(TESTS, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const onChangeSearchText = useCallback(
    text => {
      console.log(text);
      setSearch(text);
      if (text.length > 2) {
        refetch({search: text});
      } else {
        refetch({search: ''});
      }
    },
    [refetch],
  );

  const clearSearchText = useCallback(() => {
    setSearch('');
    refetch({search: ''});
  }, [refetch]);

  const _renderItem = useCallback(
    ({item}) => (
      <MediaItem
        item={item}
        title={item.title}
        image={item.thumbnail}
        label={`${
          dayjs.duration(item?.duration).hours()
            ? `${dayjs.duration(item?.duration).hours()}H`
            : ''
        } ${
          dayjs.duration(item?.duration).minutes()
            ? `${dayjs.duration(item?.duration).minutes()}M`
            : ''
        }`}
        onPress={() => onPress(item)}
      />
    ),
    [onPress],
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <CCSearchInput
        value={search}
        searching={loading}
        onChangeText={onChangeSearchText}
        onClear={clearSearchText}
      />
      <FlatList
        bounces={true}
        numColumns={2}
        //
        data={data?.tests?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-1`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={tw`h-1`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.tests?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </View>
  );
});

const MediaDocumentList = memo(({onPress}) => {
  const [search, setSearch] = useState('');

  const {loading, data, refetch, fetchMore} = useQuery(DOCUMENTS, {
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const onChangeSearchText = useCallback(
    text => {
      console.log(text);
      setSearch(text);
      if (text.length > 2) {
        refetch({search: text});
      } else {
        refetch({search: ''});
      }
    },
    [refetch],
  );

  const clearSearchText = useCallback(() => {
    setSearch('');
    refetch({search: ''});
  }, [refetch]);

  const _renderItem = useCallback(
    ({item}) => (
      <MediaItem
        item={item}
        title={item.title}
        image={item.thumbnail}
        label={`${item.pages} Pages`}
        onPress={() => onPress(item)}
      />
    ),
    [onPress],
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <CCSearchInput
        value={search}
        searching={loading}
        onChangeText={onChangeSearchText}
        onClear={clearSearchText}
      />
      <FlatList
        bounces={true}
        numColumns={2}
        //
        data={data?.documents?.payload}
        keyExtractor={item => item._id}
        renderItem={_renderItem}
        //
        contentContainerStyle={tw`px-1`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={tw`h-1`} />}
        //
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.documents?.payload.length,
              limit: 10,
            },
          });
        }}
      />
    </View>
  );
});
