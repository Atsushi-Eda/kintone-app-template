module.exports = async (client, appIds) => {
  await client.app.deployApp({ apps: appIds.map((appId) => ({ app: appId })) });
  return new Promise((resolve) => {
    const timer = setInterval(async () => {
      const response = await client.app.getDeployStatus({ apps: appIds });
      if (response.apps.every((app) => app.status === 'SUCCESS')) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
};
