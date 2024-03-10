import {useState} from "react";
import { useCookies } from "react-cookie";


const Modal = (props) => {
  const [cookies,setCookie,removeCookie] = useCookies(null);
  const mode = props.mode;
  const editMode = mode==='edit'?true:false;

  const [data,setData] = useState({
    user_email: editMode? props.task.user_email: cookies.Email,
    title: editMode? props.task.title:"",
    progress:editMode?props.task.progress:50,
    date: editMode?props.task.date:new Date()
  });

  const postData = async (e)=>{
    e.preventDefault();
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/`,{
        method:"POST",
        headers:{ "content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      if(response.status===200){
        console.log("worked");
        props.setShowModel(false);
        props.getData();
      }
      console.log(response);
    }catch(e){
      console.log("error in updating edit in modal",e.message);
    }
  }

  const changeData = async (e)=>{
    e.preventDefault();
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${props.task.id}`,{
        method:"PUT",
        headers:{ "Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      if(response.status===200){
        console.log("worked");
        props.setShowModel(false);
        props.getData();
      }
      console.log(response);
    }catch(e){
      console.log("error in updating edit in modal",e.message);
    }
  }


  function handleChange(e){
    const {name,value} = e.target;
    setData(prev=>({...data,[name]:value}));
    console.log(data);
  }
    return (
      <div className="overlay">
          <div className="modal">
            <div className="form-title-container">
              <h3>Let's {mode} your Task</h3>
              <button onClick={()=>props.setShowModel(false)}>X</button>
            </div>

            <form>
              <input 
                required
                maxLength={30}
                placeholder=" Your task goes here"
                name="title"
                value={data.title}
                onChange={handleChange}
              />
              <br />
              <label htmlFor="range">Drag to select your current status</label>
              <input 
                required
                type="range"
                min ="0"
                max="100"
                name="progress"
                value={data.progress}
                onChange={handleChange}
              />
              <input className={mode} type="submit" onClick={editMode? changeData : postData}/>
            </form>
          </div>
      </div>
    );
  }
  
  export default Modal;
