const binanceHost = "https://api.binance.com";

export const binanceServerTime = () => {
  return fetch(binanceHost + "/api/v1/time")
    .then(res => {
      return res.json();
    })
    .then(json => {
      return json.serverTime;
    });
};

export const binanceSymbols = () => {
  return fetch(binanceHost + "/api/v1/exchangeInfo")
    .then(res => {
      return res.json();
    })
    .then(json => {
      console.log("binanceSymbols:", json);
      return json.symbols;
    });
};

export const binanceKlines = (symbol, interval, startTime, endTime, limit) => {
  const url =
    binanceHost +
    "/api/v1/klines" +
    "?symbol=".concat(symbol) +
    "&interval=".concat(interval) +
    "&limit=".concat(limit) +
    "&startTime=".concat(startTime) +
    "&endTime=".concat(endTime);

  return fetch(url)
    .then(res => {
      return res.json();
    })
    .then(json => {
      console.log("binanceKlines:", json);
      return json;
    });
};
