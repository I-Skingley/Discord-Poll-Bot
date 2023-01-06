const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ApplicationCommandOptionWithChoicesAndAutocompleteMixin, EmbedBuilder } = require('discord.js');
const QuickChart = require('quickchart-js');


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
        const question = interaction.options.getString('question');
        let choices = [
            interaction.options.getString('option1'),
            interaction.options.getString('option2'),
            interaction.options.getString('option3') ?? '',
            interaction.options.getString('option4') ?? '',
            interaction.options.getString('option5') ?? '',
        ]
        // Remove empty choices
        choices = choices.filter(item => item);

        let score = new Array(choices.length).fill(0);
        let votes = [];

        const time =
            // CURRENTLY SET TO SECONDS
            interaction.options.getInteger("duration") * 1000
            //interaction.options.getInteger("duration")*1000*60
            ;

        const collector = interaction.channel.createMessageComponentCollector({
            time: time,
        })

        var str = "new ActionRowBuilder().addComponents(";
        for (var i = 0; i < choices.length; i++) {
            str += `new ButtonBuilder().setCustomId("${choices[i]}").setLabel("${choices[i]}!").setStyle(ButtonStyle.Primary),`;
        }
        str += ");";

        const row = eval(str)


        const message = await channel.send({ content: question, components: [row], fetchReply: true, })
            .then(msg => {
                setTimeout(() => msg.delete(), time)
            });

        collector.on("collect", async (interaction) => {
            let choice = (choices.findIndex((x) => x === interaction.customId))

            if (!exists(votes, interaction.user.id)) {
                votes.push([interaction.user.id, interaction.customId]);
                // console.log(`User ${interaction.user.id} pressed ${interaction.customId}`);
                score[choice] += 1;

                await interaction.reply({ content: 'Thank you for voting!', ephemeral: true });
            }
            else (await interaction.reply({ content: 'You have already voted in this poll!', ephemeral: true }));
            score[choice] += 1;


        })
        collector.on("end", async (collected) => {
            let end = "Results:";
            for (let i = 0; i < choices.length; i++) {
                end += `\n${choices[i]} got ${score[i]} votes`;
            }
            var result = [];
            for (var i = 0; i < choices.length; i++) {
                result.push([choices[i], score[i]]);
            }


            // console.log(result);
            // console.log(end);
            // console.log(`Collected ${collected.size} clicks`);
        })

        await interaction.deferReply();
        await wait(time);
        await interaction.deleteReply();
        const chartEmbed = new EmbedBuilder()
            .setTitle(question)
            .setDescription('Here are the results of the poll:')
            .setImage(chart(choices, score).getUrl())
            ;
//        console.log(chart(choices, score).getUrl());
        await interaction.followUp({ embeds: [chartEmbed] });
    },

};

function chart(choices, score) {
    const myChart = new QuickChart();
    myChart.setConfig({
        type: 'bar',
        data: { labels: choices, datasets: [{ label: '# Votes', data: score }] },
    })
        .setWidth(800)
        .setHeight(400);
    return myChart;
}

function exists(arr, search) {
//    console.log('CHECK');
    return arr.some(row => row.includes(search));
}

