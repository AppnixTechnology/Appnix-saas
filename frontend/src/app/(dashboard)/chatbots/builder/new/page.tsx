"use client";

import BotBuilderPage from "../[id]/page";

export default function NewBotBuilderPage() {
  return <BotBuilderPage params={Promise.resolve({ id: "new" })} />;
}