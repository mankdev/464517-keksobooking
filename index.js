const versionDescriptor = require(`./src/descriptors/version`);
const helpDescriptor = require(`./src/descriptors/help`);
const greetingDescriptor = require(`./src/descriptors/greeting`);
const unknownDescriptor = require(`./src/descriptors/unknown`);
const authorDescriptor = require(`./src/descriptors/author`);
const serverDescriptor = require(`./src/descriptors/server`);
const fillDescriptor = require(`./src/descriptors/fill`);

const registeredDescriptors = [
  versionDescriptor,
  helpDescriptor,
  authorDescriptor,
  serverDescriptor,
  fillDescriptor
];


const allDescriptors = [
  ...registeredDescriptors
];

const [command] = process.argv.slice(2);

let commandDescriptor;

if (command) {
  commandDescriptor = allDescriptors
      .find(((cmd) => cmd.aliases.map((alias) => alias.split(` `)[0]).indexOf(command) > -1)) || unknownDescriptor;
} else {
  commandDescriptor = greetingDescriptor;
}

commandDescriptor.execute({
  registeredDescriptors,
  command,
});

