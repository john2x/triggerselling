var LandingPage = React.createClass({
  home: function() {
    location.href="/#landing"
  },

  signUp: function() {
    data = {}
    $.ajax({
      url:location.origin+ "/signup",
      data: {},
      dataType:"json",
      success: function(res) {
        console.log(res)
        location.currentUser(res.token)
      },
      error: function(err) {
        console.log(err)
      }
    })
  },

  componentDidMount: function() {
  },

  render: function() {
    return (
      <div style={{paddingTop:50}}>

        <h4 style={{fontWeight:800,fontSize:22,cursor:"pointer"}}
          onClick={this.home}>SignalIQ</h4>

        <a href="#pricing" className="" style={{float:"right",marginTop:-32,marginRight:300,fontWeight:600,fontSize:12,color:"#0072f0"}}>PRICING</a>

        <a href="#login" className="btn btn-primary" style={{float:"right",marginTop:-40}}>LOG IN</a>
        <div className="row" style={{marginTop:40}}>
        <div className="col-md-6" >
          <h1>Leverage The Power Of Signal Based Selling</h1>
          <br/>
          <hr/>
          <h3 style={{marginTop:10,fontWeight:100}}>STOP WASTING TIME COLD CALLING </h3>
          <h3 style={{marginTop:20,fontWeight:100}}>START REACHING OUT AT <span style={{fontStyle:"italic"}}>THE RIGHT TIME</span></h3>
          <input className="form-control input-lg" style={{marginTop:30,width:300,borderRadius:2,fontSize:16}} placeholder="EMAIL"/>
          <input className="form-control input-lg" style={{marginTop:10,width:300,borderRadius:2,fontSize:16}} placeholder="PASSWORD" type="password"/>
          <input className="form-control input-lg" style={{marginTop:10,width:300,borderRadius:2,fontSize:16}} placeholder="CONFIRM PASSWORD" type="password"/>
          <a className="btn btn-lg btn-success" style={{marginTop:10,width:150,fontSize:16}}>SIGN UP</a>
        </div>

        <div className="col-md-6" >
          <img src="images/signaliq.png" style={{height:450,float:"left",marginLeft:100,marginTop:20}}/>
        </div>
        </div>
      </div>
    )
  }
})


module.exports = LandingPage
