var CurrentPlan = React.createClass({
  getInitialState: function() {
    return {

    }
  },

  componentDidMount: function() {
    //$("#credit-card-form").validate()
    var $messages = $('#error-message-wrapper');

    $.validate({
        form : '#credit-card-form',
        errorMessagePosition: $messages,
        showErrorDialogs : true
    });

    /*
    $('.form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });
    */
    /*
    $(".floatlabel-wrapper").css({
      width:"auto",
      display:"inline-block"
    })
    */
  },

  submitForm: function(e) {
    //e.preventDefault()
    this.setState({planChosen: $("#choose-plan-form").val() != ""})
    this.setState({billingCycleChosen: $("#billing-cycle-form").val() != ""})
    console.log("lmao")
  },

  render: function() {
    return (
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>Current Plan</h3>
                <hr/>
                <h4>1. Payment Information</h4>

        <div id="error-message-wrapper" 
             className="alert alert-info" ></div>
        <form  id="credit-card-form" onSubmit={this.submitForm}>
                <input type="text" className="form-control input-lg float" data-label="lmao" placeholder="Credit Card Number" style={{marginBottom:10}} data-validation="required" data-validation="number length" data-validation-length="min16 max16"/>
                <input type="text" className="form-control input-lg" placeholder="MM" style={{marginBottom:5,width:"20%",display:"inline-block",marginRight:15}} data-validation="required" data-validation="number length" data-validation-length="min2" min="0" step="1"/> 
                <h4 style={{display:"inline"}}>&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;</h4>
                <input type="text" className="form-control input-lg" placeholder="YY" style={{marginBottom:5,width:"20%",display:"inline-block"}} data-validation="length number" data-validation-length="min2" maxLength="2" min="0" max="99" step="1" />
                <input type="text" className="form-control input-lg" placeholder="CVC" style={{marginBottom:5,width:"20%",display:"inline-block",float:"right"}} data-validation="required" data-validation="length number" data-validation-length="min3" maxLength="3" min="0" step="1"/>
        </form>
                <hr/>
                <h4>2.  Select Your Plan</h4>
        {(!!this.state.planChosen) ? <div className="alert alert-info" >Please choose value</div> : ""}
        <form  id="choose-plan-form" onSubmit={this.submitForm}>
          <div className="radio" style={{display:"none"}}>
              <br/>
              <input type="radio" name="radio2" id="radio1" value="option1" 
                  style={{paddingTop:15}}/>
              <label htmlFor="radio1" style={{width:"100%"}}> 
              <div style={{marginTop:-20,marginLeft:20}}>
                <h4 style={{fontWeight:800,marginBottom:0}}>Free Trial</h4>
                <h5 style={{fontWeight:600,color:"#aaa",marginTop:4}}>Free Trial</h5>
              </div>
              </label>
              <h4 style={{float:"right",marginTop:-40,marginRight:40}}>$0</h4>
          </div>
          <div className="radio">
              <br/>
              <input type="radio" name="radio2" id="radio2" value="option1" 
                  style={{paddingTop:15}}/>
              <label htmlFor="radio2" style={{width:"100%"}}> 
              <div style={{marginTop:-20,marginLeft:20}}>
                <h4 style={{fontWeight:800,marginBottom:0}}>Starter</h4>
                <h5 style={{fontWeight:600,color:"#aaa",marginTop:4}}>Free Trial</h5>
              </div>
              <h4 style={{float:"right",marginTop:-40,marginRight:40}}>$99</h4>
              </label>
          </div>
          <div className="radio">
              <br/>
              <input type="radio" name="radio2" id="radio3" value="option1" 
                  style={{paddingTop:15}}/>
              <label htmlFor="radio3" style={{width:"100%"}}> 
              <div style={{marginTop:-20,marginLeft:20}}>
                <h4 style={{fontWeight:800,marginBottom:0}}>Professional</h4>
                <h5 style={{fontWeight:600,color:"#aaa",marginTop:4}}>Free Trial</h5>
              </div>
              <h4 style={{float:"right",marginTop:-40,marginRight:40}}>$499</h4>
              </label>
          </div>
          <div className="radio">
              <br/>
              <input type="radio" name="radio2" id="radio4" value="option1" 
                  style={{paddingTop:15}}/>
              <label htmlFor="radio4" style={{width:"100%"}}> 
              <div style={{marginTop:-20,marginLeft:20}}>
                <h4 style={{fontWeight:800,marginBottom:0}}>Enterprise</h4>
                <h5 style={{fontWeight:600,color:"#aaa",marginTop:4}}>Free Trial</h5>
              </div>
              <h4 style={{float:"right",marginTop:-40,marginRight:40}}>$999</h4>
              </label>
          </div>
        </form>

                <hr/>
          <h4>3. Select Billing Cycle</h4>
        {(!!this.state.billingCycleChosen) ? <div className="alert alert-info" >Please choose value</div> : ""}
              <br/>
              <form role="form" id="billing-cycle-form">
                <div className="radio" style={{display:"inline"}}>
                    <input type="radio" name="radio2" id="radio17" value="option1" />
                    <label htmlFor="radio17"><h5 style={{marginTop:0}}>Monthly </h5></label>
                </div>
                &nbsp;
                &nbsp;
                <div className="radio" style={{display:"inline"}}>
                    <input type="radio" name="radio2" id="radio19" value="option2" />
                    <label hmtlFor="radio19">
                        <h5 style={{marginTop:0}}>Yearly &nbsp;<span style={{fontWeight:"bold",color:"#15cd72"}}>-20 %</span></h5></label>
                </div>
              </form>
  
              <br/>
              <br/>
          <a href="javascript:" style={{display:"block",textAlign:"center",fontSize:16}}
              onClick={this.submitForm}
              className="btn btn-lg btn-primary">
              Complete and Upgrade
          </a>

        </div>
              </div>
    )
  }
})

module.exports = CurrentPlan
