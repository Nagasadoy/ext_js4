/**
 * Отображает форму xm727c02 "Заведение информации с сертификата соответствия на металл"
 * @param {number} mmm561 идентификатор строки приходного ордера
 * @param {number} mm01 идентификатор партии
 * @param {number} page страница
 * @param {object} from откуда пришли (функция и параметры)
 */
function xm727c02({ mm561, mm01, from}) {
    console.log(localStorage.getItem('role'));

    Ext.WindowMgr.hideAll(); // Закрываем все открытые окна

    var mm56Label = new Ext.form.Label({ cls: 'grey_text', margins: 'right' });

    var currentUser = null;

    var storeFormatCorrect = {
        xtype: 'store',
        fields: ['value', 'text'],
        data: [
            { 'value': '0', 'text': 'Несоответствует' },
            { 'value': '1', 'text': 'Соответствует' },
        ]
    };

    var comboBoxIsCorrect = {
        xtype: 'combobox',
        store: storeFormatCorrect,
        valueField: 'value',
        displayField: 'text',
        listConfig: {
            minWidth: 150
        },
        queryMode: 'local',
        editable: false
    };

    var headForm = {
        xtype: 'panel',
        bodyPadding: 10,
        region: 'north',
        items: [{
            layout: 'hbox',
            border: false,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Наименование, обозначение, номинал, допуск, класс, N ТУ(ГОСТ)',
                id: 'km_name',
                labelWidth: 410,
                flex: 1
            }]
        }, {
            xtype: 'fieldset',
            style: 'padding:5px 5px 5px 5px',
            title: '&nbsp<b>Информация по приходному документу</b> &nbsp',
            items: [{
                layout: 'hbox',
                border: false,
                align: 'stretch',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Номер',
                    id: 'mm15',
                    readOnly: true,
                    labelWidth: 50,
                    margin: '0 10 0 0',
                    flex: 1
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Дата',
                    id: 'mm16',
                    format: 'd.m.Y',
                    labelWidth: 30,
                    margin: '0 10 0 0',
                    flex: 1
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Поставщик',
                    id: 'x451_name',
                    labelWidth: 70,
                    readOnly: true,
                    margin: '0 10 0 0',
                    flex: 3
                }, {
                    xtype: 'numberfield',
                    fieldLabel: 'Количество (по приходному док-ту)',
                    id: 'c8940',
                    labelWidth: 220,
                    readOnly: true,
                    margin: '0 10 0 0',
                    flex: 2
                }]
            }]
        }],
    };

    var storeCertificate = new Ext.data.Store({
        xtype: 'store',
        fields: [
            'X756',
            'AC18',
            'CC68',
            'H010',
            'MM561',
            'MM56',
            'MM02',
            'X826',
            'X827',
            'X828',
            'C440',
            'MM01',
            'CN931',
            'MM031',
            'MM032',
            'MM08',
            'MM081',
            'MM32',
            'MM33',
            'MM42',
            'MM43',
            'MM45',
            'MM19',
            'MM071',
            'MM06',
            'Z1350',
            'MM135',
            /*'MM44',*/
            'ID_XM727N01',
            'STATUS_CHECK',
            'ASSISTENT',
            'ID_X756',
            'X36405',
            'P70403',
            { name: 'Z1340', type: 'date', dateFormat: 'd.m.Y' },
            { name: 'MM162', type: 'date', dateFormat: 'd.m.Y' },
            { name: 'MM481', type: 'date', dateFormat: 'd.m.Y' },
            { name: 'X373', type: 'date', dateFormat: 'd.m.Y' },
            { name: 'X363', type: 'date', dateFormat: 'd.m.Y' }
        ],
        proxy: {
            type: 'ajax',
            url: 'phps/load_store_xm727c02.php',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
    });

    storeCertificate.getProxy().extraParams = {
        mm561: mm561,
        mm01: mm01
    };
    loadStoreCertificate();

    var buttonAdd = Ext.create('Ext.Button', {
        xtype: 'button',
        text: 'Добавить',
        iconCls: "add",
        handler: function () {

            if(!canThisRoleDoIt(localStorage.getItem('role'))){
                msgNotAllowed('Добавить строку', localStorage.getItem('role'));
                return;
            }

            var newRecord = {};
            Object.assign(newRecord, gridCertificate.store.data.items[0].data); // копирование первой строки
            // newRecord.MM44 = mm01; // родительская партия, с ней мы перешли
            newRecord.MM01 = ''; // номер партии пустой
            newRecord.ID_XM727N01 = '';
            newRecord.ASSISTENT = '';

            var mm032 = Ext.getCmp('c8940').getValue() - calculateSumRejectAndUseful();
            if (mm032 < 0) { mm032 = 0; }
            newRecord.MM032 = mm032;
            newRecord.CN931 = 0;

            gridCertificate.store.insert(gridCertificate.store.getCount(), newRecord);
            calculateCount();
        }
    });

    var buttonRemoveAccept = Ext.create('Ext.Button', {
        text: 'снять подтв.',
        iconCls: 'del',
        handler: function () {

            if(!canThisRoleDoIt(localStorage.getItem('role'))){
                msgNotAllowed('Снять подтверждение', localStorage.getItem('role'));
                return;
            }

            loadMaskRemoveAccept.show();
            Ext.Ajax.request({
                url: 'phps/remove_accept.php',
                method: 'post',
                params: {
                    mm561: storeCertificate.proxy.reader.jsonData.mm561
                },
                callback: function (opts, suss, resp) {
                    loadMaskRemoveAccept.hide();
                    var r = Ext.decode(resp.responseText);
                    if (r.success) {
                        toast('Успешно!', 'Подтверждение снято!');
                        loadStoreCertificate();
                    } else {
                        var message = r.msgForUsers;
                        msg(message);
                    }
                }
            });
        }
    });

    var buttonSave = Ext.create('Ext.Button', {
        text: 'Сохранить',
        iconCls: 'save',
        hidden: true,
        handler: function(){
            var rows = [];
            var countRecords = storeCertificate.data.length;

            for (var i = 0; i < countRecords; i++) {
                var currentRow = storeCertificate.data.items[i].data;

                currentRow.X363 = Ext.Date.format(currentRow.X363, 'd.m.Y');
                currentRow.X373 = Ext.Date.format(currentRow.X373, 'd.m.Y');
                currentRow.Z1340 = Ext.Date.format(currentRow.Z1340, 'd.m.Y');
                currentRow.MM162 = Ext.Date.format(currentRow.MM162, 'd.m.Y');
                currentRow.MM481 = Ext.Date.format(currentRow.MM481, 'd.m.Y');

                rows.push(currentRow);
            }
            loadMaskSave.show();

            Ext.Ajax.request({
                url: 'phps/save.php',
                method: 'post',
                params: {
                    rows: JSON.stringify(rows),
                    km: storeCertificate.proxy.reader.jsonData.km,
                    ke: storeCertificate.proxy.reader.jsonData.ke,
                    mm06: storeCertificate.proxy.reader.jsonData.mm06,
                    cn70: storeCertificate.proxy.reader.jsonData.cn70,
                    mm561: storeCertificate.proxy.reader.jsonData.mm561
                },
                callback: function (opts, suss, resp) {
                    loadMaskSave.hide();
                    var r = Ext.decode(resp.responseText);

                    if (r.success) {
                        var message = 'Информация сохранена!';
                        toast('Успешно!', message);
                        loadStoreCertificate();
                    } else {
                        var message = r.msgForUsers;
                        msg(message);
                    }
                }
            });
        }
    })

    var buttonAccept = Ext.create('Ext.Button', {
        text: 'Подтвердить',
        iconCls: 'savedOVK',
        handler: function () {

            if(!canThisRoleDoIt(localStorage.getItem('role'))){
                msgNotAllowed('Подтверждать строки', localStorage.getItem('role'));
                return;
            }

            var countRecords = storeCertificate.data.length;
            var rows = [];
            var delRows = [];

            for (var i = 0; i < countRecords; i++) {
                var currentRow = storeCertificate.data.items[i].data;

                currentRow.X363 = Ext.Date.format(currentRow.X363, 'd.m.Y');
                currentRow.X373 = Ext.Date.format(currentRow.X373, 'd.m.Y');
                currentRow.Z1340 = Ext.Date.format(currentRow.Z1340, 'd.m.Y');
                currentRow.MM162 = Ext.Date.format(currentRow.MM162, 'd.m.Y');
                currentRow.MM481 = Ext.Date.format(currentRow.MM481, 'd.m.Y');

                if (+currentRow.MM031 == 0 && +currentRow.MM032 == 0) {
                    delRows.push(currentRow);
                    continue;
                }

                if (currentRow.MM031 != 0 && currentRow.MM032 != 0) {
                    var usefulRow = {};
                    var rejectRow = {};

                    Object.assign(usefulRow, currentRow);
                    usefulRow.MM031 = 0;
                    rows.push(usefulRow);

                    Object.assign(rejectRow, currentRow);
                    // rejectRow.MM44 = rejectRow.MM01;
                    rejectRow.MM01 = '';
                    rejectRow.ID_XM727N01 = '';

                    rejectRow.MM032 = 0;
                    rows.push(rejectRow);

                } else {
                    rows.push(currentRow);
                }
            }

            loadMaskAccept.show();
            Ext.Ajax.request({
                url: 'phps/accept.php',
                method: 'post',
                params: {
                    rows: JSON.stringify(rows),
                    delRows: JSON.stringify(delRows),
                    km: storeCertificate.proxy.reader.jsonData.km,
                    ke: storeCertificate.proxy.reader.jsonData.ke,
                    mm06: storeCertificate.proxy.reader.jsonData.mm06,
                    cn70: storeCertificate.proxy.reader.jsonData.cn70,
                    mm561: storeCertificate.proxy.reader.jsonData.mm561
                },
                callback: function (opts, suss, resp) {
                    loadMaskAccept.hide();
                    var r = Ext.decode(resp.responseText);
                    if (r.success) {
                        var message = r.acceptIO == true ? 'Приходный ордер подтвержден!' : 'Строка приходного ордера подтверждена!';
                        toast('Успешно!', message);
                        // msgToast('Успешно!', message);
                        loadStoreCertificate();
                    } else {
                        var message = r.msgForUsers;
                        msg(message);
                    }
                }
            });
        }
    });

    var buttonGotoIO = {
        xtype: 'button',
        text: 'Печать приходного ордера',
        iconCls: 'report_edit',
        handler: function () {
            var mm56 = mm56Label.text;
            console.log(mm56Label);
            window.open('phps/print_io.php?mm56=' + mm56);
        }
    }

    var buttonBack = {
        xtype: 'button',
        text: 'Назад',
        iconCls: "x-btn-icon-el x-tbar-page-prev",
        handler: function () {
            windowCertificateConformity.hide();
            windowCertificateConformity.close();

            if(from){
                localStorage.setItem('params', JSON.stringify(from.params));
                Ext.History.back();
            } else{
                Ext.History.add('MAIN');
            }

            // console.log(from);
            // var fn = from.fn;
            // var params = from.params;
            // fn(params);
            // from(from.fn());
        }
    };

    var buttonLoadScan = {
        xtype: 'button',
        text: 'Загрузить скан',
        iconCls: 'report_add',
        handler: function () {

            if(!canThisRoleDoIt(localStorage.getItem('role'))){
                msgNotAllowed('Загрузить скан', localStorage.getItem('role'));
                return;
            }

            if (gridCertificate.selModel.selected.length > 0) {
                var selected_mm01 = gridCertificate.selModel.selected.items[0].data.MM01;

                windowLoadScan({ mm01: selected_mm01, reload: loadStoreCertificate });
            } else {
                msg('Для загрузки сертификата выберите строку!');
            }
        }
    };

    var buttonPrint = {
        xtype: 'button',
        text: 'Печать штрихкода',
        iconCls: "print",
        handler: function () {
            console.log(gridCertificate.getStore());

            if (gridCertificate.selModel.selected.items.length > 0) {
                var mm01 = gridCertificate.selModel.selected.items[0].data.MM01;
                if (mm01 == '') {
                    msg('У этой строки нет номера партии!');
                    return;
                }
                w = window.open("phps/print_barcode.php?mm01=" + mm01);
            } else {
                msg('Вы не выбрали строку для печати!');
            }
        }
    };

    var buttonRefresh = {
        xtype: 'button',
        iconCls: 'x-tbar-loading',
        handler: function() {
            loadStoreCertificate();
        }
    };

    var assistent = Ext.create('Ext.form.field.Text', {
        xtype: 'textfield',
        fieldLabel: 'Лаборант',
        labelWidth: 60,
        width: 200,
        readOnly: true
    });

    var gridCertificate = Ext.create('Ext.grid.Panel', {
        selModel: { mode: 'SINGLE' },
        region: 'center',
        margin: '5, 0, 0, 0',
        store: storeCertificate,
        columnLines: true,
        multiSelect: true,
        forceFit: true,
        resizable: true,
        // title: 'Информация о партии',
        columns: {
            items: [{
                xtype: 'rownumberer'
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
            }, /*{
                text: 'MM44',
                width: 65,
                minWidth: 65,
                dataIndex: 'MM44',
                hidden: true,
                editor: {
                    xtype: 'textfield',
                    readOnly: true
                }
            },*/ {
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
                text: 'Сертификат',
                columns: [{
                    text: 'Номер',
                    align: 'center',
                    dataIndex: 'X756',
                    width: 85,
                    minWidth: 85,
                    editor: {
                        xtype: 'textfield'
                    }
                }, {
                    xtype: 'datecolumn',
                    text: 'Дата',
                    format: 'd.m.Y',
                    dataIndex: 'X363',
                    align: 'center',
                    width: 95,
                    minWidth: 95,
                    editor: {
                        format: 'd.m.Y',
                        xtype: 'datefield',
                        submitFormat: 'd.m.Y'
                    }
                }]
            }, {
                text: 'Заводской номер',
                dataIndex: 'MM02',
                width: 145,
                minWidth: 145,
                editor: {
                    xtype: 'textfield',
                }
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
                    width: 85,
                    minWidth: 85,
                    editor: {
                        xtype: 'numberfield',
                        minValue: 0
                    }
                }, {
                    text: 'брак',
                    dataIndex: 'MM031',
                    align: 'center',
                    width: 85,
                    minWidth: 85,
                    editor: {
                        xtype: 'numberfield',
                        minValue: 0
                    }
                }]
            }, {
                text: 'Состояние<br>поставки',
                dataIndex: 'C440',
                width: 100,
                minWidth: 100,
                editor: {
                    xtype: 'textfield',
                    maxLength: 50
                }
            }, {
                text: 'Проверка',
                columns: [{
                    text: 'соп. док.',
                    dataIndex: 'X828',
                    align: 'center',
                    width: 125,
                    minWidth: 125,
                    editor: comboBoxIsCorrect,
                    renderer: isCrorrectRenderer
                }, {
                    text: 'внешнего вида',
                    dataIndex: 'X826',
                    align: 'center',
                    width: 125,
                    minWidth: 125,
                    editor: comboBoxIsCorrect,
                    renderer: isCrorrectRenderer
                }, {
                    text: 'однородности',
                    dataIndex: 'X827',
                    align: 'center',
                    width: 125,
                    minWidth: 125,
                    editor: comboBoxIsCorrect,
                    renderer: isCrorrectRenderer
                }]
            }, {
                text: 'Место хранения',
                columns: [{
                    text: 'Стеллаж',
                    dataIndex: 'MM08',
                    align: 'center',
                    width: 85,
                    minWidth: 85,
                    editor: {
                        xtype: 'textfield',
                        maxLength: 50
                    }
                }, {
                    text: 'Ячейка',
                    dataIndex: 'MM081',
                    align: 'center',
                    width: 75,
                    minWidth: 75,
                    editor: {
                        xtype: 'textfield',
                        maxLength: 10
                    }
                }]
            }, {
                text: 'Номер дела',
                dataIndex: 'CC68',
                width: 105,
                minWidth: 105,
                editor: {
                    xtype: 'textfield',
                    maxLength: 11
                }
            },/* {
                text: 'Заключение ЦЗЛ',
                dataIndex: '',
                columns: [{
                    text: 'Номер',
                    dataIndex: 'H010',
                    align: 'center',
                    width: 75,
                    minWidth: 75,
                    editor: {
                        xtype: 'textfield',
                        maxLength: 10
                    }
                }, {
                    text: 'Дата',
                    xtype: 'datecolumn',
                    dataIndex: 'X373',
                    align: 'center',
                    width: 95,
                    minWidth: 95,
                    format: 'd.m.Y',
                    editor: {
                        format: 'd.m.Y',
                        xtype: 'datefield',
                        submitFormat: 'd.m.Y'
                    }
                }]
            },*/ {
                text: 'Акт, рекламация',
                columns: [{
                    text: 'Номер',
                    dataIndex: 'MM135',
                    align: 'center',
                    width: 75,
                    minWidth: 75,
                    editor: {
                        xtype: 'numberfield',
                    }
                }, {
                    text: 'Дата',
                    xtype: 'datecolumn',
                    dataIndex: 'MM162',
                    align: 'center',
                    width: 95,
                    minWidth: 95,
                    format: 'd.m.Y',
                    editor: {
                        format: 'd.m.Y',
                        xtype: 'datefield',
                        submitFormat: 'd.m.Y'
                    }
                }]
            }, {
                text: 'Протокол испытаний',
                columns: [{
                    text: 'Номер',
                    dataIndex: 'Z1350',
                    align: 'center',
                    width: 85,
                    minWidth: 85,
                    editor: {
                        xtype: 'numberfield',
                    }
                }, {
                    text: 'Дата',
                    dataIndex: 'Z1340',
                    xtype: 'datecolumn',
                    align: 'center',
                    width: 85,
                    minWidth: 85,
                    format: 'd.m.Y',
                    editor: {
                        format: 'd.m.Y',
                        xtype: 'datefield',
                        submitFormat: 'd.m.Y'
                    }
                }]
            }, {
                text: 'Параметры',
                columns: [{
                    text: 'Проверяемые',
                    dataIndex: 'MM32',
                    align: 'center',
                    width: 115,
                    minWidth: 115,
                    editor: {
                        xtype: 'textfield',
                    }
                }, {
                    text: 'Бракуемые',
                    dataIndex: 'MM33',
                    align: 'center',
                    width: 105,
                    minWidth: 105,
                    editor: {
                        xtype: 'textfield',
                    }
                }]
            }, {
                text: 'Примечание',
                width: 115,
                minWidth: 115,
                dataIndex: 'MM19',
                editor: {
                    xtype: 'textfield',
                    maxLength: 100
                }
            }, {
                text: 'Дата сдачи в<br>ЦЗЛ',
                width: 115,
                minWidth: 115,
                xtype: 'datecolumn',
                dataIndex: 'MM481',
                format: 'd.m.Y',
                editor: {
                    format: 'd.m.Y',
                    xtype: 'datefield',
                    submitFormat: 'd.m.Y'
                }
            }, {
                text: 'Скан<br>сертификата',
                dataIndex: 'CN931',
                width: 115,
                minWidth: 115,
                renderer: pdfRenderer
            }, {
                text: 'Лаборант',
                dataIndex: 'ASSISTENT',
                width: 115,
                minWidth: 115,
                hidden: true
            }],
            defaults: {
                align: 'center'
            }
        },
        dockedItems: [{
            xtype: 'toolbar',
            items: [buttonRefresh, buttonAdd, buttonSave, buttonAccept, buttonRemoveAccept, assistent, buttonGotoIO, buttonPrint, buttonLoadScan, buttonBack, '->', mm56Label],
            dock: 'bottom'
        }, {
            xtype: 'toolbar',
            items: [{
                xtype: 'numberfield',
                id: 'countField',
                fieldLabel: 'Количество',
                labelWidth: 80,
                width: 150,
                readOnly: true,
                validator: function () {
                    console.log(Ext.getCmp('c8940').getValue());
                    var v = Ext.getCmp('countField').getValue();
                    if (Ext.getCmp('c8940').getValue() != v) {
                        return 'Количество брака и годных не соответствует количеству по приходному документу';
                    }
                    return true;
                }
            }],
            dock: 'top'
        }],
        plugins: [{
            ptype: 'cellediting',
            clicksToEdit: 1,
            edit: function (editor, e) {
                if (e.value == e.originalValue) {
                    return;
                }
            },
            listeners: {
                beforeedit: function (_, editor) {
                    if (storeCertificate.proxy.reader.jsonData.status_check != 0) {
                        if (editor.field == 'MM031' || editor.field == 'MM032') {
                            return false;
                        }
                        return;
                    }
                }
            }
        }]
    });

    gridCertificate.on('edit', function () {
        calculateCount();
    });

    gridCertificate.on('cellclick', function (_, _, cellIndex, record) {
        var columnDataIndex = gridCertificate.columns[cellIndex].dataIndex;
        if (columnDataIndex == 'CN931') {
            var mm01 = record.data.MM01;
            if (mm01 != '' && record.data.CN931 != 0) {
                window.open("phps/open_scan.php?mm01=" + mm01);
            }
        }

        var assistentValue = record.data.ASSISTENT == '' ? currentUser : record.data.ASSISTENT;
        assistent.setValue(assistentValue);
    });

    var windowCertificateConformity = Ext.create('Ext.window.Window', {
        title: getShifr('ЗАВЕДЕНИЕ ИНФОРМАЦИИ С СЕРТИФИКАТА СООТВЕТСТВИЯ НА МЕТАЛЛ', 'XM727C02', 1, (document.body.clientWidth * 0.8) - 35),
        maximizable: true,
        height: document.body.clientHeight * 0.8,
        width: document.body.clientWidth * 0.95,
        layout: 'border',
        items: [headForm, gridCertificate]
    }).show();

    windowCertificateConformity.on('hide', function(){
        windowCertificateConformity.close();
    });

    // windowCertificateConformity.on('beforeclose', function(){
    //     Ext.History.add('MAIN');
    // });

    var loadMaskAccept = new Ext.LoadMask({
        msg: 'Подтверждение документа...',
        target: windowCertificateConformity
    });

    var loadMaskSave = new Ext.LoadMask({
        msg: 'Сохранение...',
        target: windowCertificateConformity
    });

    var loadMaskRemoveAccept = new Ext.LoadMask({
        msg: 'Снятие подтверждения...',
        target: windowCertificateConformity
    });

    // function loadHead() {
    //     Ext.Ajax.request({
    //         url: 'phps/load_head_xm727c02.php',
    //         method: 'post',
    //         params: {
    //             mm01: mm01
    //         },
    //         callback: function (opts, suss, resp) {
    //             var r = Ext.decode(resp.responseText);
    //             Ext.getCmp('km_name').setValue(r.km_name);
    //             Ext.getCmp('mm15').setValue(r.mm15);
    //             Ext.getCmp('mm16').setValue(r.mm16);
    //             Ext.getCmp('x451_name').setValue(r.x451_name);
    //             Ext.getCmp('c8940').setValue(r.c8940);
    
    //             currentUser = r.current_user;
    //         }
    //     });
    // }

    function loadStoreCertificate() {
        // if(storeCertificate.data.items.length > 0){
        //     var mm01_current = null;
        //     for(var i=0; i < storeCertificate.data.items.length; i++){
        //         var row = storeCertificate.data.items[i].data;
        //         if(row.MM44 == ''){
        //             mm01 = row.MM01;

        //         }
        //     }
        //     storeCertificate.getProxy().extraParams = {
        //         mm561: mm561
        //     };
        // }

        storeCertificate.load({
            callback: (records, operation, success) => {
                if(!success){
                    var r = storeCertificate.proxy.reader.jsonData;
                    console.log(r);
                    msg('Ошибка! ' + r.msgForUsers + '!');
                }
                assistent.setValue(getAssistents().join('; '));

                if(storeCertificate.data.items.length > 0){
                    mm56Label.setText(storeCertificate.data.items[0].data.MM56);
                }

                var r = storeCertificate.proxy.reader.jsonData;
                Ext.getCmp('km_name').setValue(r.km_name);
                Ext.getCmp('mm15').setValue(r.mm15);
                Ext.getCmp('mm16').setValue(r.mm16);
                Ext.getCmp('x451_name').setValue(r.x451_name);
                Ext.getCmp('c8940').setValue(r.c8940);
    
                currentUser = r.current_user;

                calculateCount();
                if (r.status_check == 2) {
                    buttonAccept.disable();
                    buttonAdd.disable();
                    buttonRemoveAccept.enable();
                    buttonSave.setVisible(false);
                } else if(r.status_check == 1){
                    buttonAccept.disable();
                    buttonAdd.disable();
                    buttonRemoveAccept.disable();
                    buttonSave.setVisible(true);
                } else {
                    buttonAccept.enable();
                    buttonAdd.enable();
                    buttonRemoveAccept.disable();
                    buttonSave.setVisible(false);
                }
            }
        });
    }

    function calculateCount() {
        var sum = calculateSumRejectAndUseful();
        Ext.getCmp('countField').setValue(sum);
        console.log('countSum', sum);
    }

    function calculateSumRejectAndUseful() {
        var sum = 0;
        var rows = storeCertificate.data.items;
        rows.forEach(el => sum += (+el.data.MM032 + +el.data.MM031));
        console.log('sum', sum);
        return sum;
    }

    function statusCheckRenderer(value) {
        if (value == 2) {
            return 'ОВК';
        }
        return '';
    }

    /**
     * Получить список всех лаборантов (без дублирования)
     * @return string[] 
     */
    function getAssistents(){
        var assistents = [];
        var rows = storeCertificate.data.items;
        rows.forEach(el => assistents.push(el.data.ASSISTENT));
        return Array.from(new Set(assistents)); // получить уникальные значения
    }
}