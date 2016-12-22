var webpack=require('webpack');
module.exports={

	entry:{
		index:"./index.js"
	},
	output:{
		path:"./dist",
		filename:"dist.js",
		publicPath:"/dist/"
	},
	module:{


		loaders:[

			{test:/\.js/,loader:"babel-loader"},
			{test:/\.scss/,loader:"style-loader!css-loader!sass-loader"}
		]
	},
	plugins:[
    	//new webpack.HotModuleReplacementPlugin()



	],
	/*devServer:{
		hot:true,
		port:9090,
		inline:true

	}*/

}