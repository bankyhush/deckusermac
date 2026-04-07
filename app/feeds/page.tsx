import FeedsLogic from "./feedsLogic";
import { requireAuth } from "@/lib/requireAuth";

const FeedsUI = async () => {
  const auth = await requireAuth();

  return <FeedsLogic />;
};

export default FeedsUI;
