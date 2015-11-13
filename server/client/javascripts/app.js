(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("checkbox_group", function(exports, require, module) {

var CheckboxGroup = React.createClass({displayName: 'CheckboxGroup',
  render: function() {
    return (
      React.createElement("div", null, 
        "The Checkbox Group", 
        React.createElement("div", {className: "checkbox"}, 
          React.createElement("input", {type: "checkbox", id: "checkbox1"}), React.createElement("label", {htmlFor: "checkbox1"}, " Check me out "), 
          React.createElement("input", {type: "checkbox", id: "checkbox2"}), React.createElement("label", {htmlFor: "checkbox2"}, " Check me out "), 
          React.createElement("input", {type: "checkbox", id: "checkbox3"}), React.createElement("label", {htmlFor: "checkbox3"}, " Check me out "), 
          React.createElement("input", {type: "checkbox", id: "checkbox4"}), React.createElement("label", {htmlFor: "checkbox4"}, " Check me out ")
        )
      )
    )
  }
})

module.exports = CheckboxGroup

});

;require.register("company_card", function(exports, require, module) {
var CompanyCard = React.createClass({displayName: 'CompanyCard',
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
    else 
      company_info = {}
    hoverStyle = {borderRadius: 5, paddingLeft:10, paddingRight:10, cursor:"pointer"}
    if(this.state.hover)
      hoverStyle.backgroundColor ="rgba(0,0,0,0.03)"

    company_info.metrics = (!!company_info.metrics) ? company_info.metrics : {}
    company_info.geo = (!!company_info.geo) ? company_info.geo : {}
    company_info.geo = {city: ""}

    return (
      React.createElement("div", {className: "", 
            onMouseEnter: this.mouseOver, 
            onMouseLeave: this.mouseLeave, 
            onClick: this.toggleCompanyDetailOverlay, 
            style: hoverStyle}, 
              React.createElement("table", null, 
                React.createElement("tbody", null, 
                  React.createElement("tr", null, 
                    React.createElement("td", null, 
                     React.createElement("a", {href: "javascript:", className: "thumbnail", 
                        style: {height:65,width:65,marginRight:15,float:"left",marginBottom:0}}, 
                        React.createElement("img", {src: (company_info.logo) ? company_info.logo : "images/empty_company.png", alt: ""})
                      )
                    ), 
                    React.createElement("td", {style: {padding:5,width:"35%"}}, 
                      React.createElement("a", {href: "javascript:", style: {color:"black"}}, 
                      React.createElement("h5", {style: {fontSize:18}}, 
                        this.props.trigger.company_name, 
                        React.createElement("small", {style: {float:"right",fontSize:8,display:"none"}}, 
                          React.createElement("i", {className: "fa fa-external-link-square", style: {cursor:"pointer"}, 
                          onClick: this.openLink})
                        ), 

                        (this.props.trigger.email_pattern) ? React.createElement("i", {className: "fa fa-envelope"}) : ""
                      )
                      ), 
                      React.createElement("div", {className: "ellipsis", style: {width:300,fontSize:10}}, 
                        company_info.description
                      ), 
                      React.createElement("div", {className: "ellipsis", style: {width:300,fontSize:10}}, 
                        (company_info.location) ? React.createElement("span", null, React.createElement("i", {className: "fa fa-map-marker"}), "  ") : "", 
                        company_info.geo.city +", "+company_info.geo.state, 

                        " " + ' ' +
                        " " + ' ' +
                        " ", 

                        (company_info.metrics.employees) ? React.createElement("span", null, React.createElement("i", {className: "fa fa-users"}), "  ") : "", 
                        company_info.metrics.employees + " employees"
                      )
                    ), 

                    React.createElement(SignalInfo, {trigger: this.props.trigger}), 
                    React.createElement(EmployeeInfo, {employees: this.props.employees}), 


                    React.createElement("td", {style: {padding:5}}, 
                      React.createElement("div", {style: {width:100}}, 
                        moment.unix(this.props.trigger.timestamp).fromNow()
                      )
                    ), 
                    React.createElement("td", {style: {padding:5}}, 
                      React.createElement("a", {href: "javascript:", className: "btn btn-primary btn-sm"}, React.createElement("i", {className: "fa fa-download"}))
                    )
                  )
                )
              )
            )
    )
  }
})

var DetailLabel = React.createClass({displayName: 'DetailLabel',
  render: function() {
    return (
      React.createElement("label", {style: {border:"3px solid #eee",fontWeight:800,float:"left",color:"#ddd",marginRight:5, borderRadius:5,paddingLeft:5,paddingRight:5,display:"block",fontSize:11,backgroundColor:"white"}}, " ", this.props.text, " ")
    )
  } 
})

var SignalInfo = React.createClass({displayName: 'SignalInfo',
  getInitialState: function() {
    return {
    }
  },

  render: function() {
    return (
      React.createElement("td", {style: {padding:5,width:"35%"}}, 
        React.createElement("h5", null), 
        React.createElement("h5", null, React.createElement("small", null, 
            React.createElement("i", {className: "fa fa-suitcase"}), "  ", 
            this.props.trigger.job_title
        )), 
        React.createElement(DetailLabel, {text: this.props.trigger.source.toUpperCase()}), 
        React.createElement(DetailLabel, {text: "HIRING SIGNAL"})
      )
    )
  }
})

var UserPic = React.createClass({displayName: 'UserPic',
  render: function() {
    return (
      React.createElement("div", {style: {height:30,width:30,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-13}}, " ")
    )

  }
})

var EmployeeInfo = React.createClass({displayName: 'EmployeeInfo',
  render: function() {
    length = (this.props.employees.length > 3) ? 3 : this.props.employees.length
    users = []
    for(i=0;i< length; i++)
      users.push(React.createElement(UserPic, null))

    return (
        React.createElement("td", {style: {padding:5,width:"18%"}}, 
          React.createElement("h5", null), 
          (this.props.employees.length) ? React.createElement("div", null, users, 
          React.createElement("div", {style: {color: "#aaa",marginTop: -30, marginLeft: 65,fontSize:13}}, 
            this.props.employees.length + " employees"
          )
          ) : ""
        )
    )
  }
})
/*
                      <div style={{height:25,width:25,border:"2px solid white",boxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-10}}> </div>
                      */
                    

module.exports = CompanyCard

});

;require.register("company_detail_overlay", function(exports, require, module) {
var CompanyDetailOverlay = React.createClass({displayName: 'CompanyDetailOverlay',
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
        return  React.createElement(EmployeeCard, {emp: emp})
    })

    return (
      React.createElement("div", {style: {position:"fixed",top:0,width:"100%",height:"100%"}}, 
        React.createElement("div", {style: {height:"100%",width:"100%",position:"absolute",top:0,left:0,backgroundColor:"rgba(255,255,255,0.7)",zIndex:1}, 
            onClick: this.toggleCompanyDetailOverlay}, 
        React.createElement("a", {href: "javascript:", className: "btn btn-lg"}, 
          React.createElement("i", {className: "fa fa-times"})
        )
      ), 
      React.createElement("div", {style: {width:"60%",float:"right",borderLeft:"1px solid #ccc",zIndex:2,position:"absolute",top:0,right:0,height:"100%",backgroundColor:"white",padding:15}}, 
                     React.createElement("a", {href: "javascript:", className: "thumbnail", 
                        style: {height:130,width:130,marginRight:15,float:"left",marginBottom:0}}, 
                        React.createElement("img", {src: (ci.logo) ? ci.logo : "images/empty_company.png", alt: ""})
                      ), 
        React.createElement("h1", {style: {marginTop:0}}, company.company_name), 
        React.createElement("h3", {style: {marginTop:0}}, React.createElement("small", null, (ci.category) ? ci.category.industry : ""), 
          " " + ' ' +
          " ", 
          React.createElement("div", {style: {display:"inline"}}, 
          React.createElement("a", {className: "btn btn-default btn-xs"}, 
            React.createElement("i", {className: "fa fa-angellist"})
          ), 
          " ", 
          React.createElement("a", {className: "btn btn-default btn-xs"}, 
            React.createElement("i", {className: "fa fa-linkedin"})
          ), 
          " ", 
          React.createElement("a", {className: "btn btn-default btn-xs"}, 
            React.createElement("i", {className: "fa fa-facebook"})
          ), 
          " ", 
          React.createElement("a", {className: "btn btn-default btn-xs"}, 
            React.createElement("i", {className: "fa fa-twitter"})
          ), 
          " ", 
          React.createElement("a", {className: "btn btn-default btn-xs"}, 
            React.createElement("i", {className: "fa fa-globe"})
          )
          )), 
        React.createElement("h5", {style: {width:"73%",overflow:"auto",height:45}}, ci.description), 
        React.createElement("div", {style: {display:"none"}}, 
          React.createElement("input", {className: "form-control input-sm", value: ci.domain, style: {width:300}}), 
          React.createElement("input", {className: "form-control input-sm", value: company.email_pattern, style: {width:300}})
        ), 
        React.createElement("hr", null), 
        React.createElement("div", {style: {height:"83%",overflow:"auto"}}, 
          employees
        )
      )
    )
    )
  }
})

var UserPic = React.createClass({displayName: 'UserPic',
  render: function() {
    return (
      React.createElement("div", {style: {height:35,width:35,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,float:"left",marginRight:10}}, " ")
    )

  }
})

var EmployeeCard = React.createClass({displayName: 'EmployeeCard',
  /*
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  */
  render: function() {
    emp = this.props.emp
    return (
            React.createElement("div", {style: {paddingLeft:5,width:"80%"}}, 
              React.createElement(UserPic, null), 
              React.createElement("h5", {style: {marginBottom:0}}, 
                React.createElement("span", {style: {fontWeight:"bold"}}, emp.name), " -",  
                React.createElement("small", {style: {width:200,whiteSpace:"nowrap",overflow:"hidden",
                               textOverflow:"ellipsis",display:"inline-block",
                               marginLeft:5}}, 
                    emp.title)), 
              React.createElement("h6", {style: {marginTop:4}}, emp.locale, " -",  
                React.createElement("small", null, emp.company_name)), 
              React.createElement("input", {className: "form-control input-sm", value: "example@example.com", 
                style: {float:"right",marginTop:-35,marginRight:60, width:150}}), 

              React.createElement("a", {className: "btn btn-primary btn-xs", 
                  onClick: this.openLink, 
                  style: {float:"right",marginTop:-32,marginRight:30}}, 
                React.createElement("i", {className: "fa fa-external-link"})
              ), 
              React.createElement("a", {href: "javascript:", className: "btn btn-success btn-xs", 
                  style: {float:"right",marginTop:-32,marginRight:0}}, 
                React.createElement("i", {className: "fa fa-plus"})
              )
            )

    )
  }
})


module.exports = CompanyDetailOverlay

});

;require.register("create_trigger_modal", function(exports, require, module) {
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

var CreateTwitterTrigger = React.createClass({displayName: 'CreateTwitterTrigger',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        "Keywords:", 
        React.createElement(TwitterKeywords, null), 
        "Hashtags:", 
        React.createElement(TwitterKeywords, null)
      )
    )
  }
})

var CreateEmployeeTitleTrigger = React.createClass({displayName: 'CreateEmployeeTitleTrigger',
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
      React.createElement("div", null, 
        React.createElement("input", {type: "text", className: "employee-title", placeholder: "Trigger Name"})
      )
    )
  }
})

