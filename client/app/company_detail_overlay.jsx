var CompanyDetailOverlay = React.createClass({
  toggleCompanyDetailOverlay: function() {
    console.log("toggle")
    this.props.toggleCompanyDetailOverlay()
  },

  componentWillReceiveProps: function(a, b) {
    console.log(a)
    console.log(b)
  },

  openLink: function(e) {
    //e.preventDefault()
    console.log("open")
    //li = JSON.parse(this.props.company.company_info)
    //console.log(li)
    //window.open(li,'_blank')
  },

  render: function() {
    console.log(this.props)
    ci = JSON.parse(this.props.company.company_info)
    console.log(ci)
    company = (this.props.company.trigger) ? this.props.company.trigger : {}
    console.log(company)
    employees = (this.props.company.employees) ? this.props.company.employees : []
    employees = _.map(employees, function(emp) {
        return  <EmployeeCard emp={emp}/>
    })

    return (
      <div style={{position:"fixed",top:0,width:"100%",height:"100%"}}>
        <div style={{height:"100%",width:"100%",position:"absolute",top:0,left:0,backgroundColor:"rgba(255,255,255,0.7)",zIndex:1}} 
            onClick={this.toggleCompanyDetailOverlay}>
        <a href="javascript:" className="btn btn-lg">
          <i className="fa fa-times" />
        </a>
      </div>
      <div style={{width:"60%",float:"right",borderLeft:"1px solid #ccc",zIndex:2,position:"absolute",top:0,right:0,height:"100%",backgroundColor:"white",padding:15}}>
                     <a href="javascript:" className="thumbnail" 
                        style={{height:130,width:130,marginRight:15,float:"left",marginBottom:0}}>
                        <img src={(ci.logo) ? ci.logo : "images/empty_company.png"} alt=""/>
                      </a>
        <h1 style={{marginTop:0}}>{company.company_name}</h1>
        <h3 style={{marginTop:0}}><small>{(ci.category) ? ci.category.industry : ""}</small>
          &nbsp;
          &nbsp;
          <div style={{display:"inline"}}>
          <a className="btn btn-default btn-xs" >
            <i className="fa fa-angellist" />
          </a>
          &nbsp;
          <a className="btn btn-default btn-xs" >
            <i className="fa fa-linkedin" />
          </a>
          &nbsp;
          <a className="btn btn-default btn-xs" >
            <i className="fa fa-facebook" />
          </a>
          &nbsp;
          <a className="btn btn-default btn-xs" >
            <i className="fa fa-twitter" />
          </a>
          &nbsp;
          <a className="btn btn-default btn-xs" >
            <i className="fa fa-globe" />
          </a>
          </div></h3>
        <h5 style={{width:"73%",overflow:"auto",height:45}}>{ci.description}</h5>
        <input className="form-control input-sm" value={ci.domain} style={{width:300}}/>
        <input className="form-control input-sm" value={company.email_pattern} style={{width:300}}/>
        <hr/>
        <div style={{height:"83%",overflow:"auto"}}>
          {employees}
        </div>
      </div>
    </div>
    )
  }
})

var UserPic = React.createClass({
  render: function() {
    return (
      <div style={{height:35,width:35,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,float:"left",marginRight:10}}> </div>
    )

  }
})

var EmployeeCard = React.createClass({
  /*
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  */
  render: function() {
    emp = this.props.emp
    return (
            <div style={{paddingLeft:5,width:"80%"}}>
              <UserPic/>
              <h5 style={{marginBottom:0}}>
                <span style={{fontWeight:"bold"}}>{emp.name}</span> - 
                <small style={{width:200,whiteSpace:"nowrap",overflow:"hidden",
                               textOverflow:"ellipsis",display:"inline-block",
                               marginLeft:5}}>
                    {emp.title}</small></h5>
              <h6 style={{marginTop:4}}>{emp.locale} - 
                <small>{emp.company_name}</small></h6>
              <input className="form-control input-sm"  value={"example@example.com"}
                style={{float:"right",marginTop:-35,marginRight:60, width:150}} /> 

              <a className="btn btn-primary btn-xs" 
                  onClick={this.openLink}
                  style={{float:"right",marginTop:-32,marginRight:30}}>
                <i className="fa fa-external-link"/>
              </a>
              <a href="javascript:" className="btn btn-success btn-xs" 
                  style={{float:"right",marginTop:-32,marginRight:0}}>
                <i className="fa fa-plus"/>
              </a>
            </div>

    )
  }
})


module.exports = CompanyDetailOverlay
