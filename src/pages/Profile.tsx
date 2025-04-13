import { useEffect, useState } from "react";
import {User } from "../lib/types/user";
import useApi from "../lib/axiosClient";
import Loader from "../components/Loader";

const ProfilePage = () => {
  const { getCurrentUser } = useApi();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);



  if (loading || !user) return <Loader />;

  return (
    <div className="p-6">
      <section className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div>
            <p className="text-sm text-gray-400">{user.email}</p>
            <p className="text-xl font-bold">{user.full_name}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
