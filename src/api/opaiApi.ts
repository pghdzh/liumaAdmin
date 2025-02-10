import axios from "axios";

// const API_KEY = "sk-NEsqpDwo1GmhgOBhB522566aF0704d1c8e0d7dD065FeB273"; // 将此替换为你的实际API密钥
const API_KEY = "sk-X43SqF6LL5tdCGPeD2C2E217570d449b8aFb4dF00b2a2cC6";
const openaiApi = axios.create({
  baseURL: " https://xiaoai.plus/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const sendMessageToChatGPT = async (message) => {
  try {
    const response = await openaiApi.post("/chat/completions", {
      // model: "gpt-3.5-turbo", // 或者使用 'gpt-4' 取决于你的访问权限
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    return "Error communicating with ChatGPT.";
  }
};
