// Function that searchs a given keyword in a list of transcriptions
exports.search_videos_by_keyword = function(keyword, transcripts) {
    // Searching the lines that contains the given keyword
    let search = transcripts.filter(transcript => transcript.text.match(keyword))
    let aggregate = {}
    let result = []

    // Grouping the lines found by videos, with minimum time and row counting aggregations
    search.forEach(result => {
        if (aggregate[result.id] !== undefined) {
            if (result.start < aggregate[result.id].time) aggregate[result.id].time = result.start
            aggregate[result.id].count++
        } else {
            aggregate[result.id] = { "id": result.id, "time": parseInt(result.start), "count": 1 }
        }
    })

    // Sorting the videos by the row counting value (descending order)
    let sorted = Object.keys(aggregate).sort(function(a, b) { return aggregate[b].count - aggregate[a].count })
    sorted.forEach(key => { result.push(aggregate[key]) })

    return result
}

// Function that returns the title of the given video id
exports.get_video_title = function(id, videos) {
    let search = videos.filter(video => video.id === id)
    if (search.length > 0) return search[0].title
    else return null
}