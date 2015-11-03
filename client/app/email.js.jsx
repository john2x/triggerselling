/** @jsx React.DOM */

var Templates = require('./templates.js.jsx');
var Schedules = require('./schedule.js.jsx');
var Campaigns = require('./campaigns.js.jsx');
var SentMail = require('./sent_mail.js.jsx');
var FollowupFeed = require('./followup_feed.js.jsx');
var CampaignDetail = require('./campaign_detail.js.jsx');
var CreateCampaignModal = require('./create_campaign.js.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      selectedScreen: 'Campaigns',
      selectedCampaign:'',
      prospectLists: [],
      campaigns: []
    }
  },

  deleteCampaign: function(objectId) {
   // sweetAlert
    console.log(this.state.campaigns)
    campaigns = _.filter(this.state.campaigns, function(campaign) {
      return campaign.objectId != objectId
    })
    console.log(campaigns)
    this.setState({campaigns: campaigns})
    $.ajax({
      url:'https//api.parse.com/1/classes/Campaign/'+objectId,
      type:'DELETE',
      headers: Parse.headers,
      success: function(res) { console.log(res) },
      error: function(err) { console.log(err) }
    })
   // persist
   // error log
  },

  componentDidMount: function() {
    thiss = this;
     company = JSON.parse(localStorage.currentUser).company
     user = Parse._pointer('_User', JSON.parse(localStorage.currentUser).objectId)
     qry = {
       where : JSON.stringify({
         user: user,
         company: company
       }),
       include: 'prospect_list,followups,followups.template,batches',
       order: '-createdAt'
     }
     $.ajax({
       url:'https//api.parse.com/1/classes/Campaign',
      headers: Parse.headers,
      data: qry,
      success: function(res) {
        console.log(res.results)
        thiss.setState({campaigns: res.results})
       // Find All Prospects In ProspectList that are not in any batches
      },
      error: function(err) {
        console.log('error')
        console.log(err)
      }
     });
    $.ajax({
      url: 'https//api.parse.com/1/classes/ProspectList',
      data: {
        order: '-createdAt',
        where : JSON.stringify({
          user: Parse.user,
          user_company: Parse._user_company,
        })
      },
      headers: Parse.headers,
      success: function(res) {
        console.log('PROSPECT LISTS')
        console.log(res.results)
        thiss.setState({prospectLists: res.results})
      },
      error: function(err) { }
    })


  },
  
  toggleScreen: function(screen) {
    this.setState({selectedScreen : screen})
  },

  changeSelectedCampaign: function(screen, selectedCampaign) {
    console.log(selectedCampaign)
    this.setState({
      selectedCampaign : selectedCampaign,
      selectedScreen: screen,
    })
  },

  render: function() {
    thiss = this
    console.log(this.state.selectedCampaign)
    console.log(this.state.selectedScreen)
    console.log(this.state.campaigns)
    switch (this.state.selectedScreen){
      case 'Campaigns':
        CurrentScreen = <Campaigns campaigns={thiss.state.campaigns}
                            changeSelectedCampaign={thiss.changeSelectedCampaign} 
                            deleteCampaign={this.deleteCampaign}
                            toggleScreen={thiss.toggleScreen}/>
        break;
      case 'CampaignDetail':
        CurrentScreen = <CampaignDetail 
                        selectedCampaign={thiss.state.selectedCampaign}
                      selectedCampaignObjectId={thiss.state.selectedCampaginObjectId}
                        toggleScreen={thiss.toggleScreen}/>
        break;
      case 'Templates':
        CurrentScreen = <Templates/>
        break;
      case 'Overview':
        CurrentScreen = <Campaigns campaigns={thiss.state.campaigns}
                            changeSelectedCampaign={thiss.changeSelectedCampaign} 
                            toggleScreen={thiss.toggleScreen}/>
        break;
      case 'Sent Mail':
        CurrentScreen = <SentMail/>
        break;
      case 'Followup Feed':
        CurrentScreen = <FollowupFeed/>
        break;
      case 'Schedules':
        CurrentScreen = <Schedules/>
        break;
    }

    return (
      <div className="" style={{height:'550px'}}>
        <div className="container" style={{padding:'0',width:'100%',height:'100%'}}>
          <SideMenu 
                createCampaign={this.createCampaign}
                prospectLists={this.state.prospectLists}
                toggleScreen={this.toggleScreen}/>
              <div className="col-md-10" 
                   style={{padding:'0',height:'100%'}}>
            {CurrentScreen}
          </div>
        </div>
      </div>
    );
  },

  persistCampaign: function(newCampaign) {
    Campaign = {}
    Campaign.name = newCampaign.name
    Campaign.user = Parse._pointer('_User', JSON.parse(localStorage.currentUser).objectId)
    Campaign.company = JSON.parse(localStorage.currentUser).company
    Campaign.mail_integration=Parse._pointer("MailIntegration",newCampaign.mail_integration_id)
    var thiss = this;
   // TODO - add MailIntegration

    $.ajax({
      url:'https//api.parse.com/1/classes/Campaign',
      type:'POST',
      headers:Parse.headers,
      data:JSON.stringify(Campaign),
      success: function(res) {
        the_campaign = _.find(thiss.state.campaigns, function(campaign){
          first = campaign.name == newCampaign.name 
          second = campaign.prospect_list == newCampaign.prospect_list
          return first && second
        })
        console.log(res)
        console.log(res.objectId)

        the_campaign.objectId = res.objectId
        campaigns = _.filter(thiss.state.campaigns, function(campaign){
          first = campaign.name == newCampaign.name 
          second = campaign.prospect_list == newCampaign.prospect_list
          return !(first && second)
        })
        campaigns.push(the_campaign)
        console.log(campaigns)

        thiss.setState({campaigns:  campaigns})

        $.ajax({
          url:'https//api.parse.com/1/classes/Campaign/'+res.objectId,
          type:'PUT',
          data: JSON.stringify({prospect_list:{
            '__type':'Pointer',
            'className':'ProspectList',
            'objectId':newCampaign.prospect_list.objectId,
          }}),
          headers: Parse.headers,
          success: function(res){ },
          error: function() { }
        })
      },
      error: function(err) {
        console.log(err)
      }
    });
  },

  createCampaign: function(newCampaign) {
    campaigns = this.state.campaigns
    campaigns.push(newCampaign)
    this.setState({campaigns: campaigns})
    console.log(newCampaign)

    $('.modal').click()
    $('.modal-backdrop').click()

    this.persistCampaign(newCampaign)
  }
});

