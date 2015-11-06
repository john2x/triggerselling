var CreateTriggerModal = require("create_trigger_modal")
var ProfileSidebar = require("profile_sidebar")
var Navbar = require("navbar")

var TimelineCard = React.createClass({
  downloadFile: function(csvString) {
    var blob = new Blob([csvString]);
    if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
        window.navigator.msSaveBlob(blob, "filename.csv");
    else
    {
        var a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
        a.download = "filename.csv";
        document.body.appendChild(a);
        a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
        document.body.removeChild(a);
    }
  },

  downloadCompanies: function() {
    this.downloadFile(Papa.unparse(this.props.day.cos))
  },

  downloadEmployees: function() {
    this.downloadFile(Papa.unparse(this.props.day.emps))
  },

  render: function() {
    company_info = {}
    return (
      <div className="" 
            onClick={this.toggleCompanyDetailOverlay}>
              <table style={{width:"100%"}}>
                <tbody>
                  <tr>
                    <td>
                      <h3 className="text-muted" style={{color:"#eee"}}
                        style={{color:"#ccc",marginTop:20}}><i className="fa fa-calendar-o"/></h3>
                    </td>
                    <td style={{width:"33%"}}>
                      <h5 style={{fontSize:18,marginTop:20,marginLeft:20}}>
                        {moment.unix(this.props.day.timestamp).format("YYYY-MM-DD")}
                        &nbsp;
                        <small>
                          ({moment.unix(this.props.day.timestamp).fromNow()})
                        </small>
                      </h5>
                    </td>


                    <td style={{width:"33%"}}>
                      <h3>
                        <i className="fa fa-building" />&nbsp;
                        {this.props.day.cos.length}
                      </h3>
                      <a href="javascript:" className="btn btn-primary btn-xs"
                          onClick={this.downloadCompanies}
                          style={{float:"left",marginTop:-39,marginLeft:90,fontSize:10,padding:5,paddingLeft:15,paddingRight:15,paddingTop:7}}>
                        <i className="fa fa-download"/>
                        &nbsp;
                        DOWNLOAD
                      </a>
                    </td>
                    <td style={{width:"33%"}}>
                      <h3>
                        <i className="fa fa-user" />&nbsp;
                        {this.props.day.emps.length}
                      </h3>
                      <a href="javascript:" className="btn btn-primary btn-xs"
                          onClick={this.downloadEmployees}
                          style={{float:"left",marginTop:-39,marginLeft:90,fontSize:10,padding:5,paddingLeft:15,paddingRight:15,paddingTop:7}}>
                        <i className="fa fa-download"/>
                        &nbsp;
                        DOWNLOAD
                      </a>
                    </td>

                  </tr>
                </tbody>
              </table>
            </div>
    )
  }
})


var ProfileTimeline = React.createClass({
  getInitialState: function() {
    return {
      profiles: []
    }
  },

  componentWillMount: function() {
    var _this = this;
    $.ajax({
      url: location.origin+"/profiles",
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({profiles: res})
      },
      error: function(err) {
        console.log(err)
      }
    })

    $.ajax({
      url: location.origin+"/timeline/"+this.props.params.profile_id,
      dataType:"json",
      success: function(res) {
        console.log(res)
        res = _.sortBy(res, "timestamp").reverse()
        _this.setState({days: res})
      },
      error: function(err) {
        console.log(err)
      }
    })
  },

  toggleCreateTriggerModal: function() {
    console.log("toggle")
    this.setState({ showCreateTriggerModal: !this.state.showCreateTriggerModal });
  },

  downloadProspects: function(prospectType) {
    $.ajax({
      url:location.origin+"/profile/"+this.props.params.profile_id+"/"+prospectType,
      dataType:"json",
      success: function(res) {
        console.log(res)
      },
      err: function(res) {
        console.log(res)
      },
    })
  },

  downloadEmployeeProspects: function() {
    this.downloadProspects("employees")
  },

  downloadCompanyProspects: function() {
    this.downloadProspects("companies")
  },

  render: function() {
    timelines = _.map(this.state.days, function(day) {
      return <TimelineCard day={day}/>
    })
    return (
      <div>
        <Navbar />
      <div className="container" style={{overflow:"hidden"}}> <br/>
        <div className = "row">
          <ProfileSidebar 
              profiles={this.state.profiles}
              lol={"yoyo"}
              toggleCreateTriggerModal={this.toggleCreateTriggerModal}/>
          <div className="col-md-10" style={{paddingLeft:30}}>
            <div style={{display:"block",marginLeft:"auto",marginRight:100,
                         textAlign:"center",marginTop:8}}>
              <span style={{fontWeight:"800"}}>TODAY </span>
              <span style={{color:"#bbb"}}>{moment().format("MMMM Do")}</span>
            </div>

            <a href="javascript:" className="btn btn-success" style={{float:"right",marginTop:-90,display:"none"}}>Create Trigger</a>
            <br/>
            {timelines}
            <br/>
          </div>
        </div>
      </div>
        <CreateTriggerModal 
            showModal={this.state.showCreateTriggerModal}
            closeModal={this.toggleCreateTriggerModal}/>
      </div>
    )
  }
})

module.exports = ProfileTimeline
