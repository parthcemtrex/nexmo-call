A Dynamic NCCO to connect IP calls from Stitch to PSTN
=====================

## Set up instructions

Remix this Glitch and link the stitch application to this glitch's answer url `rare-bassoon.glitch.me/` and events url `rare-bassoon.glitch.me/events`

```sh
nexmo app:create "Stitch Outbound PSTN" https://rare-bassoon.glitch.me/answer https://rare-bassoon.glitch.me/events
```
or
```sh
nexmo app:update 96b0f981-a03f-4bc8-b521-149978b9243c "Stitch Outbound PSTN" https://rare-bassoon.glitch.me/answer https://rare-bassoon.glitch.me/events
```

Buy a number with Nexmo and link the number to your new or existing Stitch application.

```sh
nexmo number:buy 16625461410
nexmo link:app 16625461410 96b0f981-a03f-4bc8-b521-149978b9243c
```

Set the `FROM_NUMBER` in `.env` to be the Nexmo number you just bought. Users will see this as the caller's number when their PSTN phone rings.

Use one of the Nexmo Stitch SDKs to make a PSTN call, passing in the PSTN number you want to call as an argument.

When you make a PSTN call from one of the Stitch SDKs, the Stitch API will make a request to your answer url `https://rare-bassoon.glitch.me/` with the following parameters:

```json
from=16625461410\
&to=14155550100\
&conversation_uuid=CON-4e977dab-2abc-42b5-bf64-d468d4763e54\
&uuid=0666edbe58077d826944a7c1913da2b0
```

We can use the `to` parameter to dynamically tell Nexmo which phone number to call. See `var to` in `server.js`

The caller you just dialed should receive your call and see the from number that we've set in the `.env` file!