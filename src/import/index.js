const fs = require('fs');
const rp = require('request-promise');
const commander = require('./commander');
const Progress = require('../common/Progress');
const Client = require('../common/Client');
const deployApp = require('./deployApp');
const FormFieldsFormatter = require('./FormFieldsFormatter');
const FileUploader = require('./FileUploader');
const FileFormatter = require('./FileFormatter');

(async () => {
  commander.parse(process.argv);
  const client = new Client().setCommander(commander).getClient();
  const filePath = commander.args[0];
  const spaceId = commander.spaceId || commander.guestSpaceId;
  const progress = new Progress([
    'Get template.',
    'Add files.',
    'Add app settings.',
    'Add records.',
  ]);
  const template = JSON.parse(
    /^https?:\/\//.test(filePath)
      ? await rp(filePath)
      : fs.readFileSync(filePath, 'utf-8')
  );
  progress.proceed();
  const formFieldsFormatter = new FormFieldsFormatter();
  const fileFormatter = new FileFormatter(
    await FileUploader.uploads(client, template.files)
  );
  progress.proceed();
  const appIds = [];
  for (const app of template.apps) {
    const appId = await client.app
      .addApp(
        spaceId
          ? {
              name: app.appSettings.name,
              space: spaceId,
            }
          : {
              name: app.appSettings.name,
            }
      )
      .then((response) => response.app);
    appIds.push(appId);
    const copyAppProperties = await client.app
      .getFormFields({
        app: appId,
        preview: true,
      })
      .then((formFields) => formFields.properties);
    await client.app.updateAppSettings({
      ...fileFormatter.formatAppSettings(app.appSettings),
      app: appId,
      revision: -1,
    });
    await client.app.addFormFields({
      app: appId,
      properties: app.formFields.basics,
      revision: -1,
    });
    await client.app.updateFormFields({
      app: appId,
      properties: formFieldsFormatter.formatPresets(
        app.formFields.presets,
        copyAppProperties
      ),
      revision: -1,
    });
  }
  await deployApp(client, appIds);
  formFieldsFormatter.setAppIds(appIds);
  for (const appIndex in template.apps) {
    const app = template.apps[appIndex];
    const appId = appIds[appIndex];
    await client.app.addFormFields({
      app: appId,
      properties: {
        ...formFieldsFormatter.formatRelateds(app.formFields.lookups),
        ...formFieldsFormatter.formatSubtables(app.formFields.subtables),
      },
      revision: -1,
    });
  }
  await deployApp(client, appIds);
  for (const appIndex in template.apps) {
    const app = template.apps[appIndex];
    const appId = appIds[appIndex];
    await client.app.addFormFields({
      app: appId,
      properties: formFieldsFormatter.formatRelateds(
        app.formFields.referenceTables
      ),
      revision: -1,
    });
  }
  for (const appIndex in template.apps) {
    const app = template.apps[appIndex];
    const appId = appIds[appIndex];
    await client.app.updateFormLayout({
      ...app.formLayout,
      app: appId,
      revision: -1,
    });
    await client.app.updateViews({
      ...app.views,
      app: appId,
      revision: -1,
    });
    await client.app.updateAppAcl({
      ...app.appAcl,
      app: appId,
      revision: -1,
    });
    await client.app.updateFieldAcl({
      ...app.fieldAcl,
      app: appId,
      revision: -1,
    });
    await client.app.updateRecordAcl({
      ...app.recordAcl,
      app: appId,
      revision: -1,
    });
    await client.app.updateAppCustomize({
      ...fileFormatter.formatAppCustomize(app.appCustomize),
      app: appId,
      revision: -1,
    });
    await client.app.updateProcessManagement({
      ...app.processManagement,
      app: appId,
      revision: -1,
    });
  }
  await deployApp(client, appIds);
  progress.proceed();
  for (const appIndex in template.apps) {
    const app = template.apps[appIndex];
    const appId = appIds[appIndex];
    await client.record.addAllRecords({
      app: appId,
      records: fileFormatter.formatRecordsPosts(app.records.posts),
    }).catch(({errorIndex, error}) => console.log(`index: ${errorIndex}, message: ${error.message}`));
    await client.record.deleteAllRecords({
      app: appId,
      records: app.records.deletes,
    }).catch(({errorIndex, error}) => console.log(`index: ${errorIndex}, message: ${error.message}`));
  }
  for (const appIndex in template.apps) {
    const app = template.apps[appIndex];
    const appId = appIds[appIndex];
    await client.record.updateAllRecords({
      app: appId,
      records: fileFormatter.formatRecordsPuts(app.records.puts),
    }).catch(({errorIndex, error}) => console.log(`index: ${errorIndex}, message: ${error.message}`));
  }
  progress.proceed();
  console.log(`Added ${template.apps.length} apps.`);
  console.table(appIds.map((appId) => ({ appId })));
})();
