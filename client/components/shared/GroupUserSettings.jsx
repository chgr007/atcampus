import { KeyIcon, TrashIcon } from "@heroicons/react/solid";
import Image from "./Image";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const GroupUserSettings = ({ user, group }) => {
  const navigate = useNavigate();

  async function removeMember() {
    const res = await fetch("/api/v1/groups/member", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: user.user_uuid,
        groupId: group.uuid,
      }),
    });

    navigate(`/groups/${group.uuid}/members`);
    location.reload();
  }

  function makeAdmin() {
    console.log("Admin roles given to " + user.user_name);
  }

  return (
    <div className="flex flex-col items-center bg-white text-dark-1 p-8 rounded text-center shadow-xl">
      <Image user className="h-20 mb-4 -mt-16" />
      <h2 className="font-bold text-lg w-full border-b-2 pb-4 border-purple-1 mb-5">
        {user.user_name}
      </h2>
      <div className="flex flex-col gap-3">
        <Button onClick={makeAdmin} className="flex items-center gap-3">
          <KeyIcon className="h-5 w-5" />
          Gjør til admin
        </Button>
        <Button
          onClick={removeMember}
          className={"flex items-center gap-3 bg-red-500 hover:bg-red-400"}
        >
          <TrashIcon className="h-5 w-5" />
          Slett medlem
        </Button>
      </div>
    </div>
  );
};
export default GroupUserSettings;
