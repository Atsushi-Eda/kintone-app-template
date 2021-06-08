const fs = require('fs');
const Utils = require('../common/Utils');
const commander = require('./commander');
const Progress = require('../common/Progress');
const Client = require('../common/Client');
const RelatedAppGetter = require('./RelatedAppGetter');
const FormFieldsDivider = require('./FormFieldsDivider');
const RecordsDivider = require('./RecordsDivider');
const FileExtractor = require('./FileExtractor');
const FileDownloader = require('./FileDownloader');

(async () => {
  commander.parse(process.argv);
  const options = Utils.objectValueMap(commander.opts(), (option) => option.replace(' ', ''));
  const client = new Client().setOptions(options).getClient();
  const appIds = commander.args[0].split(',');
  const fileName = options.fileName || 'template.json';
  const progress = new Progress([
    'Get related apps.',
    'Get app settings & records.',
    'Get files.',
    'Export template.',
  ]);
  const relatedApps = await new RelatedAppGetter(client, appIds).getAllApps();
  progress.proceed();
  const apps = await Promise.all(
    relatedApps.appIds.map(
      async (appId, appIndex) =>
        await Promise.all([
          client.app
            .getAppSettings({ app: appId })
            .then((appSettings) => ({ appSettings })),
          client.app.getFormFields({ app: appId }).then((formFields) => ({
            formFields: new FormFieldsDivider(
              formFields,
              relatedApps.appIds
            ).divide(),
          })),
          client.app
            .getFormLayout({ app: appId })
            .then((formLayout) => ({ formLayout })),
          client.app.getViews({ app: appId }).then((views) => ({ views })),
          client.app.getAppAcl({ app: appId }).then((appAcl) => ({ appAcl })),
          client.app
            .getFieldAcl({ app: appId })
            .then((fieldAcl) => ({ fieldAcl })),
          client.app
            .getRecordAcl({ app: appId })
            .then((recordAcl) => ({ recordAcl })),
          client.app
            .getAppCustomize({ app: appId })
            .then((appCustomize) => ({ appCustomize })),
          client.app
            .getProcessManagement({ app: appId })
            .then((processManagement) => ({ processManagement })),
          client.record
            .getAllRecordsWithCursor({
              app: appId,
              query: 'order by $id asc',
            })
            .then((records) => ({
              records: new RecordsDivider(
                records,
                relatedApps.relatedFieldCodes[appIndex]
              ).divide(),
            })),
        ]).then((responses) => {
          return responses.reduce((app, response) => {
            return {
              ...app,
              [Object.keys(response)[0]]: Object.values(response)[0],
            };
          }, {});
        })
    )
  );
  progress.proceed();
  const files = await FileDownloader.downloads(
    client,
    FileExtractor.extract(apps)
  );
  progress.proceed();
  fs.writeFileSync(
    fileName,
    JSON.stringify({
      apps,
      files,
    })
  );
  progress.proceed();
  console.log(`Exported "${fileName}".`);
  console.log(`Includes ${relatedApps.appIds.length} apps.`);
  console.table(relatedApps.appIds.map((appId) => ({ appId })));
})();
