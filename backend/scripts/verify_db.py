from sqlmodel import Session, select
from database import engine
from db_models.university import University
from db_models.scholarship import Scholarship

def test_db_queries():
    print("Testing database queries...")
    with Session(engine) as session:
        # Check universities
        unis = session.exec(select(University)).all()
        print(f"Found {len(unis)} universities.")
        if unis:
            print(f"Sample University: {unis[0].university} ({unis[0].country})")
        
        # Check scholarships
        schs = session.exec(select(Scholarship)).all()
        print(f"Found {len(schs)} scholarships.")
        if schs:
            print(f"Sample Scholarship: {schs[0].scholarship_name} ({schs[0].country})")
            
    print("Database verification successful!")

if __name__ == "__main__":
    try:
        test_db_queries()
    except Exception as e:
        print(f"Verification FAILED: {str(e)}")
