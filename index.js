require("./main.scss")
require('angular')
var $=require('jquery');
var _=require('lodash')
var jp=require('jsonpath-plus')
jp.cache=window.data
var app=angular.module('app', [])

app.controller('mainCtrl', function ($scope,$timeout) {
	$scope.json=window.data;
	
})


app.provider('trees', function () {

	this.$get = function() {

		var makeNode=function(data){

			//console.log(data)
			var isArray=angular.isArray(data)
			var isObject=angular.isObject(data)

			if(isArray){
				var p={}
				for(var i=0;i<data.length;i++){

					var sdata=data[i];
					if(angular.isDefined(sdata.id)){
						//叶子结点
						p[sdata.name]=sdata

					}else{
						p[_.keys(sdata)[0]]=_.values(sdata)[0]

					}
				}
				 return p;

			}else if(isObject){

				if(angular.isDefined(data.id)){
					//是否是叶子结点，这里用id来表示是否是叶子结点，如果id存在的话就是叶子结点

					console.log('end')

				}else{
					//不是叶子结点
					return data;

				}

			}else{

				console.error('unknown node type')
			}

		}
		var makeData=function(data){

			if(angular.isObject(data)){
				return data;
			}

		}

		return {
			makeNode:makeNode,
			makeData:makeData
		};
	};
})
var scope_list=[]
app.directive('madTrees', function ($compile,trees) {
	return {
		restrict: 'ECMA',
		scope:{
			tree:"=data",
			select:"=",
			auto:"=",
			name:"=",
			hide:"="
		},
		template:`
			<div ><span ng-click="clickHandler()">{{name}}<small ng-if="tree.description">【{{tree.description}}】</small></span>
			<input type="checkbox" ng-click="changHandler()"/></div>
		`,
		link: function (scope, iElement, iAttrs) {
			
			scope.hasDraw=false;
			scope.create=function(node,node_name){

				if(!node) return;
				var newscope=scope.$new();	
					newscope.tree=JSON.parse(JSON.stringify(node))
					newscope.auto=false
					newscope.name=node_name;
					scope_list.push(newscope);
				var str=`<mad-trees data=tree auto=auto name="name" hide="hide"></mad-trees>`
				var html=$compile(str)(newscope);
				$(iElement).append(html)



			}	
			scope.clickHandler=function(){

				if(scope.hasDraw){
					if($(iElement).hasClass('hide')){

						console.log(scope.tree)
					$(iElement).removeClass('hide')

					}else{
						
						$(iElement).addClass('hide')
					}
					return;
				}

				scope.drawNode(trees.makeNode(scope.tree));
				scope.hasDraw=true;
				//scope.fix();
			}
			scope.drawNode=function(data){

				for(var prop in data){

					scope.create(data[prop],prop)
				}

			}


		
			scope.$watch('tree',function(n){
				if(!n) return;

				if(scope.auto){

					$(iElement).contents().remove()

					for(var i=0;i<scope_list.length;i++){

						scope_list.pop().$destory();
					}
					scope.drawNode(trees.makeNode(n));			
				}

			},true)

			scope.changHandler=function(){
				

				var g=jp({path:"$..id",resultType:"parent",json:scope.tree,callback:function(data){}})

				console.log(g)

			
			}
			

		}
	};
})