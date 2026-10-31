from pydantic import BaseModel
from typing import List, Optional

class MisconceptionOut(BaseModel):
    id: str
    code: str
    title: str
    incorrect_belief: str
    correct_explanation: str
    remediation_text: str

    class Config:
        from_attributes = True

class ConceptOut(BaseModel):
    id: str
    chapter_id: str
    code: str
    name: str
    order_index: int
    description: str
    learning_objectives: str
    foundational_level: int
    formula: Optional[str] = None
    mastery_percentage: Optional[float] = None
    uncertainty: Optional[float] = None
    status: Optional[str] = None  # mastered, developing, weak, blocked, unassessed

    class Config:
        from_attributes = True

class ChapterOut(BaseModel):
    id: str
    chapter_number: int
    code: str
    title: str
    description: Optional[str] = None
    concepts: List[ConceptOut] = []

    class Config:
        from_attributes = True

class ConceptGraphNode(BaseModel):
    id: str
    code: str
    label: str
    chapter_code: str
    chapter_number: int
    chapter_title: str
    level: int
    formula: Optional[str] = None
    description: str
    learning_objectives: str
    mastery_percentage: float
    uncertainty: float
    status: str  # mastered (>=75%), developing (40-74%), weak (<40%), blocked (prereq gap), unassessed
    prerequisite_gap: bool = False

class ConceptGraphEdge(BaseModel):
    id: str
    source: str
    target: str
    strength: float

class ConceptGraphResponse(BaseModel):
    nodes: List[ConceptGraphNode]
    edges: List[ConceptGraphEdge]
    total_concepts: int
    mastered_count: int
    developing_count: int
    weak_count: int
    unassessed_count: int
