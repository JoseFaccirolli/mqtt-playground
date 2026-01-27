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
    console.log("Server MQTT iniciado | Desafio 2 (Correção)" )
    client.subscribe("gate/status");
    client.subscribe("gate/heartbeat");
});

client.on("message", (topic, payload) => {
    const msg = payload.toString();

    let objeto; // Escopo "global"

    try {
        objeto = JSON.parse(msg);
    } catch {
        console.error("Payload não é JSON:", msg);
        return;
    } // Try Catch reusido e focado aonde pode dar erro

    if (topic === "gate/status") {
        if (typeof objeto.state !== "string") { // isNaN é inpreciso (aceitando strings numéricas true false entre outros). Uso de typeof
            console.error("Campo state inválido:", objeto);
            return;
        }

        if (objeto.state !== "OPEN" && objeto.state !== "CLOSE") {
            console.error("Estado desconhecido:", objeto.state); // Mensagens claras e expecíficas
            return;
        }

        console.log("Status válido:", objeto.state);
    }

    if (topic === "gate/heartbeat") {
        if (typeof objeto.uptime !== "number") {
            console.error("Uptime inválido:", objeto);
            return;
        }

        console.log("Heartbeat válido:", objeto.uptime);
    }
});
