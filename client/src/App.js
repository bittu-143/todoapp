import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem.js";
import Auth from "./components/auth.js";
import { useCookies } from "react-cookie";
const App = () => {
  const [cookies, setCookie,removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [tasks,setTasks] = useState(null);
  if(cookies.authToken){
    console.log("it is working");
  }
  const getData = async ()=>{  
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`);
      const json = await response.json();
      setTasks(json);
      //console.log(json);
    }catch(e){
      console.log("error in getData in app component",e.message);
    }
  }
  useEffect(()=> {
    if(authToken){
      getData();
    }},[]);
  console.log("hello",tasks);
  // sort by date 
  const sortedTasks = tasks?.sort((a,b)=>new Date(a.date) - new Date(b.date));
  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && 
      <>
      <ListHeader listName={'Holiday tick list'} getData={getData}/>
      <p>Welcome {cookies.Email}</p>
      {sortedTasks?.map((task)=><ListItem key={task.id} task={task} getData={getData}/>)}
      </>}
      <p></p>
    </div>
  );
}

export default App;
