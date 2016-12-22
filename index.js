require("./main.scss")
require('angular')
var $=require('jquery')
var app=angular.module('app', [])

app.controller('mainCtrl', function ($scope,$timeout) {
	
	$scope.json={

		data:{
			id:"1",
			name:"name1",
			children:{
				id:"2",
				name:"name2",
				children:{
					id:"3",
					name:"name3",
					children:{
						id:"4",
						name:"name4",
					}
				}

			}

		}
	}
	$scope.select=[]


})

app.directive('madTrees', function ($compile) {
	return {
		restrict: 'ECMA',
		scope:{
			tree:"=data",
			select:"="
		},
		template:`
			<div>{{tree.id}}---{{tree.name}}<input type="checkbox"/>{{select}}</div>
		`,
		link: function (scope, iElement, iAttrs) {
			
			scope.clickHandler=function(){

				scope.select.push(scope.tree.id)
			}

			if(typeof scope.tree.children !='undefined' ){

				var g=$compile(`<mad-trees data="tree.children" select="select"></mad-trees>`)(scope)

				$(iElement).append(g)
			}
		}
	};
})