import "./App.css";
import { Controller, useForm } from "react-hook-form";
import NumberInput from "./Number";

function App() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const handleRegistration = (data) => {
    console.log("ran successfully");
    console.log(data);
  };
  const handleError = (e) => {
    console.log("got errors");
    console.log({ errors, e });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleRegistration, handleError)}>
        <NumberInput control={control} mode="whole" initialValue={27} />
        <button>Submit</button>
      </form>
    </>
  );
}

export default App;
