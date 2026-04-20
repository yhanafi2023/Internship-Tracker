from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv
import bcrypt
from groq import Groq
import PyPDF2
import base64
import io
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import datetime



load_dotenv()
print("GROQ KEY:", os.getenv("GROQ_API_KEY"))
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:5173",
    "https://internship-tracker-alpha.vercel.app"
]}})

limiter = Limiter(app=app,
    key_func=get_remote_address,
    default_limits=[]
)


# PostgreSQL configuration
db_user = os.getenv('DATABASE_USER')
db_password = os.getenv('DATABASE_PASSWORD')
db_host = os.getenv('DATABASE_HOST')
db_name = os.getenv('DATABASE_NAME')
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@{db_host}:5432/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)




class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)  
    is_admin = db.Column(db.Boolean, default=False)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    position = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200))
    status = db.Column(db.String(50), default='Applied')
    application_date = db.Column(db.String(50))
    deadline = db.Column(db.String(50))
    salary = db.Column(db.String(100))
    notes = db.Column(db.Text)
    link = db.Column(db.String(500))
    description = db.Column(db.Text)
class LoginLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    login_time = db.Column(db.DateTime, default=lambda: datetime.datetime.now(pytz.timezone('US/Eastern')))

# Initialize DB
with app.app_context():
    db.create_all()