var SideMenu = React.createClass({
  toggleScreen: function(e) {
    this.props.toggleScreen($(e.target).text().trim())
  },

  /*
    <button type="button" className="sharp btn btn-default" onClick={this.toggleScreen}>
      <i className="fa fa-file-text"/> &nbsp; Templates
    </button>
    <button type="button" className="sharp btn btn-default" onClick={this.toggleScreen}>
      <i className="fa fa-clock-o"/> &nbsp; Schedules
    </button>
  */
  createCampaignModal: function() {

  },

  render: function() {
    return (
      <div className="col-md-2" 
        style={{padding:'0',height:'100%', backgroundColor:'rgb(90, 107, 119)',borderBottomLeftRadius:'3px'}}>
        <div className="btn-group-vertical" style={{width:'100%'}}>
          <button type="button" 
                  className="sharp btn btn-default"
                  onClick={this.toggleScreen}>
            <span style={{marginLeft:'27px'}}>Overview</span>
          </button>
          <button type="button" 
                  className="sharp btn btn-default"
                  onClick={this.toggleScreen}>
            <i className="fa fa-newspaper-o"/> &nbsp; 
            <span style={{marginLeft:'4px'}}>Followup Feed</span>
          </button>
          <button type="button" style={{display:'none'}}
                  className="sharp btn btn-default">
            <i className="fa fa-code-fork"/> &nbsp; 
            <span style={{marginLeft:'4px'}}>Rules</span>
          </button>
          <button type="button" style={{display:'none'}}
                  className="sharp btn btn-default" onClick={this.toggleScreen}>
            <i className="fa fa-pie-chart"/> &nbsp; Analytics
          </button>
          <button type="button" className="sharp btn btn-default" 
                  onClick={this.toggleScreen}>
            <i className="fa fa-paper-plane"/> &nbsp; Sent Mail
          </button>
          <button type="button" className="sharp btn btn-default" 
                  onClick={this.toggleScreen}>
            <i className="fa fa-wrench"/> &nbsp; Settings
          </button>
        </div>

        <div className="" style={{width:'100%',textAlign:'center',marginTop:100}}>
          <a href="javascript:" className="btn btn-primary new-list-btn" 
                data-toggle="modal" data-target=".bs-createCampaign-modal-sm"
                style={{ backgroundImage: 'linear-gradient(180deg, #0096ff 0%, #005dff 100%)'}}>
            <i className="fa fa-plus-circle"/>&nbsp;&nbsp;New Campaign
          </a>
        </div>
        <CreateCampaignModal prospectLists={this.props.prospectLists}
                             createCampaign={this.createCampaign}/>
      </div>
    );
  },

  createCampaign: function(newCampaign) {
    this.props.createCampaign(newCampaign)
  }
});
