/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
import {useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  RefreshControl,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '@lib/tailwind';
import {ARTICLES} from '@queries';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CurrentAffairItem, SafeAreaContainer} from '@components';
import LinearGradient from 'react-native-linear-gradient';
import * as yup from 'yup';
import {EDIT_ARTICLE} from 'apollo/mutations/EDIT_ARTICLE';
import {showMessage} from 'react-native-flash-message';
import {Formik} from 'formik';
import {CREATE_ARTICLE} from '@mutations';
import {DELETE_ARTICLE} from 'apollo/mutations/DELETE_ARTICLE';

const AdminArticleListScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [search, setSearch] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(null);
  const [createModalVisible, setCrearteModalVisible] = useState(false);

  const {loading, data, error, refetch, fetchMore} = useQuery(ARTICLES, {
    variables: {offset: 0},
  });

  const [deleteArticle] = useMutation(DELETE_ARTICLE, {
    onCompleted: data => {
      console.log(data);

      showMessage({
        message: 'Your Article successfully deleted',
        type: 'success',
      });
    },
    onError: err => {
      console.log(err);
      showMessage({
        message: 'Not able to delete',
        type: 'danger',
      });
    },
    refetchQueries: ['articles'],
  });

  const deleteHandler = articleId =>
    Alert.alert('Delete Article', 'Are you want to delete article', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          deleteArticle({
            variables: {articleId},
          }),
      },
    ]);

  // console.log(data.articles.payload);
  // console.log(width);

  const Item = useCallback(({item, index}) => {
    return (
      <View index={index} {...item}>
        <CurrentAffairItem index={index} {...item} />
        <View style={tw`flex flex-row justify-evenly `}>
          <Button
            onPress={() => setEditModalVisible(item)}
            title="Edit"
            color="#841584"
          />
          {/* <Button
            onPress={() => setDeleteModalVisible(item)}
            title="Delete"
            color="#0866d6"
          /> */}
          <Button
            title={'Delete'}
            onPress={() => {
              deleteHandler(item._id);
            }}
          />
        </View>
      </View>
    );
  });
  console.log(editModalVisible);
  if (loading) return <Text>Submitting...</Text>;
  if (error) return <Text>Submission error! ${error.message}</Text>;

  return (
    <>
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center m-2`}>
          <View
            style={tw`flex-1 flex-row  justify-between rounded-lg px-2 items-center border`}>
            <TextInput
              placeholder="Search"
              onChangeText={text => {
                console.log('text', text);
                setSearch(text);
                if (text.length > 2) {
                  refetch({search: text});
                } else {
                  refetch({search: ''});
                }
              }}
              value={search}
            />

            <TouchableOpacity
              onPress={() => {
                setSearch('');
                refetch({search: ''});
              }}>
              <MaterialIcons name="clear" size={20} color={tw.color('black')} />
            </TouchableOpacity>
          </View>

          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            style={tw`ml-2`}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value => {
              setIsEnabled(value);
              refetch({filter: {enable: !value}});
            }}
            value={isEnabled}
          />
          <TouchableOpacity onPress={() => setCrearteModalVisible(true)}>
            <MaterialIcons
              name="add-circle"
              size={40}
              color={tw.color('blue-600')}
            />
          </TouchableOpacity>
          {/* <View style={tw` `}>
          <Button
            title="+"
            onPress={() => navigation.navigate('AdminCreateArticleScreen')}
          />
        </View> */}
        </View>
        <SafeAreaContainer
          statusBgColor={tw.color('gray-300')}
          statusBarStyle="dark-content">
          <LinearGradient
            locations={[0, 0.5, 1]}
            colors={[
              tw.color('gray-300'),
              tw.color('gray-200'),
              tw.color('gray-100'),
            ]}
            style={tw`flex-1`}>
            <FlatList
              bounces={true}
              data={data?.articles?.payload}
              renderItem={({item}) => <Item item={item} />}
              keyExtractor={item => item._id}
              // contentContainerStyle={tw`bg-white`}
              // ItemSeparatorComponent={() => <View style={tw`h-3`} />}
              ListHeaderComponent={() => <View style={tw`h-2`} />}
              ListFooterComponent={() => <View style={tw`h-2`} />}
              onEndReached={() => {
                console.log('reached end');
                fetchMore({
                  variables: {
                    offset: data?.articles?.payload.length,
                    limit: 10,
                  },
                });
              }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refetch} />
              }
            />
          </LinearGradient>
        </SafeAreaContainer>
      </View>
      <AdminCreateArticleScreen
        visible={createModalVisible}
        onClose={() => {
          setCrearteModalVisible(null);
        }}
      />
      <AdminEditArticleScreen
        item={editModalVisible}
        onClose={() => {
          setEditModalVisible(null);
        }}
      />
    </>
  );
};

export default AdminArticleListScreen;

const AddValidationSchema = yup.object({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  author: yup.string().required('required'),
});

export const AdminCreateArticleScreen = ({visible, onClose}) => {
  const [createArticle, {loading, error}] = useMutation(CREATE_ARTICLE, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your Article Successfully added.',
        type: 'success',
      });
    },
    onError: err => {
      console.log(err);
    },
    refetchQueries: ['articles'],
  });

  if (loading) return <Text>Submitting...</Text>;
  if (error) return <Text>Submission error! ${error.message}</Text>;

  // console.log(data);

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={tw`bg-white`}>
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <Formik
          initialValues={{
            title: '',
            description: '',
            author: '',
          }}
          validationSchema={AddValidationSchema}
          onSubmit={values => {
            console.log('onSubmit', values);
            createArticle({
              variables: {
                articleInput: {
                  title: values.title,
                  description: values.description,
                  author: values.author,
                },
              },
            });
          }}>
          {({
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <TextInput
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                placeholder="title"
              />
              {errors.title && touched.title ? (
                <Text>{errors.title}</Text>
              ) : null}

              <TextInput
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="description"
              />
              <TextInput
                onChangeText={handleChange('author')}
                onBlur={handleBlur('author')}
                value={values.language}
                placeholder="author"
              />
              {errors.language && touched.language ? (
                <Text>{errors.language}</Text>
              ) : null}

              <Button
                onPress={() => {
                  console.log('handleSubmit', values);
                  handleSubmit();
                }}
                title="Submit"
              />
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
};

const ValidationSchema = yup.object({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  author: yup.string().required('required'),
});

export const AdminEditArticleScreen = ({item, onClose}) => {
  const [editArticle, {loading, error}] = useMutation(EDIT_ARTICLE, {
    onCompleted: data => {
      console.log(data);
      onClose();
      showMessage({
        message: 'Your Article successfully Edited',
        type: 'success',
      });
    },
    onError: err => {
      console.log(err);
    },
    refetchQueries: ['articles'],
  });

  if (loading) return <Text>'Submitting....'</Text>;
  if (error) return <Text>'Submission error!{error.message}'</Text>;

  return (
    <Modal visible={!!item} transparent={true} onRequestClose={onClose}>
      <View style={tw`bg-white`}>
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <Formik
          initialValues={{
            title: item?.title,
            id: item?._id,
            description: item?.description,
            author: item?.author,
          }}
          validationSchema={ValidationSchema}
          onSubmit={values => {
            console.log({
              variables: {
                articleId: values.id,
                articleInput: {
                  title: values.title,
                  description: values.description,
                  author: values.author,
                },
              },
            });
            editArticle({
              variables: {
                articleId: values.id,
                articleInput: {
                  title: values.title,
                  description: values.description,
                  author: values.author,
                },
              },
            });
          }}>
          {({
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <TextInput
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                placeholder="title"
              />
              {errors.title && touched.title ? (
                <Text>{errors.title}</Text>
              ) : null}

              <TextInput
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="description"
              />
              <TextInput
                onChangeText={handleChange('author')}
                onBlur={handleBlur('author')}
                value={values.language}
                placeholder="author"
              />
              {errors.language && touched.language ? (
                <Text>{errors.language}</Text>
              ) : null}

              <Button
                onPress={() => {
                  console.log('handleSubmit', values);
                  handleSubmit();
                }}
                title="Submit"
              />
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
};
