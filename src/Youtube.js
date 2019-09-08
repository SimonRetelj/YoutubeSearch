import React from 'react';
import YoutubeForm from './YoutubeForm';
import Video from './Video';
import * as apiCalls from "./api";
import "./Youtube.css";

class Youtube extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchResults: [],
            videos: [],
            loading: false,
            error: {
                message: null
            }
        }
        this.search = this.search.bind(this);
        this.trackScrolling = this.trackScrolling.bind(this);
    }
    async search(val){
        this.setState({
            searchResults: [],
            videos: [],
            loading: true,
            error: {
                message: null
            }
        })
        let searchResults = await apiCalls.getSearch(val);
        console.log(searchResults);
        if(typeof searchResults !== String){
            this.setState({...this.state, searchResults});
            this.loadSearch();
        } else {
            this.setState({...this.state, loading: false, error: {message: searchResults.message}});
        }
            
    }
    async loadSearch() {
        const {searchResults, videos} = this.state;
        this.setState({...this.state, loading: true})
        const count = videos.length;
        const videosToLoad = searchResults.slice(count, count+10);
        let  loadSearchResults = await apiCalls.getSearchResults(videosToLoad);
        this.setState({...this.state, videos: this.state.videos.concat(loadSearchResults), loading: false});
            
    }
    openVideo(id){
        const videos = this.state.videos.map(el => {
            if(el.id === id){
                return {...el, videoPlay: true}
            } else {
                return el
            }
        })
        this.setState({videos})
    }
    closeVideo(id){
        const videos = this.state.videos.map(el => {
            if(el.id === id){
                return {...el, videoPlay: false}
            } else {
                return el
            }
        })
        this.setState({videos})
    }
    trackScrolling(e){
        const el = document.documentElement.getBoundingClientRect().bottom;
        const el2 = document.documentElement.clientHeight;
        if(Math.floor(el) === el2){
            document.removeEventListener('scroll', this.trackScrolling);
            this.loadSearch();
            setTimeout(() => document.addEventListener('scroll', this.trackScrolling),1000);
        }
    }
    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }
    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }

    render(){
        const {searchResults, videos, loading, error} = this.state;
        const searchVideos = videos.map(vid => (
            <Video 
                key={vid.id}
                {...vid}
                openVideo={this.openVideo.bind(this, vid.id)}
                closeVideo={this.closeVideo.bind(this, vid.id)}
            />
        ))
        let endOutput;
        if(error.message){
            endOutput = error.message;
        }else if(loading){
            endOutput = "Loading..."
        } else if(searchResults.length && searchResults.length === videos.length){
            endOutput = "No more videos"
        }
        return(
            <div id="app">
                <header>
                    <h1>Find Youtube Videos</h1>
                </header>
                <div className="appContainer">
                    <YoutubeForm search={this.search} />
                    <div className="search-results-container">
                        {searchVideos}
                        <div className="closing-text">
                            {endOutput}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Youtube;