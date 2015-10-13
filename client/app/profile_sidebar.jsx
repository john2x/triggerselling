var ProfileSidebar = React.createClass({

  toggleCreateTriggerModal: function() {
    console.log(this.props.profiles)
    this.props.toggleCreateTriggerModal()
  },

  render: function() {
    console.log(this.props.profiles)
    profiles = _.map(this.props.profiles, function(profile) {
      return <HiringProfileCard profile={profile}/>
    })
    return (
          <div className="col-md-2">
            <span style={{fontWeight:"800"}}>TRIGGERS 
              <span style={{color:"#bbb",marginLeft:10,fontWeight:200}}>({this.props.profiles.length}) </span>
            </span>

            <a href="javascript:" 
               className="btn btn-success btn-xs" 
               onClick={this.toggleCreateTriggerModal}
               style={{float:"right"}}>
              <i className="fa fa-plus"/></a>
            <hr/>

            {profiles}
          </div>
      
    )
  }
})

var HiringProfileCard = React.createClass({
  render: function() {
    console.log(this.props.profile)
    roles = _.map(this.props.profile.profiles[0], function(prof) {
      return <span></span>
    })
    return (
      <div style={{cursor:"pointer"}}>
        <h5>
          {this.props.profile.name}</h5>
        <h5 style={{marginBottom:0,marginTop:5}}>
          <small>
          <i className="fa fa-suitcase" style={{width:15}}/> &nbsp;
            {this.props.profile.profiles[0].roles.join(", ")}</small>
        </h5>
        <h5 style={{marginBottom:0,marginTop:2}}>
          <small>
          <i className="fa fa-map-marker" style={{width:15}}/> &nbsp;
            {this.props.profile.profiles[0].locales.join(", ")}</small>
        </h5>
        <hr/>
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
      <hr/>
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
