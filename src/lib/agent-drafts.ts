import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export interface AgentDraft {
  message: string;
  source: "prompt-card" | "typed";
}

export async function saveAgentDraft(draft: AgentDraft): Promise<string> {
  const message = draft.message.trim();
  if (!message) throw new Error("A message is required.");

  const reference = await addDoc(collection(getFirebaseDb(), "agentDrafts"), {
    message,
    source: draft.source,
    createdAt: serverTimestamp(),
  });

  return reference.id;
}
