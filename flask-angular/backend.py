import datetime
from email import message
import email
from functools import wraps
from sqlalchemy import and_
# from readline import replace_history_item
import jwt
from flask import Flask,jsonify,request,abort,make_response
from flask_sqlalchemy import SQLAlchemy;
from urllib.parse import quote 
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
import uuid
# from messaging import messaging
from ftsestock import ftseStock
from passlib.hash import sha256_crypt
import json
import hashlib
import datetime as dt
# from sendmail import sendemail
from flask_mail import Mail
import stockservices 
from sqlalchemy import delete



app = Flask(__name__)
CORS(app, supports_credentials=True)

# app.register_blueprint(ftse)

app.register_blueprint(ftseStock)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
app.config['SECRET_KEY'] = 'NEVERSHARESECRET'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:%s@127.0.0.1/flaskdb'% quote('Mer@sql2021')
app.config['CORS_HEADERS'] = 'application/json'
app.config['CORS_ALLOW_CREDENTIALS'] = True
app.config['CORS_ORIGINS']='*'


app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'finassiststockapp@gmail.com'
app.config['MAIL_PASSWORD'] = 'zlpmiflsrjwupkbp'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(50),nullable=False)
    password = db.Column(db.String(100))
    emailid = db.Column(db.String(80),unique=True)
    dob = db.Column(db.Date)
    address = db.Column(db.String(80))
    admin = db.Column(db.String(2),default="01")
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Favourites(db.Model):
    fav_id = db.Column(db.Integer, primary_key=True, autoincrement="auto")
    user_id = db.Column(db.String(50),db.ForeignKey(User.public_id), nullable=False )
    ticker = db.Column(db.String(50),nullable=False,unique=True)

class Message(db.Model):
    msg_id = db.Column(db.String(50), primary_key=True)
    message = db.Column(db.Text(255))
    msgdate = db.Column(db.DateTime)
    userId = db.Column(db.String(50))
    isUser =db.Column(db.Boolean)
    isRepied =db.Column(db.Boolean)

class Reply(db.Model):
    msg_id= db.Column(db.String(50),db.ForeignKey(Message.msg_id) )
    reply_id = db.Column(db.String(50), primary_key=True)
    reply =db.Column(db.Text(255))
    isUser =db.Column(db.Boolean)
    replydate = db.Column(db.DateTime)
    expertid = db.Column(db.String(50) )
    rating = db.Column(db.Integer)



class Sectors(db.Model):
    # id = db.Column(db.Integer, primary_key=True, autoincrement="auto")
    Industry_code = db.Column(db.String(20))
    Industry = db.Column(db.String(50))
    Supersector_code =db.Column(db.String(20))
    Supersector = db.Column(db.String(50))
    Sector_code =db.Column(db.String(20))
    Sector = db.Column(db.String(50))
    Subsector_code =db.Column(db.String(20))
    Subsector = db.Column(db.String(50),primary_key=True)
    Definition = db.Column(db.Text(255))


class Companies(db.Model):
        code = db.Column(db.String(20),primary_key =True)
        name = db.Column(db.String(50))
        marketcap =db.Column(db.Numeric(10,2))
        ISIN = db.Column(db.String(50))
        admitdate =db.Column(db.DateTime)
        subsectors = db.Column(db.String(50),db.ForeignKey(Sectors.Subsector))
        newscode = db.Column(db.String(20))

class Percent(db.Model):
    code = db.Column(db.String(20),db.ForeignKey(Companies.code),primary_key=True)
    name = db.Column(db.String(50))

