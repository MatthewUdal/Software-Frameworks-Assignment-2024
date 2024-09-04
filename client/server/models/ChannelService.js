const fs = require('fs');
const path = require('path');
const Channel = require('../models/Channel');

const channelFilePath = path.join(__dirname, '..', 'data', 'channels.json');


class ChannelService {
    // method used to read all channels and return an array of channel instances
    static readChannels() {
        return new Promise((resolve, reject) => {
            fs.readFile(channelFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const channels = JSON.parse(data).map(channel => 
                    new Channel(channel.channelID, channel.groupID, channel.name, channel.members || []));
                resolve(channels);
            });
        });
    }

    // method used to write an instance of channel
    static writeChannels(channels) {
        return new Promise((resolve, reject) => {
            fs.writeFile(channelFilePath, JSON.stringify(channels, null, 2), 'utf8', (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

}

module.exports = ChannelService;
