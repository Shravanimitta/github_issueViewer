// 'use strict';

// describe('Directive: ngEnter', function () {

//   // load the directive's module
//   beforeEach(module(app));

//   var element,
//       scope;

//   beforeEach(inject(function ($rootScope) {

//     scope = $rootScope;
//     scope.mockFunction = function(){};
//     compileDirective();

//   }));

//   /**
//    * Compile the directive into HTML
//    */
//   function compileDirective(){
//     element = angular.element('<input type="text" data-ng-enter="mockFunction()" />');
//     inject(function($compile){
//       element = $compile(element)(scope);
//     });
//     scope.$apply();
//   }

//   it('it should call the mock function on pressing enter', function () {
//     spyOn(scope,'mockFunction');
//     var e = jQuery.Event('keypress');
//     e.which = 13; //choose the one you want
//     e.keyCode = 13;
//     element.trigger(e);
//     expect(scope.mockFunction).toHaveBeenCalled();
//   });

// });
