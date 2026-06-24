# AI Engineering Patterns

> **Source**: Antigravity Awesome Skills (sickn33)
> **Type**: Reference Architecture

## 1. Tool Design

- **Schema**: JSON Schema is the universal language of tools.
- **Atomic**: Tools should do ONE thing well.
- **Resilient**: Tools should handle errors gracefully (return error strings, don't crash).

## 2. Agent Loop (The Heartbeat)

1.  **Sense**: Read environment (files, git status).
2.  **Reason**: Consult memories/protocols.
3.  **Act**: Call a tool.
4.  **Learn**: Update context based on tool output.

## 3. RAG Pipeline (LLM App Patterns)

- **Ingestion**: Chunking (Fixed vs Semantic), Embedding (OpenAI vs Local).
- **Retrieval**: Hybrid Search (Semantic + Keyword/BM25 + RRF).
- **Vector DB**: Pinecone (Scale), Weaviate (Multi-modal), Chroma (Local).

## 4. Agent Architectures

- **ReAct**: Thought -> Action -> Observation Loop.
- **Function Calling**: Structured JSON outputs for tool use.
- **Plan-and-Execute**: Step-by-step planning with replanning capability.
- **MCP Integration**:
  - **Dynamic Discovery**: Agents should "ask" what tools are available.
  - **Server/Client**: Decouple the tool logic (Server) from the reasoning logic (Client).

## 5. Prompt Engineering

- **Chain of Thought**: "Let's think step by step."
- **Few-Shot**: "Here are 3 examples..."
- **Chaining**: Breaking complex tasks into linear prompt sequences.
