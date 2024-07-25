import { useAppStore } from "@/store/index.js";

function Profile() {
  const { userInfo } = useAppStore();
  console.log(userInfo);
  return <div> hello, {userInfo.email} </div>;
}

export default Profile;
