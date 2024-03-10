import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";
import {useState} from "react";
const ListItem = (props) => {
  const t = props.task;
  const [showModel,setShowModel] = useState(null);
  const deleteData = async ()=>{
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${t.id}`,{
        method:"Delete",
      });
      if(response.status===200){
        
        props.getData();
      }
      console.log(response);
    }catch(e){
      console.log("error in delete list in listitems",e.message);
    }
  }
    return (
      <div className="list-item">
        <div className="info-container">
        <TickIcon />
        <p className="task-title">{t.title}</p>
        <ProgressBar />
        </div>

        <div className="button-container">
          <button className="edit" onClick={()=>setShowModel(true)}>EDIT</button>
          <button className="delete" onClick={deleteData}>DELETE</button>
        </div>
        {showModel && <Modal mode={"edit"} setShowModel={setShowModel} task={t} getData={props.getData}/>}
      </div>
    );
  }
  
  export default ListItem;
  