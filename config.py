from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date
import os

print(os.chdir('../class/data-viz-group-project'))

Base = declarative_base()
class Tweets(Base):
    __tablename__ = 'all_tweets'
    claim_index = Column(Integer, primary_key=True)
    claim_date = Column(Date)
    claim_source = Column(String)
    clai_rating = Column(String)
    claim_topic = Column(String)
    claim_text = Column(String)
    claim_response = Column(String)
    claim_link = Column(String)
    claim_repeat_count = Column(Integer)
    claim_repeat_date = Column(Date)

database_uri = 'postgres+psycopg2://postgres:postgres@localhost/classproject2'
engine = create_engine(database_uri)
Base.metadata.create_all(engine)

path = os.getcwd()
print(path)