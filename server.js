const express = require("express");
const puppeteer = require("puppeteer");
require("dotenv").config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ URL Resolver server is running!");
});

app.post("/resolve", async (req, res) => {
  const { url } = req.body;
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  if (!url) return res.status(400).json({ error: "No URL provided" });
  try {
    const page = await browser.newPage();
    await page.goto("https://developer.chrome.com/");

    const finalUrl = page.url();

    await browser.close();
    res.json({ original: url, resolved: finalUrl });
  } catch (error) {
    console.error("❌ Error resolving URL:", error);
    res.status(500).json({ error: "Could not resolve URL" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});