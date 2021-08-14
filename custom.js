

$( ".menu-btn" ).click(function() {
  $( ".side-menu" ).toggleClass("active");
  $( "body" ).toggleClass("active");
});

 // Client ID and API key from the Developer Console
 var CLIENT_ID = "96422988205-aovjjq9c5jg4ioqie62m3cl1lnr4apth.apps.googleusercontent.com";
 var API_KEY = "AIzaSyDktTQj41SuxEn1mxk1-i2Hw2glSX6gF3s";

 var SPREADSHEET_ID = "1ougPLGo4WWpjuBOuPtfZ-b_rlmezLUrnGGXud59mIPo";


 // Array of API discovery doc URLs for APIs used by the quickstart
 var DISCOVERY_DOCS = [
   "https://sheets.googleapis.com/$discovery/rest?version=v4",
 ];

 // Authorization scopes required by the API; multiple scopes can be
 // included, separated by spaces.
 var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

 var authorizeButton = document.getElementById("authorize_button");
 var signoutButton = document.getElementById("signout_button");
 var dayRow = document.getElementById("day");
 var timeRow = document.getElementById("time");
 var weekRow = document.getElementById("week");
 var timeSelect = document.getElementById("time-select");
 var weekSelect = document.getElementById("week-select");
 var finalTableHeader = document.getElementById("final-table-header");
 var tablediv = document.getElementById("table-div");
 var addcustomer = document.getElementById("add-customer");
 var goback = document.getElementById("goback");
 var attendenceCard = document.getElementById("attendance-card");
 var customerformdiv = document.getElementById("customerform");
 var GLOBAL_DATA = [];

 var DaySelected = "";
 var TimeSelected = "";
 var DateSelected = "";
 var SheetSelected = "";
 var RowNumSelected = "";

 /**
  *  On load, called to load the auth2 library and API client library.
  */
 function handleClientLoad() {
   gapi.load("client:auth2", initClient);
 }

 function showTiming(val) {
   DaySelected = val;
   var length = timeSelect.options.length;
   for (i = length - 1; i >= 0; i--) {
     timeSelect.options[i] = null;
   }
   timeRow.style.display = "flex";
   weekRow.style.display = "none";
   let defaultopt = document.createElement("option");
   defaultopt.setAttribute("value", "");
   defaultopt.disabled = true;
   defaultopt.selected = true;
   defaultopt.appendChild(document.createTextNode("Select Time"));
   timeSelect.appendChild(defaultopt);
   if (val === "") {
   } else if (val == "Sunday") {
     let opt = document.createElement("option");
     opt.setAttribute("value", "Sunday 9.30AM");
     opt.appendChild(document.createTextNode("9:30 AM"));
     timeSelect.appendChild(opt);

     opt = document.createElement("option");
     opt.setAttribute("value", "Sunday 10.30AM");
     opt.appendChild(document.createTextNode("10:30 AM"));
     timeSelect.appendChild(opt);
   } else if (val == "Tuesday") {
     let opt = document.createElement("option");
     opt.setAttribute("value", "Tuesday 6.30PM");
     opt.appendChild(document.createTextNode("6:30 PM"));
     timeSelect.appendChild(opt);
   }
 }

 function showDates(val) {
   SheetSelected = val;
   if (val == "Sunday 9.30AM") {
     TimeSelected = "9:30 AM";
   } else if (val == "Sunday 10.30AM") {
     TimeSelected = "10:30 AM";
   } else if (val == "Tuesday 6.30PM") {
     TimeSelected = "6:30 PM";
   }
   var length = weekSelect.options.length;
   for (i = length - 1; i >= 0; i--) {
     weekSelect.options[i] = null;
   }
   gapi.client.sheets.spreadsheets.values
     .get({
       spreadsheetId: SPREADSHEET_ID,
       range: val + "!A1:Z1",
     })
     .then(
       function (response) {
         var range = response.result;
         if (range.values[0].length > 10) {
           let tempArray = range.values[0].slice(10);
           weekRow.style.display = "flex";
           let defaultopt = document.createElement("option");
           //setting the default option
           defaultopt.setAttribute("value", "");
           defaultopt.disabled = true;
           defaultopt.selected = true;
           defaultopt.appendChild(document.createTextNode("Select Week"));
           weekSelect.appendChild(defaultopt);

           for (let v = 0; v < tempArray.length; v++) {
             var opti = document.createElement("option");
             opti.setAttribute("value", 10 + v);
             opti.appendChild(document.createTextNode(tempArray[v]));
             weekSelect.appendChild(opti);
           }
         } else {
           alert("No Dates Found");
         }
       },
       function (response) {
         alert("Error: " + response.result.error.message);
       }
     );
 }

 function rerender(val, txt) {
  attendenceCard.innerHTML = "";
   getDogData(val, txt);
 }

 function getDogData(val, txt) {
   DateSelected = txt;
   RowNumSelected = val;
   dayRow.style.display = "none";
   timeRow.style.display = "none";
   weekRow.style.display = "none";
   customerformdiv.style.display = "none";
   finalTableHeader.style.display = "block";
   finalTableHeader.innerHTML =
     DaySelected + " (" + TimeSelected + ") - " + DateSelected;
   gapi.client.sheets.spreadsheets.values
     .get({
       spreadsheetId: SPREADSHEET_ID,
       range: SheetSelected,
     })
     .then(
       function (response) {
         var res = response.result.values;
         if (res.length > 0) {
           displayDogTable(res, val);
         } else {
           alert("No Data Found");
         }
       },
       function (response) {
         alert("Error: " + response.result.error.message);
       }
     );
 }

 function showForm(event) {
  tablediv.style.display = "none";
   addcustomer.style.display = "none";
   customerformdiv.style.display = "block";
   goback.style.display = "none";
   dayRow.style.display="none"; 
   timeRow.style.display = "none"; 
   weekRow.style.display = "none"; 
   event.preventDefault();
 }

 function displayDogTable(data, val) {
   GLOBAL_DATA = data;
   tablediv.style.display = "block";
   addcustomer.style.display = "none";
   
   for (let c = 1; c < data.length; c++) {
     
    attendenceCard.innerHTML += `<div class="col-sm-12" style="padding-top:15px;"> 
    <div class="add-custom">
        <div class="mark-card">
            <div class="image-holder"><img src="images/download.png" alt="" class="img-fluid"/></div>
            <div class="text-box">
                <ul>
                    <li>${data[c][5]}</li>
                    <li>${data[c][6]}</li>
                    <li>${data[c][1]}</li>
                    <li>${data[c][4]}</li>
                    <li>${data[c][val] == "Yes" ? "<div style='color:green;'>Yes</div>" : "<div style='color:red;'>No</div>"}</li>
                    <li>
                       
                            <button type="button" class="btn btn-success" onclick="yesclick(${c.toString()},${val.toString()}) ">Yes</button>
                            <button type="button" class="btn btn-danger" onclick="noclick(${c.toString()},${val.toString()}) ">No</button>
                            
                        
                    </li>
                </ul>
            </div>
        </div>
    </div>

</div>

`;
       
   }
 }




 function noclick(rw, col) {
  let tempVal = GLOBAL_DATA;
  tempVal[rw][col] = "No";
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: SPREADSHEET_ID,

    // The A1 notation of the values to update.
    range: SheetSelected,

    // How the input data should be interpreted.
    valueInputOption: "RAW", // TODO: Update placeholder value.
  };

  var valueRangeBody = {
    range: SheetSelected,
    majorDimension: "ROWS",
    values: tempVal,
  };
  var request = gapi.client.sheets.spreadsheets.values.update(
    params,
    valueRangeBody
  );
  request.then(
    function (response) {
      rerender(col, DateSelected);
    },
    function (reason) {
      alert("error: " + reason.result.error.message);
    }
  );
}

