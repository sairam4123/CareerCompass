from __future__ import annotations

from dotenv import load_dotenv
load_dotenv()
import os
import uuid
import json

import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sqlalchemy import create_engine, select

import google.generativeai as genai
import fastapi
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
# from typing import TYPE_CHECKING
# if TYPE_CHECKING:
#     from prisma import Prisma
# from _prisma._types import Prisma


from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, joinedload
from sqlalchemy.orm.session import Session

SQLALCHEMY_DATABASE_URL = os.getenv("DIRECT_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL is not set.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def db():
    sqlal = SessionLocal()
    try:
        yield sqlal
    finally:
        sqlal.close()


from sqlalchemy import (
    Column, String, Integer, ForeignKey, DateTime, ARRAY, func, Uuid
)
from sqlalchemy.orm import relationship, declarative_base


from typing import List, Optional
from sqlalchemy import (
    Integer, ForeignKey, DateTime, func, ARRAY, Text, UUID
)
from sqlalchemy.orm import  Mapped, mapped_column, relationship
import uuid

def generate_uuid() -> uuid.UUID:
    return uuid.uuid4()

class Question(Base):
    __tablename__ = 'Question'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    question: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    createdAt: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updatedAt: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), server_onupdate=func.now(), nullable=False)

    # Relationships
    choices: Mapped[List[Choice]] = relationship(back_populates='question', cascade='all, delete-orphan')
    answers: Mapped[List[Answer]] = relationship(back_populates='question', cascade='all, delete-orphan')

class Choice(Base):
    __tablename__ = 'Choice'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    choice: Mapped[int] = mapped_column(Integer, nullable=False)
    label: Mapped[str] = mapped_column(Text, nullable=False)
    questionId: Mapped[uuid.UUID] = mapped_column(ForeignKey('Question.id', ondelete='CASCADE'), nullable=False)
    createdAt: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updatedAt: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), server_onupdate=func.now(), nullable=False)

    # Relationships
    question: Mapped[Question] = relationship(back_populates='choices')
    pickedAnswers: Mapped[List[Answer]] = relationship(back_populates='choice', cascade='all, delete-orphan')

class Answer(Base):
    __tablename__ = 'Answer'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    questionId: Mapped[uuid.UUID] = mapped_column(ForeignKey('Question.id', ondelete='CASCADE'), nullable=False)
    choiceId: Mapped[uuid.UUID] = mapped_column(ForeignKey('Choice.id', ondelete='CASCADE'), nullable=False)
    profileId: Mapped[uuid.UUID] = mapped_column(ForeignKey('Profile.userId', ondelete='CASCADE'), nullable=False)
    createdAt: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updatedAt: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), server_onupdate=func.now(), nullable=False)

    # Relationships
    question: Mapped[Question] = relationship(back_populates='answers')
    choice: Mapped[Choice] = relationship(back_populates='pickedAnswers')
    profile: Mapped[Profile] = relationship(back_populates='answers')

class Profile(Base):
    __tablename__ = 'Profile'

    userId: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    ageGroup: Mapped[str] = mapped_column(Text, nullable=False)
    education: Mapped[str] = mapped_column(Text, nullable=False)
    gender: Mapped[str] = mapped_column(Text, nullable=False)
    maxQuestion: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    createdAt: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updatedAt: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), server_onupdate=func.now(), nullable=False)

    # Relationships
    answers: Mapped[List[Answer]] = relationship(back_populates='profile', cascade='all, delete-orphan')
    results: Mapped[List[Result]] = relationship(back_populates='profile', cascade='all, delete-orphan')

class Result(Base):
    __tablename__ = 'Result'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    userId: Mapped[uuid.UUID] = mapped_column(ForeignKey('Profile.userId', ondelete='CASCADE'), nullable=False)
    result: Mapped[str] = mapped_column(Text, nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    match_description: Mapped[str] = mapped_column(Text, nullable=False)
    advantages: Mapped[List[str]] = mapped_column(ARRAY(Text), nullable=False)
    disadvantages: Mapped[List[str]] = mapped_column(ARRAY(Text), nullable=False)
    tags: Mapped[List[str]] = mapped_column(ARRAY(Text), nullable=False)
    createdAt: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updatedAt: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), server_onupdate=func.now(), nullable=False)

    # Relationships
    profile: Mapped[Profile] = relationship(back_populates='results')


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class BasicAnswers(BaseModel):
    age_group: str
    gender: str
    education: str

    def __str__(self):
        return f"Age Group: {self.age_group}\nGender: {self.gender}\nEducation: {self.education}"


class ChoiceSchema(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    choice: int
    label: str
    question_id: uuid.UUID = Field(alias="questionId")

    class Config:
        from_attributes = True

    def __str__(self):
        return f"Choice Label: {self.label}"


class QuestionSchema(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    question: int
    title: str
    choices: list[ChoiceSchema]

    class Config:
        from_attributes = True

    def __str__(self):
        return f"Question: {self.question}\nTitle: {self.title}"

class ResultSchema(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    result: str
    points: int
    advantages: list[str]
    disadvantages: list[str]
    match_description: str | None = None
    description: str | None = None

    class Config:
        from_attributes = True
    
    def __str__(self):
        return f"Result: {self.result}\nPoints: {self.points}"

print("Loading model...")
chatbot = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})

class ProfileSchema(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    basic_answers: BasicAnswers
    questions: list[QuestionSchema]
    answers: list[ChoiceSchema]
    results: list[ResultSchema] # 3 results
    max_questions: int = 10

    class Config:
        from_attributes = True

prompt = """
You are a career guide with expertise in understanding the job market and helping people find the right career paths. Your goal is to analyze a person's personality, interests, and education through structured questions and provide career domain suggestions (not specific job listings).  

Key rules:  
1. Ask only multiple-choice questions (MCQs) to understand the user's situation.  
2. Avoid open-ended questions under all circumstances.  
3. Tailor questions based on the user's age group, gender, education, and interests.  
4. Dive deeper into the user's field of study when applicable. For instance:  
   - For a Computer Science degree: ask about software engineering, data science, etc.  
   - For a Mathematics degree: ask about analytics, teaching, etc.  
   - For an English Literature degree: ask about writing, editing, teaching, etc.  

You get the following data:
- Age group,
- Gender
- Basic Education Qualification (you can ask for more details if needed)
- List of Questions and answered so far

**Additional Guidance:**  
- If the user dislikes their field of study, ask about their interests and hobbies to explore alternate career options.  
- Avoid recommending careers in your questions; focus solely on gathering insights.  
- Do not use "Other" as a choice in your questions.  

Provide your questions in the following JSON format:  

Refrain from recommending career paths in the question itself. Only ask questions to understand the user's personality and interests and educational qualification.
Please return the question in the following schema:
[
    {
    "max_questions": 10,
        "question": 1,
        "title": "What is your age group?",
        "choices": [{
            "choice": 1,
            "label": "18-25"
        }, 
        {
            "choice": 2,
            "label": "26-35"
        }
        ]
    },
    ]
Instructions for Behavior:

1. Always start by informing the user of the maximum number of questions you will ask.
2. Ask only one question at a time.
3. Your primary objective is to suggest a career domain based on the user's responses.

Remember: NO OPEN-ENDED QUESTIONS. NO "OTHER" CHOICES.
"""

result_prompt = """
You are a career guide, who knows a lot about understanding the job market and helping people find the right job. You are talking to a person who is looking for a job and needs help. You are going to ask them some questions to understand their situation and give them advice.
Your job is to decide a domain and a career.
Once Max Question is reached, return the result.
Ensure that the domains being suggested aligns with the user's educational qualification.
Recommend other domains as well for example Fisheries, Pollution Control, etc.
Please return the result in the following schema:
RESULT SCHEMA:
[
    {
        "result": "{role} in {domain}.",
        "points": "{points} over 100 as integer",
        "tags": ["tags", "tags", "tags", ...],
        "advantages": ["{tags}", "{tags}", ...],
        "disadvantages": ["{tags}", "{tags}", ...],
        "match_description": "Explain how the users matches with the role with relevant tags",
        "description": "What is the role and domain about? Explain in about 1-2 lines."
    }
]
You MUST provide atleast 2 results and atmost 4 results. Generate 3 results for optimal performance.
"""



app = fastapi.FastAPI(root_path="/api", debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("Model loaded.")

@app.post("/answers")
def post_basic_answers(basic_answer: BasicAnswers, dbalchemy: Session = fastapi.Depends(db)):
    print("Creating profile...", str(basic_answer))
    profile = Profile(**{"ageGroup": basic_answer.age_group, "gender": basic_answer.gender, "education": basic_answer.education})
    dbalchemy.add(profile)

    # profile = await dbalchemy.profile.create(data={"ageGroup": basic_answer.age_group, "gender": basic_answer.gender, "education": basic_answer.education})
    completion = chatbot.generate_content(prompt + "\n" + str(basic_answer))
    if not completion or not completion.candidates or not completion.candidates[0].content.parts:
        return {"success": False, "message": "Failed to generate content."}
    print("Generated content...")
    questions: list[dict] = json.loads(completion.candidates[0].content.parts[0].text)
    if not questions:
        return {"success": False, "message": "Question failed to generate."}
    
    max_questions = questions[0].get('max_questions', 10)
    # await dbalchemy.profile.update(where={"userId": profile.userId}, data={"maxQuestion": max_questions})
    profile.maxQuestion = max_questions
    question = Question(**{
        "question": questions[0]['question'], 
        "title": questions[0]['title'], 
    })
    question.choices = [Choice(**choice) for choice in questions[0]['choices']]
    dbalchemy.add(question)
    dbalchemy.flush()

    print("Question created...")
    question = dbalchemy.query(Question).filter(Question.id == question.id).options(joinedload(Question.choices)).first()
    if not question:
        return {"success": False, "message": "Question not found."}
    question = QuestionSchema.model_validate(question)
    dbalchemy.commit()
    return {"success": True, 'max_questions': max_questions, 'userId': profile.userId, 'question': question}

@app.post("/answers/{user_id}")
def post_answer(user_id: uuid.UUID, choice: ChoiceSchema, dbalchemy: Session = fastapi.Depends(db)):
    print("Creating answer...", str(choice), "UserId:", user_id)
    # create answer
    answer = Answer(**{"profileId": user_id, "choiceId": choice.id, "questionId": choice.question_id})
    dbalchemy.add(answer)
    dbalchemy.flush()
    query = (
        dbalchemy.query(Profile)
        .join(Profile.answers)  # Explicit join between Profile and Answer
        .where(Profile.userId == user_id)  # Filter by user_id
        .options(
            joinedload(Profile.answers).joinedload(Answer.choice),  # Eager load Answer.choice
            joinedload(Profile.answers).joinedload(Answer.question)  # Eager load Answer.question
        )
        .order_by(Answer.createdAt.asc())  # Sort by Answer.created_at
    )
    user = query.first()
    print(str(user), user)
    # await dbalchemy.answer.create(data={"profileId": str(user_id), "choiceId": str(choice.id), "questionId": str(choice.question_id)})
    
    # get new question
    # user = await dbalchemy.profile.find_unique(where={"userId": str(user_id)}, include={"answers": {"include": {"choice": True, "question": True}, "order_by": [{"createdAt": "asc"}]},})
    if not user:
        return {"success": False, "message": "User not found."}
    if not user.answers:
        return {"success": False, "message": "No answers found."}

    q_with_answers = [f"{answer.question.title}\n{answer.choice.label}" for answer in user.answers if answer.question and answer.choice]
    basic_answers = f"Age Group: {user.ageGroup}\nGender: {user.gender}\nEducation: {user.education}"
    last_question = dbalchemy.query(Question).filter(Question.id == choice.question_id).first()
    if not last_question:
        return {"success": False, "message": "Last question not found."}
    completion = chatbot.generate_content(prompt + "\n" + basic_answers + '\nList of Questions and answered so far:' + '\n'.join(q_with_answers) + f'\nLast Question: ({last_question.question}/{user.maxQuestion} max)')
    if not completion or not completion.candidates or not completion.candidates[0].content.parts:
        return {"success": False, "message": "Failed to generate content."}
    questions = json.loads(completion.candidates[0].content.parts[0].text)
    if not questions:
        return {"success": False, "message": "Question failed to generate."}
    question = Question(**{
        "question": questions[0]['question'], 
        "title": questions[0]['title'], 
    })
    question.choices = [Choice(**choice) for choice in questions[0]['choices']]
    dbalchemy.add(question)
    dbalchemy.flush()
    question = dbalchemy.query(Question).filter(Question.id == question.id).options(joinedload(Question.choices)).first()
    question = QuestionSchema.model_validate(question)
    dbalchemy.commit()
    return {"success": True, 'userId': user.userId, 'question': question}

@app.get("/result/{user_id}")
def get_result(user_id: uuid.UUID, dbalchemy: Session = fastapi.Depends(db)):
    results = dbalchemy.query(Result).filter(Result.userId == user_id).order_by(Result.createdAt.desc(), Result.points.desc()).all()
    # results = await dbalchemy.result.find_many(where={"userId": str(user_id)}, take=3, order=[{"createdAt": "desc"}, {"points": "desc"}])
    if results:
        return {"success": True, 'userId': user_id, 'results': results}
    # user = await dbalchemy.profile.find_unique(where={"userId": str(user_id)}, include={"answers": {"include": {"choice": True, "question": True}, "order_by": [{"createdAt": "asc"}]},})
    user = dbalchemy.query(Profile).filter(Profile.userId == user_id).options(joinedload(Profile.answers).joinedload(Answer.choice), joinedload(Profile.answers).joinedload(Answer.question)).order_by(Answer.createdAt.asc()).first()
    if not user:
        return {"success": False, "message": "User not found."}
    if not user.answers:
        return {"success": False, "message": "No answers found."}
    
    q_with_answers = [f"{answer.question.title}\n{answer.choice.label}" for answer in user.answers if answer.question and answer.choice]
    # last_question = await dbalchemy.question.find_unique(where={"id": user.answers[-1].questionId})
    last_question = dbalchemy.query(Question).filter(Question.id == user.answers[-1].questionId).first()
    if not last_question:
        return {"success": False, "message": "Last question not found."}
    basic_answers = f"Age Group: {user.ageGroup}\nGender{user.gender}\nEducation: {user.education}"
    completion = chatbot.generate_content(result_prompt + "\n" + basic_answers + '\nList of Questions and answered so far:' + '\n'.join(q_with_answers) + f'\n({last_question.question}/10)')
    if not completion or not completion.candidates or not completion.candidates[0].content.parts:
        return {"success": False, "message": "Failed to generate content."}
    results = json.loads(completion.candidates[0].content.parts[0].text)
    results = [Result(result=result['result'], points=result['points'], advantages=result['advantages'], disadvantages=result['disadvantages'], match_description=result['match_description'], description=result['description'], userId=user_id) for result in results]
    dbalchemy.add_all(results)
    dbalchemy.commit()
    results = dbalchemy.query(Result).filter(Result.userId == user_id).order_by(Result.createdAt.desc(), Result.points.desc()).all()

    # await dbalchemy.result.create_many(data=[{"result": result['result'], "points": int(result['points']), "advantages": result['advantages'], "disadvantages": result['disadvantages'], "match_description": result['match_description'], "description": result['description'], "userId": str(user_id)} for result in results])

    return {"success": True, 'userId': user.userId, 'results': results}
