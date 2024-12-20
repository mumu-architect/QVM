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
            filename: dev?'qvm.js':'qvm.min.js',
            //sourceMapFilename: dev?'qvm.map':'qvm.min.map',
            //libraryTarget: 'umd'//umd模块
            library: {
                // 库的名称
                name: 'Qvm',
                // 库的类型
                type: 'umd',
            },
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
                    // {
                    //     //正式打包打开此模块
                    //     //正式打包取消alert函数，assert
                    //     loader:Strip.loader('alert','assert')
                    // }
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