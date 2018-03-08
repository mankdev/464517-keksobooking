const versionDescriptor = require(`./src/descriptors/version`);
const helpDescriptor = require(`./src/descriptors/help`);
const greetingDescriptor = require(`./src/descriptors/greeting`);
const unknownDescriptor = require(`./src/descriptors/unknown`);
const authorDescriptor = require(`./src/descriptors/author`);
const descriptionDescriptor = require(`./src/descriptors/description`);
const licenseDescriptor = require(`./src/descriptors/license`);
const serverDescriptor = require(`./src/descriptors/server`);

const registeredDescriptors = [
  versionDescriptor,
  helpDescriptor,
  authorDescriptor,
  descriptionDescriptor,
  licenseDescriptor,
  serverDescriptor
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

