// Desafio mais próximo a realidade.
require("dotenv").config();
const mqtt = require("mqtt");

const BROKER_URL = process.env.MQTT_BROKER_URL
const OPTIONS = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: process.env.MQTT_CLIENT_ID
}

const client = mqtt.connect(BROKER_URL, OPTIONS);

client.on("connect", () => {
    console.log("MQTT iniciado | Desafio 3")
    client.subscribe("gate/cmd");
    client.subscribe("gate/log");
});

client.on("message", (topic, payload) => {
    const msg = payload.toString();
    let objeto;

    try {
        objeto = JSON.parse(msg);
    } catch {
        console.log("Payload não é JSON:", msg);
        return;
    }

    if (topic === "gate/cmd") {
        if (objeto.action === "TOGGLE") {
            console.log("relé acionado");
            setTimeout(() => {
                console.log("relé liberado");
            }, 500);
            const status = {"lastAction": "TOGGLE", "timestamp": 1700000000000}
            client.publish("gate/status", status);
        } else {
            client.publish("gate/log", "Mensagem inválida: Deve ser um JSON de ação toggle.");
        }
    }
});