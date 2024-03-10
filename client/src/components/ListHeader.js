import { useCookies } from "react-cookie";
import Modal from "./Modal";
import {useState} from "react";

const ListHeader = (props) => {
  const [showModel,setShowModel] = useState(null);
  const [cookies,setCookie,removeCookie] = useCookies(null);
  const signOut = (e)=>{
    removeCookie('Email');
    removeCookie('AuthToken');
    window.location.reload();

  }

    return (
      <div className="list-header">
        <h1>{props.listName}</h1>
        <div className="button-container">
          <button className="create" onClick={()=>setShowModel(true)}>ADD NEW</button>
          <button className="signout" onClick={signOut}>SIGN OUT</button>
        </div>
        {showModel && <Modal mode={"create"} setShowModel={setShowModel} getData = {props.getData}/>}
      </div>
    );
  }
  
  export default ListHeader;
  