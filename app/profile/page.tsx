import { requireAuth } from "@/lib/requireAuth";
import ProfileLogic from "./logic";

const ProfileUI = async () => {
  const user = await requireAuth();
  return <ProfileLogic />;
};

export default ProfileUI;
