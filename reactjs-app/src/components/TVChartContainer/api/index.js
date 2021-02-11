import { binanceSymbols, binanceKlines, binanceServerTime } from "./binance";

const supportedResolutions = [
  "1",
  "3",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "D"
];
const config = {
  supported_resolutions: supportedResolutions
};

let symbols = [
  {
    baseAsset: "ETH",
    baseAssetPrecision: 8,
    baseCommissionPrecision: 8,
    filters: [
      {
        filterType: "PRICE_FILTER",
        minPrice: "0.00000100",
        maxPrice: "100000.00000000",
        tickSize: "0.00000100"
      },
      {
        filterType: "PERCENT_PRICE",
        multiplierUp: "5",
        multiplierDown: "0.2",
        avgPriceMins: 5
      },
      {
        filterType: "LOT_SIZE",
        minQty: "0.00100000",
        maxQty: "100000.00000000",
        stepSize: "0.00100000"
      },
      {
        filterType: "MIN_NOTIONAL",
        minNotional: "0.00010000",
        applyToMarket: true,
        avgPriceMins: 5
      },
      { filterType: "ICEBERG_PARTS", limit: 10 },
      {
        filterType: "MARKET_LOT_SIZE",
        minQty: "0.00000000",
        maxQty: "2729.13846842",
        stepSize: "0.00000000"
      },
      { filterType: "MAX_NUM_ORDERS", maxNumOrders: 200 },
      { filterType: "MAX_NUM_ALGO_ORDERS", maxNumAlgoOrders: 5 }
    ],
    icebergAllowed: true,
    isMarginTradingAllowed: true,
    isSpotTradingAllowed: true,
    ocoAllowed: true,
    orderTypes: [
      "LIMIT",
      "LIMIT_MAKER",
      "MARKET",
      "STOP_LOSS_LIMIT",
      "TAKE_PROFIT_LIMIT"
    ],
    permissions: ["SPOT", "MARGIN"],
    quoteAsset: "BTC",
    quoteAssetPrecision: 8,
    quoteCommissionPrecision: 8,
    quoteOrderQtyMarketAllowed: true,
    quotePrecision: 8,
    status: "TRADING",
    symbol: "ETHBTC"
  }
];

const DataFeed = {
  onReady: cb => {
    console.log("=====onReady running");
    setTimeout(() => cb(config), 100);
    return binanceSymbols()
      .then(_symbols => {
        symbols = _symbols;
        console.log("=====onReady running _symbols", _symbols);
        cb({
          supports_marks: false,
          supports_timescale_marks: false,
          supports_time: true,
          supported_resolutions: [
            "1",
            "3",
            "5",
            "15",
            "30",
            "60",
            "120",
            "240",
            "360",
            "480",
            "720",
            "1D",
            "3D",
            "1W",
            "1M"
          ]
        });
      })
      .catch(err => {
        console.error(err);
      });
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log("====Search Symbols running");
  },
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    console.log("👉 resolveSymbol:", symbolName, symbols);
    const comps = symbolName.split(":");
    symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase();

    function pricescale(symbol) {
      for (let filter of symbol.filters) {
        if (filter.filterType === "PRICE_FILTER") {
          return Math.round(1 / parseFloat(filter.tickSize));
        }
      }
      return 1;
    }

    for (let symbol of symbols) {
      if (symbol.symbol === symbolName) {
        setTimeout(() => {
          onSymbolResolvedCallback({
            name: symbol.symbol,
            description: symbol.baseAsset + " / " + symbol.quoteAsset,
            ticker: symbol.symbol,
            //exchange: 'Binance',
            //listed_exchange: 'Binance',
            //type: 'crypto',
            session: "24x7",
            minmov: 1,
            pricescale: pricescale(symbol),
            timezone: "UTC",
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true,
            currency_code: symbol.quoteAsset
          });
        }, 0);
        return;
      }
    }

    onResolveErrorCallback("not found");
  },
  getBars: function (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    console.log("👉 getBars:", symbolInfo.name, resolution);
    console.log("First:", firstDataRequest);
    console.log("From:", from, "(" + new Date(from * 1000).toGMTString() + ")");
    console.log("To:  ", to, "(" + new Date(to * 1000).toGMTString() + ")");

    const interval = {
      1: "1m",
      3: "3m",
      5: "5m",
      15: "15m",
      30: "30m",
      60: "1h",
      120: "2h",
      240: "4h",
      360: "6h",
      480: "8h",
      720: "12h",
      D: "1d",
      "1D": "1d",
      "3D": "3d",
      W: "1w",
      "1W": "1w",
      M: "1M",
      "1M": "1M"
    }[resolution];

    if (!interval) {
      onErrorCallback("Invalid interval");
    }

    let totalKlines = [];

    const finishKlines = () => {
      console.log("📊:", totalKlines.length);

      if (totalKlines.length === 0) {
        onHistoryCallback([], { noData: true });
      } else {
        onHistoryCallback(
          totalKlines.map(kline => {
            return {
              time: kline[0],
              close: parseFloat(kline[4]),
              open: parseFloat(kline[1]),
              high: parseFloat(kline[2]),
              low: parseFloat(kline[3]),
              volume: parseFloat(kline[5])
            };
          }),
          {
            noData: false
          }
        );
      }
    };

    const getKlines = (from, to) => {
      binanceKlines(symbolInfo.name, interval, from, to, 500)
        .then(klines => {
          totalKlines = totalKlines.concat(klines);

          if (klines.length === 500) {
            from = klines[klines.length - 1][0] + 1;
            getKlines(from, to);
          } else {
            finishKlines();
          }
        })
        .catch(err => {
          console.error(err);
          onErrorCallback("Some problem");
        });
    };

    from *= 1000;
    to *= 1000;

    getKlines(from, to);
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    console.log("=====subscribeBars runnning");
  },
  unsubscribeBars: subscriberUID => {
    console.log("=====unsubscribeBars running");
  },
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    //optional
    console.log("=====calculateHistoryDepth running");
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    return resolution < 60
      ? { resolutionBack: "D", intervalBack: "1" }
      : undefined;
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    //optional
    console.log("=====getMarks running");
  },
  getTimeScaleMarks: (
    symbolInfo,
    startDate,
    endDate,
    onDataCallback,
    resolution
  ) => {
    //optional
    console.log("=====getTimeScaleMarks running");
  },
  getServerTime: cb => {
    console.log("=====getServerTime running");
    binanceServerTime()
      .then(time => {
        cb(Math.floor(time / 1000));
      })
      .catch(err => {
        console.error(err);
      });
  }
};

export default DataFeed;