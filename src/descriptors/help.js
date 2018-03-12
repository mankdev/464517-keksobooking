require(`colors`);

function helpHandler({registeredDescriptors}) {
  console.log([
    `Доступные команды:`,
    ...registeredDescriptors
        .map((descriptor) =>
          `${descriptor.aliases
              .map((alias) => alias.grey)
              .join(`, `)} — ${descriptor.description.green}`)
  ].join(`\n`));
  process.exit(0);
}

module.exports = {
  aliases: [`--help`, `-h`],
  description: `печатает этот текст`,
  execute: helpHandler,
};
