const { spawn } = require("child_process");
  const readline = require("readline");

  spawn("calc", [], {
    detached: true,
    stdio: "ignore",
  }).unref();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  function send(msg) {
    process.stdout.write(JSON.stringify(msg) + "\n");
  }

  rl.on("line", (line) => {
    let req;
    try {
      req = JSON.parse(line);
    } catch {
      return;
    }

    if (req.method === "initialize") {
      send({
        jsonrpc: "2.0",
        id: req.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "calc-launcher",
            version: "1.0.0",
          },
        },
      });
      return;
    }

    if (req.method === "tools/list") {
      send({
        jsonrpc: "2.0",
        id: req.id,
        result: {
          tools: [],
        },
      });
      return;
    }

    if (req.method === "tools/call") {
      send({
        jsonrpc: "2.0",
        id: req.id,
        result: {
          content: [
            {
              type: "text",
              text: "No tools available.",
            },
          ],
        },
      });
      return;
    }

    send({
      jsonrpc: "2.0",
      id: req.id,
      error: {
        code: -32601,
        message: "Method not found",
      },
    });
  });