var Navbar = require("navbar")
var PricingPanel = require("pricing_panel")
var CurrentPlan = require("current_plan")

var Profile = React.createClass({
  componentDidMount: function() {
    $('.billing-information .form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });

    $('.account-info .form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });
  },

  render: function() {
    return (
      <div>
        <Navbar />
        <div className="row">
          <div className="col-md-6">
            <CurrentPlan />
          </div>
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-body billing-information">
                <h3>Billing Information</h3>
                <hr/>
                <input type="text" className="form-control input-lg" placeholder="First Name" style={{marginBottom:10,display:"inline-block",marginRight:15}}/>
                <input type="text" className="form-control input-lg" placeholder="Last Name" style={{marginBottom:10,display:"inline-block"}}/>
                <input type="text" className="form-control input-lg" placeholder="Company" style={{marginBottom:10}}/>
                <input type="text" className="form-control input-lg" placeholder="Address" style={{marginBottom:5}}/>
                <input type="text" className="form-control input-lg" placeholder="Postal Code" style={{marginBottom:10,display:"inline-block",marginRight:15}}/>
                <input type="text" className="form-control input-lg" placeholder="City" style={{marginBottom:10,display:"inline-block"}}/>
          <br/>
          <a href="javascript:" style={{display:"block",textAlign:"center",fontSize:16}}
              className="btn btn-lg btn-primary">
              Update Billing Information
          </a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>Invoices</h3>
                <hr/>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-body account-info">
                <h3>My Account</h3>
                <hr/>
                <input type="text" className="form-control input-lg" placeholder="Email" style={{marginBottom:10}}/>
                <input className="form-control input-lg" placeholder="New Password" type="password" style={{marginBottom:10}}/>
                <input className="form-control input-lg" placeholder="Confirm Password" type="password" style={{marginBottom:10}}/>
                <a href="javascript:" className="btn btn-primary" style={{display:"block",fontSize:16}}>Update Account</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Profile
