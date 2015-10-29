var Navbar = React.createClass({
  gotoProfile: function() {
    location.href="#profile"
  },

  gotoHome: function() {
    location.href="#"
  },

  render: function() {
    return (
      <header className="header" style={{paddingTop:20,paddingBottom:40}}>
        <ul className="text-muted" style={{paddingLeft:0}}>
          <li className="app-logo" style={{marginLeft:0}} onClick={this.gotoHome}>
            <div>
            <img src="images/blaze-logo.png" style={{marginTop:4,height:18,marginLeft:-15,display:"none"}}/>
            <div style={{}} style={{color:"#000"}}> TriggerIQ</div>
            </div>
          </li>
          <div style={{display:"block"}}>
            <span style={{display:"none"}}>
            <li style={{fontWeight:"bold",color:"#0079ff",color:"#000"}}>DATASETS</li>
            <li>USERS</li>
            <li>EXPLORE</li>
            <li>COMPUTE</li>
            </span>
            <li style={{float:"right"}} onClick={this.gotoProfile}>
              <img src="images/user.png" style={{height:30,width:30,borderRadius:30}}/>
            </li>
          </div>
        </ul>
      </header>
    )
  }
})

module.exports = Navbar