var CreateHiringTrigger = React.createClass({displayName: 'CreateHiringTrigger',
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
      React.createElement("div", null, 
        React.createElement("br", null), 
        "Hiring Keywords:", 
        React.createElement("input", {type: "text", className: "hiring-signal", placeholder: "Trigger Name"})
      )
    )
  }
})

var CreatePressSubjectTrigger = React.createClass({displayName: 'CreatePressSubjectTrigger',
  render: function() {
    subjects = _.map(Press.subjects, function(sub) {
      return (
        React.createElement("label", {style: {width:200}, className: "subject-item"}, 
          React.createElement("input", {type: "checkbox", className: "subject-check", 
            'data-id': sub.subject, value: sub.id}), " ", sub.subject
        )
      )
    })

    return (
      React.createElement("div", {style: {fontFamily:"proxima-nova",fontWeight:400,fontSize:12}}, 
        React.createElement("br", null), " ", React.createElement("form", {id: "press-form-subjects"}, 
          subjects
        )
      )
    )
  }
})

var CreatePressIndustryTrigger = React.createClass({displayName: 'CreatePressIndustryTrigger',
  render: function() {
    industries = _.map(Press.industries, function(ind) {
      return (
        React.createElement("label", {style: {width:200}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-id': ind.industry, value: ind.id}), " ", ind.industry
        )
      )
    })

    return (
      React.createElement("div", {style: {fontFamily:"proxima-nova",fontWeight:400,fontSize:12}}, 
        React.createElement("br", null), 
        React.createElement("form", {id: "press-form-industries"}, 
          industries
        )
      )
    )
  }
})

var CreateTriggerModal = React.createClass({displayName: 'CreateTriggerModal',
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
    this.setState({key:key})
  },

  render: function() {
    /* <TabPane eventKey={1} tab='Twitter'><CreateTwitterTrigger /></TabPane>
      <TabPane eventKey={5} tab='News'><CreateIndustryTrigger /></TabPane> */
    return (
      React.createElement(Modal, {show: this.props.showModal, 
          dialogClassName: "create-signal-modal", 
          onHide: this.props.closeModal, bsSize: "medium", 'aria-labelledby': "contained-modal-title-lg", style: {fontFamily:"proxima-nova !important", width:640}, bsStyle: {width:700}}, 
        React.createElement(Modal.Header, {closeButton: true}, 
          React.createElement(Modal.Title, {id: "contained-modal-title-lg"}, "Create Trigger")
        ), 
        React.createElement(Modal.Body, {bsStyle: {width:700}}, 
          React.createElement("h5", null, "Enter Trigger Name"), 
          React.createElement("input", {className: "form-control signal-name", placeholder: "Trigger Name"}), 
          React.createElement("hr", null), 
          React.createElement(TabbedArea, {activeKey: this.state.key, defaultActiveKey: 1, onSelect: this.handleSelect}, 
            React.createElement(TabPane, {eventKey: 1, tab: "Hiring"}, React.createElement(CreateHiringTrigger, null)), 
            React.createElement(TabPane, {eventKey: 2, tab: "Press"}, React.createElement(CreatePressSubjectTrigger, null)), 
            React.createElement(TabPane, {eventKey: 3, tab: "Industry"}, React.createElement(CreatePressIndustryTrigger, null))
          ), 
          React.createElement("hr", null), 
          React.createElement("h5", null, "Enter Employee Title Keyword"), 
          React.createElement(CreateEmployeeTitleTrigger, null)
        ), 
        React.createElement(Modal.Footer, null, 
          React.createElement(Button, {bsStyle: "primary", onClick: this.createSignal}, 
            "Create Trigger")
        )
      )
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

});

;require.register("current_plan", function(exports, require, module) {
var CurrentPlan = React.createClass({displayName: 'CurrentPlan',
  getInitialState: function() {
    return {

    }
  },

  componentDidMount: function() {
    //$("#credit-card-form").validate()
    var $messages = $('#error-message-wrapper');

    $.validate({
        form : '#credit-card-form',
        errorMessagePosition: $messages,
        showErrorDialogs : true
    });

    /*
    $('.form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });
    */
    /*
    $(".floatlabel-wrapper").css({
      width:"auto",
      display:"inline-block"
    })
    */
  },

  submitForm: function(e) {
    //e.preventDefault()
    this.setState({planChosen: $("#choose-plan-form").val() != ""})
    this.setState({billingCycleChosen: $("#billing-cycle-form").val() != ""})
    console.log("lmao")
  },

  render: function() {
    return (
            React.createElement("div", {className: "panel panel-default"}, 
              React.createElement("div", {className: "panel-body"}, 
                React.createElement("h3", null, "Current Plan"), 
                React.createElement("hr", null), 
                React.createElement("h4", null, "1. Payment Information"), 

        React.createElement("div", {id: "error-message-wrapper", 
             className: "alert alert-info"}), 
        React.createElement("form", {id: "credit-card-form", onSubmit: this.submitForm}, 
                React.createElement("input", {type: "text", className: "form-control input-lg float", 'data-label': "lmao", placeholder: "Credit Card Number", style: {marginBottom:10}, 'data-validation': "required", 'data-validation': "number length", 'data-validation-length': "min16 max16"}), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "MM", style: {marginBottom:5,width:"20%",display:"inline-block",marginRight:15}, 'data-validation': "required", 'data-validation': "number length", 'data-validation-length': "min2", min: "0", step: "1"}), 
                React.createElement("h4", {style: {display:"inline"}}, " /    "), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "YY", style: {marginBottom:5,width:"20%",display:"inline-block"}, 'data-validation': "length number", 'data-validation-length': "min2", maxLength: "2", min: "0", max: "99", step: "1"}), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "CVC", style: {marginBottom:5,width:"20%",display:"inline-block",float:"right"}, 'data-validation': "required", 'data-validation': "length number", 'data-validation-length': "min3", maxLength: "3", min: "0", step: "1"})
        ), 
                React.createElement("hr", null), 
                React.createElement("h4", null, "2.  Select Your Plan"), 
        (!!this.state.planChosen) ? React.createElement("div", {className: "alert alert-info"}, "Please choose value") : "", 
        React.createElement("form", {id: "choose-plan-form", onSubmit: this.submitForm}, 
          React.createElement("div", {className: "radio", style: {display:"none"}}, 
              React.createElement("br", null), 
              React.createElement("input", {type: "radio", name: "radio2", id: "radio1", value: "option1", 
                  style: {paddingTop:15}}), 
              React.createElement("label", {htmlFor: "radio1", style: {width:"100%"}}, 
              React.createElement("div", {style: {marginTop:-20,marginLeft:20}}, 
                React.createElement("h4", {style: {fontWeight:800,marginBottom:0}}, "Free Trial"), 
                React.createElement("h5", {style: {fontWeight:600,color:"#aaa",marginTop:4}}, "Free Trial")
              )
              ), 
              React.createElement("h4", {style: {float:"right",marginTop:-40,marginRight:40}}, "$0")
          ), 
          React.createElement("div", {className: "radio"}, 
              React.createElement("br", null), 
              React.createElement("input", {type: "radio", name: "radio2", id: "radio2", value: "option1", 
                  style: {paddingTop:15}}), 
              React.createElement("label", {htmlFor: "radio2", style: {width:"100%"}}, 
              React.createElement("div", {style: {marginTop:-20,marginLeft:20}}, 
                React.createElement("h4", {style: {fontWeight:800,marginBottom:0}}, "Starter"), 
                React.createElement("h5", {style: {fontWeight:600,color:"#aaa",marginTop:4}}, "Free Trial")
              ), 
              React.createElement("h4", {style: {float:"right",marginTop:-40,marginRight:40}}, "$99")
              )
          ), 
          React.createElement("div", {className: "radio"}, 
              React.createElement("br", null), 
              React.createElement("input", {type: "radio", name: "radio2", id: "radio3", value: "option1", 
                  style: {paddingTop:15}}), 
              React.createElement("label", {htmlFor: "radio3", style: {width:"100%"}}, 
              React.createElement("div", {style: {marginTop:-20,marginLeft:20}}, 
                React.createElement("h4", {style: {fontWeight:800,marginBottom:0}}, "Professional"), 
                React.createElement("h5", {style: {fontWeight:600,color:"#aaa",marginTop:4}}, "Free Trial")
              ), 
              React.createElement("h4", {style: {float:"right",marginTop:-40,marginRight:40}}, "$499")
              )
          ), 
          React.createElement("div", {className: "radio"}, 
              React.createElement("br", null), 
              React.createElement("input", {type: "radio", name: "radio2", id: "radio4", value: "option1", 
                  style: {paddingTop:15}}), 
              React.createElement("label", {htmlFor: "radio4", style: {width:"100%"}}, 
              React.createElement("div", {style: {marginTop:-20,marginLeft:20}}, 
                React.createElement("h4", {style: {fontWeight:800,marginBottom:0}}, "Enterprise"), 
                React.createElement("h5", {style: {fontWeight:600,color:"#aaa",marginTop:4}}, "Free Trial")
              ), 
              React.createElement("h4", {style: {float:"right",marginTop:-40,marginRight:40}}, "$999")
              )
          )
        ), 

                React.createElement("hr", null), 
          React.createElement("h4", null, "3. Select Billing Cycle"), 
        (!!this.state.billingCycleChosen) ? React.createElement("div", {className: "alert alert-info"}, "Please choose value") : "", 
              React.createElement("br", null), 
              React.createElement("form", {role: "form", id: "billing-cycle-form"}, 
                React.createElement("div", {className: "radio", style: {display:"inline"}}, 
                    React.createElement("input", {type: "radio", name: "radio2", id: "radio17", value: "option1"}), 
                    React.createElement("label", {htmlFor: "radio17"}, React.createElement("h5", {style: {marginTop:0}}, "Monthly "))
                ), 
                " " + ' ' +
                " ", 
                React.createElement("div", {className: "radio", style: {display:"inline"}}, 
                    React.createElement("input", {type: "radio", name: "radio2", id: "radio19", value: "option2"}), 
                    React.createElement("label", {hmtlFor: "radio19"}, 
                        React.createElement("h5", {style: {marginTop:0}}, "Yearly  ", React.createElement("span", {style: {fontWeight:"bold",color:"#15cd72"}}, "-20 %")))
                )
              ), 
  
              React.createElement("br", null), 
              React.createElement("br", null), 
          React.createElement("a", {href: "javascript:", style: {display:"block",textAlign:"center",fontSize:16}, 
              onClick: this.submitForm, 
              className: "btn btn-lg btn-primary"}, 
              "Complete and Upgrade"
          )

        )
              )
    )
  }
})

module.exports = CurrentPlan

});

