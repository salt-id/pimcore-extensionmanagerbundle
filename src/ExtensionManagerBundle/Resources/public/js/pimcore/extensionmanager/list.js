pimcore.registerNS("saltid.extensionmanager.list");
saltid.extensionmanager.list = Class.create({

    initialize: function () {

        this.getTabPanel();
    },

    activate: function () {
        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.setActiveItem("saltid_extensionmanager_list");
    },

    getTabPanel: function () {

        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "saltid_extensionmanager_list",
                title: t("manage_extensions"),
                iconCls: "pimcore_icon_plugin",
                border: false,
                layout: "fit",
                closable:true,
                items: [this.getGrid()]
            });

            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("saltid_extensionmanager_list");


            this.panel.on("destroy", function () {
                pimcore.globalmanager.remove("extensionmanager_list");
            }.bind(this));

            pimcore.layout.refresh();
        }

        return this.panel;
    },

    getExtensionId: function (record) {
        var extensionId = record.get('extensionId');
        if (extensionId) {
            return extensionId;
        }

        return record.get('id');
    },

    getGrid: function () {
        var self = this;

        var modelName = 'saltid.model.extensions.list';
        if (!Ext.ClassManager.get(modelName)) {
            Ext.define(modelName, {
                extend: 'Ext.data.Model',
                fields: [
                    "id", "extensionId", "type", "name", "description",
                ],
                proxy: {
                    type: 'ajax',
                    url: '/saltid/extensionmanager/list',
                    reader: {
                        type: 'json',
                        rootProperty: 'extensions'
                    },
                    writer: {
                        type: 'json',
                        rootProperty: 'extensions',
                        allowSingle: false
                    },
                    actionMethods: {
                        read: 'GET',
                        update: 'PUT'
                    }
                }
            });
        }

        this.store = new Ext.data.Store({
            model: 'saltid.model.extensions.list',
            autoSync: true,
            listeners: {
                beforesync: function () {
                    self.panel.setLoading(true);
                },

                update: function () {
                    self.panel.setLoading(false);
                }
            }
        });

        this.store.load();

        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'pimcore_main_toolbar',
            items: [
                {
                    text: t("refresh"),
                    iconCls: "pimcore_icon_reload",
                    handler: this.reload.bind(this)
                }
            ]
        });

        var handleSuccess = function (transport) {
            var res = Ext.decode(transport.responseText);

            var message = '';
            var showAsToast = true;

            if (res.reload) {
                message += t("please_dont_forget_to_reload_pimcore_after_modifications") + "!";

                // show reload message
                Ext.get('ext-manager-reload-info').show();
                toolbar.updateLayout();
            }

            if (res.message) {
                showAsToast = false;

                if (message) {
                    message = '<p style="text-align: center">' + message + '</p>';
                    message += '<br /><hr />';
                }

                message += '<pre style="font-size:11px;word-wrap: break-word;margin-bottom: 0">';

                if (Ext.isArray(res.message)) {
                    Ext.Array.each(res.message, function(line) {
                        if (message.length > 0) {
                            message += "\n"
                        }

                        message += strip_tags(line);
                    });
                } else {
                    if (message.length > 0) {
                        message += "\n"
                    }

                    message += strip_tags(res.message);
                }

                message += '</pre>';
            }

            self.panel.setLoading(false);
            this.reload();

            if (!empty(message)) {
                if (showAsToast) {
                    pimcore.helpers.showNotification(t("success"), message, "success");
                } else {
                    self.showMessageWindow(t("success"), message, "success");
                }
            }
        }.bind(this);

        var handleFailure = function() {
            this.panel.setLoading(false);
        }.bind(this);

        var typesColumns = [
            {
                text: t("type"),
                width: 50,
                sortable: false,
                dataIndex: 'type',
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    return '<div class="pimcore_icon_' + value + '" style="min-height: 16px;" title="' + t("value") +'"></div>';
                }
            },
            {
                text: "ID", width: 100, sortable: true, dataIndex: 'id', flex: 1,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    return self.getExtensionId(record);
                }
            },
            {
                text: t("name"),
                width: 50,
                sortable: true,
                dataIndex: 'name',
                flex: 2
            },
            {
                text: t("description"),
                width: 200,
                sortable: true,
                dataIndex: 'description',
                flex: 4
            },
            {
                text: t("repository"),
                width: 200,
                sortable: false,
                dataIndex: 'repository',
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    isDisabled = value == null ? 'disabled' : '';
                    icon = isDisabled ?
                        '/bundles/pimcoreadmin/img/flat-color-icons/broken_link.svg' :
                        '/bundles/pimcoreadmin/img/flat-color-icons/link.svg';

                    isHref = value == null ? '' : 'href="'+value+'"';

                    return '<a target="_blank" '+isHref+' '+ isDisabled +'>' +
                        '<img src="'+icon+'">' +
                        '</a>';
                }
            }
        ];

        this.grid = Ext.create('Ext.grid.Panel', {
            frame: false,
            autoScroll: true,
            store: this.store,
            columns : {
                items: typesColumns,
                defaults: {
                    flex: 0
                }
            },
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1,
                    listeners: {
                        beforeedit: function (editor, context, eOpts) {
                            // only allow editing for bundles
                            if (context.record.data.type !== 'bundle') {
                                return false;
                            }

                            // abort if state changes are not allowed
                            if (!context.record.data.canChangeState) {
                                return false;
                            }
                        }
                    }
                })
            ],
            trackMouseOver: true,
            columnLines: true,
            stripeRows: true,
            tbar: toolbar,
            viewConfig: {
                forceFit: true
            }
        });

        return this.grid;
    },

    showMessageWindow: function (title, message, type) {
        var win = new Ext.Window({
            modal: true,
            iconCls: 'pimcore_icon_' + type,
            title: title,
            width: 700,
            maxHeight: 500,
            html: message,
            autoScroll: true,
            bodyStyle: "padding: 10px;",
            buttonAlign: "center",
            shadow: false,
            closable: false,
            buttons: [{
                text: t("OK"),
                handler: function () {
                    win.close();
                }
            }]
        });

        win.show();
    },

    reload: function () {
        this.store.reload();
    }
});
