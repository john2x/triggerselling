var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail

var TwitterKeywords = require("search_bar")

var CreateTwitterTrigger = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        Keywords:
        <TwitterKeywords />
        Hashtags:
        <TwitterKeywords />
      </div>
    )
  }
})

var CreateHiringTrigger = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        Title Keywords:
        <TwitterKeywords />
        Job Keyword Can Contain:
        <TwitterKeywords />
      </div>
    )
  }
})

var CreatePressTrigger = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        Title Keywords:
        <TwitterKeywords />
        Job Keyword Can Contain:
        <TwitterKeywords />
      </div>
    )
  }
})

var CreateIndustryTrigger = React.createClass({
  render: function() {
    return (
      <div style={{fontFamily:"proxima-nova"}}>
        <br/>
        Title Keywords:
        <TwitterKeywords />
        Job Keyword Can Contain:
        <TwitterKeywords />
      </div>
    )
  }
})

var CreateTriggerModal = React.createClass({
  componentDidMount: function() {
    $(".modal-md").css({"font-family":"proxima-nova"})
    $(".tab-content").css({"font-family":"proxima-nova"})

  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.closeModal} bsSize='medium' aria-labelledby='contained-modal-title-lg' style={{fontFamily:"proxima-nova !important"}}>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Create Trigger</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Enter Trigger Name</h5>
          <input className="form-control" placeholder="Trigger Name"/>
          <hr/>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Twitter'><CreateTwitterTrigger /></TabPane>
            <TabPane eventKey={2} tab='Hiring'><CreateHiringTrigger /></TabPane>
            <TabPane eventKey={3} tab='Press'><CreatePressTrigger /></TabPane>
            <TabPane eventKey={4} tab='Industry'><CreateIndustryTrigger /></TabPane>
            <TabPane eventKey={5} tab='News'><CreateIndustryTrigger /></TabPane>
          </TabbedArea>
          <hr/>
          <h5>Enter Employee Title Keyword</h5>
          <input className="form-control" placeholder="Trigger Name"/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Create Trigger</Button>
        </Modal.Footer>
      </Modal>
    )
  }
})

module.exports = CreateTriggerModal
