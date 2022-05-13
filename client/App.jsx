import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateGroup from './components/CreateGroup';
import GroupLinks from './components/GroupLinks';
import SearchGroup from './components/SearchGroup';
import GroupMembers from './components/GroupMembers';
import Questions from './components/GroupMembers';
import Questions from './components/Questions';
import ProfileMenu from './components/shared/ProfileMenu';
import Footer from './components/shared/Footer';
import TopNavBar from './components/shared/TopNavBar';
import BottomNavBar from './components/shared/BottomNavBar';
import GroupPage from './components/GroupPage';
import SearchUser from "./components/SearchUser"
import SearchGroupResults from './components/SearchGroupResults';
import SearchUserResults from './components/SearchUserResults';
import GroupCriteriaPage from './components/GroupCriteriaPage';
import LeftNavBar from './components/shared/LeftNavBar';

const App = () => {
  return (
    <>
      <BrowserRouter>
        
        <TopNavBar/>
        <main className='bg-dark-6 flex'>
        <LeftNavBar/>
          <div className='container mx-auto py-16'>
            <Routes>
              <Route path={'/'} element={<GroupLinks />} />
              <Route path={'/searchGroup'} element={<SearchGroup />} />
              <Route path={'/searchGroup/searchGroupResults'} element={<SearchGroupResults />} />
              <Route path={'/createGroup'} element={<CreateGroup />} />
              <Route path={'/group/specific'} element={<GroupPage />} />
              <Route path={'/group/groupCriteria'} element={<GroupCriteriaPage />} />
              <Route path={'/group/members'} element={<GroupMembers />} />
              <Route path={'/group/members/searchUser'} element={<SearchUser />} />
              <Route path={'/group/members/searchUser/searchUserResults'} element={<SearchUserResults />} />
              <Route path={'/questions'} element={<Questions />} />
              <Route path={'/profile'} element={<ProfileMenu />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <BottomNavBar />
      </BrowserRouter>
    </>
  );
};

export default App;
