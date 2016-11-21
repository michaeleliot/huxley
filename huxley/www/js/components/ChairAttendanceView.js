/**
* Copyright (c) 2011-2015 Berkeley Model United Nations. All rights reserved.
* Use of this source code is governed by a BSD License (see LICENSE).
+*/

'use strict';

var React = require('react');
var ReactRouter = require('react-router');

var Button = require('components/Button');
var ConferenceContext = require('components/ConferenceContext');
var CurrentUserStore = require('stores/CurrentUserStore');
var DelegateStore = require('stores/DelegateStore');
var InnerView = require('components/InnerView');
var User = require('utils/User');

var ChairAttendanceView = React.createClass({
  mixins: [
    ReactRouter.History,
  ],

  getInitialState: function() {
    var user = CurrentUserStore.getCurrentUser();
    console.log(user);
    var delegates = DelegateStore.getCommitteeDelegates(user.committee)
    return {
      assigments: {},
      delegates: delegates,
    };
  },

  componentWillMount: function() {
    var user = CurrentUserStore.getCurrentUser();
    if (!User.isChair(user)) {
      this.history.pushState(null, '/');
    }
  },

  componentDidMount: function() {
    this._delegatesToken = DelegateStore.addListener(() => {
      var committeeID =  CurrentUserStore.getCurrentUser().committee.id;
      var delegates = DelegateStore.getCommitteeDelegates(committeeID);
      this.setState({delegates: delegates});
    });

    /*for (delegate of delegates) {
      var assignments = this.state.assignments;
      var country = delegate.assignment.country.id;
      if (country in assigments) {
        var delegates = assignments[country];
        delegates.push(delegate);
      } else {
        assignments[country] = [delegate];
      }
      this.setState({
        assignments: assignments
      });
    }*/
    
  },

  componentWillUnmount: function() {
    this._delegatesToken.remove();
  },

  render: function() {
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
                  <th>Session One</th>
                  <th>Session Two</th>
                  <th>Session Three</th>
                </tr>
              </thead>
              <tbody>
                {this.renderAttendanceRows()}
              </tbody>
            </table>
          </div>
          <Button
            color="green">
            Confirm Attendance
          </Button>
        </form>
      </InnerView>
    );
  },

  renderAttendanceRows: function() {
    var delegates = this.state.delegates;
    console.log(delegates);
    return delegates.map(delegate => {
      return (
        <tr>
          <td>
            {delegate.name}
          </td>
          <td>
            <label name="session">
              <input
                className="choice"
                type="checkbox"
                name="Friday Attendance"
                // onChange={_handleAttendanceChange.bind(this, delegates, country, 1)}
              />
            </label>
          </td>
          <td>
            <label name="session">
              <input
                className="choice"
                type="checkbox"
                name="Saturday Morning Attendance"
              />
            </label>
          </td>
          <td>
            <label name="session">
              <input
                className="choice"
                type="checkbox"
                name="Saturday Afternoon Attendance"
              />
            </label>
          </td>
          <td>
            <label name="session">
              <input
                className="choice"
                type="checkbox"
                name="Sunday Attendance"
              />
            </label>
          </td>
        </tr>
      );
    });
  },

  _handleAttendanceChange: function(delegates, session, country, event) {
    var assigmnents = this.state.assignments;
    for (var delegate in delegates) {
      delegate[session] = event.target.value;
    }
    assignments[country] = delegates;
    this.setState({
      assignments: assignments
    });
  }, 

  _handleSaveAttendance: function(event) {
    for (var country in this.state.assignments) {
      for (var delegate in this.state.assignments[country]) {
        DelegateStore.updateDelegate(delegate.id, {
          sessionOneAttendance: delegate.sessionOneAttendance,
          sessionTwoAttendance: delegate.sessionTwoAttendance,
          sessionThreeAttendance: delegate.sessionThreeAttendance});
      }
    }
    event.preventDefault();
  },

});
    
module.exports = ChairAttendanceView;
