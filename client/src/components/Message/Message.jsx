
const Message = ({own,message}) => {
    const d = new Date(message?.createdAt);
    let h=d.getHours();
    let m=d.getMinutes();
    let time=h+":"+m;
    const splitedTime = time.split(":");
    const AMorPM = splitedTime[0] >= 12 ? "PM" : "AM";
    const hours = splitedTime[0] % 12 || 12;
    const fullTime = hours + ":" + splitedTime[1] +" "+ AMorPM

    return <>
        <div className="message " id={own ? "you" : "other"}>
            <div className="user-name">shubam choudhary</div>
            <div className="user-message">{message?.text}</div>
            <div className="time">{fullTime}</div>
        </div>
    </>
}

export default Message;