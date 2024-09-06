import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import { DependencyContainer } from 'tsyringe';

class NoTimegates {
  public postDBLoad(container: DependencyContainer): void {
    const logger = container.resolve<ILogger>('WinstonLogger');
    const databaseServer = container.resolve<DatabaseServer>('DatabaseServer');
    const tables = databaseServer.getTables();

    let error = false;
    for (let quest in tables.templates.quests) {
      try {
        tables.templates.quests[quest].conditions.AvailableForStart.forEach(
          (condition) => {
            try {
              condition._props['availableAfter'] = 0;
              condition._props['dispersion'] = 0;
            } catch (e) {
              logger.error(
                `[lave-notimegates] An error occured while removing quest timegates: ${e}`
              );
              error = true;
            }
          }
        );
      } catch (e) {
        logger.error(
          `[lave-notimegates] An error occured while removing quest timegates: ${e}`
        );
        error = true;
      }
    }
    if (!error) {
      logger.info(`[lave-notimegates] Removed all quest timegates`);
    }
  }
}

module.exports = { mod: new NoTimegates() };
