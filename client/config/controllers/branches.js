'use strict';

var $ = require('jquery');
var branches = global.branches || [];
var allBranches = global.allBranches || [];

function BranchesController($scope) {
  $scope.branchName = ''
  $scope.branches = branches;
  $scope.allBranches = allBranches;

  $scope.remove = function (item) {
    var actuallyDelete = confirm('Are you sure you want to remove ' + item.name + '?')
    if (actuallyDelete) {
      item.loading = true
      $scope.clearMessage()
      $.ajax({
        url: '/' + $scope.project.name + '/branches/',
        type: 'DELETE',
        data: { name: item.name },
        success: function(data, ts, xhr) {
          remove($scope.branches, item)
          $scope.success(item.name + ' is no longer a configured branch.', true)
        },
        error: function(xhr, ts, e) {
          item.loading = false
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText)
            $scope.error('Error deleting branch: ' + data.errors[0], true)
          } else {
            $scope.error('Error deleting branch: ' + e, true)
          }
        }
      })
    }
  }

  $scope.add = function () {
    var data = { name: $scope.branchName }

    $.ajax({
      url: '/' + $scope.project.name + '/branches/',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function(res, ts, xhr) {
        $scope.branchName = ''
        if (res.created) {
          $scope.branches.push(res.branch)
        }
        $scope.success(res.message, true, !res.created)
      },
      error: function(xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText)
          $scope.error('Error adding branch: ' + data.errors[0], true)
        } else {
          $scope.error('Error adding branch: ' + e, true)
        }
      }
    })
  }

  $scope.changeBranchOrder = function (list) {
    $scope.branches = list;
    $.ajax({
      url: '/' + $scope.project.name + '/branches/',
      type: 'PUT',
      data: { branches: list },
      dataType: 'json',
      success: function(res, ts, xhr) {
        $scope.success(res.message, true, false)
      },
      error: function(xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText)
          $scope.error('Error adding branch: ' + data.errors[0], true)
        } else {
          $scope.error('Error adding branch: ' + e, true)
        }
      }
    })
  }
}

function remove(ar, item) {
  ar.splice(ar.indexOf(item), 1)
}

module.exports = BranchesController;
