const asyncHandler = require('express-async-handler');
const initChain = require('../utils/utils');
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
//@desc chat service
//@route POST /api/chat/
//@access public
const chat = asyncHandler(async (req, res) => {
    const body = req.body;
    const question = body.query ?? "what is the order id for shreya order";
    const history = body.history ?? [] 
    const chat_hist = history.map((message) => {
        if(message.role == 'assistant') return new AIMessage(message.content);
        else if(message.role == 'user') return new HumanMessage(message.content);
    } )

    const chain = await initChain();

    const response = await chain.invoke({
        chat_history: chat_hist,
        input: question,
    });
    res.status(200).json({role : "assistant", content : response.answer});
});


module.exports = { chat };