import { requireAuth } from "@/lib/requireAuth";
import EditPostLogic from "./editLogic";

const BlogEditUI = async () => {
  const auth = await requireAuth();
  return <EditPostLogic />;
};

export default BlogEditUI;
