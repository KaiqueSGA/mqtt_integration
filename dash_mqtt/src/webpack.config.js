const HtmlWebPackPlugin = require('Html-webpack-plugin');


module.exports = {
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                use:{
                    loader:"babel-loader"
                }
            },
            {
                test: /\.html$/,
                use:{
                    loader:"html-loader"
                }
            }
        ]
    },
       
        resolve: {
            fallback: {
                "path":require.resolve("path-browserify")
            }
          },

          plugins:[
            new HtmlWebPackPlugin({
                "template":"./public/index.html",
                "filename":"index.html"
            })
          ]
    
};