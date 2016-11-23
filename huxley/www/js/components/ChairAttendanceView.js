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

    DelegateStore.getCommitteeDelegates(user.committee.id, (delegates) => {
      this.setState({
        delegates: delegates
      });
    });

    for (delegate of delegates) {
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
    }
  },

<<<<<<< HEAD
=======
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

>>>>>>> 801b2af3f4371efdc623a9c61499b3106b20bfe6
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
<<<<<<< HEAD
    var countries = Object.keys(this.state.assignments);
    return countries.map((country) => {
      var delegates = this.state.assignments[country];
      return (
        <tr>
          <td>
            {country.name}
=======
    var delegates = this.state.delegates;
    console.log(delegates);
    return delegates.map(delegate => {
      return (
        <tr>
          <td>
            {delegate.name}
>>>>>>> 801b2af3f4371efdc623a9c61499b3106b20bfe6
          </td>
          <td>
            <label name="session">
              <input
                className="choice"
                type="checkbox"
                name="Friday Attendance"
<<<<<<< HEAD
                onChange={_handleAttendanceChange.bind(this, delegates, country, 1)}
=======
                // onChange={_handleAttendanceChange.bind(this, delegates, country, 1)}
>>>>>>> 801b2af3f4371efdc623a9c61499b3106b20bfe6
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
<<<<<<< HEAD
    // Needs to be filled in
=======
    for (var country in this.state.assignments) {
      for (var delegate in this.state.assignments[country]) {
        DelegateStore.updateDelegate(delegate.id, {
          sessionOneAttendance: delegate.sessionOneAttendance,
          sessionTwoAttendance: delegate.sessionTwoAttendance,
          sessionThreeAttendance: delegate.sessionThreeAttendance});
      }
    }
>>>>>>> 801b2af3f4371efdc623a9c61499b3106b20bfe6
    event.preventDefault();
  },

});
    
module.exports = ChairAttendanceView;
