from fastapi import FastAPI
from models.schemas import Task, AgentResult

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/task")
def handle_task(task: Task):
    return AgentResult(
        success=True,
        message="Task received",
        data={}
    )
    