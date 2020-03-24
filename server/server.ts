import { mergePatchBodyParser } from './merge-patch.parser'
import * as restify from 'restify'
import { environment } from './../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose'
import { handleError } from './error.handler'



export class Server{

    application: restify.Server

    initializeDb(): mongoose.MongooseThenable{
        (<any>mongoose).Promise = global.Promise
        console.log(environment.db.url);
        return mongoose.connect(environment.db.url,{
            useMongoClient: true
        })
    }
    
    initRoutes(routers: Router[]): 
        Promise<any>{
            return new Promise((resolve,reject) => {
                try{
                    this.application = restify.createServer({
                        name: 'custommer-api',
                        version: '1.0.0'
                    })
                    this.application.use(restify.plugins.queryParser())
                    this.application.use(restify.plugins.bodyParser())
                    this.application.use(mergePatchBodyParser)
                    //routes

                    for(let router of routers){ 
                        router.applyRoutes(this.application)
                    }

                    this.application.listen(environment.server.port,() => {
                        resolve(this.application)
                    })
                    
                    this.application.on('restifyError', handleError)
                   
                }
                catch(error){
                    reject(error)
                }
            })
        }

    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDb().then(()=>
            this.initRoutes(routers).then( () => this)
        )  
    }
        
} 