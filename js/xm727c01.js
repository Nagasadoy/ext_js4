/**
 * Отображает форму xm727c01 "Заявка на заведение сертификата качества на металл"
 */
function xm727c01({page=null}) {
    console.log(localStorage.getItem('role'));

    var textFieldNameKM = Ext.create('Ext.form.field.Text', {
        fieldLabel: 'Наименование материала',
        labelWidth: 'auto',
        listeners: {
            'change': {
                fn: function (_, newValue) {
                    storeClaim.getProxy().extraParams = {
                        search: newValue
                    };
                    if (newValue.length >= 3) {
                        storeClaim.reload();
                    }
                },
                buffer: 800 // delay
            }
        }
    });

    textFieldNameKM.on('specialkey', function (_, e) {
        if (e.getKey() == e.ENTER) {
            storeClaim.reload();
        }
    });

    var buttonClear = Ext.create('Ext.Button', {
        text: '&#10006',
        baseCls: 'btn-clear',
        handler: function () {
            textFieldNameKM.setValue();
            storeClaim.getProxy().extraParams = {
                search: null
            };
            storeClaim.reload();
        }
    });

    var buttonBack = Ext.create('Ext.button.Button', {
        text: 'Назад',
        iconCls: "x-btn-icon-el x-tbar-page-prev",
        handler: function () {
            windowClaim.close();
            Ext.History.add('MAIN');
        }
    });

    var storeClaim = new Ext.data.Store({
        pageSize: 25,
        fields: [
            'MM01',
            'P7470',
            'MM15',
            'MM16',
            'KM',
            'KE',
            'NAME_KE',
            'P451',
            'MM03',
            'MOL',
            'MM02',
            'MM561'
        ],
        proxy: {
            type: 'ajax',
            url: 'phps/load_store_xm727c01.php',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
    });

    if(page==null){
        storeClaim.load();
    } else {
        storeClaim.loadPage(page);
    }

    var gridClaim = Ext.create('Ext.grid.Panel', {
        selModel: { mode: 'SINGLE' },
        store: storeClaim,
        columnLines: true,
        forceFit: true,
        resizable: true,
        columns: {
            items: [{
                xtype: 'rownumberer',
                width: 40,
                minWidth: 40
            }, {
                text: 'MM561',
                dataIndex: 'MM561',
                hidden: true,
                width: 25,
                minWidth: 25
            }, {
                text: 'MM01',
                dataIndex: 'MM01',
                hidden: true,
                width: 25,
                minWidth: 25
            }, {
                text: 'Номенклатурный<br>номер',
                dataIndex: 'KM',
                hidden: true,
                width: 25,
                minWidth: 25
            }, {
                text: 'Склад',
                dataIndex: 'MOL',
                width: 15,
                minWidth: 15
            }, {
                text: 'Признак брака',
                dataIndex: '',
                width: 20,
                minWidth: 20
            }, {
                text: '<center>Наименование</center>',
                dataIndex: 'P451',
                renderer: lineBreak,
                align: 'left',
                width: 100,
                minWidth: 100
            }, {
                text: 'Количество',
                dataIndex: 'MM03',
                width: 15,
                minWidth: 15
            }, {
                text: 'Код ЕИ',
                dataIndex: 'KE',
                width: 25,
                minWidth: 25,
                hidden: true
            }, {
                text: 'ЕИ',
                dataIndex: 'NAME_KE',
                width: 15,
                minWidth: 15
            }, {
                text: 'Приходный ордер',
                dataIndex: 'MM15',
                width: 20,
                minWidth: 20
            }, {
                text: 'Дата приходного ордера',
                dataIndex: 'MM16',
                width: 30,
                minWidth: 30
            }],
            defaults: {
                align: 'center'
            }
        },
        dockedItems: {
            xtype: 'pagingtoolbar',
            store: storeClaim,
            displayInfo: true,
            displayMsg: 'показаны с {0} по {1} (всего {2})',
            plugins: [new Ext.ux.ProgressBarPager()],
            items: ['-', textFieldNameKM, buttonClear, '-', buttonBack],
            dock: 'bottom'
        },
        listeners: {
            'itemdblclick': function (_, record) {
                windowClaim.close();
                var params = {
                    mm01: record.data.MM01,
                    mm561: record.data.MM561,
                    from: {
                        fn: xm727c01,
                        params: {
                            page: storeClaim.currentPage
                        }
                    }
                };
                localStorage.setItem('params', JSON.stringify(params));
                Ext.History.add('C02');

                // xm727c02({
                //     mm01: record.data.MM01,
                //     mm561: record.data.MM561,
                //     from: {
                //         fn: xm727c01,
                //         params: {
                //             page: storeClaim.currentPage
                //         }
                //     }
                // });
            }
        }
    });


    var windowClaim = Ext.create('Ext.window.Window', {
        title: getShifr('ЗАЯВКА НА ЗАВЕДЕНИЕ СЕРТИФИКАТА КАЧЕСТВА НА МЕТАЛЛ', 'XM727C01', 1, (document.body.clientWidth * 0.8) - 35),
        maximizable: true,
        height: document.body.clientHeight * 0.8,
        width: document.body.clientWidth * 0.95,
        layout: 'fit',
        items: [gridClaim]
    }).show();

    // windowClaim.on('beforeclose', function(){
    //     Ext.History.add('MAIN');
    // });
}
