import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { WebView } from 'react-native-webview';
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

const widget = `<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div id="tradingview_2c4ac"></div>
  <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL Chart</span></a> by TradingView</div>
  <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
  <script type="text/javascript">
  new TradingView.widget(
  {
  "autosize": true,
  "symbol": "NASDAQ:AAPL",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "light",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "withdateranges": true,
  "hide_side_toolbar": false,
  "allow_symbol_change": true,
  "details": true,
  "container_id": "tradingview_2c4ac"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->`


const SimpleWidget = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={{ height: '100%'}}>
          <WebView
              style={{ flex: 1 }}
              source={{ html: widget, baseUrl: '' }}
              allowFileAccessFromFileURLs={true}
              nativeConfig={{
                props: {
                  webContentsDebuggingEnabled: true,
                }
              }}
              javaScriptEnabled={true}
              allowFileAccess={true}
              originWhitelist={["*"]}
              onMessage={(event) => {
                  const data = JSON.parse(event.nativeEvent.data)
                  if (data.type == "onIntervalChanged") {
                      Alert.alert(
                        'onIntervalChanged',
                        "Interval = " + data.interval,
                        [
                          { text: 'OK', onPress: () => console.log('OK Pressed') }
                        ],
                        { cancelable: true }
                      );
                  }
              }}
          />
          </View>
      </SafeAreaView>
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

export default SimpleWidget;
