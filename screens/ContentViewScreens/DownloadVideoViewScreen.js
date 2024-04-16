import {
  Text,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import tw from '@lib/tailwind';
import React, {PureComponent} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {fileDecipher, getDownload} from 'lib/fileHandler';
import {InfoItem, SafeAreaContainer, VideoPlayer} from '@components';

class DownloadVideoViewScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.params = this.props.route.params;
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      loading: true,
      error: null,
      data: null,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.updateDimensions);
    getDownload(this.params.contentId)
      .then(async res => {
        console.log({res});
        const file = await fileDecipher(
          res?.media?.file,
          res?.media?.file.split('/').pop(),
          res?.media?.iv,
          res?.media?.salt,
        );
        this.setState({
          loading: false,
          data: {...res, media: {...res.media, file}},
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error,
        });
      });
  }

  updateDimensions({window}) {
    this.setState({
      width: window.width,
      height: window.height,
    });
  }

  render() {
    const {width, height, loading, error, data} = this.state;

    if (error) {
      return (
        <SafeAreaContainer style={tw`justify-center items-center`}>
          <Text style={tw`text-black align-center`}>
            Unexpected error happened, Please try again!
          </Text>
        </SafeAreaContainer>
      );
    }

    return (
      <SafeAreaContainer style={tw`bg-black`}>
        {loading ? (
          <View
            style={tw.style('bg-black justify-center', {
              width: width < height ? width : (height * 16) / 9,
              height: height < width ? height : (width * 9) / 16,
            })}>
            <ActivityIndicator size="large" color={tw.color('white')} />
          </View>
        ) : (
          <VideoPlayer link={data?.media?.file} />
        )}
        <LinearGradient
          locations={[0, 0.2, 0.5]}
          colors={[
            tw.color('indigo-200'),
            tw.color('indigo-50'),
            tw.color('white'),
          ]}
          style={tw`flex-1`}>
          {loading ? (
            <View style={tw`flex-1 justify-center`}>
              <ActivityIndicator size="large" color={tw.color('indigo-600')} />
            </View>
          ) : (
            <>
              <View style={tw`px-4 py-2`}>
                <Text
                  style={tw`font-avSemi text-indigo-700 text-[10px]`}
                  numberOfLines={1}>
                  {data?.subject}
                </Text>
                <Text
                  style={tw`py-1 font-avSemi text-base text-gray-600`}
                  numberOfLines={2}>
                  {data?.title}
                </Text>
                <Text
                  style={tw`font-avReg text-xs text-amber-600`}
                  numberOfLines={1}>
                  #CGPSE #ACS #SSC #Mains
                </Text>
                <Text
                  style={tw.style('font-avReg', 'text-gray-600', 'text-sm', {
                    fontSize: 10,
                  })}
                  numberOfLines={1}>
                  {`${data?.media?.time} Mins`}
                </Text>
              </View>
              <ScrollView style={tw`flex-1`}>
                <InfoItem label="Highlight" value={data?.highlight} />
                <InfoItem
                  inline
                  label="Language"
                  value={data?.language === 'HI' ? 'हिन्दी' : 'English'}
                />
                <InfoItem
                  label="Instructors"
                  value={data?.instructors?.join(', ')}
                />
                <InfoItem label="Index" value={data?.index} />
                <InfoItem label="Description" value={data?.description} />
              </ScrollView>
            </>
          )}
        </LinearGradient>
      </SafeAreaContainer>
    );
  }
}

export default DownloadVideoViewScreen;
