import {
  Fab,
  SyllabusTree,
  LoadingIndicator,
  SafeAreaContainer,
} from '@components';
import {tw} from '@lib';
import {Alert} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {gql, useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useMemo, useState} from 'react';
import AddBundleSyllabusModal from 'components/AddBundleSyllabusModal';
import EditBundleSyllabusModal from 'components/EditBundleSyllabusModal';

export const BUNDLE_SYLLABUS = gql`
  query bundleSyllabus($bundleId: ID!) {
    bundleSyllabus(bundleId: $bundleId) {
      code
      success
      message
      token
      payload
    }
  }
`;

const DELETE_BUNDLE_SYLLABUS = gql`
  mutation deleteBundleSyllabus(
    $bundleId: ID!
    $syllabusInput: BundleSyllabusDeleteInput!
  ) {
    deleteBundleSyllabus(bundleId: $bundleId, syllabusInput: $syllabusInput) {
      code
      success
      message
      token
      payload
    }
  }
`;

const AdminCourseSyllabusScreen = ({navigation, route: {params}}) => {
  const [addBundleSyllabusModal, setAddBundleSyllabusModal] = useState(null);
  const [editBundleSyllabusModal, setEditBundleSyllabusModal] = useState(null);

  const {loading: queryLoading, data: queryData} = useQuery(BUNDLE_SYLLABUS, {
    variables: {bundleId: params?.bundleId},
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const data = useMemo(() => {
    function recursive(s, sv = []) {
      return s.syllabus?.map(sub => {
        let value = [...sv, sub.subjectId];
        return {
          ...sub,
          value,
          syllabus: recursive(sub, value),
        };
      });
    }
    return recursive(queryData?.bundleSyllabus?.payload || []);
  }, [queryData]);

  const [deleteBundleSyllabus, {loading: mutationLoading}] = useMutation(
    DELETE_BUNDLE_SYLLABUS,
    {
      onCompleted: () => {
        showMessage({
          message: 'Subject successfully deleted.',
          type: 'success',
        });
      },
      onError: err => {
        showMessage({
          message: err?.message || 'Some unknown error occurred. Try again!!',
          type: 'danger',
        });
      },
      refetchQueries: [
        {query: BUNDLE_SYLLABUS, variables: {bundleId: params?.bundleId}},
      ],
    },
  );

  const deleteHandler = useCallback(
    syllabusInput =>
      Alert.alert(
        'Delete Chapter/Subject',
        'Are you sure, you want to delete this chapter/subject?',
        [
          {
            text: 'Yes',
            onPress: () =>
              deleteBundleSyllabus({
                variables: {bundleId: params?.bundleId, syllabusInput},
              }),
            style: 'destructive',
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
      ),
    [params, deleteBundleSyllabus],
  );

  const onNavigate = useCallback(
    payload => {
      navigation.navigate('CourseContentListTopTabNavigator', {
        bundleId: params?.bundleId,
        subjectId: payload?.subjectId,
      });
    },
    [navigation, params],
  );

  return (
    <>
      <SafeAreaContainer
        statusBgColor={tw.color('blue-600')}
        statusBarStyle="dark-content">
        {!queryLoading && (
          <SyllabusTree
            data={data}
            onPress={onNavigate}
            onPressAdd={setAddBundleSyllabusModal}
            onPressEdit={setEditBundleSyllabusModal}
            onPressDelete={deleteHandler}
            isAdmin={true}
          />
        )}
        <AddBundleSyllabusModal
          bundleId={params?.bundleId}
          data={addBundleSyllabusModal}
          onClose={() => {
            setAddBundleSyllabusModal(null);
          }}
        />
        <EditBundleSyllabusModal
          bundleId={params?.bundleId}
          data={editBundleSyllabusModal}
          onClose={() => {
            setEditBundleSyllabusModal(null);
          }}
        />
        <Fab
          iconName="plus"
          bgColor={tw.color('blue-600')}
          onPress={() => setAddBundleSyllabusModal({})}
        />
      </SafeAreaContainer>
      <LoadingIndicator loading={queryLoading || mutationLoading} />
    </>
  );
};

export default AdminCourseSyllabusScreen;
