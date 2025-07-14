const { Interface } = require("ethers");

module.exports = (req, res) => {
  const abi = JSON.parse(process.env.ABI_JSON || "[]");
  const iface = new Interface(abi);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: "Provide data" });
  }

  try {
    const parsed = iface.parseTransaction({ data });
    return res.json({
      functionName: parsed.name,
      args: parsed.args
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
