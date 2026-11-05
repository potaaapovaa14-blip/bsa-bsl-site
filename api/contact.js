const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  // Basic honeypot / sanity limits to cut down spam
  if (String(name).length > 200 || String(email).length > 200 || String(message).length > 5000) {
    res.status(400).json({ error: "Input too long" });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"BSA-BSL сайт" <${process.env.SMTP_USER}>`,
      to: "info@bsa-bsl.ru",
      replyTo: email,
      subject: `Новая заявка с сайта от ${name}`,
      text: `Имя: ${name}\nEmail: ${email}\n\nСообщение:\n${message}`,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Mail send error:", err);
    res.status(500).json({ error: "Failed to send" });
  }
};
