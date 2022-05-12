import { useCallback, useEffect, useState } from 'react';
import Button from './shared/Button';
import GroupCriteria from './shared/GroupCriteria';
import UserCard from './shared/UserCard';
import { motion, AnimatePresence } from 'framer-motion';

const SearchUser = () => {
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState('');

  const getGroups = useCallback(async () => {
    const res = await fetch('/api/v1/groups');
    const data = await res.json();
    console.log(res);
    setUsers(data.flatMap((group) => group.members));
  });

  const inputHandler = (e) => setInput(e.target.value);

  useEffect(() => {
    getGroups();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <>
      <div className='grid grid-cols-1 gap-4 bg-white p-6 rounded-standard border border-purple-4 mb-6'>
        <div>
          <h2 className='text-xl font-bold'>Legg til medlem</h2>
        </div>
        <div>
          <label htmlFor='userName'>Søk etter brukernavn</label>
          <input
            type='text'
            id='userName'
            placeholder='Torleif Jakobsen'
            className='w-full p-2 border border-purple-3 rounded-standard bg-dark-6 mt-2'
            onChange={inputHandler}
          />
        </div>
        {input && filteredUsers.length === 0 && 'Fant ingen brukere'}

        <motion.ul className='grid gap-4'>
          <AnimatePresence>
            {input &&
              filteredUsers.map((user) => (
                <motion.li
                  key={user}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <UserCard user={user} search={true} />
                </motion.li>
              ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <div className='bg-white p-6 rounded-standard border border-purple-4'>
        <div>
          <h2 className='text-xl font-bold'>Søk etter gruppekriterier</h2>
          <h4>Trykk på en gruppe for å sende forespørsel</h4>
        </div>
        <div className='flex flex-col gap-8'>
          <GroupCriteria />
          <Button to='/group/members/searchUser/searchUserResults'>
            Søk etter medlem
          </Button>
        </div>
      </div>
    </>
  );
};

export default SearchUser;
