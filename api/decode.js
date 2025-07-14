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
      const { data } = JSON.parse(body);
      if (!data) {
        res.status(400).json({ error: "Provide data" });
        return;
      }

      const parsed = iface.parseTransaction({ data });
      res.status(200).json({
        functionName: parsed.name,
        args: parsed.args
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
