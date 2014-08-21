/* global define */

define(['resource_ctrl'], function(ResourceCtrl){
  console.log('construct directive SETTINGBOX');
  return ResourceCtrl.directive('settingbox', function(){
    console.log('init directive SETTINGBOX');
    // <settingbox id='endpoint1' data-url='https://' data-parsetime='a,b,c' data-format='header1,header2'></apiendpoint>
    return {
      scope: false,
      restrict: 'E',
      templateUrl: '/components/html/settingbox.html',
    };
  });
});
