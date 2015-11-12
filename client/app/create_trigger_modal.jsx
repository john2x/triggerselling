var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail

var TwitterKeywords = require("search_bar")
var SearchBar = require("search_bar")
var Press = require("press")

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

var CreateEmployeeTitleTrigger = React.createClass({
  componentDidMount: function() {
    //$(".hiring-signal").selectize()
    $('.employee-title').selectize({
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
      <div>
        <input type="text" className="employee-title" placeholder="Trigger Name"/>
      </div>
    )
  }
})

var CreateHiringTrigger = React.createClass({
  componentDidMount: function() {
    //$(".hiring-signal").selectize()
    $('.hiring-signal').selectize({
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
      <div>
        <br/>
        Hiring Keywords:
        <input type="text" className="hiring-signal" placeholder="Trigger Name"/>
      </div>
    )
  }
})

var CreatePressSubjectTrigger = React.createClass({
  render: function() {
    subjects = _.map(Press.subjects, function(sub) {
      return (
        <label style={{width:200}} className="subject-item">
          <input type="checkbox" className="subject-check" 
            data-id={sub.subject} value={sub.id}/> {sub.subject}
        </label>
      )
    })

    return (
      <div style={{fontFamily:"proxima-nova",fontWeight:400,fontSize:12}}>
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
        <label style={{width:200}} className="industry-item" >
          <input type="checkbox" className="industry-check" 
            data-id={ind.industry} value={ind.id}/> {ind.industry}
        </label>
      )
    })

    return (
      <div style={{fontFamily:"proxima-nova",fontWeight:400,fontSize:12}}>
        <br/>
        <form id="press-form-industries">
          {industries}
        </form>
      </div>
    )
  }
})

var CreateTriggerModal = React.createClass({
  getInitialState: function() {
    return {
      signal: "HiringProfile",
    }
  },
  componentDidMount: function() {
    $(".modal-md").css({"font-family":"proxima-nova"})
    $(".tab-content").css({"font-family":"proxima-nova"})

    console.log(Press)
  },

  // closeModal
  //
  //
  handleSelect: function(key) {
    signal = ["", "HiringProfile","PressSubjectProfile","PressIndustryProfile"]
    console.log(key)
    console.log(signal[key])
    this.setState({signal: signal[key]});
    this.setState({key})
  },

  render: function() {
    /* <TabPane eventKey={1} tab='Twitter'><CreateTwitterTrigger /></TabPane>
      <TabPane eventKey={5} tab='News'><CreateIndustryTrigger /></TabPane> */
    return (
      <Modal show={this.props.showModal} 
          dialogClassName="create-signal-modal"
          onHide={this.props.closeModal} bsSize='medium' aria-labelledby='contained-modal-title-lg' style={{fontFamily:"proxima-nova !important", width:640}} bsStyle={{width:700}}>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Create Trigger</Modal.Title>
        </Modal.Header>
        <Modal.Body bsStyle={{width:700}}>
          <h5>Enter Trigger Name</h5>
          <input className="form-control signal-name" placeholder="Trigger Name"/>
          <hr/>
          <TabbedArea activeKey={this.state.key} defaultActiveKey={1} onSelect={this.handleSelect}>
            <TabPane eventKey={1} tab='Hiring'><CreateHiringTrigger /></TabPane>
            <TabPane eventKey={2} tab='Press'><CreatePressSubjectTrigger /></TabPane>
            <TabPane eventKey={3} tab='Industry'><CreatePressIndustryTrigger /></TabPane>
          </TabbedArea>
          <hr/>
          <h5>Enter Employee Title Keyword</h5>
          <CreateEmployeeTitleTrigger />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.createSignal}>
            Create Trigger</Button>
        </Modal.Footer>
      </Modal>
    )
  },

  createSignal: function() {
    console.log("create signal")
    console.log(this.state.signal)
    var _this = this;
    if(this.state.signal == "HiringProfile") {
      values = $(".hiring-signal").val().split(",")
      profile = {
        "className": _this.state.signal,
        "roles": values,
        "locales": [],
      }
    } else if(this.state.signal == "PressSubjectProfile") {
      values = $(".subject-item")
      profile = {
        "className": _this.state.signal,
        "values": _.map($(".subject-item :checked"), function(s) {return $(s).data()["id"] }),
        "ids": _.map($(".subject-item :checked"), function(s) {return $(s).val()}),
      }
    } else if(this.state.signal == "PressIndustryProfile") {
      values = $(".industry-item")
      profile = {
        "className": _this.state.signal,
        "values": _.map($(".industry-item :checked"), function(s) {return $(s).data()["id"] }),
        "ids": _.map($(".industry-item :checked"),function(s){return $(s).val()}),
      }
    }

    employee_titles = $(".employee-title").val().split(",")
    data = {
      name: $(".signal-name").val(),
      profiles: [profile],
      titles: employee_titles
    }

    this.props.addProfile(data)
    console.log(data)
    //this.props.closeModal()
  },
})

module.exports = CreateTriggerModal