db.create_all()



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401

        try: 
            data = jwt.decode(token, app.config['SECRET_KEY'],algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message' : 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated



def stringtoDatefn(date_string):
    return dt.datetime.strptime(date_string, '%d %B %Y')


@app.route("/")
# @app.before_request
def index():

    if 'sectors'  in db.metadata.tables.keys() :


        with open('company_sectors.json') as f:
            d = json.load(f)
            
            keysList = list(d['ICBsubs'][0].keys())
            new_sec =[]
            for sect in keysList :
                sect_details = d['ICBsubs'][0][sect]
                #    new_sec.append(sect_details['Subsector'])
                # return jsonify(new_sec)
                db.session.add_all(    
                [ Sectors(
                    Industry_code =sect_details['Industry code'],
                    Industry =sect_details['Industry'],
                    Supersector_code =sect_details['Supersector code'],
                    Supersector =sect_details['Supersector'],
                    Sector_code =sect_details['Sector code'],
                    Sector =sect_details['Sector'],
                    Subsector_code =sect_details['Subsector code'],
                    Subsector =sect_details['Subsector'],
                    Definition =sect_details['Definition'] 
                    )
                ])

            try:

                db.session.commit()
                addCompany()
                return jsonify("{message :sector table filled}")

            except Exception as e:
                db.session.rollback()
                abort(e)  

    return jsonify("{no new insert}") 


@app.route("/company")
def addCompany():

    if 'companies' in db.metadata.tables.keys():

        with open('company_details.json') as companylist:
            company = json.load(companylist)

        with open('newscode.json') as newslist :
            news= json.load(newslist)


            new_sub = []
            # keysList = list(d['ICBsubs'][0].keys())
            keysList= list(company[0].keys())
            for comp in keysList :
                comp_details = company[0][comp]
                #    new_sub.append(comp_details['subsectors'])
                # return jsonify(new_sub)
                db.session.add_all(    
                [ Companies(
                    code =comp_details['code'],
                    name =comp_details['name'],
                    marketcap =comp_details['marketcap'],
                    ISIN =comp_details['ISIN'],
                    admitdate =stringtoDatefn(comp_details['admitdate']),
                    subsectors =comp_details['subsectors'],
                    newscode = news[comp_details['code']]
                    )
                ])

            try:

                db.session.commit()
                return jsonify("{message :company table filled}")

            except Exception as e:
                db.session.rollback()
                abort(e) 
    return jsonify("{no new insert}")  




        # return jsonify(keysList)


        # for word in  d['ICBsubs']:
        #     # print(word)
        #     wordlist.append(word)

@app.route("/createuser" , methods=['POST'])
# @token_required  
def createuser():
    data = request.get_json()

    
    # if not current_user.admin:
    #     abort(403)

    # password = sha256_crypt.encrypt(data['password'].encode()).hexdigest()
    # password = hashlib.sha256(data['password'].encode()).hexdigest()
   

    new_user = User(public_id = str(uuid.uuid4()),name= data['name'],emailid=data['email'], 
    password= data['password'],dob=data['dob'],address = data['address'],admin = data['admin'])
    try:
        db.session.add(new_user)
        db.session.commit()

        response = jsonify("{message :new user created and mailsend}")
        response.headers.add('Access-Control-Allow-Origin', '*')

        # msg=
        mail.send_message(
        'Registeration Successful',
        sender='finassiststockapp@gmail.com',
        recipients=[data['email']],
        body="Congratulations "+data['name']+"!!\n You've sucessfully registered in the FIN ASSIST APP! "
    )
        
        return response

    
    except Exception as e:
        db.session.rollback()
        abort(e)  


@app.route("/allusers" , methods=['GET'])
@token_required
def get_all_users(current_user):

    if not current_user.admin:
        abort(403)

    users = User.query.all()

    output_users = []

    for user in users:
        user_data ={}
        user_data['public_id'] = user.public_id
        user_data['name'] = user.name
        user_data['emailid'] = user.emailid
        user_data['dob'] = user.dob
        user_data['address'] = user.address
        user_data['admin'] = user.admin
        user_data['created_on'] = user.created_on
        
        output_users.append(user_data)

    return jsonify({'response' :output_users}) 

        
@app.route("/user/<public_id>" , methods=['GET'])
@token_required
def get_user(current_user,public_id):

    if not current_user.admin:
        abort(403)

    try:
        user =User.query.filter_by(public_id=public_id).first()

        if not user :
            return jsonify({'response' : 'no user found'})

        user_data ={}
        user_data['public_id'] = user.public_id
        user_data['name'] = user.name
        user_data['emailid'] = user.emailid
        user_data['dob'] = user.dob
        user_data['address'] = user.address
        user_data['admin'] = user.admin
        user_data['password'] = user.password

        return jsonify({'response' : user_data})

    except Exception as e:
       abort(e)  



@app.route('/user/<public_id>', methods=['PUT'])
@token_required
def user_role_upgrade(current_user ,public_id):
    data = request.get_json()

    if not current_user.admin:
        abort(403)

    try :
        user = User.query.filter_by(public_id=public_id).first()

        if not user:
            return jsonify({'response' : 'no user found'})

        user.admin = data['value']
        db.session.commit()
        db.session.close()
        return jsonify({'response' : ' user role upgraded'})

    except Exception as e:
        db.session.rollback()
        abort(e) 


@app.route('/user/<public_id>', methods=['DELETE'])
@token_required
def delete_user(current_user,public_id):

    if not current_user.admin:
        abort(403)

    try:
        # delete(Favourites).where(user_id=public_id)
        Favourites.query.filter_by(user_id=public_id).delete() 
        user = User.query.filter_by(public_id=public_id).first()
        # favlist = Favourites.query.filter_by(user_id=public_id).all()

        if not user:
            return jsonify({'response' : 'no user found'})

        db.session.delete(user)
        db.session.commit()
        db.session.close()
        return jsonify({'response' : ' user deleted'})

    except Exception as e:
        db.session.rollback()
        db.session.close()
        abort(e) 

@app.route('/login')
# @auth.login_required
def login():
    auth = request.authorization

    try:
        user = User.query.filter_by(emailid =auth.username).first()

        if not user:
            return make_response(jsonify('Could not verify'), 401, {'WWW-Authenticate' : 'Basic realm="Please check the credentials!"'})
        
        if user.password == auth.password :
            token = jwt.encode({'public_id' : user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'],algorithm="HS256")

            response = jsonify({'token' : token,"sign" : user.admin,'name':user.name,'email':user.emailid})
           
            db.session.close()
            return response
        else:
            db.session.close()
            return make_response(jsonify('please check username and password'), 401,{'WWW-Authenticate' : 'Basic realm="Please check the credentials!"'})


    except Exception as e:
        db.session.close()
        abort(e) 


# @token_required
@app.route('/getstocklist',methods=['GET'])
def getstocks():
    return stockservices.basic_stocklist()


@app.route('/stockInfo/<stock_id>',methods=['GET'])
def getInfo(stock_id):
    return stockservices.stockInfoDB(stock_id)

@app.route('/stockvol',methods=['GET'])
def getVol():
    return stockservices.homeVolMarket()

@app.route('/percentChange',methods=['GET'])
def getpercent():
    
    percentjson= stockservices.percentChnge()
    if 'percent' in db.metadata.tables.keys():
        db.session.query(Percent).delete()
        db.session.commit()


        percent = percentjson.get_json()
        keysList= list(percent.keys())
        # new = percent["AZN"]

        for item in keysList:
             db.session.add_all(    
                [ Percent(
                    code =item,
                    name =percent[item] 
                    )
                ])
        try:

            db.session.commit()
            return jsonify("{message :percent table filled}")

        except Exception as e:
            db.session.rollback()
            abort(e) 
    return jsonify("{no new insert}")







@app.route('/gainlose',methods=['GET'])
def getGainersLoser():
    return stockservices.gainerLosers()


@app.route('/diffindushome',methods=['GET'])
def difIndustryHome( ):
    try:
        final_op ={}
        allindus = ['Technology','Industrials','Telecommunications','Health Care','Financials','Energy','Consumer Staples','Real Estate','Basic Materials','Consumer Discretionary','Utilities']
        for idx, x in enumerate(allindus, start=1):

            outercompanydict =[]

            productstore = db.session.query( Companies,Sectors).join(Sectors,and_( Sectors.Subsector == Companies.subsectors,Sectors.Industry==x)).all()

            for pdt in productstore:
                stk_op ={}
                stk_op['code']= pdt[0].code
                stk_op['industry']= pdt[1].Industry

                daily_percent = Percent.query.filter_by(code=pdt[0].code).first()
                stk_op['daily']= daily_percent.name

                outercompanydict.append(stk_op)

            final_op[x] =outercompanydict

        return jsonify(final_op)

    except Exception as e:
        abort(e)   


@app.route('/indus-stock',methods=['GET'])
def IndustryStock(ticker ):
    try:
      
        outercompanydict =[]

        productstore = db.session.query( Companies,Sectors).join(Sectors,and_( Sectors.Subsector == Companies.subsectors,Sectors.Industry==ticker)).all()

        for pdt in productstore:
            stk_op ={}
            stk_op['code']= pdt[0].name
            stk_op['industry']= pdt[1].Industry

            daily_percent = Percent.query.filter_by(code=pdt[0].code).first()
            stk_op['daily']= daily_percent.name

            outercompanydict.append(stk_op)

        db.session.close()
        return jsonify(outercompanydict)

    except Exception as e:
        abort(e)   


@app.route('/addtofav', methods=['POST','GET'])
@token_required
def add_fav(current_user):
    # print (data)
    if request.method == 'POST':
        data = request.get_json()
        new_fav = Favourites(user_id = current_user.public_id,ticker=data['code'])
        try:
            db.session.add(new_fav)
            db.session.commit()

            response = jsonify("{message :favorite stock added}")
            response.headers.add('Access-Control-Allow-Origin', '*')
            db.session.close()
            return response

        
        except Exception as e:
            db.session.rollback()
            abort(e)  

    if request.method == 'GET':
        # print (data)
        # new_fav = Favourites(user_id = current_user.public_id,ticker=data['code'])
        try:
            favorite =Favourites.query.filter_by(user_id=current_user.public_id).all()

            if not favorite :
                return jsonify({'response' : 'nofav'})


            fav_data =[]
            stock_ticker_list =[]
            stock_names =[]
            for item in favorite:
                fav_op ={}
                fav_percent =  Percent.query.filter_by(code=item.ticker).first()

                # fav_op['code'] =item.ticker
                fav_op[item.ticker+'.L']= fav_percent.name

                fav_data.append(fav_op)
                stock_ticker_list.append(item.ticker+'.L')
                stock_det =  Companies.query.filter_by(code=item.ticker).first()
                stock_names.append(stock_det.name)
            
            db.session.close()
            return jsonify({'codepercent' : fav_data,'codelist' :stock_ticker_list,'codenames' :stock_names})

        except Exception as e:
            db.session.close()
            abort(e)  

@app.route('/rmvfav/<ticker>', methods=['DELETE'])
@token_required
def rmv_fav(current_user,ticker):
    # print (data)
    try:
        fav_stk =Favourites.query.filter_by(user_id=current_user.public_id,ticker=ticker).first()

        if not fav_stk:
            return jsonify({'response' : 'no favstock found'})

        db.session.delete(fav_stk)
        db.session.commit()
        db.session.close()
        return jsonify({'response' : ' Fav stock deleted'})

    except Exception as e:
        db.session.rollback()
        db.session.close()
        abort(e) 


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
        db.session.close()
        return response

    
    except Exception as e:
        db.session.rollback()
        db.session.close()
        abort(e)  


@app.route("/createreply" , methods=['POST'])
@token_required
def add_reply(current_user):
    data = request.get_json()

    new_reply = Reply(reply_id = str(uuid.uuid4()),msg_id = data['msgid'],reply= data['reply'], 
    isUser= data['isUser'],replydate=data['replydate'],expertid = current_user.public_id)

    msg = Message.query.filter_by(msg_id=data['msgid']).first()
    


    try:
        msg.isRepied = True
        db.session.add(new_reply)
        db.session.commit()
        db.session.close()

        response = jsonify("{message :new reply created}")
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    
    except Exception as e:
        db.session.rollback()
        db.session.close()
        abort(e)  


@app.route('/conversation',methods=['GET'])
@token_required
def getConversation(current_user):
    try:
      
        msgarray =[]

        conversation = db.session.query( Message,Reply).join(Reply,and_(Reply.msg_id == Message.msg_id,Message.userId == current_user.public_id)).all()
        # msg_op_array ={}
        for item in conversation:
            msg_op ={}
            msg_op['msgid']= item[0].msg_id
            msg_op['message']= item[0].message
            msg_op['msgdate']=item[0].msgdate
            user = User.query.filter_by(public_id=item[0].userId).first()

            msg_op['user_name']=user.name
            msg_op['isUser']=item[0].isUser
            msg_op['rating']=''

            msgarray.append(msg_op)

            reply_op ={}
            reply_op['msgid']= item[1].reply_id
            reply_op['message']= item[1].reply
            reply_op['msgdate']=item[1].replydate

            expert = User.query.filter_by(public_id=item[1].expertid).first()
            reply_op['user_name']=expert.name
            reply_op['isUser']=item[1].isUser
            reply_op['rating']=item[1].rating

            msgarray.append(reply_op)

        nonreplied_msgs = Message.query.filter(Message.userId == current_user.public_id,Message.isRepied==False).all()
        if(nonreplied_msgs):
            for item in nonreplied_msgs:
                noreply_msg_op ={}

                noreply_msg_op['msgid']= item.msg_id
                noreply_msg_op['message']= item.message
                noreply_msg_op['msgdate']=item.msgdate
                newuser = User.query.filter_by(public_id=item.userId).first()
                noreply_msg_op['user_name']=newuser.name
                noreply_msg_op['isUser']=item.isUser
                noreply_msg_op['rating']=''
                msgarray.append(noreply_msg_op)
            

        db.session.close()
        return jsonify(msgarray)

    except Exception as e:
        abort(e)  


@app.route('/star-rating', methods=['PUT'])
@token_required
def reply_star_rating(current_user ):
    data = request.get_json()

    # if not current_user.admin:
    #     abort(403)

    try :
        current_reply = Reply.query.filter_by(reply_id=data['reply_id']).first()

        if not current_reply:
            return jsonify({'response' : 'no user found'})

        current_reply.rating = data['rating']
        db.session.commit()
        db.session.close()
        return jsonify({'response' : ' rating updated'})

    except Exception as e:
        db.session.rollback()
        abort(e) 


@app.route('/unanswered',methods=['GET'])
@token_required
def unAnsweredQstns(current_user):

    if  current_user.admin != "11":
        abort(403)
    try:

        msgs = Message.query.filter_by(isRepied =False).all()
        msgarray=[]
        for item in msgs:
            noreply_msg_op ={}

            noreply_msg_op['msgid']= item.msg_id
            noreply_msg_op['message']= item.message
            noreply_msg_op['msgdate']=item.msgdate
            noreply_msg_op['isRepied']=item.isRepied
            # noreply_msg_op['user_id']=item.userId
            noreply_msg_op['isUser']=item.isUser
            noreply_msg_op['rating']=''

            msgarray.append(noreply_msg_op)

        db.session.close()
        return jsonify( msgarray)
    
    except Exception as e:
        
        db.session.rollback()
        db.session.close()
        abort(e)

@app.route('/expertreplies',methods=['GET'])
@token_required
def repliesExpert(current_user):

    if  current_user.admin != "11":
        abort(403)
    try:
        # conversation = db.session.query(Reply, Message).join(Message,and_(Reply.msg_id == Message.msg_id,Message.userId == current_user.public_id)).all()

        replies = Reply.query.filter_by(expertid =current_user.public_id).all()
        msgarray=[]
        for item in replies:
            reply_op ={}

            reply_op['msgid']= item.msg_id
            msg = Message.query.filter_by(msg_id =item.msg_id).first()
            reply_op['message']= msg.message
            reply_op['msgdate']= msg.msgdate
            reply_op['replyid']= item.reply_id
            reply_op['reply']= item.reply
            reply_op['replydate']=item.replydate
            reply_op['rating']=item.rating

            msgarray.append(reply_op)

        db.session.close()
        return jsonify( msgarray)
    
    except Exception as e:
        
        db.session.rollback()
        db.session.close()
        abort(e)



@app.errorhandler(Exception)
def errormsg(e):
    return jsonify(error=str(e)),400


@app.errorhandler(403)
def errormsg(e):
    return jsonify(error=str(e)),403

# @app.errorhandler(403)
#     return jsonify(error=str(e)), 404



@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()



if __name__ == "__main__":
     app.run(debug=True)
    #  app.before_first_request(index())
    #  addCompany()

