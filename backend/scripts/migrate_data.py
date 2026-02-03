import pandas as pd
import os
import sys
from sqlmodel import Session, SQLModel, delete

# Add current directory to path so we can import from local files
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, create_db_and_tables
from db_models.university import University
from db_models.scholarship import Scholarship

def migrate_universities():
    csv_path = "data/universities.csv"
    if not os.path.exists(csv_path):
        print(f"Skipping Universities: {csv_path} not found")
        return

    df = pd.read_csv(csv_path)
    # Fill NaN values with None/empty strings for SQLModel
    df = df.where(pd.notnull(df), None)
    
    with Session(engine) as session:
        session.exec(delete(University))
        for _, row in df.iterrows():
            uni = University(
                university=row['university'],
                country=row['country'],
                city=row['city'],
                field=row['field'],
                min_gpa=float(row['min_gpa']),
                min_ielts=float(row['min_ielts']),
                average_fees_eur=float(row['average_fees_eur']),
                ranking=int(row['ranking']),
                course_url=row.get('course_url')
            )
            session.add(uni)
        session.commit()
    print(f"Migrated {len(df)} universities.")

def migrate_scholarships():
    csv_path = "data/scholarships.csv"
    if not os.path.exists(csv_path):
        print(f"Skipping Scholarships: {csv_path} not found")
        return

    df = pd.read_csv(csv_path)
    df = df.where(pd.notnull(df), None)

    with Session(engine) as session:
        session.exec(delete(Scholarship))
        for _, row in df.iterrows():
            # Handle amount_eur which might be a string or NaN
            amount = row['amount_eur']
            if isinstance(amount, str):
                amount = float(amount.replace(',', ''))
            
            sch = Scholarship(
                scholarship_name=row['scholarship_name'],
                country=row['country'],
                eligible_universities=row['eligible_universities'],
                coverage=row['coverage'],
                amount_eur=float(amount) if amount is not None else None,
                eligibility=row['eligibility'],
                website_url=row.get('website_url')
            )
            session.add(sch)
        session.commit()
    print(f"Migrated {len(df)} scholarships.")

if __name__ == "__main__":
    print("Starting migration...")
    create_db_and_tables()
    migrate_universities()
    migrate_scholarships()
    print("Migration complete!")
