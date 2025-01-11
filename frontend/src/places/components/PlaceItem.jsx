import "./PlaceItem.css";
import Button from "../../shared/components/formElements/Button";
import Card from "../../shared/components/UiElement/Card";
import Modal from "../../shared/components/UiElement/Modal";
import Map from "../../shared/components/UiElement/Map";
import { useState } from "react";
import { AuthShared } from "../../shared/context/auth-context";
import { useMutation } from "@tanstack/react-query";
import { deletePlaceById, queryClient } from "../../shared/util/http";
import { useNavigate, useParams } from "react-router-dom";


const PlaceItem = ({
  coordinates,
  address,
  description,
  title,
  image,
  id,
}) => {

  const params=useParams()
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [showWarnining, setWarning] = useState(false);
  const closeMapHandler = () => setShowMap(false);
  const openMapHandler = () => setShowMap(true);
  const closeWarning = () => setWarning(false);
  const openWarning = () => setWarning(true);
  const { mutate, isPending } = useMutation({
    mutationFn: deletePlaceById,
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ["Place-of-User",params.UserId],
      });
      const prevData = queryClient.getQueryData(["Place-of-User",params.UserId]);

      queryClient.setQueryData(["Place-of-User",params.UserId], (prev) => {
        if (!prev || !prev.data) return prev;

        const updatedPlaces = prev.data.USER.places.filter(
          (place) => place._id !== data.id
        );
        const obj = {
          ...prev, 
          data: {
            ...prev.data,
            USER: {
              ...prev.data.USER,
              places: updatedPlaces, 
            },
          },
        };
        return obj;
      });

      return { prevData };
    },
    onError: (error,data,context)=>{
      console.log(error); 
      queryClient.setQueryData(["Place-of-User",params.UserId], context.prevData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["Place-of-User", params.UserId]);
    },
    onSuccess :()=>{
      navigate(``);
    }
  });
  const confirmDelte = () => {
    closeWarning();
    mutate({ id });
  };

  const AuthData = AuthShared();


  return (
    <>

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map Lat={coordinates.lat} Lng={coordinates.lon} />
        </div>
      </Modal>
      <Modal
        show={showWarnining}
        onCancel={closeWarning}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        header={address}
        footer={
          <>
            <Button onClick={closeWarning}>Close</Button>
            <Button onClick={confirmDelte} disabled={isPending}>
              {" "}
              {isPending ? "Delete...." : "Delete"}
            </Button>
          </>
        }
      >
        Are you Shure you want delte this place ?
      </Modal>
      <li key={id} className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={image} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h2>{address}</h2>
            <h2>{description}</h2>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              View on map
            </Button>
            {AuthData.isLoggedIn && AuthData.userId===params.UserId&& (
              <>
                <Button to={`/places/${id}`}>Edit</Button>
                <Button danger onClick={openWarning} disabled={isPending}>
                  {isPending ? "Delete...." : "Delete"}
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};
export default PlaceItem;
