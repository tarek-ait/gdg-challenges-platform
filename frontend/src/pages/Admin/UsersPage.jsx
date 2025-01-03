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
  

  console.log('users:', users); // Debugging the team data after it's fetched

  return (
    <div className="bg-base-200 min-h-screen py-28">
      <div className="team-info flex items-center justify-center flex-col">
        <h1>Welcome to the Users page</h1>
        <h1 className="my-10">Users</h1>

        {/* Check for team members before rendering the table */}
        {users.length > 0 ? (
          <div className="overflow-x-auto my-5">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Avatar</th>
                  <th>User Name</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone number</th>
                  <th>Is admin</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.username}>
                    <td>{user.id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img src="/avatar.jpg" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.is_superuser ? "Admin" : "not Admin"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">No users available</div>
        )}
      </div>
    </div>
  );
}

export default UsersPage
