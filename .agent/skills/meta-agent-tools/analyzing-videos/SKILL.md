---
name: analyzing-videos
description: Extracts key takeaways, summaries, and insights from video content including YouTube videos, tutorials, and presentations. Use when the user asks to "watch this video", "summarize this video", "extract key points from", or provides a video URL.
---

# Video Analysis & Key Takeaway Extraction

## When to use this skill

- User provides a YouTube URL or video link
- User asks "can you watch this video and extract key takeaways?"
- User requests a summary of video content
- User wants to convert video content into written notes
- User mentions "video analysis" or "video summary"

## Multi-Strategy Approach

Since direct video access may fail due to browser or environment issues, use this cascading strategy:

### Strategy 1: Browser-Based Transcript Extraction (Preferred)

1. Use `browser_subagent` to navigate to the video URL
2. Look for transcript button/option on the page
3. Extract the full transcript if available
4. Parse and analyze the transcript content

### Strategy 2: URL Content Reading (Fallback)

1. Use `read_url_content` to fetch the page metadata
2. Extract title, description, and any embedded text
3. Use this information as context for further research

### Strategy 3: Web Search Enhancement (Always)

1. Search for "[video title] transcript" or "[video title] summary"
2. Search for "[video title] key points" or "[video title] takeaways"
3. Look for blog posts, articles, or discussions about the video
4. Aggregate information from multiple sources

### Strategy 4: Direct Knowledge (If Applicable)

1. If the video topic is within your knowledge base, provide relevant context
2. Cross-reference with search results to ensure accuracy

## Workflow

When a user provides a video URL:

1. **Extract Video Metadata**
   - Try `browser_subagent` first to get transcript
   - If browser fails, use `read_url_content` for title/description
   - Note: Browser issues are environment-related, not user errors

2. **Search for Additional Context**
   - Always perform web searches regardless of browser success
   - Search patterns:
     - `"[video title]" transcript`
     - `"[video title]" summary key points`
     - `"[video title]" takeaways`
   - Look for Reddit discussions, blog posts, or community notes

3. **Synthesize Key Takeaways**
   - Organize findings into clear, actionable points
   - Use bullet points for scannability
   - Include timestamps if available
   - Categorize by themes (e.g., mistakes, best practices, tools)

4. **Format Output**
   - Create a structured markdown document
   - Include:
     - Video title and link
     - Brief overview
     - Key takeaways (numbered or bulleted)
     - Detailed notes (if transcript available)
     - Related resources or references

## Output Template

```markdown
# [Video Title]

**Source:** [Video URL]
**Duration:** [If available]
**Author/Channel:** [If available]

## Overview

[Brief 2-3 sentence summary of what the video covers]

## Key Takeaways

1. **[Main Point 1]**
   - [Supporting detail]
   - [Example or context]

2. **[Main Point 2]**
   - [Supporting detail]
   - [Example or context]

[Continue for all major points...]

## Detailed Notes

[Optional: More granular breakdown if transcript was available]

## Related Resources

- [Any related articles, tools, or references found during research]
```

## Error Handling

- **Browser fails:** Don't apologize excessively. Simply note "Browser access unavailable, using alternative methods" and proceed with fallback strategies.
- **No transcript available:** Focus on metadata, search results, and related content.
- **Limited information:** Be transparent about confidence level and sources used.

## Best Practices

- Always cite sources when using search results
- Distinguish between direct transcript quotes and inferred content
- Prioritize actionable insights over verbatim transcription
- Group related points together for better comprehension
- Use formatting (bold, italics, code blocks) to highlight important terms

## Example Use Cases

- Analyzing technical tutorial videos for implementation steps
- Extracting best practices from conference talks
- Summarizing product demos or feature announcements
- Converting video content into written documentation
- Creating study notes from educational content
