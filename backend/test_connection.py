from sqlalchemy import create_engine, text

DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/projet_odyssee"

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    result = conn.execute(text("SELECT 1")).scalar()
    print("Connexion OK, résultat :", result)