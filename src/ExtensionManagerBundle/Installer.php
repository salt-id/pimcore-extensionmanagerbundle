<?php
/**
 * Created by PhpStorm.
 * User: Yulius Ardian Febrianto <yuliusardin@gmail.com>
 * Date: 20/11/2019
 * Time: 15:12
 */

namespace SaltId\ExtensionManagerBundle;

use Doctrine\DBAL\Migrations\Version;
use Doctrine\DBAL\Schema\Schema;
use Pimcore\Extension\Bundle\Installer\MigrationInstaller;

class Installer extends MigrationInstaller
{
    /**
     * Executes install migration. Used during installation for initial creation of database tables and other data
     * structures (e.g. pimcore classes). The version object is the version object which can be used to add raw SQL
     * queries via `addSql`.
     *
     * If possible, use the Schema object to manipulate DB state (see Doctrine Migrations)
     *
     * @param Schema $schema
     * @param Version $version
     */
    public function migrateInstall(Schema $schema, Version $version)
    {
        // TODO: Implement migrateInstall() method.
    }

    /**
     * Opposite of migrateInstall called on uninstallation of a bundle.
     *
     * @param Schema $schema
     * @param Version $version
     */
    public function migrateUninstall(Schema $schema, Version $version)
    {
        // TODO: Implement migrateUninstall() method.
    }
}
