import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Chatbot endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama2",
        prompt: `Müşteri sorusu: "${message}". 
                 Lütfen kibar ve yardımcı bir şekilde cevap ver.`
      })
    });

    const data = await response.json();
    res.json({ reply: data.response });
  } catch (_error) {
    res.status(500).json({ error: "Chatbot yanıt veremedi" });
  }
});

app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
});
