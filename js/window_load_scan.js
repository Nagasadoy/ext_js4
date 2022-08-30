/**
 * ������� �������������� ���� ��� �������� ����� �����������
 * @param {number} mm01 - ����� ������ 
 * @param {function} reload - ������� � ������������� store
 */
function windowLoadScan({mm01, reload}) {

    var panel = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0',

        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 50
        },

        items: [{
            xtype: 'fieldset',
            style: 'padding: 2px 5px 6px 10px; margin: 5px 8px 10px 8px; ',
            title: '���������� ��������',
            items: [{
                xtype: 'filefield',
                id: 'form-file',
                emptyText: '���� � ������� PDF',
                // fieldLabel: '���������� ��������',
                // labelAlign: 'top',
                name: 'scan_path',
                buttonText: '�������...',
                // buttonConfig: {
                //     iconCls: 'upload-icon'
                // }
            }]
        }],
        buttonAlign: 'center',
        buttons: [{
            text: '�������',
            handler: function () {

                var loadMask = new Ext.LoadMask({
                    msg: '�������� �����...',
                    target: winScan
                }).show();

                Ext.Ajax.request({
                    url: 'phps/delete_scan.php',
                    method: 'post',
                    params: {
                        mm01: mm01
                    },
                    callback: function (opts, suss, resp) {
                        loadMask.hide();
                        var r = Ext.decode(resp.responseText);
                        if(r.success){
                            toast('�������!', '���� ���̣�!');
                            reload();
                        } else {
                            msg('�� ������� ������� ����!');
                        }
                    }
                });
            }
        }, {
            text: '���������',
            handler: function () {
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    form.submit({
                        url: 'phps/add_scan.php',
                        params: {
                            mm01: mm01
                        },
                        waitMsg: '�������� �����...',
                        success: function () {
                            toast('�������!', '���� ��������');
                            reload();
                        },
                        failure: function(_, response){
                            msg(response.result.msgForUsers);
                        }
                    });
                }
            }
        }, {
            text: '������',
            handler: function () {
                winScan.close();
            }
        }]
    });

    var winScan = new Ext.window.Window({
        title: '<center>�������� ���������</center>',
        resizable: false,
        closable: false,
        border: false,
        modal: true,
        items: [panel]
    });

    winScan.show();
}