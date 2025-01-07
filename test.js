import { HfInference } from "@huggingface/inference";

const client = new HfInference("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");


const promp=""
const chatCompletion = await client.chatCompletion({
	model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
	messages: [
		{
			role: "user",
			content: "What is the capital of France?"
		}
	],
	max_tokens: 1000
});

// export default chatCompletion;

console.log(chatCompletion.choices[0].message);