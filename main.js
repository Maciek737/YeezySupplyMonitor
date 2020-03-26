const axios = require('axios');
// Import the discord.js module
const webhook = require("webhook-discord")
 
const Hook = new webhook.Webhook("https://discordapp.com/api/webhooks/692434655223349281/lpxAj908beud9FfsHnAVjfgfRbE3vPuDA58MZPTd5ONVYN0Alzh4o351n7D8R4mlUS5l")

// Send a message using the webhook
var myJSON ="TESTING HOMIE THIS IS TESTING!";

let url = "https://www.yeezysupply.com/api/products/FV6125/availability";



  setInterval(function(){
    axios.get(url)
  .then(function (response) {
    
    var difference = JSON.stringify(response.data.variation_list);
    function jsonEqual(a,b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    
    if(jsonEqual(myJSON,difference) == false){
        myJSON = difference;
        const obj = JSON.parse(myJSON);
        var sizes = ""
        const inStock = obj.filter(shoe => shoe.availability_status === 'IN_STOCK');
        for(var i = 0; i<inStock.length; i++){
            console.log("=======================================");
            sizes+=inStock[i].size + "\n"
            console.log(inStock[i].size);
            console.log("=======================================");
        }
    
    
       
        const msg = new webhook.MessageBuilder()
                    
                    .setName("YEEZY SUPPLY")
                    .setColor("#aabbcc")
                    //.setText(sizes)
                    .addField("IN STOCK", sizes)
                    //.addField("my", "webhook!")
                    .setImage("https://assets.yeezysupply.com/images/w_937,f_auto,q_auto:sensitive,fl_lossy/8453c34c94ae490cb790aad10125695b_ce49/YEEZY_POWERPHASE_Quiet_Grey_FV6125_FV6125_04_standard.png")
                    .setAvatar("https://i0.wp.com/www.techjunkie.com/wp-content/uploads/2020/02/Is-Yeezy-Supply-Legit.jpg?resize=400%2C250&ssl=1")
        Hook.send(msg);
        console.log("*****************************************");
        console.log(myJSON);
        console.log("*****************************************");
        console.log(difference);
        console.log("*****************************************");
    }
    else{
        console.log("========================== NO DIFFERENCE ========================== ")
    }
    
    console.log(typeof myJSON);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
    console.log("Done")
  });
  }, 5000);