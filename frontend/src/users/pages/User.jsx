import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UiElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UiElement/LoadingSpinner";
import { useQuery} from '@tanstack/react-query';
import { fetchUsers,queryClient } from "../../shared/util/http";
import { useState } from "react";
const Users = () => {
  const [show,setShow]=useState(false)
  const { data:loadedUsers, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    onError: () => setShow(true), 
    staleTime:10000
  });
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [loadedUsers, setLoadedUsers] = useState(null);
  // useEffect(() => {
  //   setIsLoading(true);
  //   const LodaData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3000/api/users/");
  //       const data = await response.json();
  //       if (!response.ok) {
  //         throw new Error(data.message);
  //       }
  //       setLoadedUsers(data.data);
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //     setIsLoading(false);
  //   };
  //   LodaData();
  // }, []);
  // const clearError = () => {
  //   setError(null);
  // };

  const clearError=()=>{
    setShow(false)
  }
  return (
    <>
      <ErrorModal error={error ? error.message : null} Show={show} onClear={clearError} />
      {isLoading && (
        <div className="center ">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers.data} />};
    </>
  );
};
export default Users;

export const loader = async () => {
  return await queryClient.fetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};