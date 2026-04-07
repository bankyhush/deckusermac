import React from "react";
import NewPostLogic from "./newLogic";
import { requireAuth } from "@/lib/requireAuth";

const NewPostUI = async () => {
  const user = await requireAuth();

  return <NewPostLogic />;
};

export default NewPostUI;
