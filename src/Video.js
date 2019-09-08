import React from 'react';
import PropTypes from "prop-types";
import "./Video.css";
var ytDuration = require("youtube-duration-format");

class Video extends React.Component {
    render() {
        const {title, channelTitle, description, thumbnail, publishedAt, viewCount, player, duration, videoPlay, openVideo, closeVideo } = this.props;
        const shortDescription = `${description.slice(0,50)}...`;
        const dDuration = ytDuration(duration); //ytDuration changes string into time
        const dViewCount = Number(viewCount).toLocaleString(); //convert viewCount into number with comma
        const date = publishedAt.slice(0,10);
        
        let output;
        //display search
        if(!videoPlay){
            //results - video thumnai and info
            output = <div className="search-result">
                        <div onClick={openVideo} className="img-container disable-selection">
                            <img src={thumbnail} alt="thumbnail"/>
                            <div className="duration">{dDuration}</div>
                        </div>
                        <div className="info-container">
                            <div className="title">{title}</div>
                            <div className="channel-title">{channelTitle} ~</div>
                            <div className="view-count"> {dViewCount} views ~</div>
                            <div className="published">Published: {date}</div>
                            <div className="description">{shortDescription}</div>
                        </div>
                    </div>
        } else {
            //video - video player
            const video = createVideo(player);
            output = <div className="video">
                        <div className="video-wrapper">
                            {video}
                            <div onClick={closeVideo} className="close-button">X</div>
                        </div>
                    </div>
        }
        return(
            <div>
                {output}
            </div>
        )
    }
}

export default Video;

//create iframe video player
function createVideo(vid){
    let source = vid.split(" ")[3];
    const cleanSource = source.slice(5, source.length-1);
    return <iframe title="video" src={cleanSource} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>;
}
Video.propTypes = {
    title: PropTypes.string,
    channelTitle: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    publishedAt: PropTypes.string,
    viewCount: PropTypes.string,
    player: PropTypes.string,
    duration: PropTypes.string,
    videoPlay: PropTypes.bool.isRequired,
    openVideo: PropTypes.func.isRequired,
    closeVideo: PropTypes.func.isRequired
}