;require.register("dashboard", function(exports, require, module) {
var BarChart = rd3.BarChart;
var LineChart = rd3.LineChart;
var PieChart = rd3.PieChart;
var AreaChart = rd3.AreaChart;
var Treemap = rd3.Treemap;
var ScatterChart = rd3.ScatterChart;
var CandleStickChart = rd3.CandleStickChart;

var Dashboard = React.createClass({displayName: 'Dashboard',
  getInitialState: function() {
    return {
      profile_value_counts: [],
      rq_job_counts: ["~","~","~",],
      total_counts: ["~","~","~","~","~",],
      percentage_counts: ["~","~","~","~","~",],
    }
  },

  componentDidMount: function() {
   Pusher.log = function(message) {
      if (window.console && window.console.log) {
        window.console.log(message);
      }
    };

    var pusher = new Pusher('f1141b13a2bc9aa3b519', {
      encrypted: true
    });
    var channel = pusher.subscribe('admin_dashboard');

    var _this = this;
    channel.bind('profile_value_counts', function(data) {
      //console.log(data)
      _this.setState({ "profile_value_counts" : data, "profile_last_updated": moment().unix()})
    });
    channel.bind('rq_job_counts', function(data) {
      //console.log(data)
      _this.setState({ "rq_job_counts" : data, "rq_last_updated": moment().unix()})
    });
    channel.bind('total_counts', function(data) {
      console.log(data)
      _this.setState({ "total_counts" : data, "tc_last_updated": moment().unix()})
    });
    channel.bind('percentage_counts', function(data) {
      console.log(data)
      _this.setState({ "percentage_counts" : data, "pc_last_updated": moment().unix()})
    });
    channel.bind('average_counts', function(data) {
      _this.setState({"average_counts" : data.message})
    });
    channel.bind('last_updated', function(data) {
      _this.setState({"last_updated" : data.message})
    });
    metrics = ["function:time:company_name_to_domain",
          "function:time:clearbit_search_company_record",
          "function:time:bulk_update_employee_record",
          "function:time:company_employee_search",
          "function:time:simplyhired_job_scrape",
          "function:time:indeed_job_scrape",
          "function:time:ziprecruiter_job_scrape"]
    _.map(metrics, function(metric) {
        channel.bind(metric, function(data) {
          //console.log(metric, data)
          _data = {}
          _data[metric] = data
          _this.setState(_data)
        });
    })
    /*
    _.map(metrics, function(metric) {
      $.ajax({
        url: location.origin+"/redis/stats/"+metric,
        success: function(res) {

        },
        error: function() {

        }
      })
    })
    */
  },

  render: function () {
    var _this = this;
    metrics = ["function:time:company_name_to_domain",
          "function:time:clearbit_search_company_record",
          "function:time:bulk_update_employee_record",
          "function:time:company_employee_search",
          "function:time:simplyhired_job_scrape",
          "function:time:indeed_job_scrape",
          "function:time:ziprecruiter_job_scrape"]

    metric_rows = _.map(metrics, function(metric) {
      //console.log(_this.state[metric])
      m = (_this.state[metric]) ? _this.state[metric] : {}
      return ( 
        React.createElement("tr", null, 
          React.createElement("td", null, metric), 
          React.createElement("td", null, m.mean), 
          React.createElement("td", null, m.median), 
          React.createElement("td", null, m.min), 
          React.createElement("td", null, m.max), 
          React.createElement("td", null, m.per_second)
        )
      )
    })
    raw_metric_rows = _.map(metrics, function(metric) {
      m = (_this.state[metric]) ? _this.state[metric] : {}
      //console.log(m.raw)
      return (
          React.createElement("div", {className: "col-md-3"}, 
            React.createElement("h4", null, metric.split("function:time")[1]), 
            React.createElement("div", {className: "panel panel-default"}, 
            React.createElement("table", {className: "table table-striped"}, 
              _.map(m.raw, function(stat) {
                return (
                  React.createElement("tr", null, 
                    React.createElement("td", null, moment.unix(stat.b).fromNow()), 
                    React.createElement("td", null, (stat.a/1000000).toFixed(3))
                  )
                )
                })
              
            )
            )
          )
      )
    })
    return (
    React.createElement("div", {className: "container"}, 
      React.createElement("h2", null, "Dashboard"), 
      React.createElement("hr", null), 
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-md-6"}, 
          React.createElement("h4", null, "Number of Triggers Per Profile ", React.createElement("small", null, "Last Updated: ", moment.unix(this.state.profile_last_updated).fromNow())), 
          React.createElement("div", {className: "panel panel-default"}, 
          React.createElement("table", {className: "table table-striped"}, 
            React.createElement("tbody", null, 
            _.map(_.keys(this.state.profile_value_counts), function(prof) { 
              return (React.createElement("tr", null, 
                  React.createElement("td", null, prof), 
                  React.createElement("td", null, _this.state.profile_value_counts[prof])
              ) )
            }) 
            
            )
          )
          )
        ), 
          React.createElement("div", {className: "col-md-6"}, 
              React.createElement("h4", null, "RQ Stats"), 
              React.createElement("div", {className: "panel panel-default"}, 
              React.createElement("table", {className: "table table-striped"}, 
                React.createElement("tr", null, 
                  React.createElement("td", null, "Number of Jobs"), 
                  React.createElement("td", null, 
                    React.createElement("span", {className: "label label-info"}, 
                      this.state.rq_job_counts[0]
                    ), "  ", 
                    React.createElement("span", {className: "label label-primary"}, 
                      this.state.rq_job_counts[1]
                    ), "  ", 
                    React.createElement("span", {className: "label label-success"}, 
                      this.state.rq_job_counts[2]
                    ), " "
                  )
                ), 
                React.createElement("tr", null, 
                  React.createElement("td", null, "Total Counts"), 
                  React.createElement("td", null, 
                    React.createElement("span", {className: "label label-info"}, 
                      this.state.total_counts[0]
                    ), "  ", 
                    React.createElement("span", {className: "label label-primary"}, 
                      this.state.total_counts[1]
                    ), "  ", 
                    React.createElement("span", {className: "label label-primary"}, 
                      this.state.total_counts[2]
                    ), "  ", 
                    React.createElement("span", {className: "label label-primary"}, 
                      this.state.total_counts[3]
                    ), "  ", 
                    React.createElement("span", {className: "label label-success"}, 
                      this.state.total_counts[4]
                    ), " "
                  )
                ), 
                React.createElement("tr", null, 
                  React.createElement("td", null, "Percentage Counts"), 
                  React.createElement("td", null, 
                    React.createElement("span", {className: "label label-info"}, 
                      parseFloat(this.state.percentage_counts[0]).toFixed(2)
                    ), "  ", 
                    React.createElement("span", {className: "label label-primary"}, 
                      parseFloat(this.state.percentage_counts[1]).toFixed(2)
                    ), "  ", 
                    React.createElement("span", {className: "label label-primary"}, 
                      parseFloat(this.state.percentage_counts[2]).toFixed(2)
                    ), "  ", 
                    React.createElement("span", {className: "label label-primary"}, 
                      parseFloat(this.state.percentage_counts[3]).toFixed(2)
                    ), "  ", 
                    React.createElement("span", {className: "label label-success"}, 
                      parseFloat(this.state.percentage_counts[4]).toFixed(2)
                    ), " "
                  )
                )
              )
              )
          )
      ), 
      React.createElement("br", null), 
      React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-12"}, 
              React.createElement("h4", null, "Number of Triggers Per Profile"), 
              React.createElement("div", {className: "panel panel-default"}, 
              React.createElement("table", {className: "table table-striped"}, 
                React.createElement("thead", null, 
                  React.createElement("th", null, "Function / Job"), 
                  React.createElement("th", null, "Mean"), 
                  React.createElement("th", null, "Median"), 
                  React.createElement("th", null, "Min"), 
                  React.createElement("th", null, "Max"), 
                  React.createElement("th", null, "Per Second")
                ), 
                metric_rows
              )
              )
          )
      ), 
      React.createElement("div", {className: "row"}
      ), 
      React.createElement("div", {className: "row"}, 
        raw_metric_rows

      )
    ))
  }
});

module.exports = Dashboard

});

;require.register("date_pair", function(exports, require, module) {


var DatePair = React.createClass({displayName: 'DatePair',
  componentDidMount: function() {
    $('.date').datepicker()

  },
  render: function() {
    input = {width:75, display:"inline-block",fontSize:10}
    return (
      React.createElement("div", null, 
        React.createElement("h6", {style: {fontWeight:"800"}}, "COLUMN NAME  ", 
            React.createElement("small", null, "datetime")), 
        React.createElement("p", {id: "basicExample"}, 
            React.createElement("input", {type: "text", className: "date start form-control input-sm", style: input}), 
            " ", 
            React.createElement("span", {style: {fontSize:8,fontWeight:600}}, "TO"), 
            " ", 
            React.createElement("input", {type: "text", className: "date end form-control input-sm", style: input})
        )

      )
    )
  }
})

module.exports = DatePair

});

;require.register("email.js", function(exports, require, module) {
/** @jsx React.DOM */

var Templates = require('./templates.js.jsx');
var Schedules = require('./schedule.js.jsx');
var Campaigns = require('./campaigns.js.jsx');
var SentMail = require('./sent_mail.js.jsx');
var FollowupFeed = require('./followup_feed.js.jsx');
var CampaignDetail = require('./campaign_detail.js.jsx');
var CreateCampaignModal = require('./create_campaign.js.jsx');

module.exports = React.createClass({displayName: 'exports',
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
        CurrentScreen = React.createElement(Campaigns, {campaigns: thiss.state.campaigns, 
                            changeSelectedCampaign: thiss.changeSelectedCampaign, 
                            deleteCampaign: this.deleteCampaign, 
                            toggleScreen: thiss.toggleScreen})
        break;
      case 'CampaignDetail':
        CurrentScreen = React.createElement(CampaignDetail, {
                        selectedCampaign: thiss.state.selectedCampaign, 
                      selectedCampaignObjectId: thiss.state.selectedCampaginObjectId, 
                        toggleScreen: thiss.toggleScreen})
        break;
      case 'Templates':
        CurrentScreen = React.createElement(Templates, null)
        break;
      case 'Overview':
        CurrentScreen = React.createElement(Campaigns, {campaigns: thiss.state.campaigns, 
                            changeSelectedCampaign: thiss.changeSelectedCampaign, 
                            toggleScreen: thiss.toggleScreen})
        break;
      case 'Sent Mail':
        CurrentScreen = React.createElement(SentMail, null)
        break;
      case 'Followup Feed':
        CurrentScreen = React.createElement(FollowupFeed, null)
        break;
      case 'Schedules':
        CurrentScreen = React.createElement(Schedules, null)
        break;
    }

    return (
      React.createElement("div", {className: "", style: {height:'550px'}}, 
        React.createElement("div", {className: "container", style: {padding:'0',width:'100%',height:'100%'}}, 
          React.createElement(SideMenu, {
                createCampaign: this.createCampaign, 
                prospectLists: this.state.prospectLists, 
                toggleScreen: this.toggleScreen}), 
              React.createElement("div", {className: "col-md-10", 
                   style: {padding:'0',height:'100%'}}, 
            CurrentScreen
          )
        )
      )
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

var SideMenu = React.createClass({displayName: 'SideMenu',
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
      React.createElement("div", {className: "col-md-2", 
        style: {padding:'0',height:'100%', backgroundColor:'rgb(90, 107, 119)',borderBottomLeftRadius:'3px'}}, 
        React.createElement("div", {className: "btn-group-vertical", style: {width:'100%'}}, 
          React.createElement("button", {type: "button", 
                  className: "sharp btn btn-default", 
                  onClick: this.toggleScreen}, 
            React.createElement("span", {style: {marginLeft:'27px'}}, "Overview")
          ), 
          React.createElement("button", {type: "button", 
                  className: "sharp btn btn-default", 
                  onClick: this.toggleScreen}, 
            React.createElement("i", {className: "fa fa-newspaper-o"}), "  ",  
            React.createElement("span", {style: {marginLeft:'4px'}}, "Followup Feed")
          ), 
          React.createElement("button", {type: "button", style: {display:'none'}, 
                  className: "sharp btn btn-default"}, 
            React.createElement("i", {className: "fa fa-code-fork"}), "  ",  
            React.createElement("span", {style: {marginLeft:'4px'}}, "Rules")
          ), 
          React.createElement("button", {type: "button", style: {display:'none'}, 
                  className: "sharp btn btn-default", onClick: this.toggleScreen}, 
            React.createElement("i", {className: "fa fa-pie-chart"}), "   Analytics"
          ), 
          React.createElement("button", {type: "button", className: "sharp btn btn-default", 
                  onClick: this.toggleScreen}, 
            React.createElement("i", {className: "fa fa-paper-plane"}), "   Sent Mail"
          ), 
          React.createElement("button", {type: "button", className: "sharp btn btn-default", 
                  onClick: this.toggleScreen}, 
            React.createElement("i", {className: "fa fa-wrench"}), "   Settings"
          )
        ), 

        React.createElement("div", {className: "", style: {width:'100%',textAlign:'center',marginTop:100}}, 
          React.createElement("a", {href: "javascript:", className: "btn btn-primary new-list-btn", 
                'data-toggle': "modal", 'data-target': ".bs-createCampaign-modal-sm", 
                style: { backgroundImage: 'linear-gradient(180deg, #0096ff 0%, #005dff 100%)'}}, 
            React.createElement("i", {className: "fa fa-plus-circle"}), "  New Campaign"
          )
        ), 
        React.createElement(CreateCampaignModal, {prospectLists: this.props.prospectLists, 
                             createCampaign: this.createCampaign})
      )
    );
  },

  createCampaign: function(newCampaign) {
    this.props.createCampaign(newCampaign)
  }
});

});

