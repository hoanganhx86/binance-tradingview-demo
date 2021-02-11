import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
// const html = require('./assets/charting_library/index.html');

// const jsToInject = `
// tvWidget.onChartReady(function() {
//     tvWidget.chart().onIntervalChanged().subscribe(
//         null,
//         function(interval) {
//             const response = { type: "onIntervalChanged", interval: interval }
//             //window.ReactNativeWebView.postMessage accepts one argument, data,
//             //which will be available on the event object, event.nativeEvent.data. data must be a string.
//             window.ReactNativeWebView.postMessage(JSON.stringify(response));
//         }
//     );
// });
// true; // note: this is required, or you'll sometimes get silent failures
//       // (https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md)
// `;

const BinanceTradingView = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={{height: '100%', backgroundColor: 'lightgray', padding: 2}}>
        <WebView
          style={{flex: 1}}
          source={{uri: 'index.html'}}
          allowFileAccessFromFileURLs={true}
          nativeConfig={{
            props: {
              webContentsDebuggingEnabled: true,
            },
          }}
          javaScriptEnabled={true}
          allowFileAccess={true}
          originWhitelist={['*']}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type == 'onIntervalChanged') {
              Alert.alert(
                'onIntervalChanged',
                'Interval = ' + data.interval,
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: true},
              );
            }
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    flex: 1,
    backgroundColor: 'red',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default BinanceTradingView;
