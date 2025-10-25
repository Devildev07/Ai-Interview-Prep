import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <div className=" root-layout flex flex-col ">
      <h3>Interview generation</h3>
      <Agent userName={user?.name} userId={user?.id} type="generate " />
    </div>
  );
};

export default page;
