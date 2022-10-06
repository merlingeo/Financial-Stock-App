from flask import Flask
from flask_mail import Mail, Message

app = Flask(__name__)
mail= Mail(app)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'finassiststockapp@gmail.com'
app.config['MAIL_PASSWORD'] = 'zlpmiflsrjwupkbp'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

@app.route("/send-mail")
def sendemail(recipient):
    msg = mail.send_message(
        'Send Mail tutorial!',
        sender='finassiststockapp@gmail.com',
        recipients=[recipient],
        body="Congratulations you've succeeded!"
    )
    return 'Mail sent'
#    msg = Message('Hello', sender = 'finassiststockapp@gmail.com', recipients = ['merlin.mercygeorge@gmail.com'])
#    msg.body = "Hello Flask message sent from Flask-Mail"
#    mail.send(msg)
#    return "Sent"

if __name__ == '__main__':
   app.run(debug = True)