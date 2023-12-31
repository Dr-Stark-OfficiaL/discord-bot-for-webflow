const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config()


const Discord = require('discord.js');
const d_token = process.env.TOKEN;
const d_channel = process.env.CHANNEL;
const client = new Discord.Client();
client.login(d_token);

client.on("ready", () => {
    client.user
        .setPresence({
            activity: {
                name: "🥳"
            },
            status: "online"
        })
        .catch((e) => console.log(e));
});


app.use(express.json());

/**
 * The /hook route. Processing the Webflow form data
 * and sending it to a specified Discord channel.
 */

app.post('/form', (req, res) => {
    let form_name = req.body.data.name;
    let form_email = req.body.data.email;
    let form_message = req.body.data.message;

    // Creating a formatted Discord message
    const form_data = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('New form submission')
        .setURL(process.env.SITE)
        .setAuthor(form_name)
        .setDescription(form_message)
        .setThumbnail('https://cdn.theorg.com/49515591-1fdb-45b7-8816-b490414a41ad_thumb.png')
        .addField('Email', form_email, true)
        .setTimestamp()
        .setFooter('Sent through successfully!');

    client.channels.cache.get(d_channel).send(form_data)
        .catch((e) => console.log(e));


    res.set("Connection", "close");
    res.status(200).json({
        data: 'Form submitted successfully'
    });
});

app.listen(PORT, () => {
    console.log("We're up and running!")
});