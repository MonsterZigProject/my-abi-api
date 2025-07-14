const { Interface } = require("ethers");

module.exports = async (req, res) => {
  const abi = JSON.parse(process.env.ABI_JSON || "[]");
  const iface = new Interface(abi);

  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }

  let body = "";
  req.on("data", chunk => { body += chunk; });
  req.on("end", () => {
    try {
      const { functionName, args } = JSON.parse(body);
      if (!functionName || !Array.isArray(args)) {
        res.status(400).json({ error: "Provide functionName and args[]" });
        return;
      }

      const data = iface.encodeFunctionData(functionName, args);
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
