


/**
 * Отображает форму xm727c03 "Журнал учёта результатов входного контроля"
 * @param {number} page страница
 * @param {number} mm01 идентификатор партии
 * @param {string} dateStart начало преиода поиска (по дате приходного ордера)
 * @param {string} dateEnd конец периода поиска
 * @param {boolean} acceptMol проверено складом
 * @param {boolean} acceptOVK проверено овк
 * @param {boolean} acceptBuh проверено бухгалтерией
 */
function xm727c03({
    page = null,
    mm01 = null,
    dateStart = null,
    dateEnd = null,
    acceptMol = true,
    acceptOVK = true,
    acceptBuh = false
}) {
    console.log(localStorage.getItem('role'));

    Ext.WindowMgr.hideAll(); // Закрываем все открытые окна

    var storeJournal = new Ext.data.Store({
        pageSize: 100,
        xtype: 'store',
        fields: [
            'X756',
            'P451',
            { name: 'X363', type: 'date', dateFormat: 'd.m.Y' },
            'CC68',
            'H010',
            'X373',
            'MM02',
            'X826',
            'X827',
            'X828',
            'C440',
            'MM01',
            'C8940',
            'MM561',
            // { name: 'MM031', type: 'number' },
            // { name: 'MM032', type: 'number' },
            'MM031',
            'MM032',
            'MM32',
            'MM33',
            'CN931',
            'MM42',
            'MM43',
            'MM45',
            'MM56',
            'MM19',
            'MM071',
            'Z1350',
            'Z1340',
            'MM135',
            'MM162',
            'ID_XM727N01',
            'X36405',
            'P70403',
            'SUPPLIER',
            'MM15',
            'MM16',
            'STATUS_CHECK',
            'ASSISTENT'
        ],
        proxy: {
            type: 'ajax',
            url: 'phps/load_store_xm727c03.php',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
    });

    var p006Field = Ext.create('Ext.form.TextField', {
        width: 150,
        labelWidth: 'auto'
    });

    var p008Field = Ext.create('Ext.form.TextField', {
        width: 150,
        labelWidth: 'auto'
    });

    var p457Field = Ext.create('Ext.form.TextField', {
        width: 150,
        labelWidth: 'auto'
    });

    var buttonClearKmFilters = Ext.create('Ext.button.Button', {
        text: 'Очистить фильтры',
        handler: function () {
            p006Field.setValue();
            p008Field.setValue();
            p457Field.setValue();
            reloadStore(page);
        }
    });

    var buttonBack = Ext.create('Ext.button.Button', {
        text: 'Назад',
        iconCls: "x-btn-icon-el x-tbar-page-prev",
        handler: function () {
            windowJournal.close();
            Ext.History.add('MAIN');
        }
    });

    var checkOVK = Ext.create('Ext.form.field.Checkbox', {});
    checkOVK.setValue(acceptOVK);
    var labelCheckOvk = Ext.create('Ext.form.Label', {
        html: '<img src="images/savedOVK.png"/> Проверено ОВК',
        listeners: {
            click: {
                element: 'el',
                fn: function () {
                    checkOVK.setValue(!checkOVK.getValue());
                }
            }
        }
    });

    var checkBUH = Ext.create('Ext.form.field.Checkbox', {});
    checkBUH.setValue(acceptBuh);
    var labelCheckBUH = Ext.create('Ext.form.Label', {
        html: '<img src="images/savedBUH.gif"/> Проверено Бухгалтерией',
        listeners: {
            click: {
                element: 'el',
                fn: function () {
                    checkBUH.setValue(!checkBUH.getValue());
                }
            }
        }
    });

    var checkMOL = Ext.create('Ext.form.field.Checkbox', {});
    checkMOL.setValue(acceptMol);
    var labelCheckMOL = Ext.create('Ext.form.Label', {
        html: 'Проверено складом',
        listeners: {
            click: {
                element: 'el',
                fn: function () {
                    checkMOL.setValue(!checkMOL.getValue());
                }
            }
        }
    });

    var startDate = Ext.create('Ext.form.field.Date', {
        format: 'd.m.Y',
        id: 'startDate',
        width: 100,
        listeners: {
            'change': function (_, newV) {
                if (newV == null) {
                    buttonClear.setVisible(false);
                } else {
                    buttonClear.setVisible(true);
                }
            },
            'afterrender': function (thisComp) {

                if (dateStart != null) {
                    thisComp.setValue(dateStart);
                }

                // Ext.tip.QuickTipManager.register({
                //     target: thisComp.getId(),
                //     title: 'Поиск по дате приходного ордера',
                //     text: '(начало периода)'
                // });
            }
        }
    });

    var endDate = Ext.create('Ext.form.field.Date', {
        format: 'd.m.Y',
        width: 100,
        listeners: {
            'change': function (_, newV) {
                if (newV == null) {
                    buttonClear.setVisible(false);
                } else {
                    buttonClear.setVisible(true);
                }
            },
            'afterrender': function (thisComp) {
                if (dateEnd != null) {
                    thisComp.setValue(dateEnd);
                }

                // Ext.tip.QuickTipManager.register({
                //     target: thisComp.getId(),
                //     title: 'Поиск по дате приходного ордера',
                //     text: '(конец периода)'
                // });
            }
        }
    })


    reloadByEvent([startDate, endDate, p006Field, p008Field, p457Field], 'specialkey');

    reloadByEvent([checkBUH, checkOVK, checkMOL], 'change');

    var buttonLoadScan = Ext.create('Ext.Button', {
        xtype: 'button',
        text: 'Загрузить скан сертификата',
        iconCls: "report_add",
        handler: function () {

            if (!canThisRoleDoIt(localStorage.getItem('role'))) {
                msgNotAllowed('Загрузить скан', localStorage.getItem('role'));
                return;
            }

            if (gridJournal.selModel.selected.length > 0) {
                var selected_mm01 = gridJournal.selModel.selected.items[0].data.MM01;
                windowLoadScan({ mm01: selected_mm01, reload: reloadStore });
            } else {
                msg('Для загрузки сертификата выберите строку!');
            }
        }
    });

    var buttonPassport = Ext.create('Ext.Button', {
        text: 'Сопроводительный паспорт в ЦЗЛ',
        iconCls: "passport",
        handler: function () {
            if (gridJournal.selModel.selected.length > 0) {
                var selected_mm01 = gridJournal.selModel.selected.items[0].data.MM01;
                window.open('phps/print_passport.php?mm01=' + selected_mm01);
            } else {
                msg('Вы не выбрали строку!');
            }
        }
    });

    var buttonPrintJournal = Ext.create('Ext.Button', {
        text: 'Печать журнала C04',
        handler: function () {
            window.open('phps/print_xm727c04.php');
        }
    });

    var buttonPrintJournalC05 = Ext.create('Ext.Button', {
        text: 'Печать журнала C05',
        handler: function () {
            window.open('phps/print_xm727c05.php');
        }
    });

    var buttonClear = Ext.create('Ext.Button', {
        text: '&#10006',
        baseCls: 'btn-clear',
        hidden: true,
        handler: function () {
            startDate.setValue();
            endDate.setValue();
            buttonClear.setVisible(false);
        }
    });

    var gridJournal = Ext.create('Ext.grid.Panel', {
        selModel: { mode: 'SINGLE' },
        region: 'center',
        margin: '5, 0, 0, 0',
        store: storeJournal,
        columnLines: true,
        multiSelect: true,
        forceFit: true,
        resizable: true,
        // title: 'Информация о партии',
        columns: {
            items: [{
                xtype: 'rownumberer',
                width: 40,
                minWidth: 40
            }, {
                text: 'MM01',
                width: 65,
                minWidth: 65,
                dataIndex: 'MM01',
                hidden: true,
                editor: {
                    xtype: 'textfield',
                    readOnly: true
                }
            }, {
                text: 'MM56',
                width: 65,
                minWidth: 65,
                dataIndex: 'MM56',
                hidden: true,
                editor: {
                    xtype: 'textfield',
                    readOnly: true
                }
            }, {
                text: 'MM561',
                width: 65,
                minWidth: 65,
                dataIndex: 'MM561',
                hidden: true,
                editor: {
                    xtype: 'textfield',
                    readOnly: true
                }
            }, {
                text: 'ID_XM727N01',
                width: 65,
                minWidth: 65,
                dataIndex: 'ID_XM727N01',
                hidden: true,
                editor: {
                    xtype: 'textfield',
                    readOnly: true
                }
            }, {
                text: 'AC18',
                width: 65,
                minWidth: 65,
                dataIndex: 'AC18',
                hidden: true,
                editor: {
                    xtype: 'textfield',
                    readOnly: true
                }
            }, {
                text: 'Статус',
                width: 65,
                minWidth: 65,
                dataIndex: 'STATUS_CHECK',
                renderer: statusCheckRenderer
            }, {
                text: 'Наименование, обозначение,<br> номинал, допуск, класс',
                width: 300,
                minWidth: 300,
                dataIndex: 'P451',
                renderer: lineBreak
            }, {
                text: 'Номер<br>Приходного ордера',
                width: 170,
                minWidth: 170,
                dataIndex: 'MM15'
            }, {
                text: 'Дата<br>Приходного ордера',
                width: 170,
                minWidth: 170,
                dataIndex: 'MM16'
            }, {
                text: 'Поставщик',
                width: 150,
                minWidth: 150,
                dataIndex: 'SUPPLIER',
                renderer: lineBreak
            }, {
                text: 'Количество по<br>приходному док-ту',
                width: 150,
                minWidth: 150,
                dataIndex: 'C8940'
            }, {
                text: 'Лаборант',
                width: 150,
                minWidth: 150,
                dataIndex: 'ASSISTENT'
            }, {
                text: 'Сертификат',
                columns: [{
                    text: 'Номер',
                    align: 'center',
                    dataIndex: 'X756',
                    width: 85,
                    minWidth: 85
                }, {
                    xtype: 'datecolumn',
                    text: 'Дата',
                    format: 'd.m.Y',
                    dataIndex: 'X363',
                    align: 'center',
                    width: 95,
                    minWidth: 95
                }]
            }, {
                text: 'Заводской номер',
                dataIndex: 'MM02',
                width: 145,
                minWidth: 145
            }, {
                text: 'Номер партии',
                dataIndex: 'MM01',
                width: 115,
                minWidth: 115,
            }, {
                text: 'Количество',
                columns: [{
                    text: 'годные',
                    dataIndex: 'MM032',
                    align: 'center',
                    width: 75,
                    minWidth: 65
                }, {
                    text: 'брак',
                    dataIndex: 'MM031',
                    align: 'center',
                    width: 65,
                    minWidth: 65
                }]
            }, {
                text: 'Состояние<br>поставки',
                dataIndex: 'C440',
                width: 100,
                minWidth: 100
            }, {
                text: 'Проверка',
                columns: [{
                    text: 'соп. док.',
                    dataIndex: 'X828',
                    align: 'center',
                    width: 125,
                    minWidth: 125,
                    renderer: isCrorrectRenderer
                }, {
                    text: 'внешнего вида',
                    dataIndex: 'X826',
                    align: 'center',
                    width: 125,
                    minWidth: 125,
                    renderer: isCrorrectRenderer
                }, {
                    text: 'однородности',
                    dataIndex: 'X827',
                    align: 'center',
                    width: 125,
                    minWidth: 125,
                    renderer: isCrorrectRenderer
                }]
            }, {
                text: 'Место хранения',
                columns: [{
                    text: 'Стеллаж',
                    dataIndex: 'MM08',
                    align: 'center',
                    width: 85,
                    minWidth: 85
                }, {
                    text: 'Ячейка',
                    dataIndex: 'MM081',
                    align: 'center',
                    width: 75,
                    minWidth: 75
                }]
            }, {
                text: 'Номер дела',
                dataIndex: 'CC68',
                width: 105,
                minWidth: 105
            }, /*{
                text: 'Заключение ЦЗЛ',
                dataIndex: '',
                columns: [{
                    text: 'Номер',
                    dataIndex: 'H010',
                    align: 'center',
                    width: 75,
                    minWidth: 75
                }, {
                    text: 'Дата',
                    xtype: 'datecolumn',
                    dataIndex: 'X373',
                    align: 'center',
                    width: 95,
                    minWidth: 95,
                    format: 'd.m.Y'
                }]
            },*/ {
                text: 'Акт, рекламация',
                columns: [{
                    text: 'Номер',
                    dataIndex: 'MM135',
                    align: 'center',
                    width: 75,
                    minWidth: 75
                }, {
                    text: 'Дата',
                    xtype: 'datecolumn',
                    dataIndex: 'MM162',
                    align: 'center',
                    width: 95,
                    minWidth: 95,
                    format: 'd.m.Y'
                }]
            }, {
                text: 'Протокол испытаний',
                columns: [{
                    text: 'Номер',
                    dataIndex: 'Z1350',
                    align: 'center',
                    width: 85,
                    minWidth: 85
                }, {
                    text: 'Дата',
                    dataIndex: 'Z1340',
                    xtype: 'datecolumn',
                    align: 'center',
                    width: 85,
                    minWidth: 85,
                    format: 'd.m.Y'
                }]
            }, {
                text: 'Параметры',
                columns: [{
                    text: 'Проверяемые',
                    dataIndex: 'MM32',
                    align: 'center',
                    width: 115,
                    minWidth: 115
                }, {
                    text: 'Бракуемые',
                    dataIndex: 'MM33',
                    align: 'center',
                    width: 105,
                    minWidth: 105
                }]
            }, {
                text: 'Примечание',
                width: 115,
                minWidth: 115,
                dataIndex: 'MM19'
            }, {
                text: 'Дата сдачи в<br>ЦЗЛ',
                width: 115,
                minWidth: 115,
                xtype: 'datecolumn',
                dataIndex: 'MM481',
                format: 'd.m.Y'
            }, {
                text: 'Скан<br>сертификата',
                width: 115,
                minWidth: 115,
                dataIndex: 'CN931',
                renderer: pdfRenderer
            }],
            defaults: {
                align: 'center'
            }
        },
        dockedItems: [{
            xtype: 'toolbar',
            items: [checkMOL, labelCheckMOL, '-', checkOVK, labelCheckOvk, '-', checkBUH, labelCheckBUH, '-', 'Наименование:', p008Field, '-', 'Обозначение:',
                p006Field, '-', 'Номинал:', p457Field, buttonClearKmFilters],
            dock: 'top'
        }, {
            xtype: 'pagingtoolbar',
            id: 'pgBar',
            store: storeJournal,
            // displayInfo: true,
            // displayMsg: 'показаны с {0} по {1} (всего {2})',
            // plugins: [new Ext.ux.ProgressBarPager()],
            items: ['-', startDate, endDate, buttonClear, '-', buttonLoadScan, '-', buttonPassport, '-', buttonPrintJournal, '-', buttonPrintJournalC05, '-', buttonBack],
            dock: 'bottom'
        }],
        features: [{
            ftype: 'filters',
            filterCls: 'filter-text',
            filters: [{
                type: 'string',
                dataIndex: 'MM15'
            }, {
                type: 'string',
                dataIndex: 'MM01'
            }, {
                type: 'string',
                dataIndex: 'MM56'
            }, {
                type: 'string',
                dataIndex: 'MM561'
            }, {
                type: 'string',
                dataIndex: 'P451'
            }]
        }],
        plugins: [{
            ptype: 'cellediting',
            clicksToEdit: 1,
            edit: function (editor, e) {
                if (e.value == e.originalValue) {
                    return;
                }
            }
        }],
        listeners: {
            'itemdblclick': function (_, record) {
                windowJournal.close();

                var params = {
                    mm561: record.data.MM561,
                    mm01: record.data.MM01,
                    from: {
                        fn: xm727c03,
                        params: {
                            page: storeJournal.currentPage,
                            dateStart: Ext.Date.format(startDate.getValue(), 'd.m.Y'),
                            dateEnd: Ext.Date.format(endDate.getValue(), 'd.m.Y'),
                            acceptMol: checkMOL.getValue(),
                            acceptOVK: checkOVK.getValue(),
                            acceptBuh: checkBUH.getValue(),
                            mm01: record.data.MM01,
                        }
                    }
                };
                localStorage.setItem('params', JSON.stringify(params));
                Ext.History.add('C02');
                // xm727c02({
                //     mm561: record.data.MM561,
                //     mm01: record.data.MM01,
                //     from: {
                //         fn: xm727c03,
                //         params: {
                //             page: storeJournal.currentPage,
                //             dateStart: startDate.getValue(),
                //             dateEnd: endDate.getValue(),
                //             acceptMol: checkMOL.getValue(),
                //             acceptOVK: checkOVK.getValue(),
                //             acceptBuh: checkBUH.getValue(),
                //             mm01: record.data.MM01,
                //         }
                //     }
                // });
            }
        }
    });

    //меняем стандартный хэндлер перезагрузки на свою функцию
    Ext.getCmp('pgBar').items.items[10].handler = () => { reloadStore() };

    var windowJournal = Ext.create('Ext.window.Window', {
        title: getShifr('ЖУРНАЛ УЧЁТА РЕЗУЛЬТАТОВ ВХОДНОГО КОНТРОЛЯ', 'XM727C03', 1, (document.body.clientWidth * 0.8) - 35),
        maximizable: true,
        height: document.body.clientHeight * 0.8,
        width: document.body.clientWidth * 0.95,
        layout: 'fit',
        items: [gridJournal]
    }).show();

    windowJournal.on('hide', function () {
        windowJournal.close();
    });

    // windowJournal.on('beforeclose', function(){
    //     Ext.History.add('MAIN');
    // });

    gridJournal.on('cellclick', function (_, _, cellIndex, record) {
        var columnDataIndex = gridJournal.columns[cellIndex].dataIndex;
        if (columnDataIndex == 'CN931') {
            var mm01 = record.data.MM01;
            if (mm01 != '' && record.data.CN931 != 0) {
                window.open("phps/open_scan.php?mm01=" + mm01);
            }
        }
    });

    reloadStore(page);

    function statusCheckRenderer(value) {
        if (value == 1) {
            return '<img src="images/savedBUH.gif"/>';
        }
        if (value == 2) {
            return '<img src="images/savedOVK.png"/>';
        }
        if (value == 3) {
            return '<img src="images/savedSNAB.png"/>';
        }
        return '';
    }

    /**
     * Перезагрузка хранилища с учетом фильтров
     * @param {number} page
     */
    function reloadStore(page = null) {

        var whoChecked = [];

        if (checkBUH.checked == true) {
            whoChecked.push(1);
        }
        if (checkOVK.checked == true) {
            whoChecked.push(2);
        }
        if (checkMOL.checked == true) {
            whoChecked.push(0);
        }

        var filter = {
            p006: p006Field.getValue(),
            p457: p457Field.getValue(),
            p008: p008Field.getValue(),
        };

        storeJournal.getProxy().extraParams = {
            dateStart: Ext.Date.format(startDate.getValue(), 'd.m.Y'),
            dateEnd: Ext.Date.format(endDate.getValue(), 'd.m.Y'),
            whoChecked: JSON.stringify(whoChecked),
            kmFilter: JSON.stringify(filter)
        };
        if (page == null) {
            storeJournal.load({
                callback: callbackStore
            });
        } else {
            storeJournal.loadPage(page, {
                callback: callbackStore
            });
        }
    }

    function callbackStore() {
        console.log(mm01);
        if (mm01 != null) {
            for (var i = 0; i < storeJournal.data.items.length; i++) {
                var rec = storeJournal.data.items[i].data;
                if (rec.MM01 == mm01) {
                    console.log('index=', i);
                    scrollToIndex(gridJournal, i);
                }
            }
        }
    }

    /**
     * Перезагрузка store по нажатию
     * @param {Array} elements массив элментов для которых надо обработать событие
     * @param {string} event событие которое надо обработать 
     */
    function reloadByEvent(elements, event) {
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            el.on(event, function (obj, e) {
                storeJournal.getProxy().extraParams = {
                    start: 0,
                    limit: 100,
                }

                var page = 1; // Когда перезагружаем по событию, то ищем опять с 1 листа

                if (event == 'specialkey') {
                    if (e.getKey() == e.ENTER) { reloadStore(page); }
                    return;
                }
                reloadStore(page);
            });
        }
    }
}