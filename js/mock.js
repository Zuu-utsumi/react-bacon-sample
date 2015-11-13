var MockAPIs = [
  {
    type: "GET",
    url: /\/v2\/portfolios(\?.*)?$/,
    response: function(settings) {
      this.responseText = {
        last_update: "2015-10-30",
        portfolios: Factory.buildList("portfolio", 10)
      }
    }
  },
  {
    type: "GET",
    url: /\/v2\/portfolios\/recommends(\?.*)?$/,
    response: function (settings) {
      this.responseText = {
        last_update: "2015-10-30",
        portfolios: Factory.buildList("portfolio", 10)
      }
    }
  },
  {
    type: "GET",
    url: /\/v2\/portfolios\/search\?.+$/,
    response: function (settings) {
      this.responseText = {
        last_update: "2015-10-30",
        portfolios: Factory.buildList("portfolio", 10)
      }
    }
  },

  {
    type: "POST",
    url: /\/v2\/portfolios\/\d+\/mark/,
    responseText: {message: "Successfully marked"}
  },
  {
    type: "DELETE",
    url: /\/v2\/portfolios\/\d+\/mark/,
    responseText: {message: "Successfully deleted"}
  },

  {
    type: "POST",
    url: /\/v2\/portfolios\/\d+\/hold/,
    responseText: {message: "Successfully hold"}
  },
  {
    type: "PUT",
    url: /\/v2\/portfolios\/\d+\/hold/,
    responseText: {message: "Successfully updated"}
  },
  {
    type: "DELETE",
    url: /\/v2\/portfolios\/\d+\/hold/,
    responseText: {message: "Successfully deleted"}
  },

  // News API
  {
    type: "GET",
    url: /\/v2\/news(\?.+)?$/,
    response: function(settings) {
      this.responseText = {
        news: Factory.buildList("news", 10)
      }
    }
  },
  {
    type: "GET",
    url: /\/v2\/news\/search(\?.*)?/,
    response: function(settings) {
      this.responseText = {
        news: Factory.buildList("news", 10)
      }
    }
  },
  {
    type: "GET",
    url: /\/v2\/news\/(\d+)/,
    response: function(settings) {
      var news_id = settings.url.match(this.url)[1]
      this.responseText = Factory.build("news", {
        id: news_id,
        title: "Article" + news_id
      });
    }
  },

  // Companies API
  {
    type: "GET",
    url: /\/v2\/companies(\?.*)?$/,
    response: function(settings) {
      this.responseText = {
        companies: Factory.buildList("company", 10)
      }
    }
  },
  {
    type: "GET",
    url: /\/v2\/companies\/(\d+)/,
    response: function(settings) {
      var company_id = settings.url.match(this.url)[1]
      this.responseText = Factory.build("company", {company_id: company_id});
    }
  }
];


var Factory = {
  build: function(name, overrides) {
    return $.extend({}, this[name](), overrides);
  },

  buildList: function(name, num, params) {
    num = num || 1;

    if (this[name]) {
      return Immutable.Repeat(this.build.bind(this), num)
              .map(function(f) { return f(name, params) }).toArray();
    } else {
      return [];
    }
  },

  uniqIDs: {},

  arrayLast: function(ary) {
    return ary[ary.length-1];
  },

  makeUniqID: function(name) {
    if (!this.uniqIDs[name]) {
      this.uniqIDs[name] = [];
    }

    var newID = (this.arrayLast(this.uniqIDs[name]) || 0) + 1;
    this.uniqIDs[name].push(newID);

    return newID;
  },

  rand: function(max) {
    return Math.round(Math.random() * 100) % (max + 1);
  },

  makeRandomSizeList(generator, max) {
    max = max || 5;
    return Immutable.Repeat(generator.bind(this), this.rand(max))
            .map(function(f) { return f() }).toArray();
  },

  portfolio: function() {
    return {
      company_id: this.makeUniqID("company"),
      company_name: "ソニーフィナンシャルホールディングス株式会社",
      recent_stock_price: "2164",
      change_ratio: "4.25",
      change: "96",
      valuation_adjustment_ratio: "6.78",
      valuation_adjustments: "13200",
      signal: this.rand(1),
      indicators: {
        technical: ["1", "0", "0", "-1", "1", "1", "-1", "0", "0", "-1"],
        fundamental: ["1", "1", "0", "-1"],
      },
      news: this.makeRandomSizeList(function() {
        return {
          href: "http://hogehoge/fuga",
          title: "fill title"
        }
      }, 4)
    }
  },

  company: function() {
    return {
      company_id: this.makeUniqID("company"),
      name_jp: "ソニーフィナンシャルホールディングス株式会社",
      name_us: "Sony Finalcial Holdings Inc.",
      market: "東証1部",
      segment: "ソニー子会社。収益の大半占める生保のほか、損保、銀行抱える。ネット系に強み。ＦＸ事業も。",
      consolidated_operations: "生命保険90(6)、損害保険7(5)、銀行3(19)",
      address_of_headquarter: "東京都港区南青山1丁目1番地1号",
      telephone_number: "03(5785)1070",
      sector: "保険業",
      title_and_name_of_representative: "代表取締役社長 井原 勝美",
      last_update: "2015-10-30T06:32:32Z",
      stock: {
        recent: "2164",
        open: "2202",
        high: "2244",
        low: "2013"
      },
      average_price_per_unit: "1948",
      number_of_shares: "500",
      chart: {
        weekly: "https://s3/zuusignals/copr/graph/weekly.png",
        monthly: "https://s3/zuusignals/weekly/monthly.png"
      },
      signal: this.rand(1),
      indicators: {
        "technical": {
          "sma": "1",
          "ichimoku": "0",
          "rci": "0",
          "ma_envelop": "-1",
          "bbands": "1",
          "macd": "1",
          "rsi": "-1",
          "parabolic": "0",
          "stcastics": "0",
          "dmi": "-1",
        },
        fundamental: {
          per: "1",
          pbr: "1",
          roe: "0",
          dividend_yield: "-1"
        }
      }
    }
  },

  news: function() {
    var article_id = this.makeUniqID("article");
    return {
      id: article_id,
      title: "Demo article" + article_id,
      url: "#",
      m_stock_companies: this.makeRandomSizeList(function() {
        var company_id = Factory.makeUniqID("company");
        return {
          id: company_id,
          security_code: 1000 + company_id,
          name: function() {
            return "Company-" + company_id
          }()
        }
      }, 5)
    }
  }
};

$.each(MockAPIs, function(idx, mock) {
  $.mockjax(mock);
});
