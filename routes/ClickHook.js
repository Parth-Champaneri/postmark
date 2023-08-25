const express = require('express');
const router = express.Router();

/*
TEST LOCALLY
curl -X POST -H "Content-Type: application/json" -d '{"RecordType": "Click", "ClickedLink": "https://example.com"}' http://localhost:3000/hook/webhookClick
*/
module.exports = (emailService) => {

    router.post('/webhookClick', (req, res) => {
        
        const { RecordType, OriginalLink, ReceivedAt, Recipient, MessageID } = req.body;
        if (RecordType === 'Click') {
            console.log('Clicked link:', OriginalLink, ReceivedAt, Recipient);
            // parse links and tag them
            emailService.saveEmailEvent(Recipient, MessageID, RecordType, ReceivedAt)
            res.sendStatus(200);
        } else {
            console.log('Unhandled record type:', RecordType);
            // Send a response to Postmark
            res.sendStatus(200);
        }
    });
}

/*
curl localhost:3000/hook/webhookClick  -X POST   -H 'Content-Type: application/json'  -d '{ 
        "ClickLocation": "HTML", 
        "Client": { 
            "Name": "Chrome 35.0.1916.153", 
            "Company": "Google", 
            "Family": "Chrome" 
        }, 
        "OS": { 
            "Name": "OS X 10.7 Lion", 
            "Company": "Apple Computer, Inc.","Family": "OS X 10" 
        }, 
        "Platform": "Desktop",
        "UserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko)  Chrome/35.0.1916.153 Safari/537.36", 
        "OriginalLink": "https://www.google.com", 
        "Geo": { 
            "CountryISOCode": "RS", 
            "Country": "Serbia", 
            "RegionISOCode": "VO", 
            "Region": "Autonomna Pokrajina Vojvodina", 
            "City": "Novi Sad",
            "Zip": "21000",
            "Coords": "45.2517,19.8369",
            "IP": "127.0.0.1"
        }, 
        "MessageID": "7fc95169-2aca-498e-82c0-6294962ef9a9",
        "ReceivedAt": "2017-10-25T15:21:11.9065619Z",
        "Tag": "welcome-email",
        "Recipient": "parth.champaneri@hotmail.com",
        "RecordType": "Click" 
      }';
*/
