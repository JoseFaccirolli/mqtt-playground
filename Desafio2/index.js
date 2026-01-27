require("dotenv").config();
const mqtt = require("mqtt");

const BROKER_URL = process.env.MQTT_BROKER_URL;
const OPTIONS = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: process.env.MQTT_CLIENT_ID
};

const client = mqtt.connect(BROKER_URL, OPTIONS);

client.on("connect", () => {
    console.log("Server MQTT iniciado | Desafio 2" )
    client.subscribe("gate/status");
    client.subscribe("gate/heartbeat");
});

client.on("message", (topic, payload) => {
    const msg = payload.toString();
    try {
        const objeto = JSON.parse(msg)
        if (topic === "gate/status") {
            if (objeto.state === "OPEN" || objeto.state === "CLOSE") {
                console.log("\nMensagem valida!");
                console.log(objeto);
                
            } else {
                console.error("\nMensagem inválida!")
            }
        }

        if (topic == "gate/heartbeat") {
            if (!isNaN(objeto.uptime)){
                console.log("\nMensagem valida!");
                console.log(objeto);
            } else {
                console.error("\nMensagem invalida!")
            }
        }
    } catch (error) {
        console.log("Erro ao interpretar mensagem:", error)
    }
});

client.on("error", (err) => {
  console.error("Erro MQTT:", err.message);
});