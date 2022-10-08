export type Migration<TPrev = IHasVersion, TNext = IHasVersion> = (prev: TPrev) => TNext;
export interface MigrationRegistration<TPrev = IHasVersion, TNext = IHasVersion> {
  version: number;
  up: Migration<TPrev, TNext>;
}

export interface IHasVersion {
    version?: number;
}

export interface IAddMigrationPayload<TModel = IHasVersion, TNext = IHasVersion> {
    version: number;
    migration: Migration<TModel, TNext>;
}

export class MigratorFluent<TModel = IHasVersion, TDst = IHasVersion> {
    readonly migrator: IMigrationRegistrationsOwner<TDst>;
    
    constructor(owner: IMigrationRegistrationsOwner<TDst>) {
        this.migrator = owner;
    }

    add = <TNext = IHasVersion>(version: number, migration: Migration<TModel, TNext>) => {
        this.migrator.addMigration<TModel, TNext>({ version, migration });
        
        const fluent = new MigratorFluent<TNext, TDst>(this.migrator);
        return fluent;
    }
}

interface IMigrationRegistrationsOwner<TDst = IHasVersion> {
    addMigration: <TModel, TNext>(payload: IAddMigrationPayload<TModel, TNext>) => void;
    migrations: MigrationRegistration[];
    upgrade: (currentModel: IHasVersion) => TDst;
}

export class Migrator<TSrc = IHasVersion, TDst = IHasVersion> implements IMigrationRegistrationsOwner<TDst> {
    migrations: MigrationRegistration[];
    
    constructor(){
        this.migrations = [];
    }

    addMigration = <TSrc, TNext>(payload: IAddMigrationPayload<TSrc, TNext>) => {
        const registration: MigrationRegistration<TSrc, TNext> = {
            version: payload.version, up: payload.migration
        };
        if (this.migrations.find(m => m.version === payload.version))
            throw `Migration with version ${payload.version} already registered`;

        this.migrations.push((registration as unknown) as MigrationRegistration);
    }

    add = <TNext = IHasVersion>(version: number, migration: Migration<TSrc, TNext>) => {
        this.addMigration<TSrc, TNext>({ version, migration });

        return new MigratorFluent<TNext, TDst>(this);
    }
    
    upgrade = (currentModel: IHasVersion): TDst => {
        console.log('upgrade', { currentVersion: currentModel.version, currentModel });
        const unappliedMigrations = this.migrations
            .filter(m => m.version > currentModel.version)
            .sort(m => m.version);
        
        let current = {...currentModel};
        unappliedMigrations.forEach(migration => {
            console.log(`upgrade to version ${migration.version}`);
            current = migration.up(current);
            current.version = migration.version;
        });
        return current as TDst;
    }
}