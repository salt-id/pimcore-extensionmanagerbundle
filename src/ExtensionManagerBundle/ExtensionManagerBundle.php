<?php

namespace SaltId\ExtensionManagerBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;
use Pimcore\Extension\Bundle\Traits\PackageVersionTrait;

class ExtensionManagerBundle extends AbstractPimcoreBundle
{
    use PackageVersionTrait;

    public function getNiceName()
    {
        return 'Extension Manager';
    }

    public function getDescription()
    {
        return 'PT. Ako Media Asia (SALT) Extension Manager, For manage others bundle from SALT';
    }

    public function getJsPaths()
    {
        return [
            '/bundles/extensionmanager/js/pimcore/startup.js'
        ];
    }

    /**
     * Returns the composer package name used to resolve the version
     *
     * @return string
     */
    protected function getComposerPackageName(): string
    {
        return 'saltid/pimcore-extensionmanagerbundle';
    }

    public function getInstaller()
    {
        $this->container->get(Installer::class);
    }
}
