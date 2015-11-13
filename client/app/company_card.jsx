var CompanyCard = React.createClass({
  getInitialState: function() {
    return {
      hover: false
    }
  },

  toggleCompanyDetailOverlay: function() {
    //console.log("toggle")
    this.props.toggleCompanyDetailOverlay(this.props)
  },

  componentDidMount: function() {
  },

  mouseOver: function() { this.setState({hover: true}) },
  mouseLeave: function() { this.setState({hover: false}) },

  openLink: function() {
    window.open()
  },

  render: function() {
    if(this.props.company_info.length)
      company_info = JSON.parse(this.props.company_info)
    hoverStyle = {borderRadius: 5, paddingLeft:10, paddingRight:10, cursor:"pointer"}
    if(this.state.hover)
      hoverStyle.backgroundColor ="rgba(0,0,0,0.03)"

    company_info.metrics = (!!company_info.metrics) ? company_info.metrics : {}
    company_info.geo = (!!company_info.geo) ? company_info.geo : {}

    return (
      <div className="" 
            onMouseEnter={this.mouseOver}
            onMouseLeave={this.mouseLeave}
            onClick={this.toggleCompanyDetailOverlay}
            style={hoverStyle}>
              <table>
                <tbody>
                  <tr>
                    <td>
                     <a href="javascript:" className="thumbnail" 
                        style={{height:65,width:65,marginRight:15,float:"left",marginBottom:0}}>
                        <img src={(company_info.logo) ? company_info.logo : "images/empty_company.png"} alt=""/>
                      </a>
                    </td>
                    <td style={{padding:5,width:"35%"}}>
                      <a href="javascript:" style={{color:"black"}}>
                      <h5 style={{fontSize:18}}>
                        {this.props.trigger.company_name}
                        <small style={{float:"right",fontSize:8,display:"none"}}>
                          <i className="fa fa-external-link-square" style={{cursor:"pointer"}}
                          onClick={this.openLink}/>
                        </small>

                        {(this.props.trigger.email_pattern) ? <i className="fa fa-envelope" /> : ""}
                      </h5>
                      </a>
                      <div className="ellipsis" style={{width:300,fontSize:10}}>
                        {company_info.description}
                      </div>
                      <div className="ellipsis" style={{width:300,fontSize:10}}>
                        {(company_info.location) ? <span><i className="fa fa-map-marker" />&nbsp;&nbsp;</span> : "" }
                        {company_info.geo.city +", "+company_info.geo.state}

                        &nbsp;
                        &nbsp;
                        &nbsp;

                        {(company_info.metrics.employees) ? <span><i className="fa fa-users" />&nbsp;&nbsp;</span> : "" }
                        {company_info.metrics.employees + " employees"}
                      </div>
                    </td>

                    <SignalInfo trigger={this.props.trigger}/>
                    <EmployeeInfo employees={this.props.employees}/>


                    <td style={{padding:5}}>
                      <div style={{width:100}}>
                        {moment.unix(this.props.trigger.timestamp).fromNow()} 
                      </div>
                    </td>
                    <td style={{padding:5}}>
                      <a href="javascript:" className="btn btn-primary btn-sm"><i className="fa fa-download"/></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
    )
  }
})

var DetailLabel = React.createClass({
  render: function() {
    return (
      <label style={{border:"3px solid #eee",fontWeight:800,float:"left",color:"#ddd",marginRight:5, borderRadius:5,paddingLeft:5,paddingRight:5,display:"block",fontSize:11,backgroundColor:"white"}}> {this.props.text} </label>
    )
  } 
})

var SignalInfo = React.createClass({
  getInitialState: function() {
    return {
    }
  },

  render: function() {
    return (
      <td style={{padding:5,width:"35%"}}>
        <h5></h5>
        <h5><small>
            <i className="fa fa-suitcase"/> &nbsp;
            {this.props.trigger.job_title}
        </small></h5>
        <DetailLabel text={this.props.trigger.source.toUpperCase()} />
        <DetailLabel text={"HIRING SIGNAL"} />
      </td>
    )
  }
})

var UserPic = React.createClass({
  render: function() {
    return (
      <div style={{height:30,width:30,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-13}}> </div>
    )

  }
})

var EmployeeInfo = React.createClass({
  render: function() {
    length = (this.props.employees.length > 3) ? 3 : this.props.employees.length
    users = []
    for(i=0;i< length; i++)
      users.push(<UserPic />)

    return (
        <td style={{padding:5,width:"18%"}}>
          <h5></h5>
          {(this.props.employees.length) ? <div>{users}
          <div style={{color: "#aaa",marginTop: -30, marginLeft: 65,fontSize:13}}>
            {this.props.employees.length + " employees"}
          </div>
          </div> : "" }
        </td>
    )
  }
})
/*
                      <div style={{height:25,width:25,border:"2px solid white",boxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-10}}> </div>
                      */
                    

module.exports = CompanyCard
