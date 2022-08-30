/*
This file is part of Ext JS 4.2

Copyright (c) 2011-2014 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial
Software License Agreement provided with the Software or, alternatively, in accordance with the
terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2014-09-02 11:12:40 (ef1fa70924f51a26dacbe29644ca3f31501a5fce)
*/
/**
 * Russian translation
 * By ZooKeeper (utf-8 encoding)
 * 6 November 2007
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["������", "�������", "����", "������", "���", "����", "����", "������", "��������", "�������", "������", "�������"];

        Ext.Date.shortMonthNames = ["���", "����", "����", "���", "���", "����", "����", "���", "����", "���", "����", "���"];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.shortMonthNames[month];
        };

        Ext.Date.monthNumbers = {
            '���': 0,
            '���': 1,
            '���': 2,
            '���': 3,
            '���': 4,
            '���': 5,
            '���': 6,
            '���': 7,
            '���': 8,
            '���': 9,
            '���': 10,
            '���': 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = ["�����������", "�����������", "�������", "�����", "�������", "�������", "�������"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u0440\u0443\u0431',
            // Russian Ruble
            dateFormat: 'd.m.Y'
        });
    }
});

Ext.define("Ext.locale.ru.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.ru.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} ��������� �����"
});

Ext.define("Ext.locale.ru.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "������� ��� �������"
});

Ext.define("Ext.locale.ru.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "�������� � ���� ���� ��������"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.ru.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "��������..."
});

Ext.define("Ext.locale.ru.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "�������",
    minText: "��� ���� ������ ����������� ����",
    maxText: "��� ���� ����� ������������ ����",
    disabledDaysText: "����������",
    disabledDatesText: "����������",
    nextText: '��������� ����� (Control+������)',
    prevText: '���������� ����� (Control+�����)',
    monthYearText: '����� ������ (Control+�����/���� ��� ������ ����)',
    todayTip: "{0} (������)",
    format: "d.m.y",
    startDay: 1
});

Ext.define("Ext.locale.ru.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "������"
});

Ext.define("Ext.locale.ru.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "��������",
    afterPageText: "�� {0}",
    firstText: "������ ��������",
    prevText: "���������� ��������",
    nextText: "��������� ��������",
    lastText: "��������� ��������",
    refreshText: "��������",
    displayMsg: "������������ ������ � {0} �� {1}, ����� {2}",
    emptyMsg: '��� ������ ��� �����������'
});

Ext.define("Ext.locale.ru.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "����������� ����� ����� ���� {0}",
    maxLengthText: "������������ ����� ����� ���� {0}",
    blankText: "��� ���� ����������� ��� ����������",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.ru.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "�������� ����� ���� �� ����� ���� ������ {0}",
    maxText: "�������� ����� ���� �� ����� ���� ������ {0}",
    nanText: "{0} �� �������� ������",
    negativeText: "�������� �� ����� ���� �������������"
});

Ext.define("Ext.locale.ru.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "����������",
    disabledDatesText: "����������",
    minText: "���� � ���� ���� ������ ���� ����� {0}",
    maxText: "���� � ���� ���� ������ ���� ������ {0}",
    invalidText: "{0} �� �������� ���������� ����� - ���� ������ ���� ������� � ������� {1}",
    format: "d.m.y",
    altFormats: "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});

Ext.define("Ext.locale.ru.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "��������..."
    });
});

Ext.define("Ext.locale.ru.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: '��� ���� ������ ��������� ����� ����������� ����� � ������� "user@example.com"',
    urlText: '��� ���� ������ ��������� URL � ������� "http:/' + '/www.example.com"',
    alphaText: '��� ���� ������ ��������� ������ ��������� ����� � ������ ������������� "_"',
    alphanumText: '��� ���� ������ ��������� ������ ��������� �����, ����� � ������ ������������� "_"'
});

Ext.define("Ext.locale.ru.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: '����������, ������� �����:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: '���������� (Ctrl+B)',
                text: '���������� ����������� ���������� � ����������� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: '������ (Ctrl+I)',
                text: '���������� ���������� ���������� � ����������� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: '���ޣ������� (Ctrl+U)',
                text: '���ޣ�������� ����������� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: '��������� ������',
                text: '���������� ������� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: '��������� ������',
                text: '���������� ������� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: '�������',
                text: '��������� ����� ���� ��� ����������� ������ ��� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: '���� ������',
                text: '������� ����� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: '��������� ����� �� ������ ����',
                text: '���a�������� ������ �� ������ ����.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: '�� ������',
                text: '���a�������� ������ �� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: '��������� ����� �� ������� ����',
                text: '���a�������� ������ �� ������� ����.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: '�������',
                text: '������ ������������� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: '���������',
                text: '������ ������������� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: '�������� �����������',
                text: '�������� ������ �� ����������� ������.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: '�������� ���',
                text: '������������� �� �������� ���.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.ru.form.Basic", {
    override: "Ext.form.Basic",
    waitTitle: "����������, ���������..."
});

Ext.define("Ext.locale.ru.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "����������� �� �����������",
    sortDescText: "����������� �� ��������",
    lockText: "��������� �������",
    unlockText: "����� ����������� �������",
    columnsText: "�������"
});

Ext.define("Ext.locale.ru.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(�����)',
    groupByText: '������������ �� ����� ����',
    showGroupsText: '���������� �� �������'
});

Ext.define("Ext.locale.ru.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "��������",
    valueText: "��������",
    dateFormat: "d.m.Y"
});

Ext.define("Ext.locale.ru.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "������",
        yes: "��",
        no: "���"
    }    
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.ru.Component", {	
    override: "Ext.Component"
});