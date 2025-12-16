import pandas as pd

def add_university(data):
    df = pd.read_csv("backend/data/universities.csv")
    df = df.append(data, ignore_index=True)
    df.to_csv("backend/data/universities.csv", index=False)
