import React from "react";
import { Button } from "../Button";
import { Heading } from "../Heading";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  profileImage?: string; // Path to the profile image
  userName?: React.ReactNode; // User's name
  postContent?: React.ReactNode; // Content of the post
}

export default function UserProfileCard({
  profileImage = "images/profile.svg", // Default profile image
  userName = "Rose J. Henry", // Default user name
  postContent = "This is a sample post content.", // Default post content
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`flex flex-col p-4 border-[#1D3016] border border-solid bg-white-a700 rounded-md w-full ${
        props.className || ""
      }`}
    >
      <div className="flex items-start gap-4">
        <Img
          src={profileImage} // Profile image
          alt="Profile Image"
          className="h-[70px] w-[70px] rounded-full object-cover"
        />
        <div className="flex flex-col">
          <Text as="h3" className="text-[20px] font-semibold !text-gray-800">
            {userName} {/* User name */}
          </Text>
          <Text as="p" className="mt-2 text-[18px] font-normal !text-gray-800">
            {postContent} {/* Post content */}
          </Text>
        </div>
      </div>
    </div>
  );
}
