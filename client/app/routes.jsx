var DataExplorer = require("table")
var CompanyCard = require("company_card")
var CompanyDetailOverlay = require("company_detail_overlay")
var UserDatasetTable = require("user_dataset_table")
var ProfileSidebar = require("profile_sidebar")
var TriggerList = require("trigger_list")
var CreateTriggerModal = require("create_trigger_modal")
var WebsocketListener = require("websocket_listener")
var LandingPage = require("landing_page")
var Pricing = require("pricing")
var Login = require("login")
var Signup = require("signup")
var Profile = require("profile")
var Navbar = require("navbar")
var Dashboard = require("dashboard")

var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail
var Alert = ReactBootstrap.Alert

var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;

var About = React.createClass({
  render: function () {
    return <h2>About</h2>;
  }
});

var Inbox = React.createClass({
  render: function () {
    return <h2>Inbox</h2>;
  }
});


var NewDatasetPanel = React.createClass({
  render: function() {
    return (
      <div className="col-md-offset-2 col-md-8">

        <div className="panel panel-default" style={{marginTop:20}}>
            <div className="panel-body" 
                 style={{paddingLeft:50,paddingRight:50}}>
              <h2 style={{fontWeight:800}}>Step 1: Add Dataset</h2>
              <span style={{fontWeight:400}} className="text-muted">
                Add dataset url with format hdfs://
              </span>
              <br/>
              <div>
              <hr/>
              <label htmlFor="inputEmail3" className="col-sm-2 control-label"
                style={{textAlign:"left",paddingTop:3,fontSize:18,fontWeight:800,paddingLeft:0,width:40}}>
                URL</label>
              <br/>
              <br/>
              <div className="col-sm-10" style={{paddingLeft:0}}>
                <input type="email" className="form-control" id="inputEmail3" placeholder="hdfs:// or postgres:// or mongo:// or s3:// or http://" style={{width: "124%"}}/>
              </div>
              <br/>
              <br/>
              <hr/>
              <label htmlFor="inputEmail3" className="col-sm-2 control-label"
                style={{textAlign:"left",paddingTop:3,fontSize:18,fontWeight:800,paddingLeft:0,width:40}}>
                DESCRIPTION</label>
              <br/>
              <br/>
              <div className="">
                <input type="email" className="form-control" id="inputEmail3" placeholder="hdfs:// or postgres:// or mongo:// or s3:// or http://" style={{width: "100%"}}/>
              </div>
              <br/>
              <hr/>

                <div className="radio">
                    <input type="radio" name="radio2" id="radio3" value="option1" />
                    <label htmlFor="radio3">
                      <i className="fa fa-database" /> &nbsp;
                      Public </label>
                </div>
                <div className="radio">
                    <input type="radio" name="radio2" id="radio4" value="option2" />
                    <label htmlFor="radio4">
                      <i className="fa fa-lock" /> &nbsp;
                      Private </label>
                </div>
              </div>
              <br />
              <a href="#" className="btn btn-lg btn-primary center-item"
                style={{width:200}}>
                CONTINUE</a>
              <br />
            </div>
        </div>
      </div>
    )
  }
})

// TODO: update to react 0.13.
var App = React.createClass({
  render: function() {
    return (
      <div className="app" >
        <div className="home-page">
        </div>
        <div className="container">
        <RouteHandler/>
        </div>
      </div>
    )
  }
});

var DatasetDetail = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        <div className="section-title" >Test Dataset</div>
        <ul className="dataset-detail">
          <li>Type</li>
          <li>Name</li>
          <li>Shape</li>
          <li>URL</li>
          <li>Date Added</li>
        </ul>
        <div style={{float:"right",marginTop:-55,fontWeight:800}}>
          
          <div style={{display:"inline-block",width:130}}>
          <a href="javascript:" className="btn btn-xs btn-default action-btn"
              style={{borderRight:0,borderRadius: "3px 0px 0px 3px !important"}}>
            <i className="fa fa-star"/>&nbsp;STAR  
          </a>
            <span className="action-badge"
                  style={{}}> 3.2M </span>
          </div>
          <div style={{display:"inline-block",width:130}}>
            <a href="javascript:" className="btn btn-xs btn-default action-btn"
                style={{borderRight:0,borderRadius: "3px 0px 0px 3px !important"}}>
            <i className="fa fa-code-fork"/> &nbsp;ANALYZE
          </a>
          <span className="action-badge"
            style={{}}> 
            3.2M 
          </span>
          </div> 
        </div>
        <hr/>
        <span>
          Zillow is in the process of diversifying our data sources and integrating dozens of new data feeds. 
          Ultimately, this wider diversity of data sources will lead to published data that is both more comprehensive and timely. But as this new data is incorporated, the publication of select metrics may be delayed or temporarily suspended as we work to ensure this new data meets our strict quality standards and fits into our existing datasets and databases. We look forward to resuming our usual publication schedule for all of our established datasets soon, and we apologize for any inconvenience. Thank you for your patience and understanding.
        <br/>
        <br/>



        </span>

        <TabbedArea defaultActiveKey={1}>
          <TabPane eventKey={1} tab='EXPLORE'><DataExplorer/></TabPane>
          <TabPane eventKey={2} tab='DISCUSSION'>TabPane 2 content</TabPane>
          <TabPane eventKey={3} tab='ANALYSIS'>TabPane 3 content</TabPane>
          <TabPane eventKey={4} tab='COLLABORATORS'>TabPane 3 content</TabPane>
          <TabPane eventKey={5} tab='VISUALIZATIONS'>TabPane 3 content</TabPane>
        </TabbedArea>
      </div>
    )
  }
})

