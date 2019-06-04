# remindme
A reminder bot for Typetalk

# Install
Create a new google script here https://script.google.com/u/0/home/all . Copy and paste the two files there (keep filenames and case the same). 

Create a new typetalk bot in the topic you'd like and then set it to have read and post permissions and webhook. 

In code.gs, set you typetalk URL and typetalk token 

In google scripts, go to publish -> Deploy as a web app. Make sure to execute the app as yourself, and (IMPORTANT) set who has access to the app as "Anyone, even anonymous". Copy the URL generated and input it as the webhook URL in your typetalk bot's settings. 

In google scripts, go to Edit -> Current Project triggers. 
Set it for the function "do reminders" as "time-driven" and every minute. 

Congrats, you are done. You can now send reminders by using @remindme+ tomorrow at five am "test"

# Help
If you need help, do @remindme+ help. 
