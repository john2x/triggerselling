var PricingPanel = React.createClass({
  render: function() {
    return (
      <div>
        <div className="row" style={{marginTop:40}}>
          <div className="col-md-4 col-sm-4 col-xs-4" >
            <div className="pricing-col">
            <br/>
            Starter
            <hr/>
            <br/>
            <h1>$99 <small>/ month</small></h1>
            <br/>
            <hr/>
              Unlimited Prospect Profiles
            <hr/>
              Unlimited Company Profiles
            <hr/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            </div>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4" >
            <div className="pricing-col">
            <br/>
            Professional
            <hr/>
            <br/>
            <h1>$499 <small>/ month</small></h1>
            <br/>
            <hr/>
              Unlimited Prospect Profiles
            <hr/>
              Unlimited Company Profiles
            <hr/>
              CRM Integration
            <hr/>
              Employee Search
            <br/>
            <br/>
            </div>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4" >
            <div className="pricing-col">
            <br/>
            Enterprise
            <hr/>
            <br/>
            <h1>$999 <small>/ month</small></h1>
            <br/>
            <hr/>
              Unlimited Prospect + Company Profiles
            <hr/>
              CRM Integration
            <hr/>
              Employee Search
            <hr/>
              Employee Contact Information
            <br/>
            <br/>
          </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = PricingPanel
