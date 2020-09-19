// *** flag variable just denotes whether the Chat is restored (1) or new (0) ***
// Catch all User Responses
let userResponses = [];

// Captured Data to be Sent to the Clustering Lambda through API
let capturedData = [];

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

// Dummy Object
let hasCoupon = {
    "expired": 0,
    "assigned": 0,
    "Action": "10% Off",
    "Coupon": "PE10OFFERJUL"
};

// Dummy condition
let clientCondition = "";

// Sleep Function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// To Save the Response about Coupon
async function saveToHasCoupon(data) {
    // Debugger
    // console.log(data);

    hasCoupon = data;

    await sleep(1000);
}

// Function to Match Clusters
async function checkCluster(clusterId) {
    // Debugger
    // console.log(clusterId);

    if (clusterId === sessionStorage.getItem("clientCluster")) {
        sessionStorage.setItem("clusterIt", "1");
    }

    await sleep(500);
}

// Function to Check whether the User is New or Not (Special Condition)
async function checkForNew(status) {
    // Debugger
    // console.log(status);

    // Determining Actual Customer Type
    let actualCustomer = "";
    if (status === "1") {
        if (!hasCoupon.assigned && !hasCoupon.expired) {
            actualCustomer = "New";
        } else {
            actualCustomer = "Returning";
        }
    } else {
        actualCustomer = "New";
    }

    sessionStorage.setItem("actualCustomer", actualCustomer);

    await sleep(500);
}

// Function to set Status
function setAllowance(status) {
    // Debugger
    // console.log(status);

    sessionStorage.setItem("clusterIt", status);
}

// Variable with Discount Type and Value
let discount;

// Function to Check which Campaign the User is Falling in
async function setClientCondition(data) {
    data = JSON.stringify(data);
    console.log(JSON.parse(JSON.stringify(JSON.parse(data))), "data123....");
    console.log(data.selectedSegments)
    // Debugger
    // console.log(data);

    // Dummy Allowance
    sessionStorage.setItem("clusterIt", "0");

    // For Ambiguous Choices Choose the First Matching Item
    // Check for All possible conditions
    for (let i = 0; i < data.length; i++) {
        clientCondition = data[i].header;
        // console.log("hehehehe")
        if (clientCondition === "Random") {
            console.log("hehehehe")
            // Choose between 0 or 1
            let min = 0;
            let max = 1;
            let random = Math.floor(Math.random() * (+max + 1 - +min)) + +min;

            // Setting Random Allowance
            sessionStorage.setItem("clusterIt", random.toString());

            // Allow These and Set Discount and Campaign Name
            if (sessionStorage.getItem("clusterIt") === "1") {
                sessionStorage.setItem("campaignName", data[i].campaignName);
                discount = data[i].selectedSalesPromotion;
                break;
            }
        } else if (clientCondition === "Customer Type") {
            console.log("clientCondition")
            // Getting Clients type
            let clientCustomer = "";
            if (data[i].label === "First-Time User") {
                clientCustomer = "New";
            } else {
                clientCustomer = "Returning Customer";
            }

            // For New Customers Condition
            if (clientCustomer === "New") {

                // Creating Object with ClientId to get the ClientId (New/Returning) Status
                const clientObject = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "clientId": sessionStorage.getItem("clientId")
                    })
                };

                // Making POST Request to API to Get the ClientId (New/Returning) Status
                await fetch("https://t6mcmorgdb.execute-api.us-east-1.amazonaws.com/ABTestActionSelection/", clientObject)
                    .then(response => response.json())
                    .then(data => checkForNew(data.body.status.toString()));

                // Allow These and Set Discount and Campaign Name
                if (clientCustomer === sessionStorage.getItem("actualCustomer")) {
                    sessionStorage.setItem("clusterIt", "1");
                    sessionStorage.setItem("campaignName", data[i].campaignName);
                    discount = data[i].selectedSalesPromotion;
                    break;
                }
            }

            // For Returning Customers Condition
            else {
                console.log("clientCondition1234")
                // Creating Object with ClientId to get the ClientId (New/Returning) Status
                const clientObject = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "clientId": sessionStorage.getItem("clientId")
                    })
                };

                // Making POST Request to API to Get the ClientId (New/Returning) Status
                await fetch("https://t6mcmorgdb.execute-api.us-east-1.amazonaws.com/ABTestActionSelection/", clientObject)
                    .then(response => response.json())
                    .then(data => setAllowance(data.body.status.toString()));

                // Allow These and Set Discount and Campaign Name
                if (sessionStorage.getItem("clusterIt") === "1") {
                    sessionStorage.setItem("campaignName", data[i].campaignName);
                    discount = data[i].selectedSalesPromotion;
                    break;
                }
            }
        } else if (clientCondition === "Device Type") {
            // Getting User Device Type
            let uDeviceType = FRUBIL.device.class;

            // For Our Case
            if (data[i].label === "PC / Laptop") {
                data[i].label = "Desktop";
            }

            // Allow These and Set Discount and Campaign Name
            if (uDeviceType === data[i].label) {
                sessionStorage.setItem("clusterIt", "1");
                sessionStorage.setItem("campaignName", data[i].campaignName);
                discount = data[i].selectedSalesPromotion;
                break;
            }
        } else if (clientCondition === "Custom Clusters") {
            let clusterId = "";

            // Setting Cluster ID to the Variable
            if (data[i].label === "High Session Time") {
                clusterId = "1";
            } else if (data[i].label === "Low Bounce Rate") {
                clusterId = "2";
            } else {
                clusterId = "3";
            }

            // Setting the Variable to Session
            sessionStorage.setItem("clientCluster", clusterId);

            // Passing the Data through Clustering Model to Get the Cluster
            if (sessionStorage && sessionStorage.getItem("oldChat") && sessionStorage.getItem("oldChat").length && !(sessionStorage.getItem("couponAssigned") && (sessionStorage.getItem("couponAssigned") === "1"))) {
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

                        if (restoredUserResponses[i] === "aMWmS") {
                            // Show input if User asks for Contact Support
                            var inputModal = document.getElementById("inputArea");
                            inputModal.style.display = "block";
                        }
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
                // Rieker/Inteliyo Exclusive
                // For Local
                // Make Transaction testing button and Coupon input area visible
                // setTimeout(() => {
                //     let mod = document.getElementById("transaction");
                //     mod.style.display = "block";
                // }, 2000);

                // If Coupon has Expired
                if (hasCoupon.expired) {
                    // Initializing the Bot using a "Hello" message after 1 second
                    // uRMUR is basically "hello" for our bot
                    setTimeout(() => {
                        sendFirst("uRMUR", 0, hasCoupon, 5000); // Change for Local
                    }, 2000);

                    // Prepare the Bot for Discount Showing
                    setTimeout(() => {
                        // Replace Banner Text
                        var bannerText = document.getElementsByClassName("chat-popup-widget-text")[0];
                        bannerText.innerHTML = "Hey there, I have an Exciting Offer just for you!";

                        // Hide input unless User asks for Contact Support
                        var inputModal = document.getElementById("inputArea");
                        inputModal.style.display = "none";
                    }, 2000);

                    setTimeout(() => {
                        // Clear the Bot
                        var botWindow = document.getElementById("chatWindow");
                        botWindow.innerHTML = "";
                    }, 5000); // Change for Local


                    // Verbal Messages Below (For New Customers)
                    setTimeout(() => {
                        lexHelper("Hi! Glad to see you again :)", "Other", 0);
                    }, 5000); // Change for Local

                    setTimeout(() => {
                        lexHelper("Thank you for checking out Rieker!", "Other", 0);
                    }, 6000); // Change for Local

                    setTimeout(() => {
                        lexHelper("We've got a deal just for you!", "Other", 0);
                    }, 7000); // Change for Local

                    setTimeout(() => {
                        // JavaScript for
                        // Initializing AB Testing (Data Capture and Discounts) for

                        // Adding Cookie
                        // document.cookie = "_ga=1808575901.1588821733;"

                        // Debugger
                        // console.log(document.cookie);

                        // Date and Time
                        let timeAndDate = new Date();
                        let uHour = timeAndDate.getHours(); // 24 for 12:00 AM
                        let uDay = timeAndDate.getDay() + 1; // 1 for Sunday
                        let uDate = timeAndDate.getDate();
                        let uMonth = timeAndDate.getMonth() + 1;
                        let uYear = timeAndDate.getFullYear();

                        capturedData.push(uHour);
                        capturedData.push(uDay);
                        capturedData.push(uDate);
                        capturedData.push(uMonth);
                        capturedData.push(uYear);


                        // Device Details
                        let uBrowser = FRUBIL.client.name;
                        let uOS = FRUBIL.client.os;
                        let uDeviceType = FRUBIL.device.class;
                        let uDeviceBrand = FRUBIL.device.brand;

                        capturedData.push(uBrowser);
                        capturedData.push(uOS);
                        capturedData.push(uDeviceType);
                        capturedData.push(uDeviceBrand);

                        // User Geographic Details
                        // Latitude & Longitude (IP) #10000 Requests per Month + VPN Problem (FREE)
                        jQuery(function($) {
                            $.get("https://ipinfo.io?token=589a8eaf6f4cd1", function(response) {
                                var uLatitude = response.loc.split(',')[0];
                                var uLongitude = response.loc.split(',')[1];

                                capturedData.push(uLatitude);
                                capturedData.push(uLongitude);

                                // Getting Region, City and Country
                                getRegion(uLatitude, uLongitude, "Capture");
                            }, "jsonp");
                        });

                        // Latitude, Longitude (Navigator GeoLocation API) #25000 Requests per Day (FREE)
                        // Needs User's Consent
                        /* navigator.geolocation.getCurrentPosition(
                            function success(position) {
                                setTimeout(() => {
                                    capturedData.push(position.coords.latitude);
                                }, 0);
                                setTimeout(() => {
                                    capturedData.push(position.coords.longitude);
                                }, 0);
                                getRegion(position.coords.latitude, position.coords.longitude);
                            }); */

                        // Sending Channel (Source) and Medium
                        let indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
                        indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
                        let props = indexOfCookie !== -1 ? document.cookie.substr(indexOfCookie).split("=")[1].split("%26") : [];

                        // Dummy Channel and Medium
                        let uChannel = "";
                        let uMedium = "";

                        if (props.length) {
                            uChannel = props[0] ? props[0].split("%3D")[1] : "";
                            uMedium = props[1] ? props[1].split("%3D")[1] : "";
                        }

                        capturedData.push(uChannel);
                        capturedData.push(uMedium);
                    }, 2000);
                }

                // If Coupon is Assigned and has not Expired
                else {
                    // Check if this is just a Tab change
                    if (sessionStorage && sessionStorage.getItem("couponAssigned") && (sessionStorage.getItem("couponAssigned") === "1")) {
                        // Prepare the Bot for Discount Showing
                        setTimeout(() => {
                            // Hide input unless User asks for Contact Support
                            var inputModal = document.getElementById("inputArea");
                            inputModal.style.display = "none";

                            // Hide the Banner
                            var banner = document.getElementById("banner");
                            banner.style.display = "none";
                        }, 2000);

                        setTimeout(() => {
                            // Auto Click for making Document Ready
                            document.getElementById("ready").click();
                            document.getElementById("ready").click();

                            // Clear the Bot
                            var botWindow = document.getElementById("chatWindow");
                            botWindow.innerHTML = "";
                        }, 2000); // 60000

                        // Verbal Messages Below (For Tab Change)
                        // For Returning Customer
                        if (hasCoupon.assigned) {
                            setTimeout(() => {
                                lexHelper("Hi! Glad to see you again :)", "Other", 0);
                            }, 2000);
                        }

                        // For New Customer
                        else {
                            setTimeout(() => {
                                lexHelper("Hi!", "Other", 0);
                            }, 2000);

                            setTimeout(() => {
                                lexHelper("Thank you for checking out Rieker!", "Other", 0);
                            }, 3000);

                            setTimeout(() => {
                                lexHelper("We've got a deal just for you!", "Other", 0);
                            }, 4000);
                        }

                        // Discount Messages
                        setTimeout(() => {
                            lexHelper("We're offering you " + sessionStorage.getItem("assignedAction") + " on any of our products.", "Other", 0);
                        }, 6000);

                        setTimeout(() => {
                            lexHelper("Use the code " + sessionStorage.getItem("userDiscount") + " to redeem the discount at the checkout.", "Other", 0);
                        }, 8000);
                    } else if (hasCoupon.assigned) {
                        // Initializing the Bot using a "Hello" message after 1 second
                        // uRMUR is basically "hello" for our bot
                        setTimeout(() => {
                            sendFirst("uRMUR", 0, hasCoupon, 5000); // Change for Local
                        }, 2000);

                        // Prepare the Bot for Discount Showing
                        setTimeout(() => {
                            // Replace Banner Text
                            var bannerText = document.getElementsByClassName("chat-popup-widget-text")[0];
                            bannerText.innerHTML = "Hey there, I have an Exciting Offer just for you!";

                            // Hide input unless User asks for Contact Support
                            var inputModal = document.getElementById("inputArea");
                            inputModal.style.display = "none";
                        }, 2500);

                        setTimeout(() => {
                            // Clear the Bot
                            var botWindow = document.getElementById("chatWindow");
                            botWindow.innerHTML = "";
                        }, 5000);


                        // Verbal Messages Below (For Old Customers)
                        setTimeout(() => {
                            lexHelper("Hi! Glad to see you again :)", "Other", 0);
                        }, 5000);

                        // Discount Messages
                        discountPoster(hasCoupon.Action, hasCoupon.Coupon);
                    } else {
                        // Initializing the Bot using a "Hello" message after 1 second
                        // uRMUR is basically "hello" for our bot
                        setTimeout(() => {
                            sendFirst("uRMUR", 0, hasCoupon, 5000); // Change for Local
                        }, 2000);

                        // Prepare the Bot for Discount Showing
                        setTimeout(() => {
                            // Replace Banner Text
                            var bannerText = document.getElementsByClassName("chat-popup-widget-text")[0];
                            bannerText.innerHTML = "Hey there, I have an Exciting Offer just for you!";

                            // Hide input unless User asks for Contact Support
                            var inputModal = document.getElementById("inputArea");
                            inputModal.style.display = "none";
                        }, 2000);

                        setTimeout(() => {
                            // Clear the Bot
                            var botWindow = document.getElementById("chatWindow");
                            botWindow.innerHTML = "";
                        }, 5000); // Change for Local


                        // Verbal Messages Below (For New Customers)
                        setTimeout(() => {
                            lexHelper("Hi!", "Other", 0);
                        }, 5000); // Change for Local

                        setTimeout(() => {
                            lexHelper("Thank you for checking out Rieker!", "Other", 0);
                        }, 6000); // Change for Local

                        setTimeout(() => {
                            lexHelper("We've got a deal just for you!", "Other", 0);
                        }, 7000); // Change for Local

                        setTimeout(() => {
                            // JavaScript for
                            // Initializing AB Testing (Data Capture and Discounts) for

                            // Adding Cookie
                            // document.cookie = "_ga=1808575901.1588821733;"

                            // Debugger
                            // console.log(document.cookie);

                            // Date and Time
                            let timeAndDate = new Date();
                            let uHour = timeAndDate.getHours(); // 24 for 12:00 AM
                            let uDay = timeAndDate.getDay() + 1; // 1 for Sunday
                            let uDate = timeAndDate.getDate();
                            let uMonth = timeAndDate.getMonth() + 1;
                            let uYear = timeAndDate.getFullYear();

                            capturedData.push(uHour);
                            capturedData.push(uDay);
                            capturedData.push(uDate);
                            capturedData.push(uMonth);
                            capturedData.push(uYear);


                            // Device Details
                            let uBrowser = FRUBIL.client.name;
                            let uOS = FRUBIL.client.os;
                            let uDeviceType = FRUBIL.device.class;
                            let uDeviceBrand = FRUBIL.device.brand;

                            capturedData.push(uBrowser);
                            capturedData.push(uOS);
                            capturedData.push(uDeviceType);
                            capturedData.push(uDeviceBrand);

                            // User Geographic Details
                            // Latitude & Longitude (IP) #10000 Requests per Month + VPN Problem (FREE)
                            jQuery(function($) {
                                $.get("https://ipinfo.io?token=589a8eaf6f4cd1", function(response) {
                                    var uLatitude = response.loc.split(',')[0];
                                    var uLongitude = response.loc.split(',')[1];

                                    capturedData.push(uLatitude);
                                    capturedData.push(uLongitude);

                                    // Getting Region, City and Country
                                    getRegion(uLatitude, uLongitude, "Capture");
                                }, "jsonp");
                            });

                            // Latitude, Longitude (Navigator GeoLocation API) #25000 Requests per Day (FREE)
                            /* navigator.geolocation.getCurrentPosition(
                                function success(position) {
                                    setTimeout(() => {
                                        capturedData.push(position.coords.latitude);
                                    }, 0);
                                    setTimeout(() => {
                                        capturedData.push(position.coords.longitude);
                                    }, 0);
                                    getRegion(position.coords.latitude, position.coords.longitude);
                                }); */

                            // Sending Channel (Source) and Medium
                            let indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
                            indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
                            let props = indexOfCookie !== -1 ? document.cookie.substr(indexOfCookie).split("=")[1].split("%26") : [];

                            // Dummy Channel and Medium
                            let uChannel = "";
                            let uMedium = "";

                            if (props.length) {
                                uChannel = props[0] ? props[0].split("%3D")[1] : "";
                                uMedium = props[1] ? props[1].split("%3D")[1] : "";
                            }

                            capturedData.push(uChannel);
                            capturedData.push(uMedium);
                        }, 2000);
                    }
                }
            }

            // Allow These and Set Discount and Campaign Name
            if (sessionStorage.getItem("clusterIt") === "1") {
                sessionStorage.setItem("campaignName", data[i].campaignName);
                discount = data[i].selectedSalesPromotion;
                break;
            }

        } else if (clientCondition === "Region") {
            // User Geographic Details
            // Latitude & Longitude (IP) #10000 Requests per Month + VPN Problem (FREE)
            jQuery(function($) {
                $.get("https://ipinfo.io?token=589a8eaf6f4cd1", function(response) {
                    var uLatitude = response.loc.split(',')[0];
                    var uLongitude = response.loc.split(',')[1];

                    capturedData.push(uLatitude);
                    capturedData.push(uLongitude);

                    // Getting Region, City and Country
                    getRegion(uLatitude, uLongitude, "Check");
                }, "jsonp");
            });

            // Check both the Regions
            if (data[i].label === sessionStorage.getItem("userRegion")) {
                // Allow These and Set Discount and Campaign Name
                sessionStorage.setItem("clusterIt", "1");
                sessionStorage.setItem("campaignName", data[i].campaignName);
                discount = data[i].selectedSalesPromotion;
                break;
            }
        }

        // Screen Time
        else {
            // To get Seconds
            let dataB = data[i] && data[i].label  && data[i].label.slice(-2) ?  data[i].label.slice(-2) : data[i].label;
            let timeAB = parseInt(dataB);

            var timeSpent = 0;
            jQuery(document).ready(function($) {
                // Increment the time counter every second.
                var idleInterval = setInterval(timerIncrement, 1000);
            });

            // For Break
            let flag = 0;

            function timerIncrement() {
                timeSpent += 1;
                if (timeSpent >= timeAB) {
                    sessionStorage.setItem("clusterIt", "1");
                    sessionStorage.setItem("campaignName", data[i].campaignName);
                    discount = data[i].selectedSalesPromotion;
                    flag = 1;
                }
            }

            // If true, Break
            if (flag) {
                break;
            }
        }
    }

    await sleep(1000);
}

async function restoreBotConv() {
    // Client ID
    let clientId = "000.000";
    if (document.cookie.match("_ga")) {
        // For Production
        clientId = document.cookie.match("_ga=(.+?);") && document.cookie.match("_ga=(.+?);")[1].split(".").slice(-2).join(".");

        // For Local
        // clientId = document.cookie.match("_ga").input.split(".").slice(-2).join(".");
    }

    // Saving Client ID in Session
    await sleep(500);
    sessionStorage.setItem("clientId", clientId);

    capturedData.push(clientId);

    // Check if Coupon is already assigned

    // Creating Object with Dummy Status to get the Coupon Status
    const newStatusObject = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "clientId": sessionStorage.getItem("clientId"),
            "newStatus": 0 // Only for Status
        })
    };

    // Making POST Request to API to Get the Coupon Status
    await fetch("https://t6mcmorgdb.execute-api.us-east-1.amazonaws.com/ABTestActionSelection/sendToLambda/changeTransactionData", newStatusObject)
        .then(response => response.json())
        .then(data => saveToHasCoupon(data.body));

    // Making GET Request to API to Get the Running Campaigns
    await fetch(`https://t6mcmorgdb.execute-api.us-east-1.amazonaws.com/ABTestActionSelection/getcampaigns?companyName=${companyName}&campaignname=`)
        .then(response => response.json())
        .then(data => setClientCondition(data.body));


    // Checking for Assigned Coupon Too and Whether to Pass the Data or not
    setTimeout(async() => {
        if (sessionStorage && sessionStorage.getItem("clusterIt") && sessionStorage.getItem("clusterIt") === "1") {
            if (sessionStorage && sessionStorage.getItem("oldChat") && sessionStorage.getItem("oldChat").length && !(sessionStorage.getItem("couponAssigned") && (sessionStorage.getItem("couponAssigned") === "1"))) {
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

                        if (restoredUserResponses[i] === "aMWmS") {
                            // Show input if User asks for Contact Support
                            var inputModal = document.getElementById("inputArea");
                            inputModal.style.display = "block";
                        }
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
                // Rieker/Inteliyo Exclusive
                // For Local
                // Make Transaction testing button and Coupon input area visible
                // setTimeout(() => {
                //     let mod = document.getElementById("transaction");
                //     mod.style.display = "block";
                // }, 2000);

                // If Coupon has Expired
                if (hasCoupon.expired) {
                    // Initializing the Bot using a "Hello" message after 1 second
                    // uRMUR is basically "hello" for our bot
                    setTimeout(() => {
                        sendFirst("uRMUR", 0, hasCoupon, 5000); // Change for Local
                    }, 2000);

                    // Prepare the Bot for Discount Showing
                    setTimeout(() => {
                        // Replace Banner Text
                        var bannerText = document.getElementsByClassName("chat-popup-widget-text")[0];
                        bannerText.innerHTML = "Hey there, I have an Exciting Offer just for you!";

                        // Hide input unless User asks for Contact Support
                        var inputModal = document.getElementById("inputArea");
                        inputModal.style.display = "none";
                    }, 2000);

                    setTimeout(() => {
                        // Clear the Bot
                        var botWindow = document.getElementById("chatWindow");
                        botWindow.innerHTML = "";
                    }, 5000); // Change for Local


                    // Verbal Messages Below (For New Customers)
                    setTimeout(() => {
                        lexHelper("Hi! Glad to see you again :)", "Other", 0);
                    }, 5000); // Change for Local

                    setTimeout(() => {
                        lexHelper("Thank you for checking out Rieker!", "Other", 0);
                    }, 6000); // Change for Local

                    setTimeout(() => {
                        lexHelper("We've got a deal just for you!", "Other", 0);
                    }, 7000); // Change for Local

                    setTimeout(() => {
                        // JavaScript for
                        // Initializing AB Testing (Data Capture and Discounts) for

                        // Adding Cookie
                        // document.cookie = "_ga=1808575901.1588821733;"

                        // Debugger
                        // console.log(document.cookie);

                        // Date and Time
                        let timeAndDate = new Date();
                        let uHour = timeAndDate.getHours(); // 24 for 12:00 AM
                        let uDay = timeAndDate.getDay() + 1; // 1 for Sunday
                        let uDate = timeAndDate.getDate();
                        let uMonth = timeAndDate.getMonth() + 1;
                        let uYear = timeAndDate.getFullYear();

                        capturedData.push(uHour);
                        capturedData.push(uDay);
                        capturedData.push(uDate);
                        capturedData.push(uMonth);
                        capturedData.push(uYear);


                        // Device Details
                        let uBrowser = FRUBIL.client.name;
                        let uOS = FRUBIL.client.os;
                        let uDeviceType = FRUBIL.device.class;
                        let uDeviceBrand = FRUBIL.device.brand;

                        capturedData.push(uBrowser);
                        capturedData.push(uOS);
                        capturedData.push(uDeviceType);
                        capturedData.push(uDeviceBrand);

                        // User Geographic Details
                        // Latitude & Longitude (IP) #10000 Requests per Month + VPN Problem (FREE)
                        jQuery(function($) {
                            $.get("https://ipinfo.io?token=589a8eaf6f4cd1", function(response) {
                                var uLatitude = response.loc.split(',')[0];
                                var uLongitude = response.loc.split(',')[1];

                                capturedData.push(uLatitude);
                                capturedData.push(uLongitude);

                                // Getting Region, City and Country
                                getRegion(uLatitude, uLongitude, "Capture");
                            }, "jsonp");
                        });

                        // Latitude, Longitude (Navigator GeoLocation API) #25000 Requests per Day (FREE)
                        // Needs User's Consent
                        /* navigator.geolocation.getCurrentPosition(
                            function success(position) {
                                setTimeout(() => {
                                    capturedData.push(position.coords.latitude);
                                }, 0);
                                setTimeout(() => {
                                    capturedData.push(position.coords.longitude);
                                }, 0);
                                getRegion(position.coords.latitude, position.coords.longitude);
                            }); */

                        // Sending Channel (Source) and Medium
                        let indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
                        indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
                        let props = indexOfCookie !== -1 ? document.cookie.substr(indexOfCookie).split("=")[1].split("%26") : [];

                        // Dummy Channel and Medium
                        let uChannel = "";
                        let uMedium = "";

                        if (props.length) {
                            uChannel = props[0] ? props[0].split("%3D")[1] : "";
                            uMedium = props[1] ? props[1].split("%3D")[1] : "";
                        }

                        capturedData.push(uChannel);
                        capturedData.push(uMedium);
                    }, 2000);
                }

                // If Coupon is Assigned and has not Expired
                else {
                    // Check if this is just a Tab change
                    if (sessionStorage && sessionStorage.getItem("couponAssigned") && (sessionStorage.getItem("couponAssigned") === "1")) {
                        // Prepare the Bot for Discount Showing
                        setTimeout(() => {
                            // Hide input unless User asks for Contact Support
                            var inputModal = document.getElementById("inputArea");
                            inputModal.style.display = "none";

                            // Hide the Banner
                            var banner = document.getElementById("banner");
                            banner.style.display = "none";
                        }, 2000);

                        setTimeout(() => {
                            // Auto Click for making Document Ready
                            document.getElementById("ready").click();
                            document.getElementById("ready").click();

                            // Clear the Bot
                            var botWindow = document.getElementById("chatWindow");
                            botWindow.innerHTML = "";
                        }, 2000); // 60000

                        // Verbal Messages Below (For Tab Change)
                        // For Returning Customer
                        if (hasCoupon.assigned) {
                            setTimeout(() => {
                                lexHelper("Hi! Glad to see you again :)", "Other", 0);
                            }, 2000);
                        }

                        // For New Customer
                        else {
                            setTimeout(() => {
                                lexHelper("Hi!", "Other", 0);
                            }, 2000);

                            setTimeout(() => {
                                lexHelper("Thank you for checking out Rieker!", "Other", 0);
                            }, 3000);

                            setTimeout(() => {
                                lexHelper("We've got a deal just for you!", "Other", 0);
                            }, 4000);
                        }

                        // Discount Messages
                        setTimeout(() => {
                            lexHelper("We're offering you " + sessionStorage.getItem("assignedAction") + " on any of our products.", "Other", 0);
                        }, 6000);

                        setTimeout(() => {
                            lexHelper("Use the code " + sessionStorage.getItem("userDiscount") + " to redeem the discount at the checkout.", "Other", 0);
                        }, 8000);
                    } else if (hasCoupon.assigned) {
                        // Initializing the Bot using a "Hello" message after 1 second
                        // uRMUR is basically "hello" for our bot
                        setTimeout(() => {
                            sendFirst("uRMUR", 0, hasCoupon, 5000); // Change for Local
                        }, 2000);

                        // Prepare the Bot for Discount Showing
                        setTimeout(() => {
                            // Replace Banner Text
                            var bannerText = document.getElementsByClassName("chat-popup-widget-text")[0];
                            bannerText.innerHTML = "Hey there, I have an Exciting Offer just for you!";

                            // Hide input unless User asks for Contact Support
                            var inputModal = document.getElementById("inputArea");
                            inputModal.style.display = "none";
                        }, 2500);

                        setTimeout(() => {
                            // Clear the Bot
                            var botWindow = document.getElementById("chatWindow");
                            botWindow.innerHTML = "";
                        }, 5000);


                        // Verbal Messages Below (For Old Customers)
                        setTimeout(() => {
                            lexHelper("Hi! Glad to see you again :)", "Other", 0);
                        }, 5000);

                        // Discount Messages
                        discountPoster(hasCoupon.Action, hasCoupon.Coupon);
                    } else {
                        // Initializing the Bot using a "Hello" message after 1 second
                        // uRMUR is basically "hello" for our bot
                        setTimeout(() => {
                            sendFirst("uRMUR", 0, hasCoupon, 5000); // Change for Local
                        }, 2000);

                        // Prepare the Bot for Discount Showing
                        setTimeout(() => {
                            // Replace Banner Text
                            var bannerText = document.getElementsByClassName("chat-popup-widget-text")[0];
                            bannerText.innerHTML = "Hey there, I have an Exciting Offer just for you!";

                            // Hide input unless User asks for Contact Support
                            var inputModal = document.getElementById("inputArea");
                            inputModal.style.display = "none";
                        }, 2000);

                        setTimeout(() => {
                            // Clear the Bot
                            var botWindow = document.getElementById("chatWindow");
                            botWindow.innerHTML = "";
                        }, 5000); // Change for Local


                        // Verbal Messages Below (For New Customers)
                        setTimeout(() => {
                            lexHelper("Hi!", "Other", 0);
                        }, 5000); // Change for Local

                        setTimeout(() => {
                            lexHelper("Thank you for checking out Rieker!", "Other", 0);
                        }, 6000); // Change for Local

                        setTimeout(() => {
                            lexHelper("We've got a deal just for you!", "Other", 0);
                        }, 7000); // Change for Local

                        setTimeout(() => {
                            // JavaScript for
                            // Initializing AB Testing (Data Capture and Discounts) for

                            // Adding Cookie
                            // document.cookie = "_ga=1808575901.1588821733;"

                            // Debugger
                            // console.log(document.cookie);

                            // Date and Time
                            let timeAndDate = new Date();
                            let uHour = timeAndDate.getHours(); // 24 for 12:00 AM
                            let uDay = timeAndDate.getDay() + 1; // 1 for Sunday
                            let uDate = timeAndDate.getDate();
                            let uMonth = timeAndDate.getMonth() + 1;
                            let uYear = timeAndDate.getFullYear();

                            capturedData.push(uHour);
                            capturedData.push(uDay);
                            capturedData.push(uDate);
                            capturedData.push(uMonth);
                            capturedData.push(uYear);


                            // Device Details
                            let uBrowser = FRUBIL.client.name;
                            let uOS = FRUBIL.client.os;
                            let uDeviceType = FRUBIL.device.class;
                            let uDeviceBrand = FRUBIL.device.brand;

                            capturedData.push(uBrowser);
                            capturedData.push(uOS);
                            capturedData.push(uDeviceType);
                            capturedData.push(uDeviceBrand);

                            // User Geographic Details
                            // Latitude & Longitude (IP) #10000 Requests per Month + VPN Problem (FREE)
                            jQuery(function($) {
                                $.get("https://ipinfo.io?token=589a8eaf6f4cd1", function(response) {
                                    var uLatitude = response.loc.split(',')[0];
                                    var uLongitude = response.loc.split(',')[1];

                                    capturedData.push(uLatitude);
                                    capturedData.push(uLongitude);

                                    // Getting Region, City and Country
                                    getRegion(uLatitude, uLongitude, "Capture");
                                }, "jsonp");
                            });

                            // Latitude, Longitude (Navigator GeoLocation API) #25000 Requests per Day (FREE)
                            /* navigator.geolocation.getCurrentPosition(
                                function success(position) {
                                    setTimeout(() => {
                                        capturedData.push(position.coords.latitude);
                                    }, 0);
                                    setTimeout(() => {
                                        capturedData.push(position.coords.longitude);
                                    }, 0);
                                    getRegion(position.coords.latitude, position.coords.longitude);
                                }); */

                            // Sending Channel (Source) and Medium
                            let indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
                            indexOfCookie = document.cookie.indexOf("ReturningSession") !== -1 ? document.cookie.indexOf("FirstSession") : -1;
                            let props = indexOfCookie !== -1 ? document.cookie.substr(indexOfCookie).split("=")[1].split("%26") : [];

                            // Dummy Channel and Medium
                            let uChannel = "";
                            let uMedium = "";

                            if (props.length) {
                                uChannel = props[0] ? props[0].split("%3D")[1] : "";
                                uMedium = props[1] ? props[1].split("%3D")[1] : "";
                            }

                            capturedData.push(uChannel);
                            capturedData.push(uMedium);
                        }, 2000);
                    }
                }
            }
        }else {
            sendToLex("uRMUR", 0);
        }
    }, 2000);
}

// Posts Discount Related Messages for Coupon Allotment
function discountPoster(Action, Coupon) {
    // Debugger
    console.log(Action);
    // console.log(Coupon);

    // Parse discount as JSON
    discount = JSON.parse(discount);
     console.log(discount, "discounts")
  if(Action[0] === "$"){
      let coupon  = Action.slice(1, Action.length);
      let type = Action.slice(0, 1);
      sessionStorage.setItem("type", type);
      sessionStorage.setItem("value", coupon);
      sessionStorage.setItem("CouponCode", Coupon)

  }else if(Action.slice(0, 2) === "Per"){
    let coupon  = Action.slice(2, Action.length);
      let type = Action.slice(0, 2);
      sessionStorage.setItem("type", type);
      sessionStorage.setItem("value", coupon)
      sessionStorage.setItem("CouponCode", Coupon)
  }else  {
    sessionStorage.setItem("type", coupon);
    sessionStorage.setItem("value", coupon);
    sessionStorage.setItem("CouponCode", Coupon)
  }
    //  "[{"id": "6", "itemName": "Discount", "typeD": "$", "type": "Selected", "value": "5"}, {"id": "7", "itemName": "Discount", "typeD": "Per", "type": "Selected", "value": "10"}, {"id": "8", "itemName": "Discount", "typeD": "$", "type": "Selected", "value": "10"}]"
    // Get Type and Value of Discount and Action
    // if (Action === "Action-1") {
    //     if (discount[0].itemName === "Discount") {
    //         // Setting Type
    //         if (discount[0].typeD === "$") {
    //             sessionStorage.setItem("type", "fixed_cart");
    //         } else {
    //             discount[0].typeD = "%"
    //             sessionStorage.setItem("type", "percent");
    //         }

    //         // Setting Value
    //         sessionStorage.setItem("value", discount[0].value);
    //     } else {
    //         // Setting Free Shipping
    //         sessionStorage.setItem("freeShipping", "1");

    //         // Set minimum Cart Value
    //         if (discount[0].itemName === "Free Shipping on orders above") {
    //             sessionStorage.setItem("minValue", discount[0].value);
    //         } else {
    //             sessionStorage.setItem("minValue", "00.00");
    //         }
    //     }

    //     // Setting the Discount Text
    //     Action = discount[0].value + discount[0].typeD + " " + discount[0].itemName;
    // } else if (Action === "Action-2") {
    //     if (discount[1].itemName === "Discount") {
    //         // Setting Type
    //         if (discount[1].typeD === "$") {
    //             sessionStorage.setItem("type", "fixed_cart");
    //         } else {
    //             discount[1].typeD = "%"
    //             sessionStorage.setItem("type", "percent");
    //         }
    //             console.log("Action", discount[1].value)
    //         // Setting Value
    //         sessionStorage.setItem("value", discount[1].value);
    //     } else {
    //         // Setting Free Shipping
    //         sessionStorage.setItem("freeShipping", "1");

    //         // Set minimum Cart Value
    //         if (discount[1].itemName === "Free Shipping on orders above") {
    //             sessionStorage.setItem("minValue", discount[1].value);
    //         } else {
    //             sessionStorage.setItem("minValue", "00.00");
    //         }
    //     }

    //     // Setting the Discount Text
    //     Action = discount[1].value + discount[1].typeD + " " + discount[1].itemName;
    // } else {
    //     if (discount[2].itemName === "Discount") {
    //         // Setting Type
    //         if (discount[2].typeD === "$") {
    //             sessionStorage.setItem("type", "fixed_cart");
    //         } else {
    //             discount[2].typeD = "%"
    //             sessionStorage.setItem("type", "percent");
    //         }

    //         // Setting Value
    //         sessionStorage.setItem("value", discount[2].value);
    //     } else {
    //         // Setting Free Shipping
    //         sessionStorage.setItem("freeShipping", "1");

    //         // Set minimum Cart Value
    //         if (discount[2].itemName === "Free Shipping on orders above") {
    //             sessionStorage.setItem("minValue", discount[2].value);
    //         } else {
    //             sessionStorage.setItem("minValue", "00.00");
    //         }
    //     }

    //     // Setting the Discount Text
    //     Action = discount[2].value + discount[2].typeD + " " + discount[2].itemName;
    // }

    // sessionStorage.setItem("assignedAction", Action);

    // // Discount Messages
    // setTimeout(() => {
    //     lexHelper("We're offering you " + Action + " on any of our products.", "Other", 0);
    // }, 9000); // Change for Local

    // setTimeout(() => {
    //     lexHelper("Use the code " + Coupon + " to redeem the discount at the checkout.", "Other", 0);
    // }, 11000); // Change for Local
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

    setTimeout(() => {
        // Checking if Coupon needs to be Calculated
        if (!hasCoupon.assigned) {
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
              let totalFinal = finalValues.filter(j => !unwantedValues.includes(j))
              //   value &&  value.map(i => {
              //   let values = i.split("/");
              //   beforeValues = [...beforeValues, ...values]
              // })
              // let totalValues = [];
              // beforeValues  &&  beforeValues.map(i => {
              //   let values = i.split("-").length ? i.split("-").slice(1, i.split("-").length-1): []
              //   totalValues = [...totalValues, ...values]
              // })
              // let finalValues = totalValues.filter(i => {
              // return i && i.length > 3 && !(/^\d+$/.test(i)) && i
              // })
              //   console.log(finalValues, "finalValues");

            // Making JSON object to POST from all the data captured
            const dataToPush = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "clientId": capturedData[0] === "" ? "000.000" : capturedData[0],
                    "uHour": capturedData[1] === "" ? "0" : capturedData[1],
                    "uDay": capturedData[2] === "" ? "1" : capturedData[2],
                    "uDate": capturedData[3] === "" ? "1" : capturedData[3],
                    "uMonth": capturedData[4] === "" ? "1" : capturedData[4],
                    "uYear": capturedData[5] === "" ? "1970" : capturedData[5],
                    "uBrowser": capturedData[6] === "" ? "Unknown" : capturedData[6],
                    "uOS": capturedData[7] === "" ? "Unknown" : capturedData[7],
                    "uDeviceType": capturedData[8] === "" ? "Unknown" : capturedData[8] && capturedData[8].toLowerCase(),
                    "uDeviceBrand": capturedData[9] === "" ? "Apple" : capturedData[9],
                    "latitude": capturedData[12] === "" ? "0.0" : capturedData[12],
                    "longitude": capturedData[13] === "" ? "0.0" : capturedData[13],
                    "uRegion": capturedData[17] === "" ? "Unknown" : capturedData[17],
                    "uCity": capturedData[15] === "" ? "Unknown" : capturedData[15],
                    "uCountry": capturedData[16] === "" ? "Unknown" : capturedData[16],
                    "uChannel": capturedData[10] === "" ? "Direct" : capturedData[10],
                    "product_Category": totalFinal ? totalFinal : "",
                    "uMedium": capturedData[11] === "" || capturedData[11] === "none" ? "(none)" : capturedData[11],
                    "campaignName": capturedData[14] === "" ? "Check For Cluster" : capturedData[14]
                })
            };

            // Debugger
            // console.log(dataToPush.body);

            // POST data
            if (capturedData[17] !== "") {
                fetch("https://t6mcmorgdb.execute-api.us-east-1.amazonaws.com/ABTestActionSelection/sendToLambda/clusteringData/", dataToPush)
                    .then(response => response.json())
                    .then(data => discountPoster(data.body.Action, data.body.Coupon));
            }

            // For Campaigns Matching Custom Cluster Option
            else {
                fetch("https://t6mcmorgdb.execute-api.us-east-1.amazonaws.com/ABTestActionSelection/sendToLambda/clusteringData/", dataToPush)
                    .then(response => response.json())
                    .then(data => checkCluster(data.ClusterID));
            }
        }
    }, t); // Variable time for Different Scenarios

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
async function getRegion(latitude, longitude, type) {
    // Debugger
    // console.log(latitude);
    // console.log(longitude);

    if (type === "Check") {
        jQuery(function($) {
            $.get("https://us1.locationiq.com/v1/reverse.php?key=ec33f262d124e6&lat=" + latitude + "&lon=" + longitude + "&format=json", function(response) {
                let uRegion = response.address.state;

                // Save the Region to Match
                sessionStorage.setItem("userRegion", uRegion);
            })
        });
    } else {
        jQuery(function($) {
            $.get("https://us1.locationiq.com/v1/reverse.php?key=ec33f262d124e6&lat=" + latitude + "&lon=" + longitude + "&format=json", function(response) {
                let uRegion = response.address.state;
                let uCity = response.address.city;
                let uCountry = response.address.country;

                capturedData.push(uRegion);
                capturedData.push(uCity);
                capturedData.push(uCountry);
            })
        });

        // Push Matched Campaign Name if it is there
        let whatCampaign = sessionStorage && sessionStorage.getItem("campaignName") && sessionStorage.getItem("campaignName").length ? sessionStorage.getItem("campaignName") : "";
        capturedData.push(whatCampaign);
    }
}

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
    dateObject.setMinutes(dateObject.getMinutes() + 15);
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

    // Making POST Request to API to Update the Coupon
    await fetch("https://devrieker.wpengine.com/wp-json/wc/v2/coupons/" + id.toString() + "?consumer_key=ck_82693c4b5e150815246ac85955841c4ff2c51d20&consumer_secret=cs_69eef53fe6658952899a3d6347a4095c31d5dd0f", updatedCoupon);
}

async function lexHelper(data, type, flag) {
    // Debugger
    // console.log(data);
    // console.log(type);
    // console.log(flag);

    // Setting Global Flag
    gFlag = JSON.parse(JSON.stringify(flag));

    // Assigning Inactivity limit according to type
    let iaTime = (type === "first") ? 120 : 60;

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

        if (!hasCoupon.assigned && !(sessionStorage && sessionStorage.getItem("couponAssigned") && sessionStorage.getItem("couponAssigned") === "1")) {
            // Assigning to the Session Storage that Coupon has been assigned
            sessionStorage.setItem("couponAssigned", "1");

            // Check if Free shipping is needed
            if (sessionStorage && sessionStorage.getItem("freeShipping") && sessionStorage.getItem("freeShipping") !== "1") {
                // Making a New Coupon
                const newCoupon = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "code": sessionStorage.getItem("CouponCode") ? sessionStorage.getItem("CouponCode") :  userDiscount,
                        "discount_type": sessionStorage.getItem("type"), // For Demo
                        "amount": sessionStorage.getItem("value"), // For Demo
                        "minimum_amount": "00.00",
                        "usage_limit": "1",
                        "usage_limit_per_user": "1",
                        "individual_use": "true"
                    })
                };

                // Making POST Request to API to Add the Coupon
                await fetch("https://devrieker.wpengine.com/wp-json/wc/v2/coupons?consumer_key=ck_82693c4b5e150815246ac85955841c4ff2c51d20&consumer_secret=cs_69eef53fe6658952899a3d6347a4095c31d5dd0f", newCoupon)
                    .then(response => response.json())
                    .then(data => updateCouponWithExpiry(data.id)); // Updating Expiry for Coupon
            } else {
                // Making a New Coupon
                const newCoupon = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "code": sessionStorage.getItem("CouponCode") ? sessionStorage.getItem("CouponCode") :  userDiscount,
                        "free_shipping": "true",
                        "discount_type": sessionStorage.getItem("type"),
                        "description": sessionStorage.getItem("campaignName"),
                        "amount": sessionStorage.getItem("value"),
                        "minimum_amount": sessionStorage.getItem("minValue"),
                        "usage_limit": "1",
                        "usage_limit_per_user": "1",
                        "individual_use": "true"
                    })
                };

                // Making POST Request to API to Add the Coupon
                await fetch("https://devrieker.wpengine.com/wp-json/wc/v2/coupons?consumer_key=ck_82693c4b5e150815246ac85955841c4ff2c51d20&consumer_secret=cs_69eef53fe6658952899a3d6347a4095c31d5dd0f", newCoupon)
                    .then(response => response.json())
                    .then(data => updateCouponWithExpiry(data.id)); // Updating Expiry for Coupon
            }
        }
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
        if (couponShown !== "") {
            let disBtnDiv = document.createElement("div");
            disBtnDiv.setAttribute("class", "buttonDiv");

            // Reveal and Copy Button
            let revealAndCopy = document.createElement("img");
            // revealAndCopy.innerHTML = "Reveal & Copy";
            revealAndCopy.setAttribute("class", "imageContainer tooltip");
            revealAndCopy.setAttribute("src", "./Resources/CampaignCard.png");

            revealAndCopy.addEventListener("click",
                function() {
                    // revealAndCopy.innerHTML = "Copied!"
                    // setTimeout(() => {
                    //     revealAndCopy.innerHTML = userDiscount;
                    // }, 1000);
                    const element = document.createElement('textarea');
                    element.value = userDiscount.toLowerCase();
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
                    scrollToBottom();
                });

            // Show the button in pressed state
            // revealAndCopy.addEventListener("click",
            //     function() {
            //         revealAndCopy.removeAttribute("class");
            //         revealAndCopy.setAttribute("class", "botButtonPressed");
            //     });

            // Checkout with This Coupon Button
            // let checkoutWithThisCoupon = document.createElement("button");
            // checkoutWithThisCoupon.innerHTML = "Checkout with this Coupon";
            // checkoutWithThisCoupon.setAttribute("id", "checkoutWithThisCoupon");
            // checkoutWithThisCoupon.setAttribute("class", "botButton");
            //
            // checkoutWithThisCoupon.addEventListener("click",
            //     function() {
            //         // Rieker/Inteliyo Exclusive
            //         if (document.title === "Cart - Inteliyo") {
            //             // Forward Coupon Code to Application Text Area
            //             document.getElementById("coupon_code").value = userDiscount;
            //
            //             // Click on Apply Coupon
            //             document.getElementsByName("apply_coupon")[0].click();
            //         }
            //
            //         // For Local
            //         // if (document.title === "PredictivEye ChatBot") {
            //         //     // Forward Coupon Code to Application Text Area
            //         //     document.getElementById("couponCodeApplied").value = userDiscount;
            //
            //         //     // Click on Checkout
            //         //     document.getElementById("checkout").click();
            //         // }
            //     });

            // Show the button in pressed state
            // checkoutWithThisCoupon.addEventListener("click",
            //     function() {
            //         checkoutWithThisCoupon.removeAttribute("class");
            //         checkoutWithThisCoupon.setAttribute("class", "botButtonPressed");
            //     });

            disBtnDiv.appendChild(revealAndCopy);
            // disBtnDiv.appendChild(checkoutWithThisCoupon);
            botDiv.appendChild(disBtnDiv);
        }

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
