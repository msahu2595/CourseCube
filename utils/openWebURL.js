import {tw} from '@lib';
import {Linking} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import InAppBrowser from 'react-native-inappbrowser-reborn';

async function openWebURL(url, inAppBrowser = true) {
  try {
    if (await Linking.canOpenURL(url)) {
      if (inAppBrowser) {
        if (await InAppBrowser.isAvailable()) {
          const result = await InAppBrowser.open(url, {
            // iOS Properties
            dismissButtonStyle: 'close',
            preferredBarTintColor: tw.color('blue-600'),
            preferredControlTintColor: 'white',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'fullScreen',
            modalTransitionStyle: 'coverVertical',
            modalEnabled: true,
            enableBarCollapsing: false,
            // Android Properties
            showTitle: true,
            toolbarColor: tw.color('blue-600'),
            secondaryToolbarColor: 'black',
            navigationBarColor: 'black',
            navigationBarDividerColor: 'white',
            enableUrlBarHiding: true,
            enableDefaultShare: false,
            hasBackButton: true,
            showInRecents: true,
            // Specify full animation resource identifier(package:anim/name)
            // or only resource name(in case of animation bundled with app).
            animations: {
              startEnter: 'slide_in_right',
              startExit: 'slide_out_left',
              endEnter: 'slide_in_left',
              endExit: 'slide_out_right',
            },
          });
          console.log(JSON.stringify(result));
        } else {
          await Linking.openURL(url);
        }
      } else {
        await Linking.openURL(url);
      }
    } else {
      showMessage({
        message: 'Issue with URL, it cannot be open.',
        type: 'danger',
        icon: 'danger',
      });
    }
  } catch (err) {
    console.log(err.message);
    showMessage({
      message: err?.message || 'Some unknown error occurred. Try again!!',
      type: 'danger',
      icon: 'danger',
    });
  }
}

export default openWebURL;
