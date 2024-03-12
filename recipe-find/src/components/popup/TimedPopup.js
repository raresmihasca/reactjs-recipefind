import React, {useState, useRef, useEffect} from 'react';
import "./TimedPopup.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom";
function TimedPopup({message,messageType,isVisible, setIsVisible, redirect, timer}) {
    const [isActive, setIsActive] = useState(false);
    const timer1 = useRef(null);
    const timer2 = useRef(null);
    const navigate = useNavigate();

    const icons = {
        success: faCircleCheck,
        error: faCircleExclamation,
    };

    const colors = {
        success: "#33c751",
        error: "#ff2e2e",
    };

    const showToast = () => {
        setIsActive(true);
        clearTimeout(timer1.current);
        clearTimeout(timer2.current);

        timer1.current = setTimeout(() => {
            setIsActive(false);
            setIsVisible(false);
        }, timer && messageType==="success"?timer:5000);

        timer2.current = setTimeout(() => {
            setIsActive(false);
            setIsVisible(false);
            if(redirect && messageType==="success") {
                navigate(redirect);
            }
        }, timer && messageType==="success"?timer+300:5300);
    };

    const hideToast = () => {
        setIsActive(false);
        setIsVisible(false);
        clearTimeout(timer1.current);
        clearTimeout(timer2.current);
    };

    useEffect(() => {
        if(isVisible) {
            showToast();
        }
    },[isVisible]);

    return (
        <div className="timed-popup-parent">
            {isActive && (
                <div className="timed-popup active">
                    <div className="timed-popup-content">
                        <FontAwesomeIcon icon={icons[messageType]} style={{color: colors[messageType],}}  className="check"/>
                        <div className="popup-message">
                            <span className="text text-1">{messageType}</span>
                            <span className="text text-2">{message}</span>
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faXmark} className="close" onClick={hideToast}/>

                    <div className={"progress active "+ messageType + ((timer && messageType==="success") ? timer<=2000 ?" fast":" slow":" slow")} ></div>
                </div>
            )}
        </div>
    );
}

export default TimedPopup;