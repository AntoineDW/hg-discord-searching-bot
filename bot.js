const parser = require("discord-command-parser")
const Discord = require("discord.js")
const auth = require("./auth.json") // { "token": "DISCORD_BOT_TOKEN" }
const utils = require("./utils")
const fs = require("fs")

const client = new Discord.Client()

// Number of videos to return with the !yt command
const nb_returned_video = 5

// Getting the list of all the youtube transcriptions from the .json file
let transcripts = fs.readFileSync('data/transcriptions.json')
transcripts = JSON.parse(transcripts)

// Getting the list of all the videos from the .json file
let videos = fs.readFileSync('data/videos.json')
videos = JSON.parse(videos)

client.on("ready", () => {
    console.log(`Logged in as ${ client.user.tag }!`)
})

client.on('message', message => {
    const parsed = parser.parse(message, "!")
    if (!parsed.success) return

    // !yt <keyword>
    // Command returning a list of videos talking about the given keyword
    if (parsed.command === "yt") {
        // Searching the videos that talks the given keyword
        let search = utils.search_videos_by_keyword(parsed.arguments[0], transcripts)
        if (!search.length) return message.channel.send(`Couldn't find any video talking about "${ parsed.arguments[0] }" :confused:`)
        
        // Getting the number of videos that will be returned
        let n = search.length >= nb_returned_video ? nb_returned_video : search.length

        // Formatting the answer that will be sent to the user
        let response = `** **\n**Here ${ n > 1 ? "are" : "is" } ${ n } ${ n > 1 ? "videos" : "video" } talking about "${ parsed.arguments[0] }"**\n\n`
        for (let i = 0; i < n; i++) {
            response += `:arrow_forward:  ${ utils.get_video_title(search[i].id, videos) }\n`
            response += `:link:  <https://youtu.be/${ search[i].id }?t=${ search[i].time }>\n\n`
        }

        return message.channel.send(response)
    }
});

client.login(auth.token)