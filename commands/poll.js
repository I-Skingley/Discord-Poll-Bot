const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');


const wait = require('node:timers/promises').setTimeout;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Make a poll!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('What question is the poll asking?')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('How many minutes should the poll run for? Max 15.')
                .setMinValue(1)
                .setMaxValue(15)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('First option')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('Second option')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option3')
                .setDescription('Third option'))
        .addStringOption(option =>
            option.setName('option4')
                .setDescription('Fourth option'))
        .addStringOption(option =>
            option.setName('option5')
                .setDescription('Fifth option'))
    ,
    async execute(interaction, channel) {

        let choices = [
            interaction.options.getString('option1'),
            interaction.options.getString('option2'),
            interaction.options.getString('option3') ?? '',
            interaction.options.getString('option4') ?? '',
            interaction.options.getString('option5') ?? '',
        ]

        choices = choices.filter(item => item);
        console.log(choices);
        const time =
            // CURRENTLY SET TO SECONDS
            interaction.options.getInteger("duration") * 1000
            //interaction.options.getInteger("duration")*1000*60
            ;

        const collector = interaction.channel.createMessageComponentCollector({
            //max: "1",
            time: time,
        })
        let presses = 0;
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('primary')
                    .setLabel('Click me!')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('Secondary')
                    .setLabel('Click me too!')
                    .setStyle(ButtonStyle.Secondary),
            );

        const message = await channel.send({ content: 'test', components: [row], fetchReply: true, })
            .then(msg => {
                setTimeout(() => msg.delete(), time)
            });

        collector.on("collect", async (interaction) => {
            presses = presses + 1;
            await interaction.reply({ content: 'Thank you for voting!', ephemeral: true })
        })
        collector.on("end", async (collected) => {
            console.log(`Collected ${collected.size} clicks`);
        })


        await interaction.deferReply();
        await wait(time);
        await interaction.deleteReply();
        await interaction.followUp(`Poll Ended! with ${presses} presses!`);
    },
};