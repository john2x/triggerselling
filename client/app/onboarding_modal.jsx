var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail
var Nav= ReactBootstrap.Nav
var NavItem= ReactBootstrap.NavItem

var TwitterKeywords = require("search_bar")
var SearchBar = require("search_bar")
var Press = require("press")


var OnboardingModal = React.createClass({
  getInitialState: function() {
   return {
      signal: "HiringProfile",
    }
  },
  handleSelect: function(key) {
    this.setState({key})
  },
  componentDidMount: function() {
    $(".onboarding nav").css({
      "float":"left",
      "width":"20%"
    })
    $(".onboarding .nav-pills a").css({
      "width":"200px",
    })

  },
  render: function() {
    /* <TabPane eventKey={1} tab='Twitter'><CreateTwitterTrigger /></TabPane>
      <TabPane eventKey={5} tab='News'><CreateIndustryTrigger /></TabPane> */
    return (
      <Modal show={this.props.showModal} 
          dialogClassName="create-signal-modal"
          onHide={this.props.closeModal} bsSize='lg' aria-labelledby='contained-modal-title-lg' >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Onboarding Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body modalClassName="create-signal-modal-body" bsStyle={{width:700}}>
          <div className="onboarding">
          <TabbedArea bsStyle={"pills"}activeKey={this.state.key} defaultActiveKey={1} onSelect={this.handleSelect} position="left" stacked style={{float:"left"}}>
            <TabPane tabClassName="onboarding-tab" eventKey={1} tab='1. Choose Titles'><ChooseTitles /></TabPane>
            <TabPane tabClassName="onboarding-tab" eventKey={2} tab='2. Choose Press Signals'><CreatePressSubjectTrigger /></TabPane>
            <TabPane tabClassName="onboarding-tab" eventKey={3} tab='3. Choose Industries'><CreatePressIndustryTrigger /></TabPane>
            <TabPane tabClassName="onboarding-tab" eventKey={4} tab='4. Choose Company Size'><ChooseCompanySize /></TabPane>
          </TabbedArea>

          </div>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>

        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.createSignal}>
            Create Trigger</Button>
        </Modal.Footer>
      </Modal>
    )
  },
})

var ChooseTitles = React.createClass({
  componentDidMount: function() {
    $('.profile-title').selectize({
        delimiter: ',',
        persist: false,
        create: function(input) {
            return {
                value: input,
                text: input
            }
        }
    });
  },
  
  render: function() {
    return (
      <div style={{width:600,float:"right",fontFamily:"proxima-nova",paddingRight:20}}>
        <h2>Choose Titles</h2>
        <hr/>
        <input className="profile-title" placeholder="Choose Titles"/>
      </div>
    )
  }
})

var CreatePressSubjectTrigger = React.createClass({
  render: function() {
    subjects = _.map(Press.subjects, function(sub) {
      return (
        <label style={{width:200,fontWeight:400}} className="subject-item">
          <input type="checkbox" className="subject-check" 
            data-id={sub.subject} value={sub.id}/> {sub.subject}
        </label>
      )
    })

    return (
      <div style={{fontFamily:"proxima-nova",fontWeight:400,fontSize:12,
            width:600,float:"right"}}>
        <h2> Choose Press Subjects</h2>
        <br/> <form id="press-form-subjects">
          {subjects}
        </form>
      </div>
    )
  }
})

var CreatePressIndustryTrigger = React.createClass({
  render: function() {
    industries = _.map(Press.industries, function(ind) {
      return (
        <label style={{width:200,fontWeight:400}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-id={ind.industry} value={ind.id}/> {ind.industry}
        </label>
      )
    })

    return (
      <div style={{fontFamily:"proxima-nova",fontWeight:400,fontSize:12, width:600,float:"right"}}>
        <h2> Choose Press Industries</h2>
        <form id="press-form-industries">
          {industries}
        </form>
      </div>
    )
  }
})

var ChooseCompanySize = React.createClass({
  render: function() {
    return (
      <div style={{width:500,float:"right",fontFamily:"proxima-nova"}}>
        <h2>Choose Company Size</h2>
        <br/>
        <br/>
        <label style={{width:200,fontWeight:400,fontFamily:"proxima-nova"}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-min={1} data-max={1} value="1" />
            &nbsp;
            {"1 employees"}
        </label>
        <label style={{width:200,fontWeight:400,fontFamily:"proxima-nova"}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-min={2} data-max={10} value="2-10" />
            &nbsp;
            {"2-10 employees"}
        </label>
        <label style={{width:200,fontWeight:400,fontFamily:"proxima-nova"}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-min={11} data-max={50} value="11-50" />
            &nbsp;
            {"11-50 employees"}
        </label>
        <label style={{width:200,fontWeight:400,fontFamily:"proxima-nova"}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-min={51} data-max={200} value="51-200" />
            &nbsp;
            {"51-200 employees"}
        </label>
        <label style={{width:200,fontWeight:400,fontFamily:"proxima-nova"}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-min={201} data-max={500} value="201-500" />
            &nbsp;
            {"201-500 employees"}
        </label>
        <label style={{width:200,fontWeight:400,fontFamily:"proxima-nova"}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-min={501} data-max={1000} value="501-1000" />
            &nbsp;
            {"501-1000 employees"}
        </label>
        <label style={{width:200,fontWeight:400,fontFamily:"proxima-nova"}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-min={1001} data-max={5000} value="1001-5000" />
            &nbsp;
            {"1001-5000 employees"}
        </label>
        <label style={{width:200,fontWeight:400,fontFamily:"proxima-nova"}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-min={5001} data-max={10000} value="5001-10,000" />
            &nbsp;
            {"5001-10,000 employees"}
        </label>
        <label style={{width:200,fontWeight:400,fontFamily:"proxima-nova"}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-min={10000} data-max={10000000} value="10000+" />
            &nbsp;
            {"10,000+ employees"}
        </label>
      </div>

    )
  }
})

module.exports = OnboardingModal
