/* eslint-disable no-unused-vars */
import { useAppStore } from "@/store/index.js";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";

function Profile() {
  const { userInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [hovered, setHovered] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const saveChanges = async () => {};

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className="flex flex-col gap-10 w-[80wv] md:w-max ">
        <div className="">
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
