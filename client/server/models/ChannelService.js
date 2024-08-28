const fs = require('fs');
const path = require('path');
const Channel = require('../models/Channel');

const channelFilePath = path.join(__dirname, '..', 'data', 'channels.json');

class ChannelService {
    static readChannels() {
        return new Promise((resolve, reject) => {
            fs.readFile(channelFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const channels = JSON.parse(data).map(channel => new Channel(channel.channelID, channel.groupID, channel.name));
                resolve(channels);
            });
        });
    }

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