var DatasetDiscussion = React.createClass({
  render: function() {
    return (
      <div>
        Discussion
      </div>
    )
  }
})

var DatasetAnalysis = React.createClass({
  render: function() {
    return (
      <div>
        Analysis
      </div>
    )
  }
})

var DatasetCollaborators = React.createClass({
  render: function() {
    return (
      <div>
        Collaborators
      </div>
    )
  }
})

var DatasetVisualizations = React.createClass({
  render: function() {
    return (
      <div>
        Visualizations
      </div>
    )
  }
})

var Main = React.createClass({
  getInitialState: function() {
    return {
      showCreateTriggerModal: false,
      profiles:[],
      triggers:[],
      triggerEmployees: {},
      detailMode: false,
      currentCompany: {}
    }
  },

  toggleCreateTriggerModal: function() {
    console.log("toggle")
    this.setState({ showCreateTriggerModal: !this.state.showCreateTriggerModal });
  },

  toggleCompanyDetailOverlay: function(company) {
    this.setState({currentCompany: company })
    this.setState({detailMode: !this.state.detailMode})
    if(!this.state.detailMode)
      $("body").css({"overflow":"hidden"})
    else
      $("body").css({"overflow":"auto"})
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
      url: location.origin+"/triggers",
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({triggers: res})

        _.map(_this.state.triggers, function(trig) {
          $.ajax({
            url: location.origin+"/company/"+trig.company_key+"/employees",
            triggerId: trig.company_key,
            dataType:"json",
            success: function(res) {
              triggerId = this.triggerId+"_employees"
              //console.log(triggerId)
              //console.log(res)
              //_this.setState({triggerId: res})
              localStorage[triggerId] = JSON.stringify(res)
            },
            error: function(err) {
              console.log(err)
            }
          })

          $.ajax({
            url: location.origin+"/companies/"+trig.domain,
            triggerId: trig.company_key,
            //dataType:"json",
            success: function(res) {
              triggerId = this.triggerId+"_company_info"
              console.log(triggerId)
              //console.log(res)
              //_this.setState({triggerId: res})
              localStorage[triggerId] = JSON.stringify(res)
            },
            error: function(err) {
              console.log(err)
            }
          })
        })
      },
      error: function(err) {
        console.log(err)
      }
    })
  },

  componentDidMount: function() {
  },

  render: function() {
    var _this = this;
    //console.log(this.state)
    CompanyCards = _.map(this.state.triggers, function(trig) {
      employeeId = trig.company_key+"_employees"
      companyInfoId = trig.company_key+"_company_info"
      //console.log(localStorage.employeeId)
      emps = []
      company_info = []
      if(localStorage[employeeId])
        emps = (localStorage[employeeId] != "") ? JSON.parse(localStorage[employeeId]) : []
      else
        emps = []

      if(localStorage[companyInfoId])
        company_info = (localStorage[companyInfoId] != "") ? JSON.parse(localStorage[companyInfoId]) : []
      else
        company_info = []

        return <CompanyCard trigger={trig} 
                      toggleCompanyDetailOverlay={_this.toggleCompanyDetailOverlay}
                          company_info={company_info}
                          employees={emps}/>
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

            <WebsocketListener />
            <a href="javascript:" className="btn btn-success" style={{float:"right",marginTop:-90,display:"none"}}>Create Trigger</a>
            <br/>
            {CompanyCards}
            <br/>
            {(CompanyCards.length) ? <div style={{textAlign:"center"}}><a href="javascript:" className="btn btn-primary btn-sm">LOAD MORE</a></div> : ""}
            <br/>
          </div>
        </div>
      </div>
        <CreateTriggerModal 
            showModal={this.state.showCreateTriggerModal}
            closeModal={this.toggleCreateTriggerModal}/>
        {(this.state.detailMode) ?
          <CompanyDetailOverlay 
              toggleCompanyDetailOverlay={this.toggleCompanyDetailOverlay}
              company={this.state.currentCompany}/> : ""
        }
      </div>
    )
  }
})




// declare our routes and their hierarchy
var routes = (
  <Route handler={App}>
    <Route path="" handler={Main}/>
    <Route path="landing" handler={LandingPage}/>
    <Route path="login" handler={Login}/>
    <Route path="signup" handler={Signup}/>
    <Route path="pricing" handler={Pricing}/>
    <Route path="profile" handler={Profile}/>
    <Route path="dashboard" handler={Dashboard}/>
    <Route path="new_dataset" handler={NewDatasetPanel}/>
    <Route path="datasets" handler={UserDatasetTable}/>
    <Route path="/dataset/:id" handler={DatasetDetail}/>
    <Route path="/dataset/:id/discussion" handler={DatasetDiscussion}/>
    <Route path="/dataset/:id/analysis" handler={DatasetAnalysis}/>
    <Route path="/dataset/:id/collaborators" handler={DatasetCollaborators}/>
    <Route path="/dataset/:id/visualizations" handler={DatasetVisualizations}/>
  </Route>
);

module.exports = routes;
