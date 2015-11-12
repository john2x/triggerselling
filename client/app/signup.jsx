var Signup = React.createClass({
  signupUser: function() {
    data = {}
    $.ajax({
      url:location.origin+ "/login",
      data: {},
      dataType:"json",
      // auth token: ""
      success: function(res) {
        console.log(res)
        location.currentUser(res.token)
        // location.href="/#/signals"
      },
      error: function(err) {
        console.log(err)
      }
    })
  },
  
  componentDidMount: function() {
    $('.signup-form .form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });
  },

  render: function() {
    return (
      <div style={{width:320,textAlign:"center",paddingTop:120}} className="signup-form col-md-2 col-md-offset-4 ">

          <img src="images/radar_2.png" style={{height:100}}/>
          <br/>
        <input type="text" data-label="EMAIL" className="form-control input-lg" style={{fontSize:16, marginRight:"auto",marginLeft:"auto",marginTop:30,width:300,borderRadius:2}} placeholder="EMAIL"/>
        <input className="form-control input-lg" style={{fontSize:16, marginTop:10,marginLeft:"auto",marginRight:"auto",width:300,borderRadius:2}} placeholder="PASSWORD" type="password"/>
        <input className="form-control input-lg" style={{fontSize:16, marginTop:10,marginLeft:"auto",marginRight:"auto",width:300,borderRadius:2}} placeholder="CONFIRM PASSWORD" type="password"/>
        <br/>
        <a className="btn btn-lg btn-success" 
          onClick={this.signupUser}
          style={{marginTop:10,width:300, fontSize:16}}>SIGN UP</a>

      </div>
    )
  }
})

module.exports = Signup