require.register("initialize", function(exports, require, module) {
//var UserDatasetTable = require("table");
var routes = require('routes');



document.addEventListener('DOMContentLoaded', function() {
  console.log("lol")
  ReactRouter.run(routes, ReactRouter.HashLocation, function(Root) {
    React.render(React.createElement(Root, null), document.body);
  });
}, false);

});

require.register("landing_page", function(exports, require, module) {
var LandingPage = React.createClass({displayName: 'LandingPage',
  home: function() {
    location.href="/#landing"
  },

  signUp: function() {
    data = {}
    $.ajax({
      url:location.origin+ "/signup",
      data: {},
      dataType:"json",
      success: function(res) {
        console.log(res)
        location.currentUser(res.token)
      },
      error: function(err) {
        console.log(err)
      }
    })
  },

  componentDidMount: function() {
    $('.form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });
  },

  render: function() {
    return (
      React.createElement("div", {style: {paddingTop:50}}, 

        React.createElement("h4", {style: {fontWeight:800,fontSize:22,cursor:"pointer"}, 
          onClick: this.home}, "SignalIQ"), 

        React.createElement("a", {href: "#pricing", className: "", style: {float:"right",marginTop:-32,marginRight:300,fontWeight:600,fontSize:12,color:"#0072f0"}}, "PRICING"), 

        React.createElement("a", {href: "#login", className: "btn btn-primary", style: {float:"right",marginTop:-40}}, "LOG IN"), 
        React.createElement("div", {className: "row", style: {marginTop:40}}, 
        React.createElement("div", {className: "col-md-6"}, 
          React.createElement("h1", null, "Leverage The Power Of Signal Based Selling"), 
          React.createElement("br", null), 
          React.createElement("hr", null), 
          React.createElement("h3", {style: {marginTop:10,fontWeight:100}}, "STOP WASTING TIME COLD CALLING "), 
          React.createElement("h3", {style: {marginTop:20,fontWeight:100}}, "START REACHING OUT AT ", React.createElement("span", {style: {fontStyle:"italic"}}, "THE RIGHT TIME")), 
          React.createElement("input", {type: "text", className: "form-control input-lg", style: {marginTop:30,width:300,borderRadius:2,fontSize:16}, placeholder: "EMAIL"}), 
          React.createElement("input", {type: "text", className: "form-control input-lg", style: {marginTop:10,width:300,borderRadius:2,fontSize:16}, placeholder: "PASSWORD", type: "password"}), 
          React.createElement("input", {type: "text", className: "form-control input-lg", style: {marginTop:10,width:300,borderRadius:2,fontSize:16}, placeholder: "CONFIRM PASSWORD", type: "password"}), 
          React.createElement("a", {className: "btn btn-lg btn-success", style: {marginTop:10,width:150,fontSize:16}}, "SIGN UP")
        ), 

        React.createElement("div", {className: "col-md-6"}, 
          React.createElement("img", {src: "images/signaliq.png", style: {height:450,float:"left",marginLeft:100,marginTop:20}})
        )
        )
      )
    )
  }
})


module.exports = LandingPage

});

;require.register("login", function(exports, require, module) {
var Login = React.createClass({displayName: 'Login',
  loginUser: function() {
    data = {}
    $.ajax({
      url:location.origin+ "/login",
      data: {},
      dataType:"json",
      // auth token: ""
      success: function(res) {
        console.log(res)
        location.currentUser(res.token)
        // location.href="/#/signals"
      },
      error: function(err) {
        console.log(err)
      }
    })
  },

  componentDidMount: function() {
    $('.login-form .form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });
  },

  render: function() {
    return (
      React.createElement("div", {style: {width:320,textAlign:"center",paddingTop:120}, className: "col-md-2 col-md-offset-4  login-form"}, 
          React.createElement("img", {src: "images/radar_2.png", style: {height:100}}), 
          React.createElement("br", null), 
        React.createElement("input", {type: "text", className: "form-control input-lg", style: {fontSize:16, marginRight:"auto",marginLeft:"auto",marginTop:30,width:300,borderRadius:2}, placeholder: "EMAIL"}), 
        React.createElement("input", {className: "form-control input-lg", style: {fontSize:16, marginTop:10,marginLeft:"auto",marginRight:"auto",width:300,borderRadius:2}, placeholder: "PASSWORD", type: "password"}), 
        React.createElement("br", null), 
        React.createElement("a", {className: "btn btn-lg btn-primary", 
          onClick: this.loginUser, 
          style: {marginTop:10,width:300, fontSize:16}}, "LOG IN")
      )
    )
  }
})

module.exports = Login

});

;require.register("navbar", function(exports, require, module) {
var Navbar = React.createClass({displayName: 'Navbar',
  gotoProfile: function() {
    location.href="#profile"
  },

  gotoHome: function() {
    location.href="#"
  },

  render: function() {
    return (
      React.createElement("header", {className: "header", style: {paddingTop:20,paddingBottom:40}}, 
        React.createElement("ul", {className: "text-muted", style: {paddingLeft:0}}, 
          React.createElement("li", {className: "app-logo", style: {marginLeft:0}, onClick: this.gotoHome}, 
            React.createElement("div", null, 
            React.createElement("img", {src: "images/blaze-logo.png", style: {marginTop:4,height:18,marginLeft:-15,display:"none"}}), 
            React.createElement("div", {style: {}, style: {color:"#000"}}, " SignalIQ")
            )
          ), 
          React.createElement("div", {style: {display:"block"}}, 
            React.createElement("span", {style: {display:"none"}}, 
            React.createElement("li", {style: {fontWeight:"bold",color:"#0079ff",color:"#000"}}, "DATASETS"), 
            React.createElement("li", null, "USERS"), 
            React.createElement("li", null, "EXPLORE"), 
            React.createElement("li", null, "COMPUTE")
            ), 
            React.createElement("li", {style: {float:"right",marginRight:0}, onClick: this.gotoProfile}, 
              React.createElement("img", {src: "images/user.png", style: {height:30,width:30,borderRadius:30}})
            )
          )
        )
      )
    )
  }
})

module.exports = Navbar

});

;require.register("onboarding_modal", function(exports, require, module) {
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


var OnboardingModal = React.createClass({displayName: 'OnboardingModal',
  getInitialState: function() {
   return {
      signal: "HiringProfile",
    }
  },
  handleSelect: function(key) {
    this.setState({key:key})
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
      React.createElement(Modal, {show: this.props.showModal, 
          dialogClassName: "create-signal-modal", 
          onHide: this.props.closeModal, bsSize: "lg", 'aria-labelledby': "contained-modal-title-lg"}, 
        React.createElement(Modal.Header, {closeButton: true}, 
          React.createElement(Modal.Title, {id: "contained-modal-title-lg"}, "Onboarding Modal")
        ), 
        React.createElement(Modal.Body, {modalClassName: "create-signal-modal-body", bsStyle: {width:700}}, 
          React.createElement("div", {className: "onboarding"}, 
          React.createElement(TabbedArea, {bsStyle: "pills", activeKey: this.state.key, defaultActiveKey: 1, onSelect: this.handleSelect, position: "left", stacked: true, style: {float:"left"}}, 
            React.createElement(TabPane, {tabClassName: "onboarding-tab", eventKey: 1, tab: "1. Choose Titles"}, React.createElement(ChooseTitles, null)), 
            React.createElement(TabPane, {tabClassName: "onboarding-tab", eventKey: 2, tab: "2. Choose Press Signals"}, React.createElement(CreatePressSubjectTrigger, null)), 
            React.createElement(TabPane, {tabClassName: "onboarding-tab", eventKey: 3, tab: "3. Choose Industries"}, React.createElement(CreatePressIndustryTrigger, null)), 
            React.createElement(TabPane, {tabClassName: "onboarding-tab", eventKey: 4, tab: "4. Choose Company Size"}, React.createElement(ChooseCompanySize, null))
          )

          ), 
          React.createElement("br", null), 
          React.createElement("br", null), 
          React.createElement("br", null), 
          React.createElement("br", null), 
          React.createElement("br", null)

        ), 
        React.createElement(Modal.Footer, null, 
          React.createElement(Button, {bsStyle: "primary", onClick: this.createSignal}, 
            "Create Trigger")
        )
      )
    )
  },
})

var ChooseTitles = React.createClass({displayName: 'ChooseTitles',
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
      React.createElement("div", {style: {width:600,float:"right",fontFamily:"proxima-nova",paddingRight:20}}, 
        React.createElement("h2", null, "Choose Titles"), 
        React.createElement("hr", null), 
        React.createElement("input", {className: "profile-title", placeholder: "Choose Titles"})
      )
    )
  }
})

var CreatePressSubjectTrigger = React.createClass({displayName: 'CreatePressSubjectTrigger',
  render: function() {
    subjects = _.map(Press.subjects, function(sub) {
      return (
        React.createElement("label", {style: {width:200,fontWeight:400}, className: "subject-item"}, 
          React.createElement("input", {type: "checkbox", className: "subject-check", 
            'data-id': sub.subject, value: sub.id}), " ", sub.subject
        )
      )
    })

    return (
      React.createElement("div", {style: {fontFamily:"proxima-nova",fontWeight:400,fontSize:12,
            width:600,float:"right"}}, 
        React.createElement("h2", null, " Choose Press Subjects"), 
        React.createElement("br", null), " ", React.createElement("form", {id: "press-form-subjects"}, 
          subjects
        )
      )
    )
  }
})

var CreatePressIndustryTrigger = React.createClass({displayName: 'CreatePressIndustryTrigger',
  render: function() {
    industries = _.map(Press.industries, function(ind) {
      return (
        React.createElement("label", {style: {width:200,fontWeight:400}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-id': ind.industry, value: ind.id}), " ", ind.industry
        )
      )
    })

    return (
      React.createElement("div", {style: {fontFamily:"proxima-nova",fontWeight:400,fontSize:12, width:600,float:"right"}}, 
        React.createElement("h2", null, " Choose Press Industries"), 
        React.createElement("form", {id: "press-form-industries"}, 
          industries
        )
      )
    )
  }
})

var ChooseCompanySize = React.createClass({displayName: 'ChooseCompanySize',
  render: function() {
    return (
      React.createElement("div", {style: {width:500,float:"right",fontFamily:"proxima-nova"}}, 
        React.createElement("h2", null, "Choose Company Size"), 
        React.createElement("br", null), 
        React.createElement("br", null), 
        React.createElement("label", {style: {width:200,fontWeight:400,fontFamily:"proxima-nova"}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-min': 1, 'data-max': 1, value: "1"}), 
            " ", 
            "1 employees"
        ), 
        React.createElement("label", {style: {width:200,fontWeight:400,fontFamily:"proxima-nova"}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-min': 2, 'data-max': 10, value: "2-10"}), 
            " ", 
            "2-10 employees"
        ), 
        React.createElement("label", {style: {width:200,fontWeight:400,fontFamily:"proxima-nova"}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-min': 11, 'data-max': 50, value: "11-50"}), 
            " ", 
            "11-50 employees"
        ), 
        React.createElement("label", {style: {width:200,fontWeight:400,fontFamily:"proxima-nova"}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-min': 51, 'data-max': 200, value: "51-200"}), 
            " ", 
            "51-200 employees"
        ), 
        React.createElement("label", {style: {width:200,fontWeight:400,fontFamily:"proxima-nova"}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-min': 201, 'data-max': 500, value: "201-500"}), 
            " ", 
            "201-500 employees"
        ), 
        React.createElement("label", {style: {width:200,fontWeight:400,fontFamily:"proxima-nova"}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-min': 501, 'data-max': 1000, value: "501-1000"}), 
            " ", 
            "501-1000 employees"
        ), 
        React.createElement("label", {style: {width:200,fontWeight:400,fontFamily:"proxima-nova"}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-min': 1001, 'data-max': 5000, value: "1001-5000"}), 
            " ", 
            "1001-5000 employees"
        ), 
        React.createElement("label", {style: {width:200,fontWeight:400,fontFamily:"proxima-nova"}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-min': 5001, 'data-max': 10000, value: "5001-10,000"}), 
            " ", 
            "5001-10,000 employees"
        ), 
        React.createElement("label", {style: {width:200,fontWeight:400,fontFamily:"proxima-nova"}, className: "industry-item"}, 
          React.createElement("input", {type: "checkbox", className: "industry-check", 
            'data-min': 10000, 'data-max': 10000000, value: "10000+"}), 
            " ", 
            "10,000+ employees"
        )
      )

    )
  }
})

module.exports = OnboardingModal

});

;require.register("press", function(exports, require, module) {
Press = {
  industries: [{"industry": "Food and Beverage ", "id": "3821eeab-9310-412c-840e-3937713e94a9"}, {"industry": "Lifestyle and Leisure ", "id": "f0dcfbde-f3d7-4f88-8055-e01a96c6a152"}, {"industry": "Financial Services ", "id": "23b21ce8-cbb4-461c-be8c-839b5fa9b86d"}, {"industry": "Automotive ", "id": "36a3c04b-8064-41c4-a6a1-4a891c18e2a5"}, {"industry": "Retail ", "id": "66b7ad94-5321-4eb0-8a03-a8b8849562e2"}, {"industry": "Government ", "id": "d417ed5d-b23e-427d-86fb-af2cf0875e41"}, {"industry": "Sports ", "id": "dec2b92e-62a4-4ab2-837b-70913aa80a74"}, {"industry": "Manufacturing and Production ", "id": "2967f430-cc1e-48e4-ab68-cd922a5ca71b"}, {"industry": "Travel and Hospitality ", "id": "7ba9c27d-8631-4266-9521-4f508b35bc8a"}, {"industry": "Education and Training ", "id": "34603206-0ce7-4bb2-a8d0-68d44afa2b14"}, {"industry": "Aerospace and Defense", "id": "ff49e676-3cd2-4155-8624-11c382250e2a"}, {"industry": "Pharmaceuticals and Biotech ", "id": "3d9ae55d-9579-4001-8303-554347eca656"}, {"industry": "Environment ", "id": "d02d50f3-203f-48b1-a5df-cba49ef374c4"}, {"industry": "Energy and Utilities ", "id": "e7d79e8e-bf6c-40a4-b6a7-c004b09c9137"}, {"industry": "Real Estate and Construction ", "id": "080c44e2-d1f1-4b40-b7ac-cb3119619d75"}, {"industry": "Advertising", "id": "0e144156-6ff4-4f9f-ab33-802363c8343a"}, {"industry": "Agriculture ", "id": "1f97d3b3-eb08-4f6e-a94e-de1e491aa7f4"}, {"industry": "Union and Labour ", "id": "5b6ba9bd-c29a-4a47-8405-170165a05438"}, {"industry": "Transportation and Logistics ", "id": "dbfc603b-bdee-4b45-bf0b-b384ab6adcde"}, {"industry": "Chemicals", "id": "424ae9f6-5474-4721-a8fc-00965c9eb986"}, {"industry": "Computers and Software ", "id": "647963c3-3178-4f76-a234-9d6cf62d3791"}, {"industry": "Telecom ", "id": "9440c1d1-d51f-4e88-8785-c7f3b0c0ffa7"}, {"industry": "Medical and Healthcare ", "id": "acda5f97-c061-4d90-8234-845ec6559ad2"}, {"industry": "Media and Entertainment ", "id": "b3594a8c-b599-48d2-9622-1e0054d06511"}, {"industry": "Professional Services ", "id": "ce8572d7-f291-4d63-8104-4169f691ac6c"}, {"industry": "Electronics and Semiconductors ", "id": "e55dda98-39d7-4e58-8ca2-07e267cca6f7"}],

  subjects: [{"id": "a12c0bc3-2dc2-4203-bcc6-257db9b62232", "subject": "Real Estate Transactions"}, {"id": "e289220c-97e0-4f0b-97a3-0dc8d87b7e29", "subject": "Revenue & Earnings"}, {"id": "6c764746-97d4-42a7-a78c-a012fb958829", "subject": "Litigations"}, {"id": "eeed90f5-5737-4830-b6b7-dda346622e21", "subject": "Mergers & Acquisitions"}, {"id": "1357c3e1-dcf2-4bc3-9cac-b73aa8235095", "subject": "Awards & Certifications"}, {"id": "03f3f24c-97db-4f90-89a9-51c1f1e30a02", "subject": "Personnel Changes"}, {"id": "70175346-06b6-4e50-8414-2ad3740fb87b", "subject": "New Offerings"}, {"id": "aa919a23-9f86-48fc-98b8-2008d9050376", "subject": "Funding & Development"}, {"id": "adb0e7b5-2a33-4d03-acaf-54a3565530b8", "subject": "Growth & Expansion"}, {"id": "9143b7ef-29bf-47b0-8f6e-6cac7186ed99", "subject": "Business Challenges"}, {"id": "7695f13c-0f79-498d-a4c7-5cc7e841c72f", "subject": "New Contracts"}]
}

module.exports = Press

});

;require.register("pricing", function(exports, require, module) {
var PricingPanel = require("pricing_panel")

var LandingPage = React.createClass({displayName: 'LandingPage',
  home: function() {
    location.href="/#landing"
  },

  render: function() {
    return (
      React.createElement("div", {style: {paddingTop:50}}, 

        React.createElement("h4", {style: {fontWeight:800,fontSize:22,cursor:"pointer"}, 
          onClick: this.home}, "TriggerIQ"), 

        React.createElement("a", {href: "#pricing", className: "", style: {float:"right",marginTop:-32,marginRight:300,fontWeight:600,fontSize:12,color:"#0072f0"}}, "PRICING"), 


        React.createElement("a", {href: "#signup", className: "btn btn-success", style: {float:"right",marginTop:-40,marginRight:80}}, "SIGN UP"), 
        React.createElement("a", {href: "#login", className: "btn btn-primary", style: {float:"right",marginTop:-40}}, "LOG IN"), 
        React.createElement(PricingPanel, null)
      )
    )
  }
})


module.exports = LandingPage

});

;require.register("pricing_panel", function(exports, require, module) {
var PricingPanel = React.createClass({displayName: 'PricingPanel',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "row", style: {marginTop:40}}, 
          React.createElement("div", {className: "col-md-4 col-sm-4 col-xs-4"}, 
            React.createElement("div", {className: "pricing-col"}, 
            React.createElement("br", null), 
            "Starter", 
            React.createElement("hr", null), 
            React.createElement("br", null), 
            React.createElement("h1", null, "$99 ", React.createElement("small", null, "/ month")), 
            React.createElement("br", null), 
            React.createElement("hr", null), 
              "Unlimited Prospect Profiles", 
            React.createElement("hr", null), 
              "Unlimited Company Profiles", 
            React.createElement("hr", null), 
            React.createElement("br", null), 
            React.createElement("br", null), 
            React.createElement("br", null), 
            React.createElement("br", null), 
            React.createElement("br", null)
            )
          ), 
          React.createElement("div", {className: "col-md-4 col-sm-4 col-xs-4"}, 
            React.createElement("div", {className: "pricing-col"}, 
            React.createElement("br", null), 
            "Professional", 
            React.createElement("hr", null), 
            React.createElement("br", null), 
            React.createElement("h1", null, "$499 ", React.createElement("small", null, "/ month")), 
            React.createElement("br", null), 
            React.createElement("hr", null), 
              "Unlimited Prospect Profiles", 
            React.createElement("hr", null), 
              "Unlimited Company Profiles", 
            React.createElement("hr", null), 
              "CRM Integration", 
            React.createElement("hr", null), 
              "Employee Search", 
            React.createElement("br", null), 
            React.createElement("br", null)
            )
          ), 
          React.createElement("div", {className: "col-md-4 col-sm-4 col-xs-4"}, 
            React.createElement("div", {className: "pricing-col"}, 
            React.createElement("br", null), 
            "Enterprise", 
            React.createElement("hr", null), 
            React.createElement("br", null), 
            React.createElement("h1", null, "$999 ", React.createElement("small", null, "/ month")), 
            React.createElement("br", null), 
            React.createElement("hr", null), 
              "Unlimited Prospect + Company Profiles", 
            React.createElement("hr", null), 
              "CRM Integration", 
            React.createElement("hr", null), 
              "Employee Search", 
            React.createElement("hr", null), 
              "Employee Contact Information", 
            React.createElement("br", null), 
            React.createElement("br", null)
          )
          )
        )
      )
    )
  }
})

module.exports = PricingPanel

});

;require.register("profile", function(exports, require, module) {
var Navbar = require("navbar")
var PricingPanel = require("pricing_panel")
var CurrentPlan = require("current_plan")

var Profile = React.createClass({displayName: 'Profile',
  componentDidMount: function() {
    $('.billing-information .form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });

    $('.account-info .form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Navbar, null), 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-6"}, 
            React.createElement(CurrentPlan, null)
          ), 
          React.createElement("div", {className: "col-md-6"}, 
            React.createElement("div", {className: "panel panel-default"}, 
              React.createElement("div", {className: "panel-body billing-information"}, 
                React.createElement("h3", null, "Billing Information"), 
                React.createElement("hr", null), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "First Name", style: {marginBottom:10,display:"inline-block",marginRight:15}}), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "Last Name", style: {marginBottom:10,display:"inline-block"}}), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "Company", style: {marginBottom:10}}), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "Address", style: {marginBottom:5}}), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "Postal Code", style: {marginBottom:10,display:"inline-block",marginRight:15}}), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "City", style: {marginBottom:10,display:"inline-block"}}), 
          React.createElement("br", null), 
          React.createElement("a", {href: "javascript:", style: {display:"block",textAlign:"center",fontSize:16}, 
              className: "btn btn-lg btn-primary"}, 
              "Update Billing Information"
          )
              )
            )
          ), 
          React.createElement("div", {className: "col-md-6"}, 
            React.createElement("div", {className: "panel panel-default"}, 
              React.createElement("div", {className: "panel-body"}, 
                React.createElement("h3", null, "Invoices"), 
                React.createElement("hr", null)
              )
            )
          ), 
          React.createElement("div", {className: "col-md-6"}, 
            React.createElement("div", {className: "panel panel-default"}, 
              React.createElement("div", {className: "panel-body account-info"}, 
                React.createElement("h3", null, "My Account"), 
                React.createElement("hr", null), 
                React.createElement("input", {type: "text", className: "form-control input-lg", placeholder: "Email", style: {marginBottom:10}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "New Password", type: "password", style: {marginBottom:10}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "Confirm Password", type: "password", style: {marginBottom:10}}), 
                React.createElement("a", {href: "javascript:", className: "btn btn-primary", style: {display:"block",fontSize:16}}, "Update Account")
              )
            )
          )
        )
      )
    )
  }
})

module.exports = Profile

});

;require.register("profile_sidebar", function(exports, require, module) {
var ProfileSidebar = React.createClass({displayName: 'ProfileSidebar',

  toggleCreateTriggerModal: function() {
    //console.log(this.props.profiles)
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
        React.createElement("div", null, 
          React.createElement(HiringProfileCard, {profile: profile})
        )
       )
    })

    return (
          React.createElement("div", {className: "col-md-2 col-sm-2 col-xs-2"}, 
            React.createElement("span", {style: {fontWeight:"800"}}, "TRIGGERS",  
              React.createElement("span", {style: {color:"#bbb",marginLeft:10,fontWeight:200}}, "(", this.props.profiles.length, ") ")
            ), 
            React.createElement("a", {href: "javascript:", 
               className: "btn btn-success btn-xs", 
               onClick: this.toggleCreateTriggerModal, 
               style: {float:"right"}}, 
              React.createElement("i", {className: "fa fa-plus"})), 
            React.createElement("hr", {style: {marginBottom:0}}), 
            profiles
          )
      
    )
  }
})

var HiringProfileCard = React.createClass({displayName: 'HiringProfileCard',
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
      return React.createElement("span", null)
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
      values = React.createElement("small", null, " ", React.createElement("i", {className: "fa fa-suitcase", style: {width:15}}), "  ", 
            this.props.profile.profiles[0].roles.join(", "))
      locales = React.createElement("small", null, 
            (this.props.profile.locales) ? React.createElement("span", null, React.createElement("i", {className: "fa fa-map-marker", style: {width:15}}), "  ") : "", 
            this.props.profile.profiles[0].locales.join(", "))
    } else if(this.props.profile.profiles[0].className == "PressSubjectProfile") {
      values = React.createElement("small", null, " ", React.createElement("i", {className: "fa fa-bullhorn", style: {width:15}}), "  ", 
            this.props.profile.profiles[0].values.join(", "))
    } else if(this.props.profile.profiles[0].className == "PressIndustryProfile") {
      values = React.createElement("small", null, " ", React.createElement("i", {className: "fa fa-industry", style: {width:15}}), "  ", 
            this.props.profile.profiles[0].values.join(", "))
    }
    console.log(this.props.profile)
    if(this.props.profile.titles) {
      _titles = React.createElement("small", null, 
          (this.props.profile.titles) ? React.createElement("i", {className: "fa fa-user", style: {width:15}}) : "", 
            titles)
    } else { 
      _titles = ""
    }

    return (
      React.createElement("div", {style: _style, onMouseOver: this.mouseOver, onMouseOut: this.mouseOut, 
          onClick: this.gotoProfile}, 
        React.createElement("h6", null, " ", this.props.profile.name, 
          React.createElement("small", {style: {float:"right",marginTop:2}}, 
            React.createElement("i", {className: "fa fa-building"}), 
              this.state.company_count), 
            " " + ' ' +
            " ", 
            React.createElement("small", {style: {float:"right",marginTop:2,marginRight:10}}, 
            React.createElement("i", {className: "fa fa-user"}), 
              this.state.employee_count)
        ), 
        React.createElement("h5", {style: {marginBottom:0,marginTop:5}}, 
          values
        ), 
        React.createElement("h5", {style: {marginBottom:0,marginTop:2}}, 
          locales
        ), 
        React.createElement("h5", {style: {marginBottom:0,marginTop:2}}, 
          _titles
        )
      )
    )
  }
})

var PressProfileCard = React.createClass({displayName: 'PressProfileCard',
  render: function() {
    return (
      React.createElement("div", {style: {cursor:"pointer"}}, 
        React.createElement("h5", null, " ", React.createElement("i", {className: "fa fa-bullhorn"}), " " + ' ' +
          "Press Trigger Name"), 
        React.createElement("h5", null, React.createElement("small", null, "Company Info blah blah"))
      )
    )
  }
})

var TwitterProfileCard = React.createClass({displayName: 'TwitterProfileCard',
  render: function() {
    return (
      React.createElement("div", {style: {cursor:"pointer"}}, 
        React.createElement("div", null, 
          React.createElement("h5", null, React.createElement("i", {className: "fa fa-twitter"}), "  " + ' ' +
            "Twitter Trigger Name"), 
          React.createElement("h5", null, React.createElement("small", null, 
              React.createElement("span", {style: {fontWeight:"bold"}}, "Keywords: "), 
                "blah blah"))
        )
      )
    )
  }
})

module.exports = ProfileSidebar

});

;require.register("profile_timeline", function(exports, require, module) {
var CreateTriggerModal = require("create_trigger_modal")
var ProfileSidebar = require("profile_sidebar")
var Navbar = require("navbar")

var TimelineCard = React.createClass({displayName: 'TimelineCard',
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
      React.createElement("div", {className: "", 
            onClick: this.toggleCompanyDetailOverlay}, 
              React.createElement("table", {style: {width:"100%"}}, 
                React.createElement("tbody", null, 
                  React.createElement("tr", null, 
                    React.createElement("td", null, 
                      React.createElement("h3", {className: "text-muted", style: {color:"#eee"}, 
                        style: {color:"#ccc",marginTop:20}}, React.createElement("i", {className: "fa fa-calendar-o"}))
                    ), 
                    React.createElement("td", {style: {width:"33%"}}, 
                      React.createElement("h5", {style: {fontSize:18,marginTop:20,marginLeft:20}}, 
                        moment.unix(this.props.day.timestamp).format("YYYY-MM-DD"), 
                        " ", 
                        React.createElement("small", null, 
                          "(", moment.unix(this.props.day.timestamp).fromNow(), ")"
                        )
                      )
                    ), 


                    React.createElement("td", {style: {width:"33%"}}, 
                      React.createElement("h3", null, " ", React.createElement("i", {className: "fa fa-building"}), " ", 
                        this.props.day.cos.length
                      ), 
                      React.createElement("a", {href: "javascript:", className: "btn btn-primary btn-xs", 
                         onClick: this.downloadCompanies, 
                         style: {float:"left",marginTop:-39,marginLeft:90,fontSize:10,padding:5,paddingLeft:15,paddingRight:15,paddingTop:7}}, 
                        React.createElement("i", {className: "fa fa-download"}), 
                        " " + ' ' +
                        "DOWNLOAD"
                      )
                    ), 
                    React.createElement("td", {style: {width:"33%"}}, 
                      React.createElement("h3", null, 
                        React.createElement("i", {className: "fa fa-user"}), " ", 
                        this.props.day.emps.length
                      ), 
                      React.createElement("a", {href: "javascript:", className: "btn btn-primary btn-xs", 
                          onClick: this.downloadEmployees, 
                          style: {float:"left",marginTop:-39,marginLeft:90,fontSize:10,padding:5,paddingLeft:15,paddingRight:15,paddingTop:7}}, 
                        React.createElement("i", {className: "fa fa-download"}), 
                        " " + ' ' +
                        "DOWNLOAD"
                      )
                    )

                  )
                )
              )
            )
    )
  }
})


var ProfileTimeline = React.createClass({displayName: 'ProfileTimeline',
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
      return React.createElement(TimelineCard, {day: day})
    })
    return (
      React.createElement("div", null, 
        React.createElement(Navbar, null), 
      React.createElement("div", {className: "container", style: {overflow:"hidden"}}, " ", React.createElement("br", null), 
        React.createElement("div", {className: "row"}, 
          React.createElement(ProfileSidebar, {
              profiles: this.state.profiles, 
              lol: "yoyo", 
              toggleCreateTriggerModal: this.toggleCreateTriggerModal}), 
          React.createElement("div", {className: "col-md-10", style: {paddingLeft:30}}, 
            React.createElement("div", {style: {display:"block",marginLeft:"auto",marginRight:100,
                         textAlign:"center",marginTop:8}}, 
              React.createElement("span", {style: {fontWeight:"800"}}, "TODAY "), 
              React.createElement("span", {style: {color:"#bbb"}}, moment().format("MMMM Do"))
            ), 

            React.createElement("a", {href: "javascript:", className: "btn btn-success", style: {float:"right",marginTop:-90,display:"none"}}, "Create Trigger"), 
            React.createElement("br", null), 
            timelines, 
            React.createElement("br", null)
          )
        )
      ), 
        React.createElement(CreateTriggerModal, {
            showModal: this.state.showCreateTriggerModal, 
            closeModal: this.toggleCreateTriggerModal})
      )
    )
  }
})

module.exports = ProfileTimeline

});

;require.register("range_slider", function(exports, require, module) {
//var Slider = require("bootstrap-slider");

var RangeSlider = React.createClass({displayName: 'RangeSlider',
  componentDidMount: function() {
    //$(".selector").slider({ from: 5, to: 50})
   $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
  },
  render: function() {
    return (
      React.createElement("div", null, 
        "The range slider", 
        React.createElement("input", {type: "text", id: "amount"}), 

        React.createElement("div", {id: "slider-range"})
 
      )
    )
  }
})

module.exports = RangeSlider

});

;require.register("routes", function(exports, require, module) {
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
var ProfileTimeline = require("profile_timeline")
var CurrentPlan = require("current_plan")
var OnboardingModal = require("onboarding_modal")

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

var About = React.createClass({displayName: 'About',
  render: function () {
    return React.createElement("h2", null, "About");
  }
});

var FreeTrial = React.createClass({displayName: 'FreeTrial',
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "col-md-offset-3 col-md-6"}, 
          React.createElement("br", null), 
          React.createElement("div", {style: {marginTop:30,fontSize:24,fontWeight:800,display:"block",textAlign:"center",color:"#4A90E2"}}, "SignalIQ"), 
          React.createElement("br", null), 
          React.createElement("div", {className: "", style: {display:"block",textAlign:"center",fontWeight:300,fontSize:17}}, 
            "Please complete the form to continue using SignalIQ"
          ), 
          React.createElement("br", null), 
          React.createElement("br", null), 
          React.createElement(CurrentPlan, null)
        )
      )
    )
  }
});

