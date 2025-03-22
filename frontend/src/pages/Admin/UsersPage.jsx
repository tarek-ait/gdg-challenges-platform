import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";

const UsersPage = () => {
  const { getUsers, isGettingUsers, users } = useAuthStore();

  useEffect(() => {
    async function fetchData() {
      await getUsers();
    }
    fetchData();
  }, [getUsers]);

  if (isGettingUsers) {
    return (
      <div className="loader-container flex justify-center items-center h-96">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="challenges-container p-8 py-24 bg-base-200 min-h-screen">
      {!isGettingUsers && (
        <div className="challenges-container py-24">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Users</h1>
            <div></div>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-8">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label className="sr-only">checkbox</label>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">Id</th>
                  <th scope="col" className="px-6 py-3">Avatar</th>
                  <th scope="col" className="px-6 py-3">User Name</th>
                  <th scope="col" className="px-6 py-3">First Name</th>
                  <th scope="col" className="px-6 py-3">Last Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Phone number</th>
                  <th scope="col" className="px-6 py-3">Team id</th>
                  <th scope="col" className="px-6 py-3">Is admin</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.username} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img src="/avatar.jpg" alt="avatar" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.first_name}</td>
                    <td className="px-6 py-4">{user.last_name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phone_number}</td>
                    <td className="px-6 py-4">{user.team_id ? user.team_id : "not in a team"}</td>
                    <td className="px-6 py-4">{user.is_superuser ? "Admin" : "not Admin"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
