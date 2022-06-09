import React, {useState, useRef, useEffect} from 'react'
import styles from "../styles/AudioPlayer.module.css"
import {AiOutlineFastBackward, AiOutlineFastForward} from "react-icons/ai"
import {BsPlayFill, BsPauseFill } from "react-icons/bs"

const AudioPlayer = () => {
    const [play, setPlay] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    const audioPlayer = useRef();
    const progressBar = useRef();
    const animationRef = useRef();

    useEffect(()=> {
        const seconds = Math.floor(audioPlayer.current.duration)
        setDuration(seconds)
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState])

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs/60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `minutes`
        const seconds = Math.floor(secs%60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `seconds`
        return `${returnedMinutes}:${returnedSeconds}`

    }

    const playPause = () => {
        const prevPlayVal = play
        setPlay(!prevPlayVal)
        if(!prevPlayVal){
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(nowPlaying);
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }

    const nowPlaying = ()=>{
        progressBar.current.value = audioPlayer.current.currentTime
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(nowPlaying);
    }

    const changeLength = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    }

    const changePlayerCurrentTime =()=> {
        progressBar.current.style.setProperty('--before-playhead-width', `${progressBar.current.value/duration * 100 }%`)
        setCurrentTime(progressBar.current.value)
    }

    const fastBack = () => {
        progressBar.current.value = 0
        changeLength();
    }

  return (
    <div className={styles.player}>
        <audio ref={audioPlayer} src="https://www.dropbox.com/s/f06hqjvw62ut5ew/qidea2.mp3" preload="metadata"></audio>
        <button className={styles.fastSkip} onClick={fastBack}><AiOutlineFastBackward /></button>
        <button className={styles.playPause} onClick={playPause}>
            {play ? <BsPauseFill /> : <BsPlayFill className={styles.play}/> }
        </button>
        <button className={styles.fastSkip}><AiOutlineFastForward /></button>

        {/* Curr Time */}
        <div className={styles.currTime}>{calculateTime(currentTime)}</div>

        {/* Progress */}
        <div>
            <input type="range" className={styles.progress} defaultValue="0" ref={progressBar} onChange={changeLength}/>
        </div>

        {/* Duration */}
        <div className={styles.duration}>{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
    </div>
  )
}

export default AudioPlayer