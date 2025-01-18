from dotenv import load_dotenv
load_dotenv()
import os
import google.generativeai as genai
import uuid
import json

import fastapi
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

genai.configure(api_key=os.getenv("API_KEY"))

class BasicAnswers(BaseModel):
    age_group: str
    gender: str
    education: str

    def __str__(self):
        return f"Age Group: {self.age_group}\nGender: {self.gender}\nEducation: {self.education}"


class Choice(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    choice: int
    label: str

    def __str__(self):
        return f"Choice Label: {self.label}"


class Question(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    question: int
    title: str
    choices: list[Choice]

    def __str__(self):
        return f"Question: {self.question}\nTitle: {self.title}"

class Result(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    result: str
    points: int
    advantages: list[str]
    disadvantages: list[str]
    match_description: str | None = None
    description: str | None = None

    def __str__(self):
        return f"Result: {self.result}\nPoints: {self.points}"

users: dict[str, 'User'] = {}
chatbot = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})

class User(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    basic_answers: BasicAnswers
    questions: list[Question]
    answers: list[Choice]
    results: list[Result] # 3 results
    max_questions: int = 10

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

# Load users from logs.json
try:
    with open("log.json", "r") as f:
        users = {uuid.UUID(k): User(**v) for k, v in json.loads(f.read()).items()}

except FileNotFoundError:
    pass

app = fastapi.FastAPI(root_path="/api")

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/answers")
def post_basic_answers(basic_answer: BasicAnswers):

    user = User(id=uuid.uuid4(), basic_answers=basic_answer, questions=[], answers=[], results=[])
    users[user.id] = user
    completion = chatbot.generate_content(prompt + "\n" + str(basic_answer))
    print(completion.candidates[0].content.parts[0].text)
    questions = json.loads(completion.candidates[0].content.parts[0].text)
    user.max_questions = questions[0]['max_questions']
    question = {**questions[0], 'choices': [Choice(**choice) for choice in questions[0]['choices']] }
    question = Question(**question)
    user.questions.append(question)
    
    dump = {str(user.id): user.model_dump(mode='json') for user in users.values()}
    with open("log.json", "w") as f:
        f.write(json.dumps(dump) + '\n')

    return {"success": True, 'max_questions': user.max_questions, 'userId': user.id, 'question': question}

@app.post("/answers/{user_id}")
def post_answer(user_id: uuid.UUID, choice: Choice):
    user: User = users[user_id]
    user.answers.append(choice)
    last_question = user.questions[-1]
    q_with_answers = [str(q) + '\n' + str(a) for q, a in zip(user.questions, user.answers)]
    print(q_with_answers)
    completion = chatbot.generate_content(prompt + "\n" + str(user.basic_answers) + '\nList of Questions and answered so far:' + '\n'.join(q_with_answers) + f'\n({last_question.question}/10)')
    questions = json.loads(completion.candidates[0].content.parts[0].text)
    print(questions)
    question = {**questions[0], 'choices': [Choice(**choice) for choice in questions[0]['choices']] }
    question = Question(**question)
    user.questions.append(question)
    dump = {str(user.id): user.model_dump(mode='json') for user in users.values()}
    with open("log.json", "w") as f:
        f.write(json.dumps(dump) + '\n')
    
    return {"success": True, 'userId': user.id, 'question': question}

@app.get("/result/{user_id}")
def get_result(user_id: uuid.UUID):
    user: User = users[user_id]
    if user.results:
        return {"success": True, 'userId': user.id, 'results': user.results}
    last_question = user.questions[-1]
    q_with_answers = [str(q) + '\n' + str(a) for q, a in zip(user.questions, user.answers)]
    completion = chatbot.generate_content(result_prompt + "\n" + str(user.basic_answers) + '\nList of Questions and answered so far:' + '\n'.join(q_with_answers) + f'\n({last_question.question}/10)')
    results = json.loads(completion.candidates[0].content.parts[0].text)
    user.results = results
    return {"success": True, 'userId': user.id, 'results': results}