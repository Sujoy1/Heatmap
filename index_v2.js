// *** flag variable just denotes whether the Chat is restored (1) or new (0) ***
// Catch all User Responses
let userResponses = [];

// The user Activtity array captures all the heatmap  details
//let userActivity = [];
//let heatmap = [] ;
// Captured Data to be Sent to the Clustering Lambda through API
let capturedData = {};

// Discount Coupon and Client ID assigned to User
let userDiscount = "";

// Setting up AWS Identity Credentials & Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-1:3fbfb417-6e71-405f-8656-2c952cbf9c69",
});

let companyName  = "Reiker";

let capturedPagesData = [];

let capturedClicksData = [];

// Debugger
// console.log(AWS.config.credentials);

AWS.config.region = "us-east-1";

// Starting a new Lex instance & Configuring a new user
let lexRunTime = new AWS.LexRuntime();
let lexUserId = "mediumBot" + Date.now();
// Generate random string for username

1/*function GenUsername(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
// Set   a cookie 
function setCookie(cname,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    var e = new Date();
    cvalue= e;
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

// Get a cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      console.log(c);
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    
  }
var userID;
// Check a cookie
function checkCookie() {
    let username = getCookie("username");
    if (username != "") {
     alert("Welcome again ");
    } else
     {
      username = GenUsername(7);
      userID = username;
      if (username != "" && username != null) {
        setCookie("username", username, 1);
      }
    }
  }
  */
function include(file) { 
  
    var script  = document.createElement('script'); 
    script.src  = file; 
    script.type = 'text/javascript'; 
    script.defer = true; 
    
  //  document.getElementsByTagName('head').item(0).appendChild(script); 
    
  } 
    
  /* Include  js files by greenstick ; Module name :Interactor ; Module URL :https://github.com/greenstick/interactor  */
 include('../interactor-master/intreractor.js'); 
  include('../interactor-master/interactor.min.js'); 
  
// Following is the code for interactor class

 // Mobile Detection Method
 window.ismobile = function() {
    var mobile = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return mobile;
};

// Setup Events by Device Type
if (window.ismobile()) {
    var interactionEventsArray = ["touchend"],
        conversionEventsArray = ["touchstart"];
} else {
    var interactionEventsArray = ["mouseup"],
        conversionEventsArray = ["mousedown"];
}

// Initialize Interactor
var interactor = new Interactor({
    interactions            : true,
    interactionElement      : "chatbox",
    interactionEvents       : interactionEventsArray,
    conversions             : true,
    conversionElement       : "chatbotIcon",
    conversionEvents        : conversionEventsArray,
    endpoint                : '/usage/interactions',
    async                   : true,
    debug                   : true
});

// Empty Data Model for VM Initialization
var model       = {
    interactions    : [
        {
            type            : "",
            event           : "",
            targetTag       : "",
            targetClasses   : "",
            content         : "",
            clientPosition  : {
                x               : 0,
                y               : 0
            },
            screenPosition  : {
                x               : 0,
                y               : 0
            },
            createdAt       : ""
        }
    ],
    conversions     : [
        {
            type            : "",
            event           : "",
            targetTag       : "",
            targetClasses   : "",
            content         : "",
            clientPosition  : {
                x               : 0,
                y               : 0
            },
            screenPosition  : {
                x               : 0,
                y               : 0
            },
            createdAt        : ""
        }
    ],
    loadTime        : "",
    unloadTime      : "",
    language        : "",
    platform        : "",
    port            : "",
    clientStart     : {
        name            : "",
        innerWidth      : 0,
        innerHeight     : 0,
        outerWidth      : 0,
        outerHeight     : 0
    },
    clientEnd       : {
        name            : "",
        innerWidth      : 0,
        innerHeight     : 0,
        outerWidth      : 0,
        outerHeight     : 0
    },
    page            : {
        location        : "",
        href            : "",
        origin          : "",
        title           : ""
    },
    endpoint        : ""
};

// Bind Interaction & Conversion Classes to VM Update
var buttons = document.querySelectorAll(".interaction, .conversion");

// Mapping for Interactions & Conversions Array
var mapping = {
    'interactions': {
        key: function (data) {
            return ko.utils.unwrapObservable(data.id);
        }
    },
    'conversions': {
        key: function (data) {
            return ko.utils.unwrapObservable(data.id);
        }
    }
}

// Map ViewModel
var viewmodel = ko.mapping.fromJS(model, mapping);

// Apply Bindings
ko.applyBindings(viewmodel, document.getElementById("wrapper"));

// Init Session Data
ko.mapping.fromJS(interactor.session, viewmodel);

// Update View Model on Button Click
var historydata = document.querySelector(".history-data");
for(var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (e) {
        ko.mapping.fromJS(interactor.session, viewmodel);
        historydata.style.display = "block";
    });
}

// End of code for interactor class
function handleShowBanner() {
    const chatWindowDiv = document.getElementById("chatWindow");
 
    //    let disBtnDiv = document.createElement("div");
    //    disBtnDiv.setAttribute("class", "buttonDiv");
       
       let disBtnDiv = document.createElement("div");
       disBtnDiv.setAttribute("class", "mainDivWrapper");
       disBtnDiv.style.cursor = "pointer"
    
        let header = document.createElement("h4");
        header.setAttribute("class", "headerWrapper");
        header.innerHTML = "Limited Sale"
        console.log(header, "dsds")
    
        let imageContainer = document.createElement("div");
        imageContainer.setAttribute("class", "row");
    
       // Reveal and Copy Button
       let revealAndCopy = document.createElement("img");
       revealAndCopy.setAttribute("class", "imageDiv");
    //    revealAndCopy.setAttribute("class", "imageContainer tooltip");
       revealAndCopy.setAttribute("src", "./Resources/crop.png");
    
       let containerDiv = document.createElement("div");
       containerDiv.setAttribute("class", "containerDiv");
    
       let createsubHeader = document.createElement("h");
       createsubHeader.innerHTML = "Expires Soon!"
       createsubHeader.style.padding = "0px";
       createsubHeader.style.margin = "5px";
       createsubHeader.style.fontWeight ="bold";
       createsubHeader.style.fontSize = "20px"
    
       let subTitle = document.createElement("h4");
       subTitle.setAttribute("class", "subHeader");
       subTitle.innerHTML = "Save"
    
       let couponTag = document.createElement("p");
       couponTag.setAttribute("class", "couponTag");
       couponTag.setAttribute("id", "dynamicText");
       
       let value = `${sessionStorage.getItem("value") === null ? "" : sessionStorage.getItem("value") } ${sessionStorage.getItem("type") === "percent" ? "% Now" : sessionStorage.getItem("type") === "dollar" ? "$ Now" : sessionStorage.getItem("type")}`
       couponTag.innerHTML = `${value}`;
       couponTag.style.lineHeight = "26px";
    
    
       let footer = document.createElement("h4");
        footer.innerHTML = "CLICK HERE"
        footer.setAttribute("class", "footerWrapper");
    
     
        containerDiv.append(createsubHeader);
        containerDiv.append(subTitle);
        containerDiv.append(couponTag);
    
    
        imageContainer.appendChild(revealAndCopy);
        imageContainer.appendChild(containerDiv)
    
        disBtnDiv.appendChild(header);
        disBtnDiv.appendChild(imageContainer);
        disBtnDiv.appendChild(footer);
    
       let couponCode = sessionStorage.getItem("CouponCode");
       console.log(couponCode, "couponCode")
       // revealAndCopy.innerHTML = "Reveal & Copy";
    
       disBtnDiv.addEventListener("click",
           function() {
               const element = document.createElement('textarea');
               element.value = couponCode;
               document.body.appendChild(element);
               element.focus();
               element.setSelectionRange(0, element.value.length);
               document.execCommand('copy');
               document.body.removeChild(element);
               let elementCOpied = document.getElementById("textCopied");
               console.log(elementCOpied, "elementCOpied")
               elementCOpied.innerHTML = "Copied";
               element.style.padding = "20px"
    
               setTimeout(() => {
                   let elementCOpied = document.getElementById("textCopied");
                   elementCOpied.innerHTML = "";
                   element.style.padding = "0px"
               }, 3000)
           //    alert(`copied:${userDiscount}`)
           });
        //    disBtnDiv.appendChild(revealAndCopy);
           // disBtnDiv.appendChild(checkoutWithThisCoupon);
        //    botDiv.appendChild(disBtnDiv);
    
           chatWindowDiv.appendChild(disBtnDiv);

           var banner = document.getElementById("box-toggle");
           banner.style.display = "block";
           scrollToBottom();
}

async function getRegion(latitude, longitude, type) {
    // Debugger
    // console.log(latitude);
    // console.log(longitude);
        jQuery(function($) {
            $.get("https://us1.locationiq.com/v1/reverse.php?key=ec33f262d124e6&lat=" + latitude + "&lon=" + longitude + "&format=json", function(response) {
                let uRegion = response.address.state;
                let uCity = response.address.city;
                let uCountry = response.address.country;
                capturedData["uRegion"] = uRegion;
                capturedData["uCity"] = uCity;
                capturedData["uCountry"] = uCountry;
        
            })
        });

        // Push Matched Campaign Name if it is there
        let whatCampaign = sessionStorage && sessionStorage.getItem("campaignName") && sessionStorage.getItem("campaignName").length ? sessionStorage.getItem("campaignName") : "";
        capturedData["whatCampaign"] = whatCampaign;
        // capturedData.push(whatCampaign);
}

async function postUser(data) {
    // Debugger
    // console.log(data);

    const chatDiv = document.getElementById("chatWindow");

    let userElement = document.createElement("div");
    userElement.setAttribute("class", "userResponse");

    let userDiv = document.createElement("div");
    userDiv.setAttribute("class", "userMessage");

    let userMessage = document.createElement("p");
    userMessage.innerHTML = data;

    userDiv.appendChild(userMessage);
    userElement.appendChild(userDiv);

    // Get Current Timestamp in IST
    var myUserDate = new Date();

    var userHours = myUserDate.getHours();
    var userAmPm = userHours >= 12 ? "PM" : "AM";
    userHours %= 12;
    userHours = userHours ? userHours : 12;

    var userMinutes = myUserDate.getMinutes();
    userMinutes = userMinutes < 10 ? "0" + userMinutes : userMinutes;

    var myUserTime = userHours + ":" + userMinutes + " " + userAmPm;
     
    // Debugger
    //console.log(userhours);

   




    // Adding time to View and Assigning a "class"
    let userTime = document.createElement("div");
    userTime.setAttribute("class", "userTime");

    let userTimeElement = document.createElement("p");
    userTimeElement.innerHTML = myUserTime;

    // Appending Timestamp to User Response
    userTime.appendChild(userTimeElement);
    userElement.appendChild(userTime);

    chatDiv.appendChild(userElement);
    scrollToBottom();
}

// Dummy Object

// Dummy condition

// Sleep Function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let discount;
function isMobile() {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  function isMobileTablet(){
    var check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|Windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
            check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }
  //  function mouse_poitio
 /* function mouse_position()
  {
      var e = window.event;
  
      var posX = e.clientX;
      var posY = e.clientY;
  
     // userActivity[0] = posX;
     // userActivity[1] = posY;
  
      var t = setTimeout(mouse_position,100);
  
  }
  // Get Engagement Time using getTimeSpentonPage()
  function diff_minutes(dt2, dt1) 
 {
 console.log(dt1);
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }
  var k= new Date();
  function getTimeSpentonPage()
  {
     
     var date2 = k;
     var date1 = getCookie(userID);
     var difference = date2 - date1;
     var minutespent = Math.floor(difference / (1000));
    // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
     //var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
     userActivity [10] = minutespent;
    // console.log("Date login :",date1)
     console.log("Time spent in seconds :", userActivity[10]);
     window.setTimeout(getTimeSpentonPage(), 1000);
          return minutespent;
  }
  // Capturing all User activity with Mouse Clicks and Mouse Hovering

  // Activity capture for single clicks
  let clicks_count =0;
    window.onclick = function (e) {
        var d = new Date();
        var target_name_1 = e.target.localName;
        userActivity[4]=target_name_1;
        clicks_count = clicks_count+1;
        userActivity[5]=clicks_count;
        userActivity[6]=d;
        //  console.log("User clicked on : "+target_name_1 + " on time" , d);
      // console.log("Number of single clicks till now:",clicks_count);
        }

        // Activity capture for Mouse double Clicks

        let double_clicks_count =0;
    window.ondblclick = function (e) {
        var f = new Date();
        var target_name_2 = e.target.localName;
        double_clicks_count = double_clicks_count+1;
        userActivity[7]=target_name_2;
        userActivity[8]=double_clicks_count;
        userActivity[9]=f;
          // console.log("User double clicked on : "+target_name_2 + " on time" , f);
         // console.log("Number of double clicks till now:",double_clicks_count);
        }
    
  // Activity capture for scrolling of mouse
 /* window.addEventListener('wheel', function(event)
{
    userActivity[11]=false;
 if (event.deltaY < 0)
 {
 // console.log('scrolling up');
  userActivity[11] =true;
  //document.getElementById('status').textContent= 'scrolling up';
 }
 else if (event.deltaY > 0)
 {
  console.log('scrolling down');
 // userActivity[11]= true;
 // document.getElementById('status').textContent= 'scrolling down';
 }
 else
 {
   //  console.log("No scrolling now");
   userActivity[11]=false;
 }
});*/
 
    //The handleDetails() is supposed to capture all User Details and most of the user Activity

function handleDetails(){

    let timeAndDate = new Date();
    let uHour = timeAndDate.getHours(); // 24 for 12:00 AM
    let uDay = timeAndDate.getDay() + 1; // 1 for Sunday
    let uDate = timeAndDate.getDate();
    let uMonth = timeAndDate.getMonth() + 1;
    let uYear = timeAndDate.getFullYear();
    capturedData["uHour"] = uHour;
    capturedData["uDay"] = uDay;
    capturedData["uDate"] = uDate;
    capturedData["uMonth"] = uMonth;
    capturedData["uYear"] = uYear;
    

    

    // Get real time mouse location
   /* onmousemove = function(e)
    {   
        
        userActivity[0]=e.clientX;
        userActivity[1]=e.clientY;
        userActivity[2]= e.target.localName;
    //   console.log("mouse location X:", userActivity[0] )
     //  console.log("mouse location Y:", userActivity[1])
      //  console.log("Mouse Hovering over:",userActivity[2]); 
    }
    userActivity[3]=document.URL;*/
    //console.log("Current URL :" ,userActivity[3]);
    // capturedData.push(uHour);
    // capturedData.push(uDay);
    // capturedData.push(uDate);
    // capturedData.push(uMonth);
    // capturedData.push(uYear);
   
    // Capturing user Clicks
    

   // Getting real time engagement time
 // window.setTimeout(getTimeSpentonPage(), 1000);
  //console.log("Time present :" ,userActivity[2]);

    // Device Details

    //Capturing the User Medium
    
    // Getting user URL  which will help in retrieving medium
   var user_url = document.URL;
    // Check if utm_medium parameter is set or not
   var uMedium = "";
    // Example : 
    var po = user_url.search("utm_medium");
    if(po==-1)
    {
        uMedium = "System Defined";
    }
    else
    {
        uMedium = "User Defined";
        var p1 = user_url.indexOf("=",po);
        var p2 = user_url.indexOf("&",po);
        if((p1!=null)&&(p2!=null))
        {
            uMedium=str.substring(p1,p2-1);
        }
    }
   // console.log("Captured Medium : ",uMedium);

    
    if(isMobile())
    {
        uDeviceType = "Mobile";
    }
    else if (isMobileTablet())
    {
        uDeviceType = "Tablet";
    }
    else
    {
        uDeviceType ="Desktop";
    }
    //test1
    //(function () {
      //  'use strict';
        
        var module = {
            options: [],
            header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
            dataos: [
                { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
                { name: 'Windows', value: 'Win', version: 'NT' },
                { name: 'iPhone', value: 'iPhone', version: 'OS' },
                { name: 'iPad', value: 'iPad', version: 'OS' },
                { name: 'Kindle', value: 'Silk', version: 'Silk' },
                { name: 'Android', value: 'Android', version: 'Android' },
                { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
                { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
                { name: 'Macintosh', value: 'Mac', version: 'OS X' },
                { name: 'Linux', value: 'Linux', version: 'rv' },
                { name: 'Palm', value: 'Palm', version: 'PalmOS' }
            ],
            databrowser: [
                { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
                { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
                { name: 'Safari', value: 'Safari', version: 'Version' },
                { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
                { name: 'Opera', value: 'Opera', version: 'Opera' },
                { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
                { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
            ],
            init: function () {
                var agent = this.header.join(' '),
                    os = this.matchItem(agent, this.dataos),
                    browser = this.matchItem(agent, this.databrowser);
                
                return { os: os, browser: browser };
            },
            matchItem: function (string, data) {
                var i = 0,
                    j = 0,
                    html = '',
                    regex,
                    regexv,
                    match,
                    matches,
                    version;
                
                for (i = 0; i < data.length; i += 1) {
                    regex = new RegExp(data[i].value, 'i');
                    match = regex.test(string);
                    if (match) {
                        regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                        matches = string.match(regexv);
                        version = '';
                        if (matches) { if (matches[1]) { matches = matches[1]; } }
                        if (matches) {
                            matches = matches.split(/[._]+/);
                            for (j = 0; j < matches.length; j += 1) {
                                if (j === 0) {
                                    version += matches[j] + '.';
                                } else {
                                    version += matches[j];
                                }
                            }
                        } else {
                            version = '0';
                        }
                        return {
                            name: data[i].name,
                            version: parseFloat(version)
                        };
                    }
                }
                return { name: 'unknown', version: 0 };
            }
        };
        
        var e = module.init(),
        /*    debug = '';
        
        debug += 'os.name = ' + e.os.name + '<br/>';
        debug += 'os.version = ' + e.os.version + '<br/>';
        debug += 'browser.name = ' + e.browser.name + '<br/>';
        debug += 'browser.version = ' + e.browser.version + '<br/>';
        
        debug += '<br/>';
        debug += 'navigator.userAgent = ' + navigator.userAgent + '<br/>';
        debug += 'navigator.appVersion = ' + navigator.appVersion + '<br/>';
        
        debug += 'navigator.platform = ' + navigator.platform + '<br/>';
        debug += 'navigator.vendor = ' + navigator.vendor + '<br/>';
        
        document.getElementById('log').innerHTML = debug;*/
        uBrowser = e.browser.name;
        uOS = e.os.name;
        uDeviceBrand = navigator.appVersion;
   // }());
    //end of test 1
     
    capturedData["uBrowser"] = uBrowser;
    capturedData["uOS"] = uOS;
    capturedData["uDeviceType"] = uDeviceType;
    capturedData["uDeviceBrand"] = uDeviceBrand;

    // capturedData.push(uBrowser);
    // capturedData.push(uOS);
    // capturedData.push(uDeviceType);
    // capturedData.push(uDeviceBrand);

    // User Geographic Details
    // Latitude & Longitude (IP) #10000 Requests per Month + VPN Problem (FREE)
    jQuery(function($) {
        $.get("https://ipinfo.io?token=589a8eaf6f4cd1", function(response) {
            var uLatitude = response.loc.split(',')[0];
            var uLongitude = response.loc.split(',')[1];

            // capturedData.push(uLatitude);
            // capturedData.push(uLongitude);

            capturedData["uLongitude"] = uLongitude;
            capturedData["uLatitude"] = uLatitude;

            // Getting Region, City and Country
            getRegion(uLatitude, uLongitude, "Capture");
            console.log("Capture", "capturedData", capturedData)
        }, "jsonp");
    });

    let indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
    indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
    let props = indexOfCookie !== -1 ? document.cookie.substr(indexOfCookie).split("=")[1].split("%26") : [];

    // Dummy Channel and Medium
    let uChannel = "";
    //let uMedium = "";

    if (props.length) {
        uChannel = props[0] ? props[0].split("%3D")[1] : "";
       // uMedium = props[1] ? props[1].split("%3D")[1] : "";
    }


    capturedData["uChannel"] = uChannel;
    capturedData["uMedium"] = uMedium;
    //console.log("Captured Medium : ",uMedium);
    // capturedData.push(uChannel);
    // capturedData.push(uMedium);
}

async function restoreBotConv() {
    // Client ID
    let clientId = "000.000";
    if (document.cookie.match("_ga")) {
        console.log(document.cookie.match("_ga"), document.cookie.match("_ga"))
        // For Production
        clientId = document.cookie.match("_ga=(.+?);") && document.cookie.match("_ga=(.+?);")[1].split(".").slice(-2).join(".");

    }

    // let chatWindowDiv = document.getElementById("rat");

   

    // Saving Client ID in Session
    await sleep(500);
    sessionStorage.setItem("clientId", clientId);
    capturedData["clientId"] = clientId;
    // capturedData.push(clientId);
            if (sessionStorage && sessionStorage.getItem("oldChat") && sessionStorage.getItem("oldChat").length) {
                setTimeout(async() => {
                    // Popup the Bot
                    var modal = document.getElementById("box-toggle");
                    modal.style.display = "none";

                    // Hide the Banner
                    var banner = document.getElementById("banner");
                    banner.style.display = "none";

                    // Hide input unless User asks for Contact Support
                    var inputModal = document.getElementById("inputArea");
                    inputModal.style.display = "none";
                }, 2000);

                // User Responses
                let pasteUser = [];
                if (sessionStorage.getItem("userSays") && sessionStorage.getItem("userSays").length) {
                    pasteUser = JSON.parse(sessionStorage.getItem("userSays"));
                }

                // Restore Chat from Session Storage
                let restoredUserResponses = JSON.parse(sessionStorage.getItem("oldChat"));
                for (let i = 0; i < restoredUserResponses.length; i++) {
                    if (i !== restoredUserResponses.length - 1) {
                        let response = await sendToLex(restoredUserResponses[i], 1);
                        userResponses.push(restoredUserResponses[i]);

                        // Post User Responses
                        postUser(pasteUser[i]);

                        // if (restoredUserResponses[i] === "aMWmS") {
                        //     // Show input if User asks for Contact Support
                        //     var inputModal = document.getElementById("inputArea");
                        //     inputModal.style.display = "block";
                        // }
                    } else {
                        let response = await sendToLex(restoredUserResponses[i], 0);

                        if (restoredUserResponses[i] === "aMWmS") {
                            // Show input if User asks for Contact Support
                            var inputModal = document.getElementById("inputArea");
                            inputModal.style.display = "block";
                        }
                    }
                }
            } else {
                // sendToLex("uRMUR", 0);
                sendFirst("aMWmS", 0); 
                
                    setTimeout(() => {
                        sendToLex("uRMUR", 0);
                    }, 2000);

                    // Prepare the Bot for Discount Showing
                    // setTimeout(() => {
                    //     // Replace Banner Text
                    //     var bannerText = document.getElementsByClassName("chat-popup-widget-text")[0];
                    //     bannerText.innerHTML = "Hey there, I have an Exciting Offer just for you!";

                    //     // Hide input unless User asks for Contact Support
                    //     var inputModal = document.getElementById("inputArea");
                    //     inputModal.style.display = "none";
                    // }, 2000);

                    // setTimeout(() => {
                    //     // Clear the Bot
                    //     var botWindow = document.getElementById("chatWindow");
                    //     botWindow.innerHTML = "";
                    // }, 5000); // Change for Local
 
                    // Verbal Messages Below (For New Customers)
                  if(sessionStorage.getItem("IsThisFirstTime_Log_From_LiveServer") === true){
                    setTimeout(() => {
                        lexHelper("Hi! Glad to see you again :)", "Other", 0);
                    }, 5000);   
                }else {
                    // sendToLex("uRMUR", "Other", 0);
                    // setTimeout(() => {
                    //     lexHelper("Hi!  :)", "Other", 0);
                    // }, 5000);   
                    // Change for Local

                    // setTimeout(() => {
                    //     lexHelper("Thank you for checking out Rieker!", "Other", 0);
                    // }, 6000); // Change for Local

                    // setTimeout(() => {
                    //     lexHelper("We've got a deal just for you!", "Other", 0);
                    // }, 7000); // Change for Local

                        // Date and Time
                        capturedData && !capturedData.length &&  handleDetails();
                    }

                    capturedData && !capturedData.length &&  handleDetails();
}
handleDetails();

if(sessionStorage.getItem("CouponCode") && sessionStorage.getItem("type") && sessionStorage.getItem("action")){
    // let
    // discountPoster();
        lexHelper("We've got a deal just for you!", "Other", 0);
    handleShowBanner()

}else {
    setTimeout(() => {
        clusteringApi()
    }, 5000);
}
}

async function clusteringApi() {
    // sendToLex("uRMUR", 0);
    for (let i = 0; i < capturedData.length; i++) {
        capturedData[i] = capturedData[i] ? capturedData[i] : "";
    };
    let value = sessionStorage.getItem("userDataCapturing");
     console.log(value, 'value');
      value = JSON.parse(value);
      let beforeValues = [];
      let checkValues = ["mens", "womens", 'sandals', "tshirts", "shoes", "ladies", "gents"];
      let unwantedValues = ["https:", "http:", "devrieker.wpengine.com"];
      value &&  value.map(i => {
      let values = i.split("/");
      beforeValues = [...beforeValues, ...values]
      })
      let totalValues = [];
      beforeValues  &&  beforeValues.map(i => {
      let values = i.split("-").length ? i.split("-").slice(1, i.split("-").length-1): []
      totalValues = [...totalValues, ...values]
      })
      let checkValuesForBeforeValues = totalValues && totalValues.length ? totalValues : beforeValues;
      let finalValues = checkValuesForBeforeValues.filter(i => {
      if(i && i.length > 3){
        let values = checkValues.filter(j => {
          if(i.includes(j)){
            return i
          }
        });
        return values
      }
      });

    //   console.log(capturedData , "capturedDatacapturedData")

      let totalFinal = finalValues.filter(j => !unwantedValues.includes(j))
    //   {
    //     "uMedium": "organic",
    //     "uBrowser": "Safari",
    //     "uHour": 12,
    //     "uDeviceBrand": "Apple",
    //     "uOS": "iOS",
    //     "uDeviceType": "mobile",
    //     "uDay": 4,
    //     "clientId": "GA1406292255.1590694355",
    //     "uChannel": "Organic Search",
    //     "uRegion": "British Columbia",
    //     "uYear": 2020,
    //     "uCountry": "Canada",
    //     "uMonth": 5,
    //     "latitude": 123.34,
    //     "longitude": 223.43
    //   }
    const dataToPush = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:  JSON.stringify({
                "clientId": capturedData["clientId"] === "" ? "000.000" : capturedData["clientId"],
                "uHour": capturedData["uHour"] === "" ? "0" : capturedData["uHour"],
                "uDay": capturedData['uDay'] === "" ? "1" : capturedData['uDay'],
                "uDate": capturedData["uDate"] === "" ? "1" : capturedData["uDate"],
                "uMonth": capturedData["uMonth"] === "" ? "1" : capturedData["uMonth"],
                "uYear": capturedData["uYear"] === "" ? "1970" : capturedData["uYear"],
                "uBrowser": capturedData["uBrowser"] === "" ? "Unknown" : capturedData["uBrowser"],
                "uOS": capturedData["uOS"] === "" ? "Unknown" : capturedData["uOS"],
                "uDeviceType": capturedData["uDeviceType"] === "" ? "Unknown" : capturedData["uDeviceType"] && capturedData["uDeviceType"].toLowerCase(),
                "uDeviceBrand": capturedData["uDeviceBrand"] === "" ? "Apple" : capturedData["uDeviceBrand"],
                "latitude": capturedData["uLatitude"] === "" ? "0.0" : capturedData["uLatitude"],
                "longitude": capturedData["uLongitude"] === "" ? "0.0" : capturedData["uLongitude"],
                "uRegion": capturedData["uRegion"] === "" ? "Unknown" : capturedData["uRegion"],
                "uCity": capturedData["uCity"] === "" ? "Unknown" : capturedData["uCity"],
                "uCountry": capturedData["uCountry"] === "" ? "Unknown" : capturedData["uCountry"],
                "uChannel": capturedData["uChannel"] === "" ? "Direct" : capturedData["uChannel"],
                "product_Category": totalFinal ? totalFinal : "",
                "uMedium": capturedData["uMedium"] === "" || capturedData["uMedium"] === "none" ? "(none)" : capturedData["uMedium"] ? capturedData["uMedium"]  : "organic",
                "campaignName": capturedData["campaignName"] === "" ? "Check For Cluster" : capturedData["campaignName"]
            })
    };

     fetch("https://t6mcmorgdb.execute-api.us-east-1.amazonaws.com/ABTestActionSelection/sendToLambda/clusteringData/", dataToPush)
            .then(response => response.json())
            .then(data => discountPoster(data));

}


function discountPoster(data) {
    let Action = data && data.body && data.body.Action ? data.body.Action : " ";
    let  Coupon = data && data.body &&  data.body.Coupon ? data.body.Coupon : " "
    // console.log(Action,Coupon, "CouponCoupon" )
    if(Action === null && Coupon === null){
        return null
    }
    //
    // Debugger
  if(Action[0] === "$"){
      let coupon  = Action.slice(1, Action.length);
      let type = Action.slice(0, 1);
      sessionStorage.setItem("type", "dollar");
      sessionStorage.setItem("value", coupon);
      sessionStorage.setItem("CouponCode", Coupon);
      sessionStorage.setItem("action",Action)
      handleCreateCoupon();
  }else if(Action.slice(0, 3) === "Per"){
    let coupon  = Action.slice(3, Action.length);
      let type = Action.slice(0, 3);
      sessionStorage.setItem("type", "percent");
      sessionStorage.setItem("value", coupon)
      sessionStorage.setItem("CouponCode", Coupon)
      sessionStorage.setItem("action",Action)
      handleCreateCoupon()
  }else if(Action === "Free Shipping") {
    sessionStorage.setItem("CouponCode", Coupon)
    sessionStorage.setItem("type", "Free Shipping");
    sessionStorage.setItem("action",Action)
    handleCreateCoupon()
  }    
}


const handleCreateCoupon = async() => {

    setTimeout(() => {
            lexHelper("We've got a deal just for you!", "Other", 0);
        }, 7000)

    let obj = {
        "code": sessionStorage.getItem("CouponCode") ? sessionStorage.getItem("CouponCode") :  "",
        "amount": sessionStorage.getItem("value"), // For Demo
        "discount_type" : sessionStorage.getItem("type"),
        "minimum_amount": "00.00",
        "usage_limit": "1",
        "usage_limit_per_user": "1",
        "individual_use": "true"
    }
    if(sessionStorage.getItem("type") === "Free Shipping") {
        obj.free_shipping = true
    } 
    const newCoupon = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    };

    // Making POST Request to API to Add the Coupon
    await fetch("https://devrieker.wpengine.com/wp-json/wc/v2/coupons?consumer_key=ck_82693c4b5e150815246ac85955841c4ff2c51d20&consumer_secret=cs_69eef53fe6658952899a3d6347a4095c31d5dd0f", newCoupon)
        .then(response => response.json())
        .then(data => updateCouponWithExpiry(data.id)); 

        
}

// First function to Send Hello to Lex
function sendFirst(hello, flag, hasCoupon, t) {
    // Debugger
    // console.log(hello);
    // console.log(flag);
    // console.log(hasCoupon);
    // console.log(t);

    // Save User Responses to Session Storage
    // For Demo Commented these
    // userResponses.push(hello);
    // sessionStorage.setItem("oldChat", JSON.stringify(userResponses));

    // Check if Bot already opened by User
    var modal = document.getElementById("box-toggle");

    // If Bot is not opened
    if (modal.style.display !== "block") {
        // Show the Banner
        var banner = document.getElementById("banner");
        banner.style.display = "block";

        // Auto Click for making Document Ready
        document.getElementById("ready").click();
        document.getElementById("ready").click();

        // Greet User by Playing PopUp Sound
        var PopUp = new Audio();
        PopUp.src = "./Resources/PopUp.mp3";
        PopUp.play();
    }
// Variable time for Different Scenarios

    // Hide input unless User asks for Contact Support
    var inputModal = document.getElementById("inputArea");
    inputModal.style.display = "none";

    // Transfer Parameters with Bot Details on AWS Lex, Input Type and User ID
    let params = {
        botAlias: "button_bot",
        botName: "ButtonBOT",
        inputText: hello,
        userId: lexUserId,
    }

    // Calls the Bot instance if no errors are there
    lexRunTime.postText(params, (e, helloMessage) => {
        // If an error happens, Show error
        if (e) {
            // Debugger
            // console.log(e);

            // Rieker Exclusive
            let error = "Unknown error Occured. Please report the issue to the Rieker Support";
            sendFirst(hello, flag, hasCoupon, t + 2000);
        }

        // If there is data, Send it to Bot
        if (helloMessage) {
            // Debugger
            // console.log(lexResponse);

            // For Demo Commented Out
            // lexHelper(helloMessage, "first", flag);

            setTimeout(() => {
                // If bot is already Opened by the User
                var mod = document.getElementById("box-toggle");

                if (mod.style.display === "none") {

                    // Popup the Bot
                    var modal = document.getElementById("box-toggle");
                    modal.style.display = "block";

                    // Hide the Banner
                    var banner = document.getElementById("banner");
                    banner.style.display = "none";

                    // Auto Click for making Document Ready
                    document.getElementById("ready").click();
                    document.getElementById("ready").click();

                    // Greet User by Playing PopUp Sound
                    var PopUp = new Audio();
                    PopUp.src = "./Resources/PopUp.mp3";
                    PopUp.play();
                }
            }, 3000);
        }
    });
}

// Main function to Send Instructions to Lex
async function sendToLex(message, flag) {
    // Save User Responses to Session Storage
    if (flag === 0) {
        userResponses.push(message);
        sessionStorage.setItem("oldChat", JSON.stringify(userResponses));
    }

    // Debugger
    // console.log(message);
    // console.log(flag);

    // Transfer Parameters with Bot Details on AWS Lex, Input Type and User ID
    let params = {
        botAlias: "button_bot",
        botName: "ButtonBOT",
        inputText: message,
        userId: lexUserId,
    }

    // Calls the Bot instance if no errors are there
    let response = new Promise((res, rej) => {
        lexRunTime.postText(params, (e, lexResponse) => {
            // If an error happens, Show error
            if (e) {
                // Debugger
                // console.log(e);

                // Rieker Exclusive
                let error = "Unknown error Occured. Please report the issue to the Rieker Support";
                sendToLex(message, flag);
            }

            // If there is data, Send it to Bot
            if (lexResponse) {
                // Debugger
                // console.log(lexResponse);
                res(lexResponse)
                lexHelper(lexResponse, "other", flag);
            }
        })
    });
    let result = await response;
    return result;
}

// To Hide the Banner
function hideBanner() {
    var banner = document.getElementById("banner");
    banner.style.display = "none";
    var cross = document.getElementById("cross");
    cross.style.display = "none";
}

// To Toggle the Visibility of Banner Cross button
function toggleCross() {
    var cross = document.getElementById("cross");
    if (cross.style.display) {
        cross.style.display = ((cross.style.display != "none") ? "none" : "block");
    } else {
        cross.style.display = "block";
    }
}

function openBot() {
    // Popup the Bot
    var modal = document.getElementById("box-toggle");
    modal.style.display = "block";

    // Hide the Banner
    var banner = document.getElementById("banner");
    banner.style.display = "none";
}

// Region, City & Country (Reverse GeoCoding API) #10000 Requests per Day (FREE)
// async function getRegion(latitude, longitude, type) {
//     // Debugger
//     // console.log(latitude);
//     // console.log(longitude);
//         jQuery(function($) {
//             $.get("https://us1.locationiq.com/v1/reverse.php?key=ec33f262d124e6&lat=" + latitude + "&lon=" + longitude + "&format=json", function(response) {
//                 let uRegion = response.address.state;
//                 let uCity = response.address.city;
//                 let uCountry = response.address.country;

//                 capturedData.push(uRegion);
//                 capturedData.push(uCity);
//                 capturedData.push(uCountry);
//             })
//         });

//         // Push Matched Campaign Name if it is there
//         let whatCampaign = sessionStorage && sessionStorage.getItem("campaignName") && sessionStorage.getItem("campaignName").length ? sessionStorage.getItem("campaignName") : "";
//         capturedData.push(whatCampaign);
// }

// For Production
// Checking if Coupon was not assigned and user went on to the page


    // For Local
    // async function afterTransaction() {

    // Checking if transaction is made even before the Coupon was assigned
    if (sessionStorage && sessionStorage.getItem("userDiscount") && sessionStorage.getItem("userDiscount").length) {

        // Checking whether it is a Reward or Penalty for RL Model
        let newStatus;

        // For Local
        // let idToCheck = "couponCodeApplied";
        // let appliedCoupon = document.getElementById(idToCheck).value;
        // if (appliedCoupon === sessionStorage.getItem("userDiscount")) {

        // For Production
        let idToCheck = "coupon_code";
        let appliedCoupon = sessionStorage.getItem("appliedCoupon");
        if (appliedCoupon === sessionStorage.getItem("userDiscount").toLowerCase()) {
            newStatus = 1;
        } else {
            newStatus = -1;
        }

        // Creating Object with Status to be Updated
        const newStatusObject = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "clientId": sessionStorage.getItem("clientId"),
                "newStatus": newStatus
            })
        };

        // Making POST Request to API to Update the DB through Lambda
       fetch("https://t6mcmorgdb.execute-api.us-east-1.amazonaws.com/ABTestActionSelection/sendToLambda/changeTransactionData", newStatusObject);
    }

// Restore Bot Conversation if Navigation Happened
restoreBotConv();

// User Side Messages
let userSays = [];

// Default state of Bot Popup
let popUpState = false;

// Global Flag
let gFlag;

// For removing the repeated nudges
let nudgeRemover = "";

// Regex for URLs
var urlCheck = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

// Toggle the state of Chatbot Visibility
function popUpToggle() {
    var modal = document.getElementById("box-toggle");
    // Debugger
    // console.log(modal);

    if (modal.style.display) {
        modal.style.display = ((modal.style.display != "none") ? "none" : "block");
    } else {
        modal.style.display = "block";
    }

    // Scroll to Bottom
    scrollToBottom();
}

// Scroll Down to Bottom
function scrollToBottom() {
    const whatScroll = document.getElementById("chatWindow");
    whatScroll.scrollTop = whatScroll.scrollHeight;
}

// Function to change the message to show the link if there is any
function highlightLinkInMessage(text, start) {
    // Debugger
    // console.log(text);
    // console.log(start);

    var index = text.indexOf(start);
    var ending = text.length;
    let innerHTML = ` ${text.substring(0, index)} <a target="_blank" rel="noreferrer" style="color: inherit;" href="${text.substring(index, ending)}"> ${text.substring(index, ending)}</a>`;
    // Debugger
    // console.log(innerHTML);

    return innerHTML;
}

async function updateCouponWithExpiry(id) {
    await sleep(1000);

    // Debugger
    // console.log(id);

    // Calculate Expiry Date and Time (15 Minutes Expiry)
    let dateObject = new Date();
    dateObject.setMinutes(dateObject.getMinutes() + 60);
    let Expiry = dateObject.toISOString().slice(0, -5);

    // Making the Updated Coupon
    const updatedCoupon = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "date_expires": Expiry,
            "date_expires_gmt": Expiry
        })
    };

     id = id && id.toString();

    // Making POST Request to API to Update the Coupon
   let response = await fetch("https://devrieker.wpengine.com/wp-json/wc/v2/coupons/" + id  + "?consumer_key=ck_82693c4b5e150815246ac85955841c4ff2c51d20&consumer_secret=cs_69eef53fe6658952899a3d6347a4095c31d5dd0f", updatedCoupon).catch( err => err.text().then(errorMessage => {
    console.log(errorMessage, "errorMessage")
  }))

  handleShowBanner()
}

async function lexHelper(data, type, flag) {
    // Debugger
    // console.log(data);
    // console.log(type);
    // console.log(flag);

    // Setting Global Flag
    gFlag = JSON.parse(JSON.stringify(flag));

    // Assigning Inactivity limit according to type
    let iaTime =  60;
    // let iaTime  = 15

    // Resetting Nudge Checker
    nudgeRemover = "";

    // Getting Parameters from Lex Response
    let { responseCard, message } = data;
    let intentName = data.intentName;

    // For Coupon Code PopUp
    message = data && data.message && data.message.length ? data.message : data;

    // Storing the Assigned Coupon
    couponShown = data && data.message && data.message.length ? "" : data;

    // If the Message is not a Coupon Message (Rieker/Inteliyo Exclusive)
    if (couponShown === "Hi!" || couponShown === "Hi! Glad to see you again :)" || couponShown === "Thank you for checking out Rieker!" || couponShown === "We've got a deal just for you!" || couponShown[0] === "W") {
        couponShown = "";
    }

    if (couponShown !== "") {
        // Extract the Coupon code from the Original Message
        message = message.slice(0, 12) + " " + message.slice(26, message.length - 1) + ".";

        // Setting Assigned Coupon in Session Storage
        userDiscount = couponShown.toString().slice(13, 25);
        sessionStorage.setItem("userDiscount", userDiscount);

            sessionStorage.setItem("couponAssigned", "1");

            // Check if Free shipping is needed
            // if (sessionStorage && sessionStorage.getItem("freeShipping") && sessionStorage.getItem("freeShipping") !== "1") {
            //     // Making a New Coupon
            //     const newCoupon = {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({
            //             "code": sessionStorage.getItem("CouponCode") ? sessionStorage.getItem("CouponCode") :  userDiscount,
            //             "discount_type": sessionStorage.getItem("type"), // For Demo
            //             "amount": sessionStorage.getItem("value"), // For Demo
            //             "minimum_amount": "00.00",
            //             "usage_limit": "1",
            //             "usage_limit_per_user": "1",
            //             "individual_use": "true"
            //         })
            //     };

            //     // Making POST Request to API to Add the Coupon
            //     await fetch("https://devrieker.wpengine.com/wp-json/wc/v2/coupons?consumer_key=ck_82693c4b5e150815246ac85955841c4ff2c51d20&consumer_secret=cs_69eef53fe6658952899a3d6347a4095c31d5dd0f", newCoupon)
            //         .then(response => response.json())
            //         .then(data => updateCouponWithExpiry(data.id)); // Updating Expiry for Coupon
            // } else {
            //     // Making a New Coupon
            //     const newCoupon = {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({
            //             "code": sessionStorage.getItem("CouponCode") ? sessionStorage.getItem("CouponCode") :  userDiscount,
            //             "free_shipping": "true",
            //             "discount_type": sessionStorage.getItem("type"),
            //             "description": sessionStorage.getItem("campaignName"),
            //             "amount": sessionStorage.getItem("value"),
            //             "minimum_amount": sessionStorage.getItem("minValue"),
            //             "usage_limit": "1",
            //             "usage_limit_per_user": "1",
            //             "individual_use": "true"
            //         })
            //     };

            //     // Making POST Request to API to Add the Coupon
            //     await fetch("https://devrieker.wpengine.com/wp-json/wc/v2/coupons?consumer_key=ck_82693c4b5e150815246ac85955841c4ff2c51d20&consumer_secret=cs_69eef53fe6658952899a3d6347a4095c31d5dd0f", newCoupon)
            //         .then(response => response.json())
            //         .then(data => updateCouponWithExpiry(data.id)); // Updating Expiry for Coupon
            // }
    }

    // Rieker Exclusive
    // For COVID Notice
    let covidMessage = (message === "1-2 business day for Ontario & Quebec. 3-7 business days for West and East Coast. 7-14 business days for remote Canadian locations. Express and priority post are available for an additional charge at time of checkout. This will give delivery 1-2 business days, Canada-wide.") ? "NOTICE : Dear Valued Customer, Rieker Canada will continue to ensure that distribution and online support is available to you. Due to COVID-19 there will be longer than normal processing times, which will affect shipping. We ask for your patience as we closely monitor the situation. Please note: For your convenience, online sales will have FREE shipping and FREE returns on all orders. We thank you in advance for your patience and cooperation during this uncertain time. Kind Regards, Rieker Canada Team" : "";

    if (responseCard &&
        responseCard.genericAttachments &&
        responseCard.genericAttachments[0]) {
        getResponseCardContents(responseCard.genericAttachments[0], intentName);
    }

    // If only message is there, Render it by using tags
    else if (message) {
        // Debugger
        // console.log(message);

        let modifiedInnerHTML = message;

        if (message !== "Please enter your name." && message !== "Thank you! Please enter your email address as well." && message !== "To Submit your Request to our Customer Service Team, Please type your Question below. If you are Inquiring about a Current Order, Please include your Order Number.") {
            // Hide input unless User asks for Customer Support
            var iModal = document.getElementById("inputArea");
            iModal.style.display = "none";
        }

        // Check if the message contains link
        if (message.match(urlCheck)) {
            modifiedInnerHTML = highlightLinkInMessage(message, "http");
        }
        // Debugger
        // console.log(message.match(urlCheck));
        // console.log(modifiedInnerHTML);

        const chatWindowDiv = document.getElementById("chatWindow");

        let botDiv = document.createElement("div");
        botDiv.setAttribute("class", "botResponse");

        let botMsgDiv = document.createElement("div");
        botMsgDiv.setAttribute("class", "botMessage");

        let botMsg = document.createElement("p");
        botMsg.innerHTML = modifiedInnerHTML;

        botMsgDiv.appendChild(botMsg);
        botDiv.appendChild(botMsgDiv);

        // Rieker Exclusive
        // For COVID Notice
        if (covidMessage !== "") {
            let covidBotMsgDiv = document.createElement("div");
            covidBotMsgDiv.setAttribute("class", "botMessage");

            let covidBotMsg = document.createElement("p");
            covidBotMsg.innerHTML = covidMessage;

            covidBotMsgDiv.appendChild(covidBotMsg);
            botDiv.appendChild(covidBotMsgDiv);
        }

        // Logic for Reveal & Copy and Checkout with this Coupon

        // Ignore for Bunched messages as in the Discount messages
        if (modifiedInnerHTML !== "Hi!" && modifiedInnerHTML !== "Hi! Glad to see you again :)" && modifiedInnerHTML !== "Thank you for checking out Rieker!" && modifiedInnerHTML !== "We've got a deal just for you!" && modifiedInnerHTML[0] !== "W") {
            // Get Current Timestamp in IST (These are for Bot Side only, not User Side)
            var myUserDate = new Date();

            var userHours = myUserDate.getHours();
            var userAmPm = userHours >= 12 ? "PM" : "AM";
            userHours %= 12;
            userHours = userHours ? userHours : 12;

            var userMinutes = myUserDate.getMinutes();
            userMinutes = userMinutes < 10 ? "0" + userMinutes : userMinutes;

            var myUserTime = userHours + ":" + userMinutes + " " + userAmPm;

            // Debugger
            // console.log(myUserTime);

            // Adding time to View and Assigning a "class"
            let userTime = document.createElement("div");
            userTime.setAttribute("class", "botTime");

            let userTimeElement = document.createElement("p");
            userTimeElement.innerHTML = myUserTime;

            // Appending Timestamp and Message to Bot Response
            userTime.appendChild(userTimeElement);
            botDiv.appendChild(userTime);
        }

        chatWindowDiv.appendChild(botDiv);

        // Check for User Inactivity, Based on this Restart the conversation or Say him Thank you.
        if (message != "Please enter your name." && message != "Thank you! Please enter your email address as well." && message != "To Submit your Request to our Customer Service Team, Please type your Question below. If you are Inquiring about a Current Order, Please include your Order Number.") {
            // Debugger
            // console.log(message);

            if (message === "Thanks for helping me out with the details. Our team will get in touch with you soon :)") {
                // Hide input unless User asks for Customer Support
                var iModal = document.getElementById("inputArea");
                iModal.style.display = "none";
            }

            var idleTime = 0;
            jQuery(document).ready(function($) {
                // Increment the idle time counter every second.
                var idleInterval = setInterval(timerIncrement, 1000);

                // Zero the idle timer on mouse movement.
                $(this).mousemove(function(e) {
                    idleTime = 0;
                });
                $(this).keypress(function(e) {
                    idleTime = 0;
                });
            });


            // setTimeout(() => {
            //     timerIncrement()
            // }, 15000);
            function timerIncrement() {
                idleTime += 1;
                if (idleTime > iaTime && nudgeRemover != "Hey there! Is there anything else we can help you with?" && nudgeRemover != "Alright! Thanks for letting me know. If you need my help, you can check out the FAQ section. Happy Shopping :)") {
                    var modal = document.getElementById("chatWindow");
                    if (modal.style.display === "block") {
                        // Auto Click for making Document Ready
                        document.getElementById("ready").click();
                        document.getElementById("ready").click();

                        // Remind User by Playing PopUp Sound
                        var remindUser = new Audio();
                        remindUser.src = "./Resources/PopUp.mp3";
                        remindUser.play();
                    }

                    const chatWinDiv = document.getElementById("chatWindow");

                    let btDiv = document.createElement("div");
                    btDiv.setAttribute("class", "botResponse");

                    let btMsgDiv = document.createElement("div");
                    btMsgDiv.setAttribute("class", "botMessage");

                    let btMsg = document.createElement("p");
                    btMsg.innerHTML = "Hey there! Is there anything else we can help you with?";
                    nudgeRemover = btMsg.innerHTML;

                    let btnDiv = document.createElement("div");
                    btnDiv.setAttribute("class", "buttonDiv");

                    // If User Presses "Yes", We show FAQs again
                    let yesButton = document.createElement("button");
                    yesButton.innerHTML = "Yes";
                    yesButton.setAttribute("id", "yesButton");
                    yesButton.setAttribute("class", "botButton");

                    yesButton.addEventListener("click",
                        function() {
                            postUserResponse(yesButton.innerHTML);
                            sendToLex("uRMUR", 0);
                        });

                    // Show the button in pressed state
                    yesButton.addEventListener("click",
                        function() {
                            yesButton.removeAttribute("class");
                            yesButton.setAttribute("class", "botButtonPressed");
                        });

                    // If User Presses "No", We show "Thank you" message
                    let noButton = document.createElement("button");
                    noButton.innerHTML = "No";
                    noButton.setAttribute("id", "noButton");
                    noButton.setAttribute("class", "botButton");

                    noButton.addEventListener("click",
                        function() {
                            postUserResponse(noButton.innerHTML);
                            const chatWiniDiv = document.getElementById("chatWindow");

                            let btiDiv = document.createElement("div");
                            btiDiv.setAttribute("class", "botResponse");

                            let btiMsgDiv = document.createElement("div");
                            btiMsgDiv.setAttribute("class", "botMessage");

                            let btiMsg = document.createElement("p");
                            btiMsg.innerHTML = "Alright! Thanks for letting me know. If you need my help, you can check out the FAQ section. Happy Shopping :)";
                            nudgeRemover = btiMsg.innerHTML;

                            let btniDiv = document.createElement("div");
                            btniDiv.setAttribute("class", "buttonDiv");

                            // If User Presses this, We show FAQs again
                            let againButton = document.createElement("button");
                            againButton.innerHTML = "I have another Question";
                            againButton.setAttribute("id", "againButton");
                            againButton.setAttribute("class", "botButton");

                            againButton.addEventListener("click",
                                function() {
                                    postUserResponse(againButton.innerHTML);
                                    sendToLex("uRMUR", 0);
                                });

                            // Show the button in pressed state
                            againButton.addEventListener("click",
                                function() {
                                    againButton.removeAttribute("class");
                                    againButton.setAttribute("class", "botButtonPressed");
                                });

                            btiMsgDiv.appendChild(btiMsg);
                            btiDiv.appendChild(btiMsgDiv);

                            // Get Current Timestamp in IST
                            var myDate = new Date();

                            var hours = myDate.getHours();
                            var ampm = hours >= 12 ? "PM" : "AM";
                            hours %= 12;
                            hours = hours ? hours : 12;

                            var minutes = myDate.getMinutes();
                            minutes = minutes < 10 ? "0" + minutes : minutes;

                            var myTime = hours + ":" + minutes + " " + ampm;

                            // Debugger
                            // console.log(myTime);

                            // Adding time to View and Assigning a "class"
                            let time = document.createElement("div");
                            time.setAttribute("class", "botTime");
                            let timeElement = document.createElement("p");
                            timeElement.innerHTML = myTime;
                            time.appendChild(timeElement);

                            btniDiv.appendChild(againButton);
                            btiDiv.appendChild(btniDiv);
                            btiDiv.appendChild(time);
                            chatWiniDiv.appendChild(btiDiv);

                            scrollToBottom();
                        });

                    // Show the button in pressed state
                    noButton.addEventListener("click",
                        function() {
                            noButton.removeAttribute("class");
                            noButton.setAttribute("class", "botButtonPressed");
                        });

                    btMsgDiv.appendChild(btMsg);
                    btDiv.appendChild(btMsgDiv);
                    btnDiv.appendChild(yesButton);
                    btnDiv.appendChild(noButton);
                    btDiv.appendChild(btnDiv);

                    // Get Current Timestamp in IST
                    var myDate = new Date();

                    var hours = myDate.getHours();
                    var ampm = hours >= 12 ? "PM" : "AM";
                    hours %= 12;
                    hours = hours ? hours : 12;

                    var minutes = myDate.getMinutes();
                    minutes = minutes < 10 ? "0" + minutes : minutes;

                    var myTime = hours + ":" + minutes + " " + ampm;

                    // Debugger
                    // console.log(myTime);

                    // Adding time to View and Assigning a "class"
                    let time = document.createElement("div");
                    time.setAttribute("class", "botTime");
                    let timeElement = document.createElement("p");
                    timeElement.innerHTML = myTime;
                    time.appendChild(timeElement);

                    btDiv.appendChild(time);
                    chatWinDiv.appendChild(btDiv);

                    scrollToBottom();
                }
            }
        }

        scrollToBottom();
    }
}

function getResponseCardContents(attachments, intentName) {
    // Debugger
    // console.log(attachments);
    // console.log(intentName);

    // Hide input unless User asks for Customer Support
    var iModal = document.getElementById("inputArea");
    iModal.style.display = "none";

    // Getting Title from Response Card
    let title = attachments.title ? attachments.title : "";
    // Debugger
    // console.log(title);

    // Making Title Element with Contents and Assigning a "class"
    const parentDiv = document.getElementById("chatWindow");

    const childDiv = document.createElement("div");
    childDiv.setAttribute("class", "botResponse");

    let titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "botMessage");

    let titleElement = document.createElement("p");
    titleElement.innerHTML = title;

    titleDiv.appendChild(titleElement);
    childDiv.appendChild(titleDiv);

    // Getting Subtitle from Response Card
    let subTitle = attachments.subTitle ? attachments.subTitle : "";
    // Debugger
    // console.log(subTitle);

    // Making Subtitle Element with Contents and Assigning a "class"
    let subTitleDiv = document.createElement("div");
    subTitleDiv.setAttribute("class", "botMessage");

    let subTitleElement = document.createElement("p");
    subTitleElement.innerHTML = subTitle;

    subTitleDiv.appendChild(subTitleElement);
    childDiv.appendChild(subTitleDiv);

    // Getting Buttons from Response Card
    let buttons = attachments.buttons ? attachments.buttons : [];
    // Debugger
    // console.log(buttons);

    // Fetching Buttons one by one, Making Button elements & Setting contents
    // Settting an "id" and a "class" to each one of them, and Appending to Parent
    let buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "buttonDiv");

    for (let i = 0; i < buttons.length; i++) {
        let button = document.createElement("button");
        button.innerHTML = buttons[i].text;
        button.setAttribute("id", buttons[i].value);
        button.setAttribute("class", "botButton");
        buttonDiv.appendChild(button);

        button.addEventListener("click",
            function() {
                data = document.getElementById(buttons[i].value).getAttribute("id");
                // Debugger
                // console.log(data);

                // Post User Message Making and Appending tags after Data Insertion
                postUserResponse(buttons[i].text);

                // Sending button query to Lex
                sendToLex(data, 0);
            });

        // Show the button in pressed state
        button.addEventListener("click",
            function() {
                button.removeAttribute("class");
                button.setAttribute("class", "botButtonPressed");
            });

        if (buttons[i].value === "aMWmS") {
            button.addEventListener("click",
                function() {
                    // Show input when User asks for Contact Support
                    var inputcsModal = document.getElementById("inputArea");
                    inputcsModal.style.display = "block";
                    jQuery(function($) {
                        $("#inputArea").focus();
                    });
                });
        }
    }

    // Adding missing button
    if (intentName === "faqs_intent") {
      console.log("faqintent")
        let buttonAdd = document.createElement("button");
        buttonAdd.innerHTML = "Contact Support";
        buttonAdd.setAttribute("id", "aMWmS");
        buttonAdd.setAttribute("class", "botButton");
        buttonDiv.appendChild(buttonAdd);

        buttonAdd.addEventListener("click",
            function() {
                data = document.getElementById("aMWmS").getAttribute("id");
                // Debugger
                // console.log(data);

                // Post User Message Making and Appending tags after Data Insertion
                postUserResponse(buttonAdd.innerHTML);

                // Sending button query to Lex
                sendToLex(data, 0);
            });

        // Show the button in pressed state
        buttonAdd.addEventListener("click",
            function() {
                buttonAdd.removeAttribute("class");
                buttonAdd.setAttribute("class", "botButtonPressed");
            });

        buttonAdd.addEventListener("click",
            function() {
                // Show input unless when asks for Contact Support
                var inputCSModal = document.getElementById("inputArea");
                inputCSModal.style.display = "block";
                jQuery(function($) {
                    $("#inputArea").focus();
                });
            });
    }

    // Get Current Timestamp in IST
    var myDate = new Date();

    var hours = myDate.getHours();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours ? hours : 12;

    var minutes = myDate.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;

    var myTime = hours + ":" + minutes + " " + ampm;

    // Debugger
    // console.log(myTime);

    // Adding time to View and Assigning a "class"
    let time = document.createElement("div");
    time.setAttribute("class", "botTime");
    let timeElement = document.createElement("p");
    timeElement.innerHTML = myTime;
    time.appendChild(timeElement);

    // Appending Buttons and Timestamp to Bot Response
    childDiv.appendChild(buttonDiv);
    childDiv.appendChild(time);

    // Appending Bot Response to Chat Window
    parentDiv.appendChild(childDiv);
    scrollToBottom();
}

function postUserResponse(data) {
    // Debugger
    // console.log(data);

    // Save to User Side Messages
    userSays = sessionStorage && sessionStorage.getItem("userSays") ? JSON.parse(sessionStorage.getItem("userSays")) : [];
    userSays.push(data);
    sessionStorage.setItem("userSays", JSON.stringify(userSays));

    const chatDiv = document.getElementById("chatWindow");

    let userElement = document.createElement("div");
    userElement.setAttribute("class", "userResponse");

    let userDiv = document.createElement("div");
    userDiv.setAttribute("class", "userMessage");

    let userMessage = document.createElement("p");
    userMessage.innerHTML = data;

    userDiv.appendChild(userMessage);
    userElement.appendChild(userDiv);

    // Get Current Timestamp in IST
    var myUserDate = new Date();

    var userHours = myUserDate.getHours();
    var userAmPm = userHours >= 12 ? "PM" : "AM";
    userHours %= 12;
    userHours = userHours ? userHours : 12;

    var userMinutes = myUserDate.getMinutes();
    userMinutes = userMinutes < 10 ? "0" + userMinutes : userMinutes;

    var myUserTime = userHours + ":" + userMinutes + " " + userAmPm;

    // Debugger
    // console.log(myUserTime);

    // Adding time to View and Assigning a "class"
    let userTime = document.createElement("div");
    userTime.setAttribute("class", "userTime");

    let userTimeElement = document.createElement("p");
    userTimeElement.innerHTML = myUserTime;

    // Appending Timestamp to User Response
    userTime.appendChild(userTimeElement);
    userElement.appendChild(userTime);

    chatDiv.appendChild(userElement);
    scrollToBottom();
}

function submitFunction() {
    // Fetching Parent element
    let message = document.getElementById("inputValue").value;
    if (message.length) {
        // Appending User message, Current time and Sending query to Lex
        postUserResponse(message);
        sendToLex(message, gFlag);
    }

    // Clearing text box
    message = document.getElementById("inputValue");
    message.value = "";
}
