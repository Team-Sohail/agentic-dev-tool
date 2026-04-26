from pydantic import BaseModel
from typing import List, Optional, Any, Dict


#Task - input to the system
class Task(BaseModel):
    task_id:str
    description: Optional[str] = None #what user wants
    repo_path:str
    file_path: Optional[str] = None
    extra_context: Optional[str] = None

# CHANGE (Proposed by agents)
class PendingChange(BaseModel):
    agent_id: str
    original_content: str
    proposed_content: str
    diff: str
    reason:str
    status : str = "pending"
    
# AGENT RESULT (Output)
class AgentResult(BaseModel):
    success:bool
    # agent:str
    message: str
    data: Optional[Dict[str, Any]] = None
    changes: Optional[List[PendingChange]] = None

    
    