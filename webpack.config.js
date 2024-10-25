const path=require('path');
const Strip=require('strip-loader');

module.exports=function(env={}){
    const dev = env.development;

    return {
        mode: dev?'development':'production',
        cache: false,
        entry: dev?'./src/index.js':'./src/qvm.js',
        output:{
            path: path.resolve(__dirname,'dist'),
            filename: dev?'qvm.js':'qvm.js',
            //sourceMapFilename: dev?'qvm.map':'qvm.min.map',
            libraryTarget: 'umd'//umd模块
        },

        module:{
            rules:[
                {test:/\.js$/i,use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:['@babel/preset-env']
                        }
                    },
                    ...dev?[]:{
                        //正式打包取消alert函数，assert
                        loader:Strip.loader('alert','assert')
                    },
                ]}
            ]
        },
        devServer: {
            static: {
                directory: path.join(__dirname, '/'),
            },
            hot: true,
            compress: true,
            open: true,
            host:'localhost',
            port: 9000
        },

        devtool: "source-map"

    };

}