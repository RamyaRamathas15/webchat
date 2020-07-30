import pymysql.cursors
import requests
import json

r = requests.get("https://us-central1-clear-gantry-283402.cloudfunctions.net/cloudJson")
    # print(r.json())
    
dict1 = r.json()

#a function to prepare a string for the lex bot response
def package_text(text):
    return {"dialogAction": {"type": "Close","fulfillmentState": "Fulfilled","message": {"contentType": "PlainText","content": text}}}

#a function to query the db
def query_db(db,query):
    try:
        with db.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchall()
            db.close()
    except:
        result = "Trouble reaching the datasource"
    return result

#the main processing function
def dispatch(intent_request):
    print("inside")
    #scrape the user intent
    intent_name = intent_request['currentIntent']['name']
    if intent_name == "HelpRDS":
        #scrape the metric slot
        email = intent_request['currentIntent']['slots']['user']
        print(email)
        userid = ""
        for dic in dict1:
            if(dict1[dic]['email']==email):
                userid = dic
        if userid == "": 
            return "Sorry cannot help email you entered is incorrect!!"

        # query = "SELECT question , answer FROM lms.userdetails where uid = "+userid+" ;"
        query = "select * from userdetails;"
        print(query)
        db = pymysql.connect(host="lms.cwjvkekjyh6m.us-east-1.rds.amazonaws.com",user='admin',password='password',db='lms',cursorclass=pymysql.cursors.DictCursor)
    
        # resultant_string_name = 'SUM(%s)' % metric_name
        list_result = query_db(db,query)
        print(list_result)
        res1=[]
        for list in list_result:
            print(userid,list['uid'])
            if(list['uid'] == userid):
                res1.extend([list['question'],list['answer']])
        print(res1)
        st = "Your security question is :"+str(res1[0])+" and answer starts with "+str(res1[1])[0:2]+"xxxx"
        
        return st
#Lambda calls this function
def lambda_handler(event, context):
    k = dispatch(event)
    
    return package_text(k)


    