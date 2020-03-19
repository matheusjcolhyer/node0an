import * as restify from 'restify'

const server = restify.createServer({
    name: 'custommer-api',
    version: '1.0.0'
})

server.use(restify.plugins.queryParser())



server.get('/info',
    [
        (req,resp,next) => {
            if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
                let error: any = new Error()
                error.statusCode = 400
                error.message = 'Please update your browser'
                return next(false)
            }
            return next()
        }, 
        (req,resp,next) => {
            resp.status(200)
            resp.json({
                browser: req.userAgent,
                method: req.method,
                url: req.href(),
                path: req.path(),
                query: req.query
            })
            return next()
        }
    ]
)

server.listen(3001,() => {
    console.log('Api is running on http://localhost:3001');  
})