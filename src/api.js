const youtube = 'https://www.googleapis.com/youtube/v3/';
const apiKey = "";

//fetch for search
export async function getSearch(val) {
    const search = `${youtube}search?part=snippet&type=video&order=viewCount&maxResults=30&key=${apiKey}&q=${val}`;
    return fetch(search)
    .then(resp => {
        if(!resp.ok){
            if(resp.status >=400 && resp.status < 500) {
                return resp.json().then(data => {
                    let err = `Error: ${data.error.message}`
                    throw err;
                })
            } else {
                let err = "Please try again, server is not responding";
                throw err;
            }
        }            
        return resp.json(); 
    }) 
    .then(data => {
        if(data.pageInfo.totalResults === 0){
            let err = "No results found";
            throw err;
        }
        return data;
    })
    .then(data => data.items.map(el => el.id.videoId))
    .catch(error => {
        return error
    })
}

//fetch for search results (videos and their info)
export async function getSearchResults(searchList){
    const searchVideos = `${youtube}videos?id=${searchList.join()}&key=${apiKey}&part=snippet,statistics,player,contentDetails`;
    return fetch(searchVideos)
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
}

//helper function for choosing best possible thumbnail
function chooseThumbnail(thumbnails){
    if(thumbnails.hasOwnProperty("maxres")){
        return thumbnails.maxres.url
    } else if (thumbnails.hasOwnProperty("standard")) {
        return thumbnails.standard.url
    } else if (thumbnails.hasOwnProperty("high")) {
        return thumbnails.high.url
    } else if (thumbnails.hasOwnProperty("medium")) {
        return thumbnails.medium.url
    } else {
        return thumbnails.default.url
    }
}