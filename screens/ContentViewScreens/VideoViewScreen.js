import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import tw from '@lib/tailwind';
import {CONTENT} from '@queries';
import {VideoPlayer} from '@components';
import {useQuery} from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';

const VideoViewScreen = ({route}) => {
  const {loading: queryLoading, data: queryData} = useQuery(CONTENT, {
    variables: {contentId: route?.params?.contentId},
  });

  const data = queryData?.content?.payload || {};

  console.log({queryLoading, data});

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <VideoPlayer videoId={queryData?.content?.payload?.media?._id} />
      <ContentInfoScreen {...data} />
    </SafeAreaView>
  );
};

export default VideoViewScreen;

const ContentInfoScreen = props => {
  const renderItem = ({item}) => <Item {...item} />;

  const ListHeaderComponent = () => {
    return (
      <View style={tw`py-2`}>
        <View style={tw`px-4`}>
          <Text
            style={tw`font-avSemi text-base text-gray-600`}
            numberOfLines={2}>
            {props?.title}
          </Text>
          <Text style={tw`font-avReg text-xs text-amber-600`} numberOfLines={1}>
            #CGPSE #ACS #SSC #Mains
          </Text>
          <Text
            style={tw.style('font-avReg', 'text-gray-600', 'text-sm', {
              fontSize: 10,
            })}
            numberOfLines={1}>
            {props?.media?.time} Mins | 50k Watched | 223 Likes
          </Text>
        </View>
        <View
          style={tw`flex-row justify-around border-t border-b border-gray-100 px-2 my-2`}>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign name="like1" size={20} color={tw.color('blue-600')} />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', {fontSize: 10})}>
              Likes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign name="sharealt" size={20} color={tw.color('blue-600')} />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', {fontSize: 10})}>
              Share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign
              name="questioncircleo"
              size={20}
              color={tw.color('blue-600')}
            />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', {fontSize: 10})}>
              Doubts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign name="download" size={20} color={tw.color('blue-600')} />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', {fontSize: 10})}>
              Download
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('items-center', 'py-1', {width: 60})}>
            <AntDesign name="message1" size={20} color={tw.color('blue-600')} />
            <Text
              numberOfLines={1}
              style={tw.style('pt-1', 'font-avReg', {fontSize: 10})}>
              Live
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    // <LinearGradient
    //   locations={[0, 0.2, 0.5]}
    //   colors={[
    //     tw.color('indigo-200'),
    //     tw.color('indigo-50'),
    //     tw.color('white'),
    //   ]}
    //   style={tw`flex-1`}>
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={tw`bg-white`}
      ItemSeparatorComponent={() => <View style={tw`h-3`} />}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={() => <View style={tw`h-4`} />}
    />
    // </LinearGradient>
  );
};

const Item = ({image, title, course, color, info}) => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      locations={[0.5, 1]}
      colors={[tw.color('white'), tw.color(`${color}-200`)]}
      style={tw.style('flex-row', 'rounded-lg', 'shadow-sm', 'mx-4')}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        imageStyle={tw.style('rounded-lg', {
          opacity: 0.5,
        })}
        style={tw.style('rounded-lg', 'items-center', 'shadow-sm', 'bg-black', {
          height: 96,
        })}>
        <Image
          source={image}
          resizeMode="contain"
          style={tw.style({borderRadius: 20, height: 96, aspectRatio: 16 / 9})}
        />
      </ImageBackground>
      <View style={tw`flex-1 px-2 py-2 justify-between`}>
        <Text
          style={tw.style('font-avSemi', `text-${color}-700`, 'py-1', {
            fontSize: 10,
          })}
          numberOfLines={1}>
          {course}
        </Text>
        <Text
          style={tw`flex-1 font-avSemi text-xs text-gray-600`}
          numberOfLines={2}>
          {title}
        </Text>
        <Text
          style={tw.style('font-avReg', 'text-gray-600', 'py-1', {
            fontSize: 10,
          })}
          numberOfLines={1}>
          {info}
        </Text>
      </View>
    </LinearGradient>
  );
};

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    image: require('@images/vd1.jpeg'),
    title: 'CGPSC Prelims Hindi Medium Mobile Course',
    course: 'Geography',
    color: 'indigo',
    info: '45 Mins | 50k Watched | 223 Likes',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bb',
    image: require('@images/dc1.jpeg'),
    title: 'CGPSC Prelims PDF',
    course: 'Chhattisgarh',
    color: 'teal',
    info: '12 Pages | 5.5k Likes',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bc',
    image: require('@images/ts1.jpg'),
    title: 'CGPSC Prelims Mock Test',
    course: 'History',
    color: 'amber',
    info: '12 Ques | 5 Mins | 180 Attempts',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb898bc',
    image: require('@images/ts2.jpeg'),
    title: 'CGPSC Prelims Mock Test',
    course: 'History',
    color: 'amber',
    info: '12 Ques | 5 Mins | 180 Attempts',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed6-3ad53abb28bd',
    image: require('@images/vd4.jpg'),
    title: 'CGPSC Prelims Hindi Medium Mobile Course',
    course: 'Geography',
    color: 'indigo',
    info: '45 Mins | 50k Watched | 223 Likes',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed7-3ad53abb28ba',
    image: require('@images/vd5.jpg'),
    title: 'CGPSC Prelims Hindi Medium Mobile Course',
    course: 'Geography',
    color: 'indigo',
    info: '45 Mins | 50k Watched | 223 Likes',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed8-3ad53abb28bb',
    image: require('@images/vd6.jpg'),
    title: 'CGPSC Prelims Hindi Medium Mobile Course',
    course: 'Geography',
    color: 'indigo',
    info: '45 Mins | 50k Watched | 223 Likes',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed9-3ad53abb28bc',
    image: require('@images/vd7.jpg'),
    title: 'CGPSC Prelims Hindi Medium Mobile Course',
    course: 'Geography',
    color: 'indigo',
    info: '45 Mins | 50k Watched | 223 Likes',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed10-3ad53abb28bc',
    image: require('@images/vd8.jpg'),
    title: 'CGPSC Prelims Hindi Medium Mobile Course',
    course: 'Geography',
    color: 'indigo',
    info: '45 Mins | 50k Watched | 223 Likes',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed11-3ad53abb28bc',
    image: require('@images/vd9.jpg'),
    title: 'CGPSC Prelims Hindi Medium Mobile Course',
    course: 'Geography',
    color: 'indigo',
    info: '45 Mins | 50k Watched | 223 Likes',
  },
];
