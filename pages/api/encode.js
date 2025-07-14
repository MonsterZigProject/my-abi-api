const { Interface } = require("ethers");

module.exports = (req, res) => {
  const abi = JSON.parse(process.env.ABI_JSON || "[]");
  const iface = new Interface(abi);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { functionName, args } = req.body;

  if (!functionName || !Array.isArray(args)) {
    return res.status(400).json({ error: "Provide functionName and args[]" });
  }

  try {
    const data = iface.encodeFunctionData(functionName, args);
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
