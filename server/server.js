import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import morgan from "morgan";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(
  cors({
    // credentials: true,
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
  })
);
app.use(morgan("tiny"));

app.use(express.json());
app.get("/", async (req, res, next) => {
  res.status(200).send({
    message: "hellow from the bakend",
  });
});

app.post("/", async (req, res, next) => {
  try {
    const prompt = req.body.prompt;
    console.log("prompt", req.body);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.2,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    console.log(response.data);
    return res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error });
  }
  return res.status(200).send({
    message: "hellow from the bakend",
  });
});

app.listen(3001, () =>
  console.log("server is running in localhost http://localhost:3001")
);
