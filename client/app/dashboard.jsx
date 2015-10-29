var BarChart = rd3.BarChart;
var LineChart = rd3.LineChart;
var PieChart = rd3.PieChart;
var AreaChart = rd3.AreaChart;
var Treemap = rd3.Treemap;
var ScatterChart = rd3.ScatterChart;
var CandleStickChart = rd3.CandleStickChart;

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      profile_value_counts: [],
      rq_job_counts: ["~","~","~",],
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
      console.log(data)
      _this.setState({ "profile_value_counts" : data, "profile_last_updated": moment().unix()})
    });
    channel.bind('rq_job_counts', function(data) {
      console.log(data)
      _this.setState({ "rq_job_counts" : data, "rq_last_updated": moment().unix()})
    });
    channel.bind('average_counts', function(data) {
      _this.setState({"average_counts" : data.message})
    });
    channel.bind('last_updated', function(data) {
      _this.setState({"last_updated" : data.message})
    });
  },

  render: function () {
    var _this = this;
    return (
    <div className="container" >
      <h2>Dashboard</h2>
      <hr/>
      <h4>Number of Triggers Per Profile <small>Last Updated: {moment.unix(this.state.profile_last_updated).fromNow()}</small></h4>
      <div className="panel panel-default">
      <table className="table table-striped">
        <tbody>
        {_.map(_.keys(this.state.profile_value_counts), function(prof) { 
          return (<tr>
              <td>{prof}</td>
              <td>{_this.state.profile_value_counts[prof]}</td>
          </tr> )
        }) 
        }
        </tbody>
      </table>
      </div>
      <br/>

      <div className="row">
          <div className="col-md-6">
              <h4>Number of Triggers Per Profile</h4>
              <div className="panel panel-default">
              <table className="table table-striped">
                <tr>
                  <td>Number of Triggers / per minute</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Value Count per Stage</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Average Time Spent On Company Name To Domain</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Average Time Spent On Company Employee</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Average Time Spent On Email Pattern</td>
                  <td>0</td>
                </tr>
              </table>
              </div>
          </div>
          <div className="col-md-6">
              <h4>RQ Stats</h4>
              <div className="panel panel-default">
              <table className="table table-striped">
                <tr>
                  <td>Number of Jobs</td>
                  <td>
                    <span className="label label-info"> 
                      {this.state.rq_job_counts[0]}
                    </span> &nbsp;
                    <span className="label label-primary">
                      {this.state.rq_job_counts[1]} 
                    </span> &nbsp;
                    <span className="label label-success">
                      {this.state.rq_job_counts[2]}
                    </span>&nbsp;
                  </td>
                </tr>
                <tr>
                  <td>High Jobs Per Minute</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Average Time Spent On Company Name To Domain</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Average Time Spent On Company Employee</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Average Time Spent On Email Pattern</td>
                  <td>0</td>
                </tr>
              </table>
              </div>
          </div>
      </div>
      <div className="row">
          <div className="col-md-3">
            <h4>Company Name To Domain</h4>
            <div className="panel panel-default">
            <table className="table table-striped">
              <tr>
                <td>Number of Triggers / per minute</td>
                <td>0</td>
              </tr>
            </table>
            </div>
          </div>
          <div className="col-md-3">
            <h4>Secondary</h4>
            <div className="panel panel-default">
            <table className="table table-striped">
              <tr>
                <td>Number of Triggers / per minute</td>
                <td>0</td>
              </tr>
            </table>
            </div>
          </div>

          <div className="col-md-3">
            <h4>Third</h4>
            <div className="panel panel-default">
            <table className="table table-striped">
              <tr>
                <td>Number of Triggers / per minute</td>
                <td>0</td>
              </tr>
            </table>
            </div>
          </div>

          <div className="col-md-3">
            <h4>Company Name To Domain</h4>
            <div className="panel panel-default">
            <table className="table table-striped">
              <tr>
                <td>Number of Triggers / per minute</td>
                <td>0</td>
              </tr>
            </table>
            </div>
          </div>

      </div>
    </div>)
  }
});

module.exports = Dashboard
