import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {

    try{

      await API.post("/api/users/register",{

        name: name,
        email: email,
        password: password,
        role: "USER"

      });

      alert("Registration Successful");

      navigate("/");

    }catch(error){

      console.log(error);
      alert("Registration Failed");

    }

  };

  return(

    <div>

      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e)=>setName(e.target.value)}
      />

      <br/>

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/>

      <button onClick={handleRegister}>
        Register
      </button>

    </div>

  );

}

export default Register;