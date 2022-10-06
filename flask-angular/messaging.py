# import uuid
# from flask import Blueprint, render_template, session,abort,jsonify,request,abort,make_response
# messaging = Blueprint('messaging',__name__)

# from backend import Messages,db


# @messaging.route("/newmessage" , methods=['POST'])
# # @token_required  
# def addMessage():
#     data = request.get_json()

    
#     # if not current_user.admin:
#     #     abort(403)

#     new_user = Messages(public_id = str(uuid.uuid4()),name= data['name'],emailid=data['email'], 
#     password= data['password'],dob=data['dob'],address = data['address'],admin = data['admin'])
#     try:
#         db.session.add(new_user)
#         db.session.commit()

#         response = jsonify("{message :new user created}")
#         response.headers.add('Access-Control-Allow-Origin', '*')
#         return response

    
#     except Exception as e:
#         db.session.rollback()
#         abort(e)  


# # meanararay =[];
# # #    meanDf =0;
# # for i =1:10
# #    meanDF =meanDf +patient[i][df] 
# #     meanararay.append(meanDF)
# # end
# # mean =sumDf/10

