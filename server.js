import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

if (!MP_ACCESS_TOKEN) {
  console.error("MP_ACCESS_TOKEN não definido");
}

app.get("/", (req, res) => {
  res.send("✅ Backend Black Natal rodando");
});

app.post("/criar-pagamento", async (req, res) => {
  const { nome, email, valor } = req.body;

  if (!nome || !email || !valor) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transaction_amount: Number(valor),
        description: "Pedido Black Natal",
        payment_method_id: "pix",
        payer: {
          email: email,
          first_name: nome
        }
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
