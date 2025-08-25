import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useMemo } from "react";

/* eslint-disable react/prop-types */
function ContactList({ contacts, isChannel = false }) {
  const { selectedChatData, setSelectedChatType, setSelectedChatData } =
    useAppStore();

  const basePath = useMemo(
    () => (isChannel ? "/chat/channel" : "/chat/contact"),
    [isChannel]
  );

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <Link
          key={contact._id}
          to={`${basePath}/${contact._id}`}
          onClick={() => {
            setSelectedChatType(isChannel ? "channel" : "contact");
            setSelectedChatData(contact);
          }}
          data-testid={`contact-link-${contact._id}`}
        >
          <div
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#f1f1f111]"
            }`}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300">
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="contact"
                      className="object-cover w-full h-full bg-black rounded-full"
                    />
                  ) : (
                    <div
                      className={`
                      ${
                        selectedChatData && selectedChatData._id === contact._id
                          ? "bg-[#ffffff22] border border-white/70"
                          : `${getColor(contact.color)}`
                      } uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}
                    >
                      {contact.firstName
                        ? contact.firstName.split("").shift()
                        : contact.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              )}
              {isChannel && (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}
              {isChannel ? (
                <span>{contact.name}</span>
              ) : (
                <span>{`${contact.firstName} ${contact.lastName}`}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ContactList;
