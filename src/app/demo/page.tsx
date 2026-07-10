// app/profile/page.tsx

import { AddressInfo, MyProfile, PersonalInfo } from "@/components/cards/dashboard/profile-card";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h1>
        <MyProfile />
        <PersonalInfo />
        <AddressInfo />
      </div>
    </div>
  );
};

export default ProfilePage;
