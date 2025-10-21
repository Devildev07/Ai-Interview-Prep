import Agent from "@/components/Agent";

const page = () => {
  return (
    <div className=" root-layout flex flex-col ">
      <h3>Interview generation</h3>
      <Agent userName="Dewanshu" userId="1" type="generate " />
    </div>
  );
};

export default page;
