import Fastify from "fastify";

const fastify = Fastify();

fastify.get("/", (req, res) => {
    return new Response();
});