from langgraph.graph import StateGraph, END
from app.agents.state import TravelState
from app.agents.nodes import (
    planner_node,
    research_node,
    safety_node,
    evaluator_node,
    formatter_node
)


def build_graph():
    graph = StateGraph(TravelState)

    # Nodes
    graph.add_node("planner", planner_node)
    graph.add_node("research", research_node)
    graph.add_node("safety", safety_node)
    graph.add_node("evaluator", evaluator_node)
    graph.add_node("formatter", formatter_node)

    # ✅ START NODE (VERY IMPORTANT)
    graph.set_entry_point("planner")

    # FLOW
    graph.add_edge("planner", "research")
    graph.add_edge("research", "safety")

    # ✅ SAFETY → EVALUATOR
    def safety_condition(state):
        if state.get("error"):
            return END
        return "evaluator"

    graph.add_conditional_edges("safety", safety_condition)

    # ✅ EVALUATOR ROUTING (FIXED)
    def evaluator_condition(state):
        score = state.get("evaluation_score", 0)
        retry = state.get("retry_count", 0)

        if score >= 6:
            return "formatter"
        elif retry < 2:
            return "planner"
        else:
            return "formatter"

    graph.add_conditional_edges("evaluator", evaluator_condition)

    # ✅ FINAL STEP
    graph.add_edge("formatter", END)

    return graph.compile()