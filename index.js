const Discord = require('discord.js'),
    client = new Discord.Client({
		fetchAllMembers: true
	}),
    config = require('./config.json'),
    fs = require('fs')

client.login(process.env.TOKEN);
client.commands = new Discord.Collection()

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    if (command.guildOnly && !message.guild) return message.channel.send('Cette commande ne peut être utilisée que dans un serveur.')
    command.run(message, args, client)
})

client.on('ready' , () => {
    const statuses = [
        'Bot en dev',
        'Love WimoX',
        'discord.gg/RHuQjpNG2X'
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i], {type: 'STREAMING', url: 'https://twitch.tv/cuvette_en_stream'})
        i = ++i % statuses.length
    }, 5e3)
})
