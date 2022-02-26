import React from 'react';

const ProgressBar = ({ CurrentProgress, MaxProgress,setShowProgressBar }) => {

    CurrentProgress>=MaxProgress &&setShowProgressBar([false,[]]);
    return (
        <div onClick={()=>setShowProgressBar([false,[0,100]])} style={{ position: "absolute",zIndex:1, top: "58px", left: "20%", width: "60%" }} >

            <div id="myProgress" style={{ width: "100%", backgroundColor: "white", height: "15px" , border:"1px solid black"}}>
                <div id="myBar" style={{ width: (CurrentProgress * 100 / MaxProgress) + '%', height: "13px", backgroundColor: "red" }}></div>
            </div>
          </div>
    )
}

export default ProgressBar