import { useNavigate } from "react-router-dom";

function Dashboard(){

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  return(

    <div>

      <h1>Smart Ambulance Dashboard</h1>

      <button onClick={()=>navigate("/emergency")}>
        Request Ambulance
      </button>

      <br/><br/>

      <button onClick={()=>{
        localStorage.removeItem("token");
        navigate("/");
      }}>
        Logout
      </button>

      <br/><br/>

      <p>JWT Token:</p>

      <p>{token}</p>

    </div>

  );

}

export default Dashboard;