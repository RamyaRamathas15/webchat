import requests
import json

r = requests.get("https://us-central1-clear-gantry-283402.cloudfunctions.net/cloudJson")
    # print(r.json())
    
dict1 = r.json()

#a function to prepare a string for the lex bot response
def package_text(text):
    return {"dialogAction": {"type": "Close","fulfillmentState": "Fulfilled","message": {"contentType": "PlainText","content": text}}}

def count_O(dict1):
    loggedin_list = []
    for dic in dict1:
        # print(dict1[dic])
        print(dict1[dic]['online'])
        print(dict1[dic]['name'])
        if (dict1[dic]['online']==True):
            loggedin_list.append(dict1[dic]['name'])
    k = "The number of users who are currently logged in is "+str(len(loggedin_list))
    print(k)
    print(loggedin_list)
    return k
    
def count_F(dict1):
    loggedout_list = []
    for dic in dict1:
        # print(dict1[dic])
        print(dict1[dic]['online'])
        print(dict1[dic]['name'])
        if (dict1[dic]['online']==False):
            loggedout_list.append(dict1[dic]['name'])
    k = "The number of users who are currently logged out is "+str(len(loggedout_list))
    print(k)
    print(loggedout_list)
    return k
    

def validate_org_email(user,org):
    for dic in dict1:
        print(user,dict1[dic]['email'])
        print(org,dict1[dic]['organization'])
        if(dict1[dic]['email']==user):
            print("inside")
            if(dict1[dic]['organization']==org):
                return True
    else:
        return False

def dispatch(intent_request):
    #scrape the user intent
    intent_name = intent_request['currentIntent']['name']
    # print(intent_request)
    if intent_name == "HelpChat":
        #scrape the slot data
        User = intent_request['currentIntent']['slots']['User']
        organisation = intent_request['currentIntent']['slots']['organisation']
        people = intent_request['currentIntent']['slots']['people']
        status = intent_request['currentIntent']['slots']['status']
        print(User,organisation,people,status)
        
        if(validate_org_email(User,organisation)==True):
            if(status=='online'):
                s = who_loggedin(dict1)
                print(people)
                if (people == "many"):
                    return count_O(dict1)
                else:
                    return s
            elif(status=='offline'):
                s = who_loggedout(dict1)
                print(people)
                if (people == "many"):
                    return count_F(dict1)
                else:
                    return s
        else:
            return  "Sorry but info you gave is incorrect!!"
            
    #     query = "SELECT SUM(%s) FROM prod_channels;" % metric_name
    #     db = pymysql.connect(host=HOST,user=USERNAME,password=PASSWORD,db=DB_NAME,charset='utf8mb4',cursorclass=pymysql.cursors.DictCursor)
    
    #     resultant_string_name = 'SUM(%s)' % metric_name
    #     return query_db(db,query)[0][resultant_string_name]
    
def who_loggedin(dict1):
    loggedin_list = []
    for dic in dict1:
        # print(dict1[dic])
        print(dict1[dic]['online'])
        print(dict1[dic]['name'])
        if (dict1[dic]['online']==True):
            loggedin_list.append(dict1[dic]['name'])
    s =""
    for i in loggedin_list:
        s = s+i+' , '
    k = "The other users who are currently logged in is "+s
    print(k)
    print(loggedin_list)
    return k
    
def who_loggedout(dict1):
    loggedout_list = []
    for dic in dict1:
        # print(dict1[dic])
        print(dict1[dic]['online'])
        print(dict1[dic]['name'])
        if (dict1[dic]['online']==False):
            loggedout_list.append(dict1[dic]['name'])
    s =""
    for i in loggedout_list:
        s = s+i+' , '
    k = "The other users who are currently logged out is "+s
    print(k)
    print(loggedout_list)
    return k


def lambda_handler(event, context):
    # TODO implement

    # r = requests.get("https://us-central1-clear-gantry-283402.cloudfunctions.net/cloudJson")
    # # print(r.json())
    
    # dict1 = r.json()
    
    text = dispatch(event)
    
    return package_text(text)