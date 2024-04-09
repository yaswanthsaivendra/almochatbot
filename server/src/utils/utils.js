const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { createHistoryAwareRetriever } = require("langchain/chains/history_aware_retriever");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { CSVLoader } = require("langchain/document_loaders/fs/csv");


const openAIApiKey = process.env.openAIApiKey;


const chatModel = new ChatOpenAI({
    openAIApiKey : openAIApiKey,
});

const embeddings = new OpenAIEmbeddings({
    openAIApiKey : openAIApiKey,
});

const initChain = async () => {
    try {

        // prompt

        const historyAwarePrompt = ChatPromptTemplate.fromMessages([
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
            [
                "user",
                "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
            ],
        ]);

        // loading data from csv and creating a vectorstore
        const loader = new CSVLoader("src/data.csv");
        const documents = await loader.load();
        const vectorstore = await MemoryVectorStore.fromDocuments(
            documents,
            embeddings
        );


        const retriever = vectorstore.asRetriever();
        
        const historyAwareRetrieverChain = await createHistoryAwareRetriever({
            llm: chatModel,
            retriever,
            rephrasePrompt: historyAwarePrompt,
        });

        const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                "Answer the user's questions based on the below context:\n\n{context}",
            ],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
        ]);

        const historyAwareCombineDocsChain = await createStuffDocumentsChain({
            llm: chatModel,
            prompt: historyAwareRetrievalPrompt,
        });
        
        return createRetrievalChain({
            retriever: historyAwareRetrieverChain,
            combineDocsChain: historyAwareCombineDocsChain,
        });
        
    } catch (error) {
        console.log(error);
    }
}



module.exports = initChain;