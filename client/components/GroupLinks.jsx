import { Link, useNavigate } from "react-router-dom";
import Loading from "./shared/Loading";
import GroupCard from "./shared/GroupCard";
import Button from "./shared/Button";
import { useContext } from "react";
import { UserInfoContext } from "../App";
import React from "react";
import { UserGroupsContext } from "../store/UserGroupsContext";
import Breadcrumbs from "./shared/Breadcrumbs";
import { motion } from "framer-motion";

const GroupLinks = () => {
  const navigate = useNavigate();

  const user = useContext(UserInfoContext);

  const { groups, loading, error } = useContext(UserGroupsContext);

  if (!user) {
    return <Link to={"/login"}><Button className="lg:w-32 mx-auto">Logg inn</Button></Link>;
  }
  if (loading) return <Loading className="h-screen w-screen bg-dark-6" />;

  return (
    <>
      <Breadcrumbs />
      <div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 mt-6">
            <Button to="/createGroup" className="lg:col-start-2">
              Opprett gruppe
            </Button>
            <Button to="/searchGroup" className="lg:col-start-3">
              Søk etter gruppe
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-dark-1 text-xl font-bold mb-4">Mine grupper</h2>
          <div className="grid gap-x-4 sm:grid-cols-2 xl:grid-cols-3">
            {/*Only return this id groupdata is nbot undefined*/}
            {groups.map((group) => (
              <GroupCard
                group={group}
                key={group.uuid}
                onClick={() => navigate(`/groups/${group.uuid}`)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
  // Return this only if they are logged in
};

export default GroupLinks;
