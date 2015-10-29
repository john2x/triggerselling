var Login = React.createClass({
  loginUser: function() {
    data = {}
    $.ajax({
      url:location.origin+ "/login",
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

  render: function() {
    return (
      <div style={{textAlign:"center",paddingTop:120}}>

          <img src="images/radar_2.png" style={{height:100}}/>
          <br/>
        <input className="form-control input-lg" style={{fontSize:16, marginRight:"auto",marginLeft:"auto",marginTop:30,width:300,borderRadius:2}} placeholder="EMAIL"/>
        <input className="form-control input-lg" style={{fontSize:16, marginTop:10,marginLeft:"auto",marginRight:"auto",width:300,borderRadius:2}} placeholder="PASSWORD" type="password"/>
        <br/>
        <a className="btn btn-lg btn-primary" style={{marginTop:10,width:300, fontSize:16}}>LOG IN</a>

      </div>
    )
  }
})

module.exports = Login
