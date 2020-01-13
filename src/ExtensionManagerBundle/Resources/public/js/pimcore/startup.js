pimcore.registerNS("pimcore.plugin.ExtensionManagerBundle");

pimcore.plugin.ExtensionManagerBundle = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.ExtensionManagerBundle";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);

        this.navEl = Ext.get('pimcore_menu_search').insertSibling(
            '<li id="pimcore_menu_extensionManager" data-menu-tooltip="SALT Extension Manager" class="pimcore_menu_item pimcore_menu_needs_children">' +
            '<img src="/bundles/pimcoreadmin/img/flat-color-icons/github.svg">' +
            '</li>',
            'after'
        );

        this.menu = new Ext.menu.Menu({
            items: [{
                text: "Extension List",
                iconCls: "pimcore_nav_icon_bundles",
                handler: function () {
                    try {
                        pimcore.globalmanager.get("extensionmanager_list").activate();
                    }
                    catch (e) {
                        pimcore.globalmanager.add("extensionmanager_list", new saltid.extensionmanager.list());
                    }
                }
            }
            ],
            cls: "pimcore_navigation_flyout"
        });
        pimcore.layout.toolbar.prototype.extensionManagerMenu = this.menu;
    },

    pimcoreReady: function (params, broker) {
        var toolbar = pimcore.globalmanager.get("layout_toolbar");
        this.navEl.on("mousedown", toolbar.showSubMenu.bind(toolbar.extensionManagerMenu));
        pimcore.plugin.broker.fireEvent("extensionManagerMenuMenuReady", toolbar.extensionManagerMenu);
    }
});

var ExtensionManagerBundlePlugin = new pimcore.plugin.ExtensionManagerBundle();
