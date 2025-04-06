const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();
app.use(express.json());

app.post("/resolve", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    console.log("Browser launched. Opening page...");
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

    const finalUrl = page.url();

    await browser.close();
    console.log(`Resolved URL: ${finalUrl}`);
    res.json({ original: url, resolved: finalUrl });
  } catch (error) {
    console.error("Error resolving URL:", error);
    res.status(500).json({ error: "Could not resolve URL" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`URL Resolver running on port ${PORT}`);
});