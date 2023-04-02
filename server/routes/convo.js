// const { Configuration, OpenAIApi } = require("openai")
// const readlineSync = require("readline-sync")
require("dotenv").config()

const express = require(`express`)
const fetchU = require(`../middleware/fetchuser`)
const {body, validationResult}  = require("express-validator")
const router = express.Router()
const userConvo = require(`../models/userconvo`)
const User = require(`../models/user`)
const { response } = require("express")
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);

const globalHistory = []

router.get(`/getuserconvos`, fetchU, async(req, res) => {
  try{
    const data = await userConvo.find({userId: req.user.id})
    res.json(data)
  }catch(error){
    res.status(500).send(`Internal Server Error`)
  }
})

router.post("/chat", async(req, res) => {
  // Get the prompt from the request
  const { prompt } = req.body;

  // Generate a response with ChatGPT --> gpt-3.5-turbo
  // const completion = await openai.createCompletion({
  //   model: "text-davinci-002",
  //   prompt: prompt,
  // });
  // res.send(completion.data.choices[0].text);
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
  });
  globalHistory.push([prompt, completion.data.choices[0].message])
  //console.log(completion.data.choices[0].text)
  res.send(completion.data.choices[0].message);
});

router.post("/saveuserchat", fetchU, async(req, res) => {
  const taskDone = await userConvo.create(
    {
      userId: req.user.id,
      conversation: globalHistory,
    }
  )

  console.log(taskDone)
  
  while (globalHistory.legnth)
  {
    globalHistory.pop()
  }

  res.status(200).send({"success": true, "message": "Conversation Saved"})
})
// (async () => {
//   const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
//   const openai = new OpenAIApi(configuration);

//   const history = [];

//   while (true) {
//     const user_input = readlineSync.question("Your input: ");

//     const messages = [];
//     for (const [input_text, completion_text] of history) {
//       messages.push({ role: "user", content: input_text });
//       messages.push({ role: "assistant", content: completion_text });
//     }

//     messages.push({ role: "user", content: user_input });

//     try {
//       const completion = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: messages,
//       });

//       const completion_text = completion.data.choices[0].message.content;
//       //console.log(completion_text);

//       history.push([user_input, completion_text]);
//       //globalUserHistory.push([user_input, completion_text]);

//       // const user_input_again = readlineSync.question(
//       //   "\nWould you like to continue the conversation? (Y/N)"
//       // );

//       const responsegetter = async() => {
//         const value = []
//         router.post(`/getuserconvoresponse`, async(req, res) => {
//           value.push(req.body.status), value.push(req.body._id)
//           res.status(200).send(`Message Received`)
//         })

//         return value
//       }

//       const response = await responsegetter()

//       // if (user_input_again.toUpperCase() === "N") {
//       //   return;
//       // } else if (user_input_again.toUpperCase() !== "Y") {
//       //   console.log("Invalid input. Please enter 'Y' or 'N'.");
//       //   return;
//       // }
//       if (response[0] === "N") {
//         try{
//           const data = await userConvo.create({
//             "userId": response[1],
//             "conversation": history,
//           })

//           console.log(data)
//           console.log("Success")
//           res.json(data)

//         }catch(error){
//           console.log("Error")
//           console.log(error)
//           res.json(error)
//         }
//         return;
//       }
//     } catch (error) {
//       if (error.response) {
//         console.log(error.response.status);
//         console.log(error.response.data);
//       } else {
//         console.log(error.message);
//       }
//     }
//   }

// })();

module.exports = router