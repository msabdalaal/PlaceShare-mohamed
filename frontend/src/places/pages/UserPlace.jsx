import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { getPlaceByUserId } from "../../shared/util/http";
import { useState } from "react";
import ErrorModal from "../../shared/components/UiElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UiElement/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
const UserPlaces = () => {
  let params = useParams();
  const [show, setShow] = useState(false);
  const {
    data,
    isPending,
    error,
  } = useQuery({
    queryKey: ["Place-of-User", params.UserId],
    queryFn: ({signal})=>getPlaceByUserId({id:params.UserId,signal}),
    onError: () => setShow(true),
  });
  const clearError = () => {
    setShow(false);
  };
  return (
    <>
      <ErrorModal
        error={error ? error.message : null}
        Show={show}
        onClear={clearError}
      />
      {isPending && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isPending && data && <PlaceList itmes={data.data.USER.places} />}
    </>
  );
};
export default UserPlaces;
