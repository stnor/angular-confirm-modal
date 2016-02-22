/*
 * angular-confirm-modal
 * https://github.com/Schlogen/angular-confirm
 * @version v1.2.3 - 2016-01-26
 * @license Apache
 */
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
    module.exports = factory(require('angular'));
  } else {
    return factory(root.angular);
  }
}(this, function (angular) {
  angular.module('angularConfirmModal', ['ui.bootstrap.modal'])
    .controller('ConfirmModalController',
      ['$scope', '$uibModalInstance', 'data', function ($scope, $uibModalInstance, data) {
        $scope.data = angular.copy(data);

        $scope.ok = function (closeMessage) {
          $uibModalInstance.close(closeMessage);
        };

        $scope.cancel = function (dismissMessage) {
          if (angular.isUndefined(dismissMessage)) {
            dismissMessage = 'cancel';
          }
          $uibModalInstance.dismiss(dismissMessage);
        };

      }])
    .value('$confirmModalDefaults', {
      template: '<div class="modal-header"><h3 class="modal-title">{{data.title}}</h3></div>' +
      '<div class="modal-body">{{data.text}}</div>' +
      '<div class="modal-footer">' +
      '<button class="btn btn-primary" ng-click="ok()">{{data.ok}}</button>' +
      '<button class="btn btn-default" ng-click="cancel()">{{data.cancel}}</button>' +
      '</div>',
      controller: 'ConfirmModalController',
      defaultLabels: {
        title: 'Confirm',
        ok: 'OK',
        cancel: 'Cancel'
      }
    })
    .factory('$confirmModal', ['$uibModal', '$confirmModalDefaults', function ($uibModal, $confirmModalDefaults) {
      return function (data, settings) {
        var defaults = angular.copy($confirmModalDefaults);
        settings = angular.extend(defaults, (settings || {}));

        data = angular.extend({}, settings.defaultLabels, data || {});

        if ('templateUrl' in settings && 'template' in settings) {
          delete settings.template;
        }

        settings.resolve = {
          data: function () {
            return data;
          }
        };

        return $uibModal.open(settings).result;
      };
    }])
    .directive('confirmModal', ['$confirmModal', function ($confirmModal) {
      return {
        priority: 1,
        restrict: 'A',
        scope: {
          confirmIf: "=",
          ngClick: '&',
          confirmModal: '@',
          confirmSettings: "=",
          confirmTitle: '@',
          confirmOk: '@',
          confirmCancel: '@'
        },
        link: function (scope, element) {

          element.unbind("click").bind("click", function ($event) {

            $event.preventDefault();

            if (angular.isUndefined(scope.confirmIf) || scope.confirmIf) {

              var data = {text: scope.confirmModal};
              if (scope.confirmTitle) {
                data.title = scope.confirmTitle;
              }
              if (scope.confirmOk) {
                data.ok = scope.confirmOk;
              }
              if (scope.confirmCancel) {
                data.cancel = scope.confirmCancel;
              }
              $confirmModal(data, scope.confirmSettings || {}).then(scope.ngClick);
            } else {

              scope.$apply(scope.ngClick);
            }
          });

        }
      }
    }]);
}));