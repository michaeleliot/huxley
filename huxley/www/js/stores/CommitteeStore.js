/**
 * Copyright (c) 2011-2015 Berkeley Model United Nations. All rights reserved.
 * Use of this source code is governed by a BSD License (see LICENSE).
 */

'use strict';

var Dispatcher = require('dispatcher/Dispatcher');
var ServerAPI = require('lib/ServerAPI');
var {Store} = require('flux/utils');


var _committeePromise = null;
var _committeeDelegates = {};

class CommitteeStore extends Store {
  getCommittees(callback) {
    if (!_committeePromise) {
      _committeePromise = ServerAPI.getCommittees();
    }
    if (callback) {
      _committeePromise.then(callback);
    }
    return _committeePromise;
  }

  getSpecialCommittees(callback) {
    var p = this.getCommittees().then((committees) => {
      return committees.filter((committee) => committee.special);
    });
    if (callback) {
      p.then(callback);
    }
    return p;
  }

  getCommitteeDelegates(committeeID) {
    if (_committeeDelegates[committeeID]) {
      return _committeeDelegates[committeeID];
    }

    ServerAPI.getCommitteeDelegates(committeeID).then(value => {
      _committeeDelegates[committeeID] = value;
      for (const delegate of value) {
        _delegates[delegate.id] = delegate;
      }
      DelegateActions.delegatesFetched();
    });

    return [];
  }

  updateDelegates(committeeID, delegates) {
    ServerAPI.updateCommitteeDelegates(
      committeeID,
      JSON.stringify(delegates)
    )
    for (const delegate of delegates) {
      _delegates[delegate.id] = delegate;
    }
    _committeeDelegates[schoolID] = delegates;
  }

  __onDispatch(action) {
    switch (action.actionType) {
      case ActionConstants.UPDATE_DELEGATES:
        this.updateDelegates(action.committeeID, action.delegates);
        break;
      default:
        return;
  }
};

module.exports = new CommitteeStore(Dispatcher);
