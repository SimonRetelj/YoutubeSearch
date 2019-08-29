import React from 'react';
import YoutubeForm from './YoutubeForm';
import Video from './Video';
import "./Youtube.css";

const youtube = 'https://www.googleapis.com/youtube/v3/';
const apiKey = "";

class Youtube extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            videos: []
        }
        this.search = this.search.bind(this);
    }
    search(val){
        const search = `${youtube}search?part=snippet&type=video&order=viewCount&maxResults=10&key=${apiKey}&q=${val}`;
        fetch(search)
            .then(data => data.json())
            .then(data => data.items.map(el => el.id.videoId))
            .then(searchString => {
                const videos =  `${youtube}videos?id=${searchString.join()}&key=${apiKey}&part=snippet,statistics,player,contentDetails`;
                return fetch(videos); 
            })
            .then(data => data.json())
            .then(videos => videos.items.map(el => (
                {   
                    id: el.id,
                    title: el.snippet.title,
                    channelTitle: el.snippet.channelTitle,
                    description: el.snippet.description,
                    thumbnail: chooseThumbnail(el.snippet.thumbnails),
                    publishedAt: el.snippet.publishedAt,
                    viewCount: el.statistics.viewCount,
                    player: el.player.embedHtml,
                    duration: el.contentDetails.duration,
                    videoPlay: false
                }
            )))
            .then(videos => this.setState({videos}))
    }
    openVideo(id){
        const videos = this.state.videos.map(el => {
            if(el.id === id){
                return {
                    ...el,
                    videoPlay: true
                }
            } else {
                return el
            }
        })
        this.setState({videos})
    }
    closeVideo(id){
        const videos = this.state.videos.map(el => {
            if(el.id === id){
                return {
                    ...el,
                    videoPlay: false
                }
            } else {
                return el
            }
        })
        this.setState({videos})
    }

    render(){
        const searchVideos = this.state.videos.map(vid => (
            <Video 
                key={vid.id}
                {...vid}
                openVideo={this.openVideo.bind(this, vid.id)}
                closeVideo={this.closeVideo.bind(this, vid.id)}
            />
        ))
        return(
            <div className="appContainer">
                <YoutubeForm search={this.search} />
                <div className="search-results-container">
                    {searchVideos} 
                </div>
            </div>
        )
    }
}
function chooseThumbnail(thumbnails){
    if(thumbnails.hasOwnProperty("maxres")){
        return thumbnails.maxres.url
    } else {
        return thumbnails.standard.url
    }
}

export default Youtube;