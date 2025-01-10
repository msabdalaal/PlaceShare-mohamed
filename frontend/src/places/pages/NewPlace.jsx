import "./PlaceForm.css";
import Button from "../../shared/components/formElements/Button.jsx";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validatior.js";
import Input from "../../shared/components/formElements/Input.jsx";
import { useForm } from "../../shared/Hooks/form-hook.js";
import { AddPlace, queryClient } from "../../shared/util/http.js";
import { useMutation } from "@tanstack/react-query";
import { AuthShared } from "../../shared/context/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../shared/components/UiElement/ErrorModal.jsx";
import { useState } from "react";
import LoadingSpinner from "../../shared/components/UiElement/LoadingSpinner.jsx";
import ImageUpload from "../../shared/components/formElements/ImageUpload.jsx";
// import { useCallback, useReducer } from "react";
// const formReducer = (state, action) => {
//   switch (action.type) {
//     case "INPUT_CHANGE": {
//       let formIsValid = true;
//       for (const inputId in state.inputs) {
//         if (inputId === action.inputId) {
//           formIsValid = formIsValid && action.isValid;
//         } else {
//           formIsValid = formIsValid && state.inputs[inputId].isValid;
//         }
//       }
//       return {
//         ...state,
//         inputs: {
//           ...state.inputs,
//           [action.inputId]: { value: action.value, isValid: action.isValid },
//         },
//         isValid: formIsValid,
//       };
//     }
//     default:
//       return state;
//   }
// };
const NewPlace = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image:{
        value: null,
        isValid: false,
      }
    },
    false
  );
  const AuthData = AuthShared();
  const { mutate, error, isPending } = useMutation({
    mutationFn: AddPlace,
    onSuccess: () => {
      queryClient.invalidateQueries(["Place-of-User", AuthData.userId]);
      navigate("/");
    },
    onError:()=>setShow(true)
  });
  // const [formState, dispatch] = useReducer(formReducer, {
  //   inputs: {
  // title: {
  //   value: "",
  //   isValid: false,
  // },
  // description: {
  //   value: "",
  //   isValid: false,
  // },
  // address: {
  //   value: "",
  //   isValid: false,
  // },
  //   },
  // });
  // const InputHandler = useCallback((id, value, isValid) => {
  //   dispatch({
  //     type: "INPUT_CHANGE",
  //     value,
  //     isValid,
  //     inputId: id,
  //   });
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData=new FormData();
    formData.append("title",formState.inputs.title.value);
    formData.append("description",formState.inputs.description.value);
    formData.append("address",formState.inputs.address.value);
    formData.append("creator",AuthData.userId);
    formData.append("image",formState.inputs.image.value);
    mutate({
      body: formData,
    });
  };
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
      <form className="place-form" onSubmit={handleSubmit}>
        {isPending && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          element="input"
          label="Title"
          errorText="Please Enter Value"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
        />
        <Input
          id="description"
          type="description"
          element="textarea"
          label="Description"
          errorText="Please Enter Value"
          validators={[VALIDATOR_MINLENGTH(3)]}
          onInput={InputHandler}
        />
        <Input
          id="address"
          type="text"
          element="input"
          label="Address"
          errorText="Please Enter Value"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
        />
        <ImageUpload
          errorText="Select image"
          center
          id="image"
          onInput={InputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isPending ? "wait...." : "Add Place"}
        </Button>
      </form>
    </>
  );
};
export default NewPlace;
