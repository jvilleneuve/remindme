function reminder (user,date,postId,memo) {
  this.user=user;
  this.date = date;
  this.postId=postId;
  this.memo=memo;
}


function sendReminder(message,replyTo) {
  //Set your typetalk bot URL
  var url = "TYPETALK_URL_GOES_HERE";
  
  //set your typetalk token
  var options = {
    "method": "post",
    "headers": {"X-Typetalk-Token": "TOKEN_GOES_HERE"},
    "payload": {"message": message, "replyTo" : replyTo}
  };
  var response = UrlFetchApp.fetch(url, options);
}

function postToTypetalk(message) {
  //Set your typetalk bot URL
  var url = "TYPETALK_URL_GOES_HERE";
  
  //set your typetalk token
  var options = {
    "method": "post",
    "headers": {"X-Typetalk-Token": "TOKEN_GOES_HERE"},
    "payload": {"message": message}
  };
  var response = UrlFetchApp.fetch(url, options);
}

//parse the natural language to date object
function makeDate(text){
  try{
    //   var chrono = require('chrono-node');
    var myDate = chrono.parseDate(text);
    return myDate;
    //   postToTypetalk("Mydate="+myDate.toString());
  }catch(err){
    postToTypetalk(err.message);
  }
  
}

//get the payload from Typetalk
function doPost(e) {
  try{
    var reminders = [];
    
    
    reminders = propertyToArray();
    var jsonString = e.postData.getDataAsString();
    var post = JSON.parse(jsonString).post;
    var message = post.message.replace(/@echo\+/g, '@' + post.account.name); 
    
    if (message.length <16 && message.indexOf('help') !== -1){
      //output stuff for testing
      var myMessage = "Help: Use natural English or Japanese to input time. Then put your memo in \"\" \n example: in one hour \"test message\"";
      var result =
          {
            "message" : myMessage,
            "replyTo" : post.id
          };
      
      // postToTypetalk (JSON.stringify(result));
      return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
    }  
    var who = "@" + post.account.name;
    var memo ="";
    memo= message.slice(message.indexOf('"')+1,message.lastIndexOf('"'));
    
    var date = makeDate(message.slice(9));
    var r = new reminder(who,date,post.id,memo);
    reminders.push(r);
    arrayToProperty(reminders);
    
    //output stuff for testing
    var myMessage = "Ok "+who+" , I'll remind you \""+memo+"\" on "+ date.toString();
    var result =
        {
          "message" : myMessage,
          "replyTo" : post.id
        };
    
    // postToTypetalk (JSON.stringify(result));
    return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    postToTypetalk (err.message);
  }
}

function doGet(e) {
  postToTypetalk ("dekita!");
  return HtmlService.createHtmlOutput("request received2");
}


//actually send the reminders
function doReminders(){
  try{
    var reminders = [];
    
    reminders = propertyToArray();
    var keepArray=[];
    var length = reminders.length;
    var now = new Date();
    var plusOne= new Date();
    plusOne.setMinutes(plusOne.getMinutes()+1);
    if (length > 0)
    {
      
      for (i=0;i<length; i++){
        //convert to new date because of weirdness
        var checkDate = new Date(reminders[i].date);
        if (checkDate > now && checkDate <= plusOne) 
        { 
          //post
          //build a message
          var message = "Hello " + reminders[i].user + " ! "+reminders[i].memo;
          sendReminder(message,reminders[i].postId);
        }else{
          //add to keepArray
          
          keepArray.push(reminders[i]);
        }
        
      }
      
      //finished, reset the arrays
      reminders=keepArray.slice();
      arrayToProperty(reminders);
    }
  }catch(err){
    postToTypetalk ("Your stupid bot broke: " + err.message);
  }
}

function propertyToArray(){
  try{
    var scriptProperties = PropertiesService.getScriptProperties();
    var myJSON = scriptProperties.getProperty("reminders");
    var array = JSON.parse(myJSON) || [];
    return array.slice();
  }catch(err){
    postToTypetalk ("This stupid shit failed: "+ err.message);
  }
}

function arrayToProperty(array){
  try{
    var myJSON = JSON.stringify(array);
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('reminders', myJSON);
  }catch(err){
    postToTypetalk ("This stupid shit failed again: "+ err.message);
  }
}
