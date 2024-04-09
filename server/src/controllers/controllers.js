const asyncHandler = require('express-async-handler');
const initChain = require('../utils/utils');

//@desc chat service
//@route POST /api/chat/
//@access public
const chat = asyncHandler(async (req, res) => {
    const body = req.body;
    const question = body.query ?? "what is the order id for shreya order";
    const history = body.history ?? [] 

    const chain = await initChain();

    const response = await chain.invoke({
        chat_history: [],
        input: question,
    });
    res.status(200).json({role : "assistant", content : response.answer});
});


module.exports = { chat };