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
        <tr>
          <td>{metric}</td>
          <td>{m.mean}</td>
          <td>{m.median}</td>
          <td>{m.min}</td>
          <td>{m.max}</td>
          <td>{m.per_second}</td>
        </tr>
      )
    })
    raw_metric_rows = _.map(metrics, function(metric) {
      m = (_this.state[metric]) ? _this.state[metric] : {}
      //console.log(m.raw)
      return (
          <div className="col-md-3">
            <h4>{metric.split("function:time")[1]}</h4>
            <div className="panel panel-default">
            <table className="table table-striped">
              {_.map(m.raw, function(stat) {
                return (
                  <tr>
                    <td>{moment.unix(stat.b).fromNow()}</td>
                    <td>{(stat.a/1000000).toFixed(3)}</td>
                  </tr>
                )
                })
              }
            </table>
            </div>
          </div>
      )
    })
    return (
    <div className="container" >
      <h2>Dashboard</h2>
      <hr/>
      <div className="row">
        <div className="col-md-6">
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
                  <td>Total Counts</td>
                  <td>
                    <span className="label label-info"> 
                      {this.state.total_counts[0]}
                    </span> &nbsp;
                    <span className="label label-primary">
                      {this.state.total_counts[1]} 
                    </span> &nbsp;
                    <span className="label label-primary">
                      {this.state.total_counts[2]} 
                    </span> &nbsp;
                    <span className="label label-primary">
                      {this.state.total_counts[3]} 
                    </span> &nbsp;
                    <span className="label label-success">
                      {this.state.total_counts[4]}
                    </span>&nbsp;
                  </td>
                </tr>
                <tr>
                  <td>Percentage Counts</td>
                  <td>
                    <span className="label label-info"> 
                      {parseFloat(this.state.percentage_counts[0]).toFixed(2)}
                    </span> &nbsp;
                    <span className="label label-primary">
                      {parseFloat(this.state.percentage_counts[1]).toFixed(2)} 
                    </span> &nbsp;
                    <span className="label label-primary">
                      {parseFloat(this.state.percentage_counts[2]).toFixed(2)} 
                    </span> &nbsp;
                    <span className="label label-primary">
                      {parseFloat(this.state.percentage_counts[3]).toFixed(2)} 
                    </span> &nbsp;
                    <span className="label label-success">
                      {parseFloat(this.state.percentage_counts[4]).toFixed(2)}
                    </span>&nbsp;
                  </td>
                </tr>
              </table>
              </div>
          </div>
      </div>
      <br/>
      <div className="row">
          <div className="col-md-12">
              <h4>Number of Triggers Per Profile</h4>
              <div className="panel panel-default">
              <table className="table table-striped">
                <thead>
                  <th>Function / Job</th>
                  <th>Mean</th>
                  <th>Median</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Per Second</th>
                </thead>
                {metric_rows}
              </table>
              </div>
          </div>
      </div>
      <div className="row">
      </div>
      <div className="row">
        {raw_metric_rows}

      </div>
    </div>)
  }
});

module.exports = Dashboard
