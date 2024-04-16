import tw from '@lib/tailwind';
import Pdf from 'react-native-pdf';
import openWebURL from 'utils/openWebURL';
import React, {PureComponent} from 'react';
import {SafeAreaContainer} from '@components';
import {getDownload, fileDecipher} from 'lib/fileHandler';
import {Text, View, Alert, ActivityIndicator} from 'react-native';

class DownloadDocumentViewScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.params = this.props.route.params;
    this.state = {
      loading: true,
      error: null,
      data: null,
    };
  }

  componentDidMount() {
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

  handledLoadComplete = (numberOfPages, filePath) => {
    console.log(`Number of pages: ${numberOfPages}, File path: ${filePath}`);
  };

  handlePageChanged = (page, numberOfPages) => {
    console.log(`Current page: ${page}, Total page: ${numberOfPages}`);
  };

  handlePressLink = uri => {
    openWebURL(uri);
  };

  handleError = error => {
    console.log('Cannot render PDF', error);
    Alert.alert('Error', 'The source URL is wrong.');
  };

  render() {
    return (
      <SafeAreaContainer
        statusBgColor={tw.color('teal-200')}
        statusBarStyle="dark-content"
        containerStyle={tw`bg-black`}>
        {this.state.loading ? (
          <View style={tw`flex-1 items-center justify-center`}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : this.state.error ? (
          <View style={tw`flex-1 items-center justify-center`}>
            <Text style={tw`text-black align-center`}>
              Unexpected error happened, Please try again!
            </Text>
          </View>
        ) : (
          <Pdf
            trustAllCerts={false}
            style={tw`flex-1 bg-black`}
            source={{
              uri: this.state.data?.media?.file,
              cache: true,
            }}
            onLoadComplete={this.handledLoadComplete}
            onPageChanged={this.handlePageChanged}
            onPressLink={this.handlePressLink}
            onError={this.handleError}
          />
        )}
      </SafeAreaContainer>
    );
  }
}

export default DownloadDocumentViewScreen;