# Signup
@app.route("/signup", methods=["POST"])
@limiter.limit("5 per minute")  # Limit to 5 signup attempts per minute per IP
def signup():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if User.query.filter_by(email=email).first():
            return jsonify({"success": False, "message": "Email already exists"})

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(email=email, password=hashed.decode('utf-8'))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Login
@app.route("/login", methods=["POST"])
@limiter.limit("10 per minute")  # Limit to 10 login attempts per minute per IP
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            log = LoginLog(user_id=user.id, email=user.email)
            db.session.add(log)
            db.session.commit()
            return jsonify({"success": True, "is_admin": user.is_admin})
        else:
            return jsonify({"success": False, "message": "Invalid credentials"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
@app.route("/applications", methods=["POST"])
@limiter.limit("30 per minute")  # Limit to 30 application creations per minute per IP
def add_application():
    try:
        data = request.get_json()
        email = data.get("email")
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404
        new_application = Application(
            user_id=user.id,
            company=data.get("company"),
            position=data.get("position"),
            location=data.get("location"),
            status=data.get("status"),
            application_date=data.get("applicationDate"),  
            deadline=data.get("deadline"),
            salary=data.get("salary"),
            notes=data.get("notes"),
            link=data.get("link"),
            description=data.get("description")
        )
        db.session.add(new_application)
        db.session.commit()
        return jsonify({"success": True, "id": new_application.id})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/applications/<email>", methods=["GET"])
@limiter.limit("30 per minute")  # Limit to 30 application retrievals per minute per IP
def get_applications(email):
    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404
        apps = Application.query.filter_by(user_id=user.id).all()
        return jsonify({
            "success": True,
            "applications": [{
                "id": a.id,
                "company": a.company,
                "position": a.position,
                "location": a.location,
                "status": a.status,
                "applicationDate": a.application_date,
                "deadline": a.deadline,
                "salary": a.salary,
                "notes": a.notes,
                "link": a.link,
                "description": a.description
            } for a in apps]
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/applications/<int:app_id>", methods=["DELETE"])
@limiter.limit("30 per minute")  # Limit to 30 application deletions per minute per IP
def delete_application(app_id):
    try:
        application = Application.query.get(app_id)
        if not application:
            return jsonify({"success": False, "message": "Application not found"}), 404
        db.session.delete(application)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/applications/<int:app_id>", methods=["PUT"])
@limiter.limit("15 per minute")  # Limit to 15 application updates per minute per IP
def update_application(app_id):
    try:
        data = request.get_json()
        application = Application.query.get(app_id)
        if not application:
            return jsonify({"success": False, "message": "Application not found"}), 404

        application.company = data.get("company", application.company)
        application.position = data.get("position", application.position)
        application.location = data.get("location", application.location)
        application.status = data.get("status", application.status)
        application.application_date = data.get("applicationDate", application.application_date)
        application.deadline = data.get("deadline", application.deadline)
        application.salary = data.get("salary", application.salary)
        application.notes = data.get("notes", application.notes)
        application.link = data.get("link", application.link)
        application.description = data.get("description", application.description)

        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
@app.route("/applications/<email>/with-description", methods=["GET"])
@limiter.limit("100 per minute")  # Limit to 100 application retrievals with description per minute per IP
def get_applications_with_description(email):
    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        apps = Application.query.filter_by(user_id=user.id).filter(
            Application.description != None, 
            Application.description != ''
        ).all()
        
        return jsonify({
            "success": True,
            "applications": [{
                "id": a.id,
                "company": a.company,
                "position": a.position,
                "description": a.description
            } for a in apps]
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Get AI feedback

@app.route("/ai-feedback", methods=["POST"])
@limiter.limit("5 per hour")  # Limit to 5 AI feedback requests per hour per IP
def ai_feedback():
    try:
        data = request.get_json()
        resume_base64 = data.get("resume")
        job_description = data.get("description")

        
        if "," in resume_base64:
            resume_base64 = resume_base64.split(",")[1]

        
        resume_bytes = base64.b64decode(resume_base64)

        #read text from the PDF
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(resume_bytes))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text()

        
        #connect to Groq AI
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": f"Here is a job description:\n\n{job_description}\n\nHere is the resume:\n\n{resume_text}\n\nPlease review the resume and provide specific feedback on how well it matches this job description. Highlight strengths, weaknesses, and suggest improvements."
                }
            ]
        )

        feedback = response.choices[0].message.content
        print("Groq response received")
        return jsonify({"success": True, "feedback": feedback})
    except Exception as e:
        print("ERROR: Please Input a valid resume or valid job description.", str(e))
        return jsonify({"success": False, "message": "ERROR: Please Input a valid resume or valid job description."}), 500
@app.route("/interview-feedback", methods=["POST"])
@limiter.limit("5 per hour")  # Limit to 5 interview feedback requests per hour per IP
def interview_feedback():
    try:
        data = request.get_json()
        job_description = data.get("description")
        position = data.get("position")
        company = data.get("company")
        #connect to Groq AI
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": f"""You are an expert interview coach. Based on the following job description for a {position} role at {company}, generate 10 likely interview questions (mix of behavioral, technical, and situational). For each question, provide key points to focus on in the response.

Job Description:
{job_description}

Format your response like this for each question:
QUESTION 1: [question here]
KEY POINTS: [key points here]

Do not use any markdown, asterisks, or special formatting. Use plain text only."""
                }
            ]
        )

        feedback = response.choices[0].message.content
        print("Groq response received")
        return jsonify({"success": True, "feedback": feedback})
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "message": str(e)}), 500
@app.route("/applications/<email>/with-interview-status", methods=["GET"])
def get_interview_applications(email):
    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        apps = Application.query.filter_by(user_id=user.id).filter(
            Application.status == 'interview',
            Application.description != None,
            Application.description != ''
        ).all()
        
        return jsonify({
            "success": True,
            "applications": [{
                "id": a.id,
                "company": a.company,
                "position": a.position,
                "description": a.description
            } for a in apps]
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
@app.route("/admin/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify({"success": True, "users": [
        {"id": u.id, "email": u.email, "is_admin": u.is_admin} for u in users
    ]})

@app.route("/admin/delete/<int:user_id>", methods=["POST"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:                                          
        return jsonify({"success": False, "message": "User not found"}), 404
        Application.query.filter_by(user_id=user_id).delete()
        LoginLog.query.filter_by(user_id=user_id).delete()
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": True})
    return jsonify({"success": True})
@app.route("/admin/logs", methods=["GET"])
def get_logs():
    logs = LoginLog.query.order_by(LoginLog.login_time.desc()).all()
    return jsonify({"success": True, "logs": [
        {"email": l.email, "login_time": l.login_time.strftime("%Y-%m-%d %H:%M:%S")} for l in logs
    ]})

@app.route("/admin/make-admin/<int:user_id>", methods=["POST"])
def make_admin(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    user.is_admin = not user.is_admin 
    db.session.commit()
    return jsonify({"success": True, "is_admin": user.is_admin})
if __name__ == "__main__":
    print("Starting Flask...")
    app.run(host="127.0.0.1", port=5000, debug=True)