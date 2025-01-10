import { useEffect, useReducer } from "react";
import { validate } from "../../util/validatior";
import "./Input.css";
const reducerFun = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,

        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isToutched: true,
      };
    default:
      return state;
  }
};
const Input = (props) => {
  const [inputState, dispatch] = useReducer(reducerFun, {
    value: props.value||'',
    isToutched: false,
    isValid: props.valid||'',
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);
  const changeHandler = (e) => {
    dispatch({
      type: "CHANGE",
      val: e.target.value,
      validators: props.validators,
    });
  };
  const touchHandle = () => {
    dispatch({ type: "TOUCH" });
  };
  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandle}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandle}
        value={inputState.value}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isToutched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isToutched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
