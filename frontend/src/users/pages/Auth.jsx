import "./Auth.css";
import Input from "../../shared/components/formElements/Input";
import Button from "../../shared/components/formElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validatior";
import Card from "../../shared/components/UiElement/Card";
import { useForm } from "../../shared/Hooks/form-hook";
import { useState } from "react";
import { AuthShared } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UiElement/LoadingSpinner.jsx";
import ErrorModal from "../../shared/components/UiElement/ErrorModal.jsx";
import { login, queryClient } from "../../shared/util/http.js";
import { useMutation } from "@tanstack/react-query";
import ImageUpload from "../../shared/components/formElements/ImageUpload.jsx";
const Auth = () => {
  const [show, setShow] = useState(false);
  const [isLoggiedIn, setLoggendIn] = useState(true);
  const { mutate, error,isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (!isLoggiedIn) {
        queryClient.invalidateQueries(["users"]);
      }
      AuthData.login({ id: data.data._id });
    },
    onError: () => setShow(true),
  });
  const [formState, InputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const switchMode = () => {
    if (isLoggiedIn) {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image:{
            value:null,
            isValid:false
          }
        },
        false
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image:undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
    setLoggendIn((prev) => !prev);
  };
  const AuthData = AuthShared();

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoggiedIn) {
      mutate({
        state: "login",
        body: {
          password: formState.inputs.password.value,
          email: formState.inputs.email.value,
        },
      });
      // try {
      //   const response = await fetch("http://localhost:3000/api/users/login", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       password: formState.inputs.password.value,
      //       email: formState.inputs.email.value,
      //     }),
      //   });
      //   const data = await response.json();
      //   if (!response.ok) {
      //     throw new Error(data.message);
      //   }
      //   
      //   setIsLoading(false);
      //   AuthData.login();
      // } catch (err) {
      //   setError(err.message);
      //   setIsLoading(false);
      // }
    } else {
      const formData=new FormData();
      formData.append("name",formState.inputs.name.value)
      formData.append("password",formState.inputs.password.value)
      formData.append("email",formState.inputs.email.value)
      formData.append("image",formState.inputs.image.value)
      mutate({
        state: "signup",
        body: formData ,
      });
      //   try {
      //     const response = await fetch("http://localhost:3000/api/users/signup", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         name: formState.inputs.name.value,
      //         email: formState.inputs.email.value,
      //         password: formState.inputs.password.value,
      //       }),
      //     });
      //     const data = await response.json();
      //     if (!response.ok) {
      //       throw new Error(data.message);
      //     }
      //     setIsLoading(false);
      //     AuthData.login();
      //   } catch (err) {
      //     setError(err.message);
      //     setIsLoading(false);
      //   }
    }
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
      <Card className="authentication">
        {isPending && <LoadingSpinner asOverlay />}
        <form onSubmit={authSubmitHandler}>
          {!isLoggiedIn && (
            <>
              <Input
                id="name"
                type="text"
                element="input"
                label="Username"
                errorText="Please Enter username"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={InputHandler}
              />
              <ImageUpload center id="image" onInput={InputHandler}/>
            </>
          )}
          <Input
            id="email"
            type="text"
            element="input"
            label="Email"
            errorText="Please Enter valid email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={InputHandler}
          />
          <Input
            id="password"
            type="password"
            element="input"
            label="Password"
            errorText="Please Enter valid password"
            validators={[VALIDATOR_MINLENGTH(3)]}
            onInput={InputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoggiedIn ? "Login" : "Sign up"}
          </Button>
        </form>
        <Button inverse onClick={switchMode}>
          {`Switch to ${isLoggiedIn ? "Sign Up" : "Login"}`}
        </Button>
      </Card>
    </>
  );
};
export default Auth;
