function helpHandler({registeredDescriptors}) {
  console.log([
    `Доступные команды:`,
    ...registeredDescriptors.map((descriptor) => `${descriptor.aliases.join(`, `)} — ${descriptor.description};`)
  ].join(`\n`));
}

module.exports = {
  aliases: [`--help`, `-h`],
  description: `печатает этот текст`,
  execute: helpHandler,
};
