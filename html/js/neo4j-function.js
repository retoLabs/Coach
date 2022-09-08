var r=require("request");
var txUrl = "http://localhost:7474/db/data/transaction/commit";
function cypher(query,params,cb) {
  r.post({uri:txUrl,
          json:{statements:[{statement:query,parameters:params}]}},
         function(err,res) { cb(err,res.body)})
}


var query="MATCH (n:User) RETURN n, labels(n) as l LIMIT {limit}"
var params={limit: 10}
var cb=function(err,data) { console.log(JSON.stringify(data)) }

cypher(query,params,cb)

{"results":[
  {"columns":["n","l"],
   "data":[
     {"row":[{"name":"Aran"},["User"]]}
    ]
  }],
 "errors":[]}