import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRightIcon,
  UserAddIcon,
  PencilAltIcon,
  ClipboardListIcon,
  TrashIcon,
} from '@heroicons/react/solid';
import { LogoutIcon } from '@heroicons/react/outline';
import { UserInfoContext } from '../../App';
import React, { useContext } from 'react';
import { UserGroupsContext } from '../../store/UserGroupsContext';

const GroupSettings = ({ group, onClick }) => {
  const navigate = useNavigate();

  const { fetchData } = useContext(UserGroupsContext);

  const user = React.useContext(UserInfoContext);

  async function deleteGroup() {
    await fetch('/api/v1/groups', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        groupId: group.uuid,
      }),
    });
    fetchData();
    onClick();
  }

  async function leaveGroup() {
    await fetch('/api/v1/groups/member', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        groupId: group.uuid,
        userId: user.uuid,
      }),
    });
    fetchData();
    onClick();
  }

  return (
    <div>
      <div className='flex justify-end'>
        <button
          onClick={onClick}
          className='text-white px-4 py-2 mb-3 mr-3 outline outline-white text-center bg-purple-1 rounded-full hover:bg-purple-2'
        >
          X
        </button>
      </div>

      <div className='grid grid-cols-1 bg-gradient-left w-screen text-white max-w-2xl mx-auto rounded-standard'>
        <ul className='divide-y divide-purple-4'>
          <Link
            to={`/groups/${group.uuid}/members/search`}
            className='flex flex-row justify-between my-1 py-3 hover:bg-purple-2 px-4'
          >
            <li className='flex flex-row'>
              <UserAddIcon className='h-6 w-6 text-white mr-4' />
              {/*navigate("/groups/specific/members/searchUser", {
              state: { group: group },*/}
              Inviter medlemmer
            </li>
            <ChevronRightIcon className='h-6 w-6 text-white' />
          </Link>
          <Link
            to='profile'
            className='flex flex-row justify-between my-1 py-3 hover:bg-purple-2 px-4'
            onClick={onClick}
          >
            <li className='flex flex-row'>
              <PencilAltIcon className='h-6 w-6 text-white mr-4' />
              Endre gruppeprofil
            </li>
            <ChevronRightIcon className='h-6 w-6 text-white' />
          </Link>

          <Link
            to='/groups/specific/groupCriteria'
            className='flex flex-row justify-between my-1 py-3 hover:bg-purple-2 px-4'
            onClick={onClick}
            state={{ group: group }}
          >
            <li className='flex flex-row'>
              <ClipboardListIcon className='h-6 w-6 text-white mr-4' />
              Gruppekriterier
            </li>
            <ChevronRightIcon className='h-6 w-6 text-white' />
          </Link>
          <Link
            to='/'
            className='flex flex-row justify-between my-1 py-3 hover:bg-purple-2 px-4'
            onClick={deleteGroup}
          >
            <li className='flex flex-row'>
              <TrashIcon className='h-6 w-6 text-white mr-4' />
              Slett gruppe
            </li>
            <ChevronRightIcon className='h-6 w-6 text-white' />
          </Link>
          <Link
            to='/'
            className='flex flex-row justify-between my-1 py-3 hover:bg-purple-2 px-4'
            onClick={leaveGroup}
          >
            <li className='flex flex-row'>
              <LogoutIcon className='h-6 w-6 text-white mr-4' />
              Forlat gruppe
            </li>
            <ChevronRightIcon className='h-6 w-6 text-white' />
          </Link>
        </ul>
      </div>
    </div>
  );
};
export default GroupSettings;
