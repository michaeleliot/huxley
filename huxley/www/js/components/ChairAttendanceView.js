/**
* Copyright (c) 2011-2015 Berkeley Model United Nations. All rights reserved.
* Use of this source code is governed by a BSD License (see LICENSE).
+*/

'use strict';

var React = require('react');
var ReactRouter = require('react-router');

var Button = require('components/Button');
var AssignmentStore = require('stores/AssignmentStore');
var ConferenceContext = require('components/ConferenceContext');
var CurrentUserStore = require('stores/CurrentUserStore');
var DelegateActions = require('actions/DelegateActions');
var DelegateStore = require('stores/DelegateStore');
var InnerView = require('components/InnerView');
var User = require('utils/User');

var ChairAttendanceView = React.createClass({
  mixins: [
    ReactRouter.History,
  ],

  getInitialState() {
    var user = CurrentUserStore.getCurrentUser();
    var delegates = DelegateStore.getCommitteeDelegates(user.committee);
    var country_assignments = {};
    var assignments = [];

    AssignmentStore.getCommitteeAssignments(user.committee, function(assignments) {
        for (var delegate of delegates) {
          var assignment = assignments.find(assignment => assignment.id == delegate.assignment)
          var countryID = assignment.country;
          if (countryID in country_assignments) {
            country_assignments[countryID].push(delegate)
          } else {
            country_assignments[countryID] = [delegate]
          }
        }
        this.setState({
          country_assignments: country_assignments,
          assignments: assignments,
        });
      }.bind(this));

    // for (var delegate of delegates) {
    //   var assignment = assignments.find(assignment => assignment.id == user.assignment)
    //   var countryID = assignment.country;
    //   if (countryID in country_assignments) {
    //     country_assignments[countryID].push(delegate)
    //   } else {
    //     country_assignments[countryID] = [delegate]
    //   }
    // }

    return {
      country_assignments: {},
      delegates: delegates,
      assignments: assignments
    };
  },

  componentWillMount() {
    var user = CurrentUserStore.getCurrentUser();
    if (!User.isChair(user)) {
      this.history.pushState(null, '/');
    }
  },

  componentDidMount() {
    this._delegatesToken = DelegateStore.addListener(() => {
      var user = CurrentUserStore.getCurrentUser();
      var delegates = DelegateStore.getCommitteeDelegates(user.committee);
      var country_assignments = this.state.country_assignments;
     
      var assignments = AssignmentStore.getCommitteeAssignments(user.committee, function(assignments) {
        for (var delegate of delegates) {
          var assignment = assignments.find(assignment => assignment.id == delegate.assignment)
          var countryID = assignment.country;
          if (countryID in country_assignments) {
            country_assignments[countryID].push(delegate)
          } else {
            country_assignments[countryID] = [delegate]
          }
        }
        this.setState({country_assignments: country_assignments});
      }.bind(this));
    });
  },

  componentWillUnmount() {
    this._delegatesToken.remove();
  },

  render() {
    return (
      <InnerView>
        <h2>Attendance</h2>
        <p>
          Here you can take attendance for delegates. Note that confirming 
          attendance will alert the advisor as to if there delegates have 
          shown up to committee.
        </p>
          <form>
          <div className="table-container">
            <table className="table highlight-cells">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Friday</th>
                  <th>Saturday Morning</th>
                  <th>Saturday Afternoon</th>
                  <th>Sunday</th>
                </tr>
              </thead>
              <tbody>
                {this.renderAttendanceRows()}
              </tbody>
            </table>
          </div>
          <Button
            color="green"
            onClick={this._handleSaveAttendance}>
            Confirm Attendance
          </Button>
        </form>
      </InnerView>
    );
  },

  renderAttendanceRows() {
    var countries = Object.keys(this.state.country_assignments);
    return countries.map(country => {
      return (
        <tr>
          <td>
            {country}
          </td>
          <td>
            <label name="session">
              <input
                className="choice"
                type="checkbox"
                name="Friday Attendance"
                checked={this.state.country_assignments[country][0].friday_attendance}
                onChange={this._handleAttendanceChange.bind(this, "friday_attendance", country)}
              />
            </label>
          </td>
          <td>
            <label name="session">
              <input
                className="choice"
                type="checkbox"
                name="Saturday Morning Attendance"
                checked={this.state.country_assignments[country][0].saturday_morning_attendance}
                onChange={this._handleAttendanceChange.bind(this, "saturday_morning_attendance", country)}
              />
            </label>
          </td>
          <td>
            <label name="session">
              <input
                className="choice"
                type="checkbox"
                name="Saturday Afternoon Attendance"
                checked={this.state.country_assignments[country][0].saturday_afternoon_attendance}
                onChange={this._handleAttendanceChange.bind(this, "saturday_afternoon_attendance", country)}
              />
            </label>
          </td>
          <td>
            <label name="session">
              <input
                className="choice"
                type="checkbox"
                name="Sunday Attendance"
                checked={this.state.country_assignments[country][0].sunday_attendance}
                onChange={this._handleAttendanceChange.bind(this, "sunday_attendance", country)}
              />
            </label>
          </td>
        </tr>
      );
    });
  },

  _handleAttendanceChange(session, country, event) {
    var country_assignments = this.state.country_assignments;
    var delegates = country_assignments[country];
    for (var delegate of delegates) {
      delegate[session] = !delegate[session];
    }
    country_assignments[country] = delegates;
    this.setState({
      country_assignments: country_assignments
    });
  }, 

  _handleSaveAttendance(event) {
    this.setState({loading: true});
    var committee = CurrentUserStore.getCurrentUser().committee;
    var country_assignments = this.state.country_assignments;
    var delegates = [];
    for (var country in country_assignments) {
      var country_delegates = country_assignments[country];
      delegates = delegates.concat(country_assignments[country]);
    }
    DelegateActions.updateCommitteeDelegates(committee, delegates);
    this.setState({loading: false});
  },

});
    
module.exports = ChairAttendanceView;