var Inbox = React.createClass({displayName: 'Inbox',
  render: function () {
    return React.createElement("h2", null, "Inbox");
  }
});

var NewDatasetPanel = React.createClass({displayName: 'NewDatasetPanel',
  render: function() {
    return (
      React.createElement("div", {className: "col-md-offset-2 col-md-8"}, 

        React.createElement("div", {className: "panel panel-default", style: {marginTop:20}}, 
            React.createElement("div", {className: "panel-body", 
                 style: {paddingLeft:50,paddingRight:50}}, 
              React.createElement("h2", {style: {fontWeight:800}}, "Step 1: Add Dataset"), 
              React.createElement("span", {style: {fontWeight:400}, className: "text-muted"}, 
                "Add dataset url with format hdfs://"
              ), 
              React.createElement("br", null), 
              React.createElement("div", null, 
              React.createElement("hr", null), 
              React.createElement("label", {htmlFor: "inputEmail3", className: "col-sm-2 control-label", 
                style: {textAlign:"left",paddingTop:3,fontSize:18,fontWeight:800,paddingLeft:0,width:40}}, 
                "URL"), 
              React.createElement("br", null), 
              React.createElement("br", null), 
              React.createElement("div", {className: "col-sm-10", style: {paddingLeft:0}}, 
                React.createElement("input", {type: "email", className: "form-control", id: "inputEmail3", placeholder: "hdfs:// or postgres:// or mongo:// or s3:// or http://", style: {width: "124%"}})
              ), 
              React.createElement("br", null), 
              React.createElement("br", null), 
              React.createElement("hr", null), 
              React.createElement("label", {htmlFor: "inputEmail3", className: "col-sm-2 control-label", 
                style: {textAlign:"left",paddingTop:3,fontSize:18,fontWeight:800,paddingLeft:0,width:40}}, 
                "DESCRIPTION"), 
              React.createElement("br", null), 
              React.createElement("br", null), 
              React.createElement("div", {className: ""}, 
                React.createElement("input", {type: "email", className: "form-control", id: "inputEmail3", placeholder: "hdfs:// or postgres:// or mongo:// or s3:// or http://", style: {width: "100%"}})
              ), 
              React.createElement("br", null), 
              React.createElement("hr", null), 

                React.createElement("div", {className: "radio"}, 
                    React.createElement("input", {type: "radio", name: "radio2", id: "radio3", value: "option1"}), 
                    React.createElement("label", {htmlFor: "radio3"}, 
                      React.createElement("i", {className: "fa fa-database"}), "  " + ' ' +
                      "Public ")
                ), 
                React.createElement("div", {className: "radio"}, 
                    React.createElement("input", {type: "radio", name: "radio2", id: "radio4", value: "option2"}), 
                    React.createElement("label", {htmlFor: "radio4"}, 
                      React.createElement("i", {className: "fa fa-lock"}), "  " + ' ' +
                      "Private ")
                )
              ), 
              React.createElement("br", null), 
              React.createElement("a", {href: "#", className: "btn btn-lg btn-primary center-item", 
                style: {width:200}}, 
                "CONTINUE"), 
              React.createElement("br", null)
            )
        )
      )
    )
  }
})

var App = React.createClass({displayName: 'App',
  getInitialState: function() {
    return {
      authenticated: !!localStorage.currentUser
    }
  },

  render: function() {
    if(this.state.authenticated) {
        location.href = "/#/signals"

    } else  {
      return (
        React.createElement("div", {className: "app"}, 
          React.createElement("div", {className: "home-page"}, " "), 
          React.createElement("div", {className: "container"}, 
            React.createElement(RouteHandler, null)
          )
        )
      )
    }
  }
});

var AuthenticatedApp = React.createClass({displayName: 'AuthenticatedApp',
  getInitialState: function() {
    if(!localStorage.currentUser)
        location.href = "/"

    return {
      authenticated: !localStorage.currentUser,
      freeTrialOver:"not loaded"
    }
  },

  componentWillMount: function() {

    var _this = this;
    $.ajax({
      url: location.origin+"/trial",
      dataType: "json",
      success: function(res) {
        console.log(res)
        _this.setState({freeTrialOver: res.days_left})
      },
      error: function(err) {

      }
    })

    $.ajax({
      url: location.origin+"/valid_token",
      data: "",
      success: function(res) {
        // days left
      },
      error: function(err) {

      }
    })
  },

  render: function() {
    if(this.state.authenticated) {
        location.href = "/"

    }  else if(!this.state.freeTrialOver) {
        location.href = "/#/free_trial"

    } else {
        return (
          React.createElement("div", {className: "app"}, 
            React.createElement("div", {className: "home-page"}, " "), 
            React.createElement("div", {className: "container"}, 
              React.createElement(RouteHandler, null)
            )
          )
        )
    }
  }
});

var DatasetDetail = React.createClass({displayName: 'DatasetDetail',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        React.createElement("div", {className: "section-title"}, "Test Dataset"), 
        React.createElement("ul", {className: "dataset-detail"}, 
          React.createElement("li", null, "Type"), 
          React.createElement("li", null, "Name"), 
          React.createElement("li", null, "Shape"), 
          React.createElement("li", null, "URL"), 
          React.createElement("li", null, "Date Added")
        ), 
        React.createElement("div", {style: {float:"right",marginTop:-55,fontWeight:800}}, 
          
          React.createElement("div", {style: {display:"inline-block",width:130}}, 
          React.createElement("a", {href: "javascript:", className: "btn btn-xs btn-default action-btn", 
              style: {borderRight:0,borderRadius: "3px 0px 0px 3px !important"}}, 
            React.createElement("i", {className: "fa fa-star"}), " STAR"  
          ), 
            React.createElement("span", {className: "action-badge", 
                  style: {}}, " 3.2M ")
          ), 
          React.createElement("div", {style: {display:"inline-block",width:130}}, 
            React.createElement("a", {href: "javascript:", className: "btn btn-xs btn-default action-btn", 
                style: {borderRight:0,borderRadius: "3px 0px 0px 3px !important"}}, 
            React.createElement("i", {className: "fa fa-code-fork"}), "  ANALYZE"
          ), 
          React.createElement("span", {className: "action-badge", 
            style: {}}, 
            "3.2M" 
          )
          )
        ), 
        React.createElement("hr", null), 
        React.createElement("span", null, 
          "Zillow is in the process of diversifying our data sources and integrating dozens of new data feeds." + ' ' + 
          "Ultimately, this wider diversity of data sources will lead to published data that is both more comprehensive and timely. But as this new data is incorporated, the publication of select metrics may be delayed or temporarily suspended as we work to ensure this new data meets our strict quality standards and fits into our existing datasets and databases. We look forward to resuming our usual publication schedule for all of our established datasets soon, and we apologize for any inconvenience. Thank you for your patience and understanding.", 
        React.createElement("br", null), 
        React.createElement("br", null)



        ), 

        React.createElement(TabbedArea, {defaultActiveKey: 1}, 
          React.createElement(TabPane, {eventKey: 1, tab: "EXPLORE"}, React.createElement(DataExplorer, null)), 
          React.createElement(TabPane, {eventKey: 2, tab: "DISCUSSION"}, "TabPane 2 content"), 
          React.createElement(TabPane, {eventKey: 3, tab: "ANALYSIS"}, "TabPane 3 content"), 
          React.createElement(TabPane, {eventKey: 4, tab: "COLLABORATORS"}, "TabPane 3 content"), 
          React.createElement(TabPane, {eventKey: 5, tab: "VISUALIZATIONS"}, "TabPane 3 content")
        )
      )
    )
  }
})

var DatasetDiscussion = React.createClass({displayName: 'DatasetDiscussion',
  render: function() {
    return (
      React.createElement("div", null, 
        "Discussion"
      )
    )
  }
})

var DatasetAnalysis = React.createClass({displayName: 'DatasetAnalysis',
  render: function() {
    return (
      React.createElement("div", null, 
        "Analysis"
      )
    )
  }
})

var DatasetCollaborators = React.createClass({displayName: 'DatasetCollaborators',
  render: function() {
    return (
      React.createElement("div", null, 
        "Collaborators"
      )
    )
  }
})

var DatasetVisualizations = React.createClass({displayName: 'DatasetVisualizations',
  render: function() {
    return (
      React.createElement("div", null, 
        "Visualizations"
      )
    )
  }
})

var Main = React.createClass({displayName: 'Main',
  getInitialState: function() {
    return {
      showCreateTriggerModal: false,
      profiles:[],
      triggers:[],
      triggerEmployees: {},
      detailMode: false,
      currentCompany: {},
      page:0,
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

  /*
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
    
    this.loadTriggers()
  },
  */

  loadTriggers: function() {
    var _this = this;
    if(this.props.params.profile_id)
      url = location.origin+"/"+this.props.params.profile_id+"/triggers/"+this.state.page
    else
      url = location.origin+"/triggers/"+this.state.page

    //this.setState({triggers: [] })

    $.ajax({
      url: url,
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({triggers: _this.state.triggers.concat(res)})
        _this.setState({page: _this.state.page+1})
        _this.setState({paginating: false})

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
    
    this.loadTriggers()

    var _this = this;
    $(window).scroll(function() {
       if($(window).scrollTop() + $(window).height() == $(document).height()) {
         //alert("bottom!");
        // TODO PAGINATE
        _this.setState({paginating: true})
        _this.loadTriggers()
       }
    });
  },

  gotoCalendarView: function() {
    location.href = "#/calendar/"+this.props.params.profile_id
  },

  addProfile: function(profile) {
    var _this = this;
    this.setState({profiles: [profile].concat(_this.state.profiles)})

    /*
    $.ajax({
      url:location.origin+"",
      dataType:"json",
      data: data,
      success: function(res) {
        console.log(res)
      },
      error: function(err) {
        console.log(err)
      }
    })
    */
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

        return React.createElement(CompanyCard, {trigger: trig, 
                      toggleCompanyDetailOverlay: _this.toggleCompanyDetailOverlay, 
                          company_info: company_info, 
                          employees: emps})
    })

    console.log("PARAM")
    profile = _.findWhere(this.state.profiles, {id: this.props.params.profile_id})

    console.log("_PROFILE")
    console.log(profile)
    return (
      React.createElement("div", null, 
          React.createElement(Navbar, null), 
      React.createElement("div", {className: "container", style: {overflow:"hidden"}}, " ", React.createElement("br", null), 
        React.createElement("div", {className: "row"}, 
          React.createElement(ProfileSidebar, {
              profiles: this.state.profiles, 
              lol: "yoyo", 
              toggleCreateTriggerModal: this.toggleCreateTriggerModal}), 
          React.createElement("div", {className: "col-md-10 col-sm-2 col-xs-2", style: {paddingLeft:30}}, 
            React.createElement("h4", {style: {marginLeft:"auto",marginRight:"auto",marginTop:-5,display:"block",textAlign:"center",marginBottom:10}}, 
              React.createElement("i", {className: "fa fa-wifi", style: {marginRight:4}}), 
              (profile) ? profile.name : "All Signals"
            ), 

            React.createElement("div", {style: {display:"block",marginLeft:"auto",marginRight:100,
                         textAlign:"",marginTop:-30,float:"left"}}, 
              React.createElement("span", {style: {fontWeight:"800"}}, "TODAY "), 
              React.createElement("span", {style: {color:"#bbb"}}, moment().format("MMMM Do"))
            ), 
            (this.props.params.profile_id) ? 
            React.createElement("a", {href: "javascript:", className: "btn btn-default btn-xs", style: {float:"right",marginTop:-30}, onClick: this.gotoCalendarView}, 
              "Calendar View") : "", 
            

            React.createElement("a", {href: "javascript:", className: "btn btn-success", style: {float:"right",marginTop:-90,display:"none"}}, "Create Trigger"), 
            React.createElement("br", null), 

            CompanyCards, 

            React.createElement("br", null), 
            (CompanyCards.length && this.state.paginating) ? React.createElement("div", {style: {textAlign:"center"}}, React.createElement("a", {href: "javascript:", className: "btn btn-primary btn-sm"}, "LOADING")) : "", 
            React.createElement("br", null)
          )
        )
      ), 

        React.createElement(CreateTriggerModal, {
            showModal: this.state.showCreateTriggerModal, 
            addProfile: this.addProfile, 
            closeModal: this.toggleCreateTriggerModal}), 
        React.createElement(OnboardingModal, {
            showModal: this.state.showCreateTriggerModal, 
            closeModal: this.toggleCreateTriggerModal}), 
        (this.state.detailMode) ?
          React.createElement(CompanyDetailOverlay, {
              toggleCompanyDetailOverlay: this.toggleCompanyDetailOverlay, 
              company: this.state.currentCompany}) : ""
      )
    )
  }
})

// declare our routes and their hierarchy
var routes = (
  React.createElement(Route, null, 
    React.createElement(Route, {handler: App}, 
      React.createElement(Route, {path: "", handler: LandingPage}), 
      React.createElement(Route, {path: "login", handler: Login}), 
      React.createElement(Route, {path: "signup", handler: Signup})
    ), 

    React.createElement(Route, {handler: AuthenticatedApp}, 
      React.createElement(Route, {path: "signals", handler: Main}), 
      React.createElement(Route, {path: "dashboard", handler: Dashboard}), 
      React.createElement(Route, {path: "pricing", handler: Pricing}), 
      React.createElement(Route, {path: "profile", handler: Profile}), 
      React.createElement(Route, {path: "signal/:profile_id", handler: Main}), 
      React.createElement(Route, {path: "calendar/:profile_id", handler: ProfileTimeline}), 
      React.createElement(Route, {path: "free_trial", handler: FreeTrial})
    )
  )
);

module.exports = routes;

});

