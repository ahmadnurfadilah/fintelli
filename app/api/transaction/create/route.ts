import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { JinaEmbeddings } from "@langchain/community/embeddings/jina";

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createClient();

  const embeddings = new JinaEmbeddings({
    model: "jina-embeddings-v2-base-en",
  });

  try {
    const queryEmbedding = await embeddings.embedQuery(
      `- Amount: ${body.type == "income" ? parseInt(body.amount) : 0 - parseInt(body.amount)}\n- Account: ${body.account}\n- Category: ${
        body.category
      }\n- Description: ${body.description}\n- Transaction Date: ${body.transaction_date}`
    );

    const { data } = await supabase.from("accounts").select("balance").eq("id", body.account_id);

    let balance;
    if (body.type == "income") {
      balance = (data && data.length > 0 ? data[0].balance : 0) + parseInt(body.amount);
    } else if (body.type == "expense") {
      balance = (data && data.length > 0 ? data[0].balance : 0) - parseInt(body.amount);
    }

    await supabase.from("accounts").update({ balance }).eq("id", body.account_id);

    const { error } = await supabase
      .from("transactions")
      .insert([
        {
          type: body.type,
          user_id: body.user_id,
          account_id: body.account_id,
          category_id: body.category_id,
          amount: body.type == "income" ? parseInt(body.amount) : 0 - parseInt(body.amount),
          transaction_date: body.transaction_date,
          description: body.description,
          embedding: queryEmbedding,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Success creating new transaction!", data: [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
