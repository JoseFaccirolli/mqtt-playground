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
    console.log("Server MQTT iniciado | Desafio 1" )
    client.subscribe("gate/status");
    client.subscribe("hello/world");
    client.subscribe("life/knight");
});

client.on("message", (topic, payload) => {
    console.log("Tópico:", topic);
    console.log("Payload:", payload.toString());
});