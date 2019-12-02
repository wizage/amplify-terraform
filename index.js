const path = require('path');
const { execSync } = require('child_process');
const ejs = require('ejs');
const fs = require('fs');

function init(context) {
  //Do nothing for now

  context.exeInfo.amplifyMeta = {};
  if (!context.exeInfo.amplifyMeta.providers) {
    context.exeInfo.amplifyMeta.providers = {};
  }
  context.exeInfo.amplifyMeta.providers.terraformprovider = {};
  const { envName } = context.exeInfo.localEnvInfo;
  context.exeInfo.teamProviderInfo[envName] = {};
  context.exeInfo.teamProviderInfo[envName]['terraformprovider'] = {};


  return context;
}

async function initEnv(context, providerMetadata) {
  
  const backEndDir = context.amplify.pathManager.getBackendDirPath();
  const appendSchemaTemplate = fs.readFileSync(`${__dirname}/templates/aws_config.tf.ejs`, { encoding: 'utf-8' });

  const appendSchema = ejs.render(appendSchemaTemplate, providerMetadata);

  fs.appendFileSync(`${backEndDir}/aws_config.tf`, appendSchema);
  const command = `terraform init ${backEndDir}`;
  const log = execSync(command, {stdio: 'inherit'});
}

function onInitSuccessful(context) {}

function pushResources(context, resourceList) {
  const command = `terraform plan ${backEndDir}`;
  const log = execSync(command, {stdio: 'inherit'});
  const command2 = `terraform apply ${backEndDir}`;
  const log2 = execSync(command2, {stdio: 'inherit'});
}

function deleteEnv(context, envName) {}

function configure(context) {}

async function executeAmplifyCommand(context) {
  const commandsDirPath = path.normalize(path.join(__dirname, 'commands'));
  const commandPath = path.join(commandsDirPath, context.input.command);
  const commandModule = require(commandPath);
  await commandModule.run(context);
}

async function handleAmplifyEvent(context, args) {
  const eventHandlersDirPath = path.normalize(path.join(__dirname, 'event-handlers'));
  const eventHandlerPath = path.join(eventHandlersDirPath, `handle-${args.event}`);
  const eventHandlerModule = require(eventHandlerPath);
  await eventHandlerModule.run(context, args);
}

module.exports = {
  init,
  onInitSuccessful,
  initEnv,
  deleteEnv,
  configure,
  pushResources,
  executeAmplifyCommand,
  handleAmplifyEvent,
};
