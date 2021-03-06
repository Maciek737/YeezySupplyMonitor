const axios = require('axios');
// Stores all the private data so yall don't steal my webhooks and logos. 
const data = require('./data');
//const readline = require('readline')
// Import the discord.js module
const webhook = require("webhook-discord")
// Set up the webhooks for each server
const Hook = new webhook.Webhook(data.MyWebhook)
const Lab = new webhook.Webhook(data.YeezyLabWebhook)

// Sets up the YEEZY logo to later be used as the avatar for the webhook.
const logo = data.YeezyLogo;

// Sets up my personal logo to be used in the footer of the webhook. Just a bit of personal branding :)
const chuk = data.ChukLogo;

// Setting myJSON to something random in order to compare it later.
var myJSON ="Nothing here to start with :)";
var outofstock = false;

// Asks for input from the user. The input is the SKU of the shoe. 
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  readline.question(`Product SKU to monittor?   `, (sku) => { // takes in input
    console.log(`Hi monitoring ${sku}!`) // confirms input in console, dont need it, i like it
    // sets the url for the sku to see the size list
    let url = "https://www.yeezysupply.com/api/products/" + sku + "/availability";
    // sets the url for the sku to get the api and the image of the shoe
    let productURL = "https://www.yeezysupply.com/api/products/" + sku

    
    // this is used to get the image and is here for....reasons
    var shoeURL = "";


    // this is the function to get the image of the shoe
axios.get(productURL)
        .then(response => {
            // parses the data from the api
            var data = JSON.stringify(response.data.view_list);
            const obj = JSON.parse(data);
            // finds the shoe image url
            const urlShoe = obj.filter(shoe => shoe.image_url );
            // sets the shoeURL to the image 
            for(var i = 0; i<urlShoe.length; i++){
                shoeURL+=urlShoe[i].image_url;
            }
            // debug code to confirm that it got the url
            console.log(shoeURL);
        })
        // catches errors, not really needed
        .catch(error => {
            console.log(error);
        })


// Start of monitoring function
  setInterval(function(){
    //Connect to the url
    axios.get(url)
    // get the response 
  .then(function (response) {
    // Create a var to store the current data in the api
    var difference = JSON.stringify(response.data.variation_list);
    // Function to check the difference between myJSON and the current data in the api
    function jsonEqual(a,b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    
    // If there IS A DIFFERENCE between api and stored data execute this
    if(jsonEqual(myJSON,difference) == false){
        // Set stored data to the new data
        myJSON = difference;
        // Parse the data
        //console.log(difference)
        const obj = JSON.parse(myJSON);
        
        // Create an empty string to use for the webhook
        var sizes = ""
        // Function to filter the data and select only IN_STOCK items
        const inStock = obj.filter(shoe => shoe.availability_status === 'IN_STOCK');
        if(inStock === ""){
          outofstock = true;
        } 
        else{
          outofstock = false;
        }
        // For loop to loop through the IN_STOCK items
        for(var i = 0; i<inStock.length; i++){
            // Debug code to make it easier to see the data in console
            console.log("=======================================");
            // Add the size of each IN_STOCK item to the var later used to pass into the webhook
            sizes+=inStock[i].size;
            // Check if the stock is under 15. YS api does not show the real stock unless it is less than 15.
            // By adding this check the webhook will notify that a given size has LESS than 15 stock and is in LOW STOCK.
            // Important as low stock items tend to have issues in ATC and checkout during a drop.
            if(inStock[i].availability < 15){
                sizes += " - LOW STOCK - " + inStock[i].availability;
            }
            // Add new line to better space out the sizes in the webhook
            sizes += "\n"
            // Debug code to see all the IN_STOCK sizes in the console, not needed but I like it.
            console.log(inStock[i].size);
            // More debug code for better spacing.
            console.log("=======================================");
        }
        // Debug code please ignore. 
        //console.log(sizes.length)

        // Checking if there are any sizesm if not it will display sold out and change the color to red.
        if(sizes.length === 0){
          sizes = "SOLD OUT"
          outofstock = true;
        }

        // Just colors used for the webhook. Normal is green to show In Stock. Oos is Red to show Out of Stock. 
        var normal = "#20fc03"
        var oos = "#e82517"
        var color = ""
        // Redundant code could be very easily combined with the if statments above. This was hastly written as a last minute addition at some point and just stayed.
        // Will fix at some point, next time I need to edit the code.
        // It just sets the colors from above to the corresponding ones.
        if(outofstock === true){
          color = oos
        }
        else{
          color = normal
        }
       // The constructor for the webhook message. This is using npm webhoook-discord. At the time I used this as it was quicker. In other monitors I have my own system.
        const msg = new webhook.MessageBuilder()
                    // Name of the "USER" sending the message
                    .setName("YEEZY SUPPLY")
                    // Color of the message. Right now selected blue, for "info"
                    .setColor(color)
                    // A text field inside the webhook. Sets Title to IN STOCK and adds all of the sizes. Makes it look nicer.
                    .addField("IN STOCK", sizes)
                    // Shows the image of the shoe in question. Done dynamically at the start and changes according to the sku.
                    .setThumbnail(shoeURL)
                    // Sets the avatar of the "User" to the YEEZY logo. Looks nice and will remain unchanged. 
                    .setAvatar(logo)
                    // Sets the footer to credit me the creator :) my discord id and profile pic
                    .setFooter("Lil Chuk#0001" , chuk)
                    // Adds the time of the webhook
                    .setTime()
        // Sends the Webhook message.             
        Hook.send(msg);
        Lab.send(msg);
        // Debug code to display in console. Not needed. Keeping it for now as I like to see whats going on.
        console.log("*****************************************");
        console.log(myJSON);
        console.log("*****************************************");
        console.log(difference);
        console.log("*****************************************");
    }
    // If there is no difference it will display no difference, not needed but I like to have it.
    else{
        console.log("========================== NO DIFFERENCE ========================== ")
    }
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed just sates the code is done running. not needed I choose to have it.
    console.log("Done")
  });
  // 5 second delay on running. Can bee much lower. Personal preference for Yeezy Supply as the stock only starts moving closer to end of release. 
  }, 5000);

// closes the readline. kind of a wonky way to do it but this way the readline will wait for user input before executing the rest of the code.
// there are better ways around it but I just did this for simplicity atm
    readline.close()
  })


