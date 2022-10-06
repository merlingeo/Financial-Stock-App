import uuid
from flask import Flask,jsonify,request,abort,make_response
from backend import Companies, Message, Percent, Sectors, User
from datetime import date,timedelta,datetime

from backend import app,db,token_required

@app.route("/createmsg" , methods=['POST'])
@token_required
def add_message(current_user):
    data = request.get_json()

    new_msg = Message(msg_id = str(uuid.uuid4()),message= data['message'],userId=current_user.public_id, 
    isUser= data['isUser'],msgdate=data['msgdate'],isRepied = data['isRepied'])
    try:
        db.session.add(new_msg)
        db.session.commit()

        response = jsonify("{message :new msg created}")
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    
    except Exception as e:
        db.session.rollback()
        abort(e)  
