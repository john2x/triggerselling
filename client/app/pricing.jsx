var PricingPanel = require("pricing_panel")

var LandingPage = React.createClass({
  home: function() {
    location.href="/#landing"
  },

  render: function() {
    return (
      <div style={{paddingTop:50}}>

        <h4 style={{fontWeight:800,fontSize:22,cursor:"pointer"}}
          onClick={this.home}>TriggerIQ</h4>

        <a href="#pricing" className="" style={{float:"right",marginTop:-32,marginRight:300,fontWeight:600,fontSize:12,color:"#0072f0"}}>PRICING</a>


        <a href="#signup" className="btn btn-success" style={{float:"right",marginTop:-40,marginRight:80}}>SIGN UP</a>
        <a href="#login" className="btn btn-primary" style={{float:"right",marginTop:-40}}>LOG IN</a>
        <PricingPanel />
      </div>
    )
  }
})


module.exports = LandingPage
