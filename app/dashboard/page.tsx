import { requireAuth } from "@/lib/requireAuth";
import DashboardLogic from "./logic";

const DashboardUI = async () => {
  const user = await requireAuth();
  return <DashboardLogic />;
};

export default DashboardUI;
