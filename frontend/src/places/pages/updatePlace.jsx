import { useNavigate, useParams } from "react-router-dom";
import Input from "../../shared/components/formElements/Input.jsx";
import Button from "../../shared/components/formElements/Button";
import Card from "../../shared/components/UiElement/Card.jsx";
import { useForm } from "../../shared/Hooks/form-hook.js";
import "./PlaceForm.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validatior.js";
import { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UiElement/ErrorModal.jsx";
import LoadingSpinner from "../../shared/components/UiElement/LoadingSpinner.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPlaceById,
  queryClient,
  updatePlaceById,
} from "../../shared/util/http.js";
import { AuthShared } from "../../shared/context/auth-context.jsx";

const UpdatePlace = () => {
  const params = useParams();
  const authData = AuthShared();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const {
    data: place,
    isPending,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["places", params.placeId],
    queryFn: ({ signal }) => getPlaceById({ id: params.placeId, signal }),
    onError: () => setShow(true),
  });
  const { mutate ,error:err} = useMutation({
    mutationFn: updatePlaceById,
    onMutate: async (data) => {
      const newData = data.body;
      
      // إلغاء الاستعلامات السابقة
      await queryClient.cancelQueries({ queryKey: ["places", params.placeId] });
      await queryClient.cancelQueries({
        queryKey: ["Place-of-User", authData.userId],
      });
    
      // الحصول على البيانات السابقة من الكاش
      const prev1 = queryClient.getQueryData(["places", params.placeId]);
      const prev2 = queryClient.getQueryData([
        "Place-of-User",
        authData.userId,
      ]);
      // تحديث الكاش بالبيانات الجديدة
      queryClient.setQueryData(["places", params.placeId], newData);
      queryClient.setQueryData(["Place-of-User", authData.userId], (prev) => {
        if (!prev || !prev.data) return prev;
    
        const updatedPlaces = prev.data.USER.places.map((place) =>
          place._id === data.id
            ? {
                ...place,
                title: data.body.title,
                description: data.body.description,
              }
            : place
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
    

      return { prev1, prev2 };
    },
    onError: (error, variables, context) => {


      queryClient.setQueryData(["places", params.placeId], context.prev1);
      queryClient.setQueryData(
        ["Place-of-User", authData.userId],
        context.prev2
      );
      setShow(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["places", params.placeId]);
      queryClient.invalidateQueries(["Place-of-User", authData.userId]);
    },
    onSuccess :()=>{
      navigate(`/${authData.userId}/places`);
    }
  });
  const clearError = () => {
    setShow(false);
  };
  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  useEffect(() => {
    if (place && place.data && place.data.place) {
      setFormData(
        {
          title: {
            value: place.data.place.title,
            isValid: true,
          },
          description: {
            value: place.data.place.description,
            isValid: true,
          },
        },
        true
      );
    }
  }, [setFormData, place]);

  if (isLoading || isPending || (place && place.status !== "success")) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!place)
    return (
      <div className="center">
        <Card>
          <h2>No Place</h2>
        </Card>
      </div>
    );

  const submitform = (event) => {
    event.preventDefault();
    mutate({
      id: params.placeId,
      body: {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      },
    });
  };
  return (
    <>
      <ErrorModal
        error={error ? error.message : (err ? err.message:null)}
        Show={show}
        onClear={clearError}
      />
      {!isPending && place && place.data && place.data.place && (
        <form className="place-form" onSubmit={submitform}>
          <Input
            id="title"
            element="input"
            type="text"
            label="title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="no data"
            onInput={InputHandler}
            value={place.data.place.title}
            valid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(3)]}
            errorText="min char 5"
            onInput={InputHandler}
            value={place.data.place.description}
            valid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </>
  );
};
export default UpdatePlace;
