from app import create_app, db
from app.models import User, Class, Enrollment, Grade

app = create_app()

@app.shell_context_processor
def shell():
    return {"db": db, "User": User, "Class": Class, "Enrollment": Enrollment, "Grade": Grade}