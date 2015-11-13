var ProfileSidebar = React.createClass({

  toggleCreateTriggerModal: function() {
    console.log(this.props.profiles)
    this.props.toggleCreateTriggerModal()
  },

  profileHover: function() {
    console.log("hover")
  },

  render: function() {
    //console.log(this.props.profiles)
    var _this = this;
    profiles = _.map(this.props.profiles, function(profile) {
      return ( 
        <div >
          <HiringProfileCard profile={profile} />
        </div>
       )
    })

    return (
          <div className="col-md-2 col-sm-2 col-xs-2">
            <span style={{fontWeight:"800"}}>TRIGGERS 
              <span style={{color:"#bbb",marginLeft:10,fontWeight:200}}>({this.props.profiles.length}) </span>
            </span>
            <a href="javascript:" 
               className="btn btn-success btn-xs" 
               onClick={this.toggleCreateTriggerModal}
               style={{float:"right"}}>
              <i className="fa fa-plus"/></a>
            <hr style={{marginBottom:0}}/>
            {profiles}
          </div>
      
    )
  }
})

var HiringProfileCard = React.createClass({
  getInitialState: function() {
    return {
      company_count: "~",
      employee_count: "~",
      hover: false,
      _id: this.props.profile.id
    }
  },

  gotoProfile: function() {
    location.href="#signal/"+this.state._id
  },

  componentDidMount: function() {
    profile = this.props.profile
    var _this = this;
    $.ajax({
      url:location.origin+"/"+profile.id+"/count",
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({
          company_count: res.count,
          employee_count: res.employee_count
        })
      },
      error: function(err) {
        console.log(err)
      }
    })

    var pusher = new Pusher('f1141b13a2bc9aa3b519', { encrypted: true });
    var channel = pusher.subscribe('profile_count');

    var _this = this;
    channel.bind(_this.props.profile.id, function(data) {
      _this.setState({ "count" : data, "profile_last_updated": moment().unix()})
    });

    if(this.props.profile.newProfile) {
      $.ajax({
        url: location.origin+"/profile",
        dataType:"json",
        type:"POST",
        data: this.props.profile,
        success: function(res) {
          console.log(res)
          _this.setState({_id: res.id})
        },
        error: function(err) { console.log(err) }
      })
    }
  },

  mouseOver: function() {
    this.setState({hover: true})
  },

  mouseOut: function() {
    this.setState({hover: false})
  },

  render: function() {
    //console.log(this.props.profile)
    roles = _.map(this.props.profile.profiles[0], function(prof) {
      return <span></span>
    })

    _style ={cursor:"pointer",paddingTop:5,paddingBottom:5,paddingLeft:10,paddingRight:10, borderLeft:"3px solid white",borderBottom:"1px solid #eee"}
    if(this.state.hover) {
      _style.borderLeft = "3px solid #0072f0"
      _style.backgroundColor="rgba(238,238,238,0.4)"
    }

    console.log(this.props.profile)
    titles = (this.props.profile.titles) ? this.props.profile.titles.join(", ") : ""
    locales = ""
    if(this.props.profile.profiles[0].className == "HiringProfile") {
      values = <small> <i className="fa fa-suitcase" style={{width:15}}/> &nbsp;
            {this.props.profile.profiles[0].roles.join(", ")}</small>
      locales = <small>
            {(this.props.profile.locales) ? <span><i className="fa fa-map-marker" style={{width:15}}/> &nbsp;</span> : ""}
            {this.props.profile.profiles[0].locales.join(", ")}</small>
    } else if(this.props.profile.profiles[0].className == "PressSubjectProfile") {
      values = <small> <i className="fa fa-bullhorn" style={{width:15}}/> &nbsp;
            {this.props.profile.profiles[0].values.join(", ")}</small>
    } else if(this.props.profile.profiles[0].className == "PressIndustryProfile") {
      values = <small> <i className="fa fa-industry" style={{width:15}}/> &nbsp;
            {this.props.profile.profiles[0].values.join(", ")}</small>
    }
    console.log(this.props.profile)
    if(this.props.profile.titles) {
      _titles = <small>
          {(this.props.profile.titles) ? <i className="fa fa-user" style={{width:15}}/> : "" }
            {titles}</small>
    } else { 
      _titles = ""
    }

    return (
      <div style={_style} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}
          onClick={this.gotoProfile}>
        <h6> {this.props.profile.name} 
          <small style={{float:"right",marginTop:2}}>
            <i className="fa fa-building" />
              {this.state.company_count}</small> 
            &nbsp;
            &nbsp;
            <small style={{float:"right",marginTop:2,marginRight:10}}>
            <i className="fa fa-user" />
              {this.state.employee_count}</small> 
        </h6>
        <h5 style={{marginBottom:0,marginTop:5}}>
          {values}
        </h5>
        <h5 style={{marginBottom:0,marginTop:2}}>
          {locales}
        </h5>
        <h5 style={{marginBottom:0,marginTop:2}}>
          {_titles}
        </h5>
      </div>
    )
  }
})

var PressProfileCard = React.createClass({
  render: function() {
    return (
      <div style={{cursor:"pointer"}}>
        <h5> <i className="fa fa-bullhorn" />&nbsp;
          Press Trigger Name</h5>
        <h5><small>Company Info blah blah</small></h5>
      </div>
    )
  }
})

var TwitterProfileCard = React.createClass({
  render: function() {
    return (
      <div style={{cursor:"pointer"}}>
        <div>
          <h5><i className="fa fa-twitter" /> &nbsp;
            Twitter Trigger Name</h5>
          <h5><small>
              <span style={{fontWeight:"bold"}}>Keywords: </span>
                blah blah</small></h5>
        </div>
      </div>
    )
  }
})

module.exports = ProfileSidebar
