const Notification = ({ message }) => {
    if (!message) return null;
  
    return (
      <div className="notification error" style={{backgroundColor: "red", color: "white"}}>
        {message}
      </div>
    );
  };
  
  export default Notification;
  