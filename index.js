const versionDescriptor = require(`./src/version`);
const helpDescriptor = require(`./src/help`);
const greetingDescriptor = require(`./src/greeting`);
const unknownDescriptor = require(`./src/unknown`);
const authorDescriptor = require(`./src/author`);
const descriptionDescriptor = require(`./src/description`);
const licenseDescriptor = require(`./src/license`);

const registeredDescriptors = [
  versionDescriptor,
  helpDescriptor,
  authorDescriptor,
  descriptionDescriptor,
  licenseDescriptor
];

const systemDescriptors = [
  greetingDescriptor,
];

const allDescriptors = [
  ...registeredDescriptors,
  ...systemDescriptors,
];

const [command] = process.argv.slice(2);

const commandDescriptor = allDescriptors.find(((cmd) => cmd.aliases.indexOf(command) > -1)) || unknownDescriptor;

commandDescriptor.execute({
  registeredDescriptors,
  command,
});

