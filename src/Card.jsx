import { useState } from "react";
import { HfInference } from "@huggingface/inference";

const client = new HfInference("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");

const prompt = "You are a helpful chef assistant that provides recipes based on a given set of ingredients. The entire recipe output should be in HTML markdown format for easy rendering.";

export default function Card() {
    const [count, setCount] = useState([]); // List of ingredients
    const [inputValue, setInputValue] = useState(""); // Input box value
    const [recipe, setRecipe] = useState(""); // Generated recipe or error message

    const insert = () => {
        if (inputValue.trim() !== "") {
            setCount([...count, inputValue.trim()]);
        }
        setInputValue("");
    };

    const items = count.map((item, index) => (
        <li key={index}>{item}</li>
    ));

    const generate = async () => {
        if (count.length >= 3) {
            const content = count.join(", ");
            // console.log("Ingredients:", content);
            setRecipe("Generating recipe...");
            try {
                const chatCompletion = await client.chatCompletion({
                    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
                    messages: [
                        {
                            role: "system",
                            content: prompt
                        },
                        {
                            role: "user",
                            content: `Ingredients: ${content}`
                        }
                    ],
                    max_tokens: 2000
                });

                // console.log(chatCompletion.choices[0].message.content);
                setRecipe(chatCompletion.choices[0].message.content);
            } catch (error) {
                setRecipe("Error generating recipe. Please try again.");
                // console.error(error);
            }
        } else {
            setRecipe("Please add at least 3 ingredients.");
        }
    };

    return (
        <div className="card">
            <div><h1>Recipe App</h1></div>
            
            {/* Input Section */}
            <div id="input-container">
                <input
                    placeholder="Add Ingredient"
                    className="input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div id="submit-button" onClick={insert}>+</div>
            </div>
            
            {/* List of Ingredients */}
            <div className="items">
                <ul>{items}</ul>
            </div>
            
            {/* Generate Recipe Section */}
            <div id="input-container">
                <h1>Generate Recipe</h1>
                <div id="get-button" onClick={generate}>Get Recipe</div>
            </div>

            <div className="recipe-output">
                <h2>Recipe Output:</h2>
                
                <div className="actualoutput" dangerouslySetInnerHTML={{ __html: recipe }} />
            </div>
        </div>
    );
}