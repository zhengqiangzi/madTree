require("./main.scss")
require('angular')
var $=require('jquery');
var _=require('lodash')
var jp=require('jsonpath-plus')
jp.cache=window.data
var app=angular.module('app', [])

app.controller('mainCtrl', function ($scope,$timeout) {
	$scope.tree=window.data;
	$scope.auto=true;
	$scope.hasDraw=false;
	//$scope.selected=false;

})


app.provider('trees', function () {


	var treeList=[]
	this.$get = function() {


		var makeNode=function(data){

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

		var saveData=function(data,status){

			if(status){
				data.map((item)=>{
					treeList.push(item.id)
				})

			}else{
				data.map((item)=>{
					treeList=_.without(treeList,item.id)
				})
			}




		}

		var  hasTheTreeData=function(data){
			if(!data) return { status:false};

			var status=[]
			for(var i=0;i<data.length;i++){

				status.push(_.indexOf(treeList,data[i].id)>=0)
			}

			var result=_.compact(status)

			var len=result.length;

			var c={status:len==data.length}
			return c;
		}

		return {
			makeNode:makeNode,
			makeData:makeData,
			saveData:saveData,
			hasTheTreeData:hasTheTreeData
		};
	};
})
var scope_list=[]
app.directive('madTrees', function ($compile,trees) {
	return {
		restrict: 'ECMA',
	/*	scope:{
			tree:"=data",
			select:"=",
			auto:"=",
			name:"=",
			hide:"=",
			selected:"="
		},*/
		require:"?ngModel",
		template:`
			<div ><span ng-click="clickHandler()">{{name}}<small ng-if="tree.description">【{{tree.description}}】</small></span>
			<input type="checkbox" ng-checked="selected" ng-click="opHandler()"/>{{selected}}--></div>
		`,
		controller:function($scope){


		},
		link: function (scope, iElement, iAttrs,ngModel) {
			
			scope.create=function(node,node_name){

				if(!node) return;
				var newscope=scope.$new();	
					newscope.tree=JSON.parse(JSON.stringify(node))
					newscope.auto=false
					newscope.name=node_name;
					newscope.hasDraw=false;
					newscope.jp=jp({path:"$..id",resultType:"parent",json:newscope.tree,callback:function(data){}})

					newscope.selected=newscope.ds=trees.hasTheTreeData(newscope.jp).status
					//newscope.selected=scope.$parent.selected
					//newscope.selected=true;//trees.hasTheTreeData(newscope.tree);
				

				var str=`<mad-trees></mad-trees>`
				var html=$compile(str)(newscope);
					$(iElement).append(html)



			}	
			scope.clickHandler=function(){

				if(scope.hasDraw){
					if($(iElement).hasClass('hide')){

					$(iElement).removeClass('hide')

					}else{
						
						$(iElement).addClass('hide')
					}
					return;
				}

				scope.drawNode(trees.makeNode(scope.tree));
				scope.hasDraw=true;
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

			scope.opHandler=function(){

				scope.ds=!scope.ds

				console.log(scope.ds)
				trees.saveData(scope.jp,scope.ds);
				scope.$broadcast("checkEventBoradcast")
				scope.$emit("checkEvent")
			};	

			scope.$on('checkEventBoradcast',function(){
				//console.log(1)
				scope.selected=trees.hasTheTreeData(scope.jp).status
				scope.ds=scope.selected;
			})
			scope.$on('checkEvent',function(){
				//console.log(2)

				scope.selected=trees.hasTheTreeData(scope.jp).status
				scope.ds=scope.selected;
			})




		}
	};
})