function yesclick(rw, col) {
  let tempVal = GLOBAL_DATA;
  tempVal[rw][col] = "Yes";
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: SPREADSHEET_ID,

    // The A1 notation of the values to update.
    range: SheetSelected,

    // How the input data should be interpreted.
    valueInputOption: "RAW", // TODO: Update placeholder value.
  };

  var valueRangeBody = {
    range: SheetSelected,
    majorDimension: "ROWS",
    values: tempVal,
  };
  var request = gapi.client.sheets.spreadsheets.values.update(
    params,
    valueRangeBody
  );
  request.then(
    function (response) {
      rerender(col, DateSelected);
    },
    function (reason) {
      alert("error: " + reason.result.error.message);
    }
  );
}

 function backGo(event) {
   event.preventDefault();
   changeGlobalData();
   attendenceCard.innerHTML = "";
   getDogData(RowNumSelected, DateSelected);
 }


 function addNewCustomer(tempVal) {
   var params = {
     // The ID of the spreadsheet to update.
     spreadsheetId: SPREADSHEET_ID,

     // The A1 notation of the values to update.
     range: SheetSelected,

     // How the input data should be interpreted.
     valueInputOption: "RAW", // TODO: Update placeholder value.
   };

   var valueRangeBody = {
     range: SheetSelected,
     majorDimension: "ROWS",
     values: tempVal,
   };
   var request = gapi.client.sheets.spreadsheets.values.update(
     params,
     valueRangeBody
   );
   request.then(
     function (response) {
       changeGlobalData();
       attendenceCard.innerHTML = "";
       getDogData(RowNumSelected, DateSelected);
     },
     function (reason) {
       alert("error: " + reason.result.error.message);
     }
   );
 }

 function changeGlobalData() {
   gapi.client.sheets.spreadsheets.values
     .get({
       spreadsheetId: SPREADSHEET_ID,
       range: SheetSelected,
     })
     .then(
       function (response) {
         GLOBAL_DATA = response.result.values;
       },
       function (response) {
         alert("Error: " + response.result.error.message);
       }
     );
 }

 function redirecthome() {
   window.location = "http://localhost:8000";
 }

 function cust(event) {
   event.preventDefault();
   var name = document.getElementById("customername").value;
   var postcode = document.getElementById("customerpostcode").value;
   var email = document.getElementById("customeremail").value;
   var phone = document.getElementById("customerphone").value;
   var dog = document.getElementById("customerdog").value;
   var breed = document.getElementById("customerbreed").value;
   var ref = "";
   var tc = document.getElementById("customertc").value;
   var paid = document.getElementById("customerpaid").value;
   gapi.client.sheets.spreadsheets.values
     .get({
       spreadsheetId: SPREADSHEET_ID,
       range: SheetSelected,
     })
     .then(
       function (response) {
         var res = response.result.values;
         var new_customer_array = [];
         var time = "";
         if (SheetSelected == "Sunday 9.30AM") {
           time = "9:30AM";
         } else if (SheetSelected == "Sunday 10.30AM") {
           time = "10:30AM";
         } else {
           time = "06:30PM";
         }
         new_customer_array[0] = time;
         new_customer_array[1] = name;
         new_customer_array[2] = postcode;
         new_customer_array[3] = email;
         new_customer_array[4] = phone;
         new_customer_array[5] = dog;
         new_customer_array[6] = breed;
         new_customer_array[7] = ref;
         new_customer_array[8] = tc;
         new_customer_array[9] = paid;
         res[res.length] = new_customer_array;
         addNewCustomer(res);
       },
       function (response) {
         alert("Error: " + response.result.error.message);
       }
     );
 }

 /**
  *  Initializes the API client library and sets up sign-in state
  *  listeners.
  */
 function initClient() {
   gapi.client
     .init({
       apiKey: API_KEY,
       clientId: CLIENT_ID,
       discoveryDocs: DISCOVERY_DOCS,
       scope: SCOPES,
     })
     .then(
       function () {
         // Listen for sign-in state changes.
         gapi.auth2
           .getAuthInstance()
           .isSignedIn.listen(updateSigninStatus);

         // Handle the initial sign-in state.
         updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
         authorizeButton.onclick = handleAuthClick;
         signoutButton.onclick = handleSignoutClick;
       },
       function (error) {
         appendPre(JSON.stringify(error, null, 2));
       }
     );
 }

 /**
  *  Called when the signed in status changes, to update the UI
  *  appropriately. After a sign-in, the API is called.
  */
 function updateSigninStatus(isSignedIn) {
   if (isSignedIn) {
     authorizeButton.style.display = "none";
     signoutButton.style.display = "block";
     dayRow.style.display = "flex";
   } else {
     authorizeButton.style.display = "block";
     signoutButton.style.display = "none";
   }
 }

 /**
  *  Sign in the user upon button click.
  */
 function handleAuthClick(event) {
   gapi.auth2.getAuthInstance().signIn();
 }

 /**
  *  Sign out the user upon button click.
  */
 function handleSignoutClick(event) {
   gapi.auth2.getAuthInstance().signOut();
 }

 /**
  * Append a pre element to the body containing the given message
  * as its text node. Used to display the results of the API call.
  *
  * @param {string} message Text to be placed in pre element.
  */
 function appendPre(message) {
   var pre = document.getElementById("content");
   var textContent = document.createTextNode(message + "\n");
   pre.appendChild(textContent);
 }
