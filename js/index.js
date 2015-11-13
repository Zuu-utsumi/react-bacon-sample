var Main = React.createClass({
  render() {
    return (
      <div className="main">
        <h1>Main conponent</h1>
        <button onClick={this.handleClickBtn}>Get News!</button>
      </div>
    );
  },

  handleClickBtn(e) {
    e.preventDefault();
    var promise = this.ajax("GET", "/v2/news/1");
    debugger;
    promise.then(function(res) {
      console.debug(res);
    });
  },

  ajax(method, url, data) {
    return Promise.resolve($.ajax({
      type: method,
      url: url,
      data: data,
      dataType: "json",
      headers: {
        'X-Auth-Token': "Bearer " + this.authToken(),
        'X-Auth-Subject': this.authSubject()
      }
    }));
  },

  authToken() {
    return $('meta[name=auth-token]').attr('content');
  },

  authSubject() {
    return $('meta[name=auth-subject]').attr('content');
  }
});

ReactDOM.render(<Main a={10} bus={new Bacon.Bus()} />, document.getElementById("top"));