require.register("search_bar", function(exports, require, module) {
//var TagsInput = require('react-tagsinput');
//var TagsInput = require('react-tageditor');
          //<TagsInput ref='tags' />

var SearchBar = React.createClass({displayName: 'SearchBar',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", null, 
          React.createElement(TagEditor, {tags: [], delimiters: [",",13], placeholder: "Enter search..."})
        )
      )
    )
  }
})

module.exports = SearchBar

});

;require.register("signup", function(exports, require, module) {
var Signup = React.createClass({displayName: 'Signup',
  signupUser: function() {
    data = {}
    $.ajax({
      url:location.origin+ "/login",
      data: {},
      dataType:"json",
      // auth token: ""
      success: function(res) {
        console.log(res)
        location.currentUser(res.token)
        // location.href="/#/signals"
      },
      error: function(err) {
        console.log(err)
      }
    })
  },
  
  componentDidMount: function() {
    $('.signup-form .form-control').floatlabel({
      labelClass:"floatingLabel",
      labelEndTop :"5px"
    });
  },

  render: function() {
    return (
      React.createElement("div", {style: {width:320,textAlign:"center",paddingTop:120}, className: "signup-form col-md-2 col-md-offset-4 "}, 

          React.createElement("img", {src: "images/radar_2.png", style: {height:100}}), 
          React.createElement("br", null), 
        React.createElement("input", {type: "text", 'data-label': "EMAIL", className: "form-control input-lg", style: {fontSize:16, marginRight:"auto",marginLeft:"auto",marginTop:30,width:300,borderRadius:2}, placeholder: "EMAIL"}), 
        React.createElement("input", {className: "form-control input-lg", style: {fontSize:16, marginTop:10,marginLeft:"auto",marginRight:"auto",width:300,borderRadius:2}, placeholder: "PASSWORD", type: "password"}), 
        React.createElement("input", {className: "form-control input-lg", style: {fontSize:16, marginTop:10,marginLeft:"auto",marginRight:"auto",width:300,borderRadius:2}, placeholder: "CONFIRM PASSWORD", type: "password"}), 
        React.createElement("br", null), 
        React.createElement("a", {className: "btn btn-lg btn-success", 
          onClick: this.signupUser, 
          style: {marginTop:10,width:300, fontSize:16}}, "SIGN UP")

      )
    )
  }
})

module.exports = Signup

});

;require.register("table", function(exports, require, module) {
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var DatePair = require("date_pair")
var SearchBar = require("search_bar")
var RangeSlider = require("range_slider")
var CheckboxGroup = require("checkbox_group")
//var TagsInput = require("react-tagsinput")

var BlazeColumn = React.createClass({displayName: 'BlazeColumn',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        "Columns", 
        React.createElement("br", null), 
        React.createElement("h6", null, "Date Pair"), 
          React.createElement(DatePair, null), 
        React.createElement("h6", null, "Search (tags)"), 
          React.createElement(SearchBar, null), 
        React.createElement("h6", null, "Range Slider"), 
          React.createElement(RangeSlider, null), 
        React.createElement("h6", null, "Checkbox Group"), 
          React.createElement(CheckboxGroup, null)
      )
    )
  }
})

var BlazeTable = React.createClass({displayName: 'BlazeTable',
  getInitialState: function() {
    return {
      rows: [
        ['a1', 'b1', 'c1'],
        ['a2', 'b3', 'c2'],
        ['a3', 'b3', 'c3'],
      ]
    }
  },
  rowGetter: function (rowIndex) {
    return this.state.rows[rowIndex];
  },
  render: function() {
    var rowGetter = this.rowGetter
    // TODO 
    // get column names
    // get default data
    return( 
      React.createElement("div", {style: {marginLeft:30}}, 
        React.createElement("br", null), 
        React.createElement(Table, {
          rowHeight: 50, 
          rowGetter: rowGetter, 
          rowsCount: this.state.rows.length, 
          width: 500, 
          height: 200, 
          headerHeight: 50}, 
          React.createElement(Column, {
            label: "Col 1", 
            width: 300, 
            dataKey: 0}
          ), 
          React.createElement(Column, {
            label: "Col 2", 
            width: 200, 
            dataKey: 1}
          )
        )
      )
    )
  }
})

var DataExplorer = React.createClass({displayName: 'DataExplorer',
  render: function() {
    return (
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-md-2", style: {paddingRight:0}}, React.createElement(BlazeColumn, null), " "), 
        React.createElement("div", {className: "col-md-10"}, React.createElement(BlazeTable, null), " ")
      )
    )
  }
})

module.exports = DataExplorer

});

;require.register("trigger_list", function(exports, require, module) {
var CompanyCard = require("company_card")

var TriggerList = React.createClass({displayName: 'TriggerList',
  render: function() {
    return (

          React.createElement("div", {className: "col-md-10", style: {paddingLeft:30}}, 
            React.createElement("div", {style: {display:"block",marginLeft:"auto",marginRight:100,textAlign:"center",marginTop:8}}, 
              React.createElement("span", {style: {fontWeight:"800"}}, "TODAY "), 
              React.createElement("span", {style: {color:"#bbb"}}, "August 28th")
            ), 
            React.createElement("a", {href: "javascript:", className: "btn btn-success", style: {float:"right",marginTop:-90,display:"none"}}, "Create Trigger"), 
            React.createElement("a", {href: "javascript:", className: "btn btn-default btn-xs", style: {float:"right",marginTop:-25}}, "List View"), 
            React.createElement("br", null), 
            React.createElement(CompanyCard, null), 
            React.createElement(CompanyCard, null), 
            React.createElement(CompanyCard, null)
          )

    )
  }
})

module.exports = TriggerList

});

;require.register("user_dataset_table", function(exports, require, module) {
var UserDatasetTable = React.createClass({displayName: 'UserDatasetTable',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        React.createElement("br", null), 
        React.createElement("div", {className: "section-title"}, "Datasets"), 
        React.createElement("br", null), 
        React.createElement("a", {href: "#/new_dataset", className: "btn btn-success btn-lg", 
          style: {float:"right",marginTop:-65}}, 
          "Add Dataset"
        ), 
        React.createElement("table", {className: "table table-hover dataset-table"}, 
          React.createElement("thead", null, 
            React.createElement("tr", {className: "header-row"}, 
              React.createElement("th", null), 
              React.createElement("th", null, "Type "), 
              React.createElement("th", null, "Name "), 
              React.createElement("th", null, "Shape "), 
              React.createElement("th", null, "URL "), 
              React.createElement("th", null, "Date Added "), 
              React.createElement("th", null, "Collaborators ")
            )
          ), 
          React.createElement("tbody", null, 
            React.createElement("tr", null, 
              React.createElement("td", {style: {textAlign:"center"}}, 
                  React.createElement("div", {style: {display:"inline-block",
                               backgroundColor:"#15CD72",
                              height:10,width:10,borderRadius:5}})), 
              React.createElement("td", null, "Type "), 
              React.createElement("td", null, "Name "), 
              React.createElement("td", null, "Shape "), 
              React.createElement("td", null, "URL "), 
              React.createElement("td", null, "Date Added "), 
              React.createElement("td", null, "Collaborators ")
            ), 
            React.createElement("tr", null, 
              React.createElement("td", {style: {textAlign:"center"}}, 
                  React.createElement("div", {style: {display:"inline-block",
                               backgroundColor:"#15CD72",
                              height:10,width:10,borderRadius:5}})), 
              React.createElement("td", null, "Type "), 
              React.createElement("td", null, "Name "), 
              React.createElement("td", null, "Shape "), 
              React.createElement("td", null, "URL "), 
              React.createElement("td", null, "Date Added "), 
              React.createElement("td", null, "Collaborators ")
            )
          )
          
        )
      )
    )
  }
});

module.exports = UserDatasetTable;

});

require.register("websocket_listener", function(exports, require, module) {
var _SockJS = {
  start: function() {
    console.log("start")
  }
}

    var sockJS = new SockJS("http://127.0.0.1:8988/sockjs"),
                        userId = 0,
                        users = {};

var WebsocketListener = React.createClass({displayName: 'WebsocketListener',
  componentDidMount: function() {
    //SockJS.start()
    var sockJS = new SockJS("http://127.0.0.1:8988/sockjs"),
                        userId = 0,
                        users = {};

    sockJS.onopen = function() {
        console.log("connected")
    }

    sockJS.onmessage = function(event) {
      event.data = JSON.parse(event.data);
      console.log(event)
      var msg = event.data.msg,
          user = event.data.user,
          el;
    }

    sockJS.onclose = function() {
      console.log("on close")
    };
  },

  render: function() {
    return (
      React.createElement("div", {className: "alert alert-info", 
           style: {textAlign:"center",marginTop:20,cursor:"pointer"}}, 
        React.createElement("strong", null, "36 new prospects found"), "   " + ' ' +
            "Click this here to load!"
      )
    )
  }
})

module.exports = WebsocketListener

});

;
//# sourceMappingURL=app.js.map