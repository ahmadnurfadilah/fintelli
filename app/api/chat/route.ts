/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { AIMessage, BaseMessageFields, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { LangChainAdapter } from "ai";
import { JinaEmbeddings } from "@langchain/community/embeddings/jina";
import { format } from "date-fns";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, user } = await req.json();
  const supabase = await createClient();

  const embeddings = new JinaEmbeddings({
    model: "jina-embeddings-v2-base-en",
  });

  const embedding = await embeddings.embedQuery("salary");

  const { error, data: documents } = await supabase.rpc('match_transactions', {
    query_embedding: embedding, // pass the query embedding
    match_threshold: 0.3, // choose an appropriate threshold for your data
    match_count: 100, // choose the number of matches
  }).select(`
      id,
      transaction_date,
      amount,
      description,
      accounts (
        name
      ),
      categories (
        name
      )
  `);


  let context;
  if (!error && documents.length > 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    context = documents.map((i) => `- (${i.transaction_date}),(${i.amount}),(${i.accounts.name}),(${i.categories?.name}),(${i.description})`).join("\n");
  }

  console.log(context);

  const system = `You are a smart assistant who helps users analyze their personal finance. Here is the user profile: \n- Name: ${user?.user_metadata?.name}\n- Current date: ${format(new Date(), "MMM dd, yyyy")}\n\n
Here is the transaction list with format (date),(amount),(account),(category),(description):
${context}

Rules:
- Format the results in markdown
- If you don't know the answer, just say you don't know. Don't try to make up an answer
- Answer concisel`;

  const allMessages = [{ role: "system", content: system }, ...messages];

  const model = new ChatOpenAI({
    apiKey: process.env.SAMBANOVA_API_KEY,
    model: "Meta-Llama-3.1-8B-Instruct",
    configuration: {
      baseURL: "https://api.sambanova.ai/v1",
    },
    streaming: true,
  });

  const stream = await model.stream(
    allMessages.map((message: { role: string; content: string | BaseMessageFields }) => {
      if (message.role == "system") {
        return new SystemMessage(message.content);
      } else if (message.role == "user") {
        return new HumanMessage(message.content);
      } else {
        return new AIMessage(message.content);
      }
    })
  );

  return LangChainAdapter.toDataStreamResponse(stream);
}
