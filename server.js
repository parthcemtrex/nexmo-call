const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(morgan('combined'))
app.use(express.static('public'));

var Nexmo = require('nexmo');

var nexmo = new Nexmo({apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET, applicationId: process.env.APP_ID, privateKey: process.env.PRIVATE_KEY});

const adminAcl = {
  "paths": {
    "/v1/users/**": {},

    "/v1/conversations/**": {},

    "/v1/sessions/**": {},

    "/v1/devices/**": {},

    "/v1/image/**": {},

    "/v3/media/**": {},

    "/v1/applications/**": {},
    
    "/v1/push/**": {},
    
    "/v1/knocking/**": {}
  }
}

app.get("/answer_old", (request, response) => {
  console.log(request.query)
  // if (request.query.to) then the following code
  // else show alex's code from blog post https://www.nexmo.com/blog/2018/05/13/connect-phone-call-to-stitch-in-app-voice-dr/
  
  //use the `to` query parameter that Nexmo gives us to make a call. 
  //Or if there isn't one for some reason, fallback to a TO_NUMBER that we've set in .env
  var to = request.query.to || process.env.TO_NUMBER
  
  //let's dynamically set the URL since glitch's can have different URLs after remixing :)
  var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
  response.json([
    {
      "action": "connect",
      "from": `${process.env.FROM_NUMBER}`,
      "endpoint": [
        {
          "type": "phone",
          "number": `${to}`
        }
      ]
    }
  ])
})

app.get('/answer', (req, res) => {
  var ncco = [
    {
      action: "talk",
      text: "Thank you for calling cemtrex"
    },
    {
      "action": "connect",
      "from": "12059001729",
      "endpoint": [
        {
          "type": "app",
          "user": "jamie"
        }
      ]

    }
  ];
  res.json(ncco);
})

app.get("/events", (request, response) => {
  response.sendStatus(200)
})

app.post("/events", (request, response) => {
  // console.log(request)
  response.sendStatus(200)
})

app.get('/jwt', function(req, res, next) {
  console.log(process.env.PRIVATE_KEY)
  res.json({
    user_jwt: Nexmo.generateJwt(process.env.PRIVATE_KEY, {
      application_id: process.env.APP_ID,
      sub: process.env.USERNAME,
      exp: new Date().getTime() + 86400,
      acl: adminAcl
    })
  });
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
