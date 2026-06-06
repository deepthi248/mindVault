require("dotenv").config();

const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors()); //  allows frontend to call backend

// const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const PORT = process.env.PORT || 3000;

app.get("https://mindvault-icca.onrender.com/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const dummy_ai_response = {
  summary: [
    "Lorem Ipsum is placeholder text used in printing",
    "It originated in the 1500s and is still used today",
    "It helps designers visualize layouts before real content",
  ],
  topics: [
    "History of Lorem Ipsum",
    "Printing and Typesetting",
    "Modern Publishing",
  ],
  questions: [
    "What is Lorem Ipsum used for?",
    "When did Lorem Ipsum originate?",
    "Why is it still relevant today?",
  ],
  suggestions: [
    "Explore how dummy text is used in UI design",
    "Learn about typography basics",
    "Compare Lorem Ipsum with real content examples",
  ],
};

app.post("https://mindvault-icca.onrender.com/api/analyse_text", async (req, res) => {
  try {
    const { content } = req.body;
    // console.log('IO am inisde analyse note back end ', content)

    if (!content || !content.trim()) {
      res.status(400).json({ error: "Note content is required" });
    }

    if (process.env.USE_DUMMY === "true") return res.json(dummy_ai_response);

    url = "https://openrouter.ai/api/v1/chat/completions";
    console.log("API KEY:", process.env.OPENROUTER_API_KEY);

    headers = {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    };

    const prompt = `
    analyse the note, RETURN THE VALUE ONLY IN JSON FORMAT.
    Note is ${content}
    JSON FORMAT : {
    summary: Summarize this note in 3 short bullet points[POINT1, POINT 2, POINT 3],
    topics:Give me the list of 3 main topics from the note['TOPIC1, TOPIC2,TOPIC3],
    questions: give me list of atleast 1 to maximum 3 questions as quiz from the topic, 
    suggestions: suggest how can I improve my depth in the current note topic
    }
    `;

    const response = await axios.post(
      url,
      {
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: headers,
      },
    );
    const llm_response = response.data.choices[0].message.content;
    let parsed = null;
    console.log(llm_response);
    try {
      parsed = extractJson(llm_response);

      if (typeof parsed === "string") {
        parsed = extractJson(parsed);
      }

      if (!parsed) {
        throw new Error("Could not parse AI response");
      }

      return res.json(normalizeAIResponse(parsed));
    } catch (error) {
      console.error("JSON PARSE ERROR:", error.message);
      return res.status(422).json({
        error: "AI returned invalid JSON",
        raw: llm_response,
      });
    }
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.get("/test", (req, res) => {
  console.log("✅ TEST ROUTE HIT");
  res.json({ message: "Server is working!" });
});

const normalizeAIResponse = (data) => {
  return {
    summary: Array.isArray(data.summary) ? data.summary : [data.summary || ""],
    topics: Array.isArray(data.topics) ? data.topics : [data.topics || ""],
    questions: Array.isArray(data.questions)
      ? data.questions
      : [data.questions || ""],
    suggestions: Array.isArray(data.suggestions)
      ? data.suggestions
      : [data.suggestions || ""],
  };
};

const extractJson = (text) => {
  if (!text) return null;

  let cleaned = text.trim();

  // remove ```json and ```
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  // if model adds extra text, extract only {...}
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) return null;

  cleaned = cleaned.slice(firstBrace, lastBrace + 1);

  return JSON.parse(cleaned);
};

app.post("https://mindvault-icca.onrender.com/api/export-note-pdf", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    const { note } = req.body;
    console.log(note);
    const html = generatePDFHTML(note);
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=test.pdf");

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF TEST ERROR:", error);
    return res.status(500).json({ error: "PDF test failed" });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

const generatePDFHTML = (note) => {
  const insights = note.ai_insights || {};

  const renderList = (items) => {
    if (!items) return "<p>Not generated</p>";

    const safeItems = Array.isArray(items) ? items : [items];

    return `
      <ul>
        ${safeItems.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 32px;
            color: #111827;
            line-height: 1.6;
          }

          h1 {
            color: #4f46e5;
            margin-bottom: 4px;
          }

          .date {
            color: #6b7280;
            font-size: 13px;
            margin-bottom: 24px;
          }

          .section {
            margin-top: 20px;
            padding: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
          }

          .content {
            white-space: pre-wrap;
          }

          h2 {
            margin-top: 0;
            font-size: 18px;
          }
        </style>
      </head>

      <body>
        <h1>${note.title || "Untitled Note"}</h1>
        <div class="date">Updated on ${note.date_updated || ""}</div>

        <div class="section">
          <h2>Note Content</h2>
          <div class="content">${note.content || ""}</div>
        </div>

        <div class="section">
          <h2>Summary</h2>
          ${renderList(insights.summary)}
        </div>

        <div class="section">
          <h2>Topics</h2>
          ${renderList(insights.topics)}
        </div>

        <div class="section">
          <h2>Questions</h2>
          ${renderList(insights.questions)}
        </div>

        <div class="section">
          <h2>Suggestions</h2>
          ${renderList(insights.suggestions)}
        </div>
      </body>
    </html>
  `;
};
