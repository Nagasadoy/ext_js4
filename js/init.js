Ext.onReady(function () {

    Ext.History.init();
    if (Ext.ux.grid.FiltersFeature) { Ext.apply(Ext.ux.grid.FiltersFeature.prototype, { menuFilterText: '�����' }); }

    clearDiv('toolbar');
    mainMenu = Ext.create('Ext.menu.Menu', {
        width: 305,
        items: [
            {
                text: '������ �� ��������',
                handler: function () {
                    if(Ext.History.currentToken != 'C01'){
                        Ext.WindowMgr.hideAll(); // ��������� ��� �������� ����
                        Ext.History.add('C01'); // ������� �� ���� xm727c01
                    }
                }
            }, {
                text: '������ ����� ����������� ��',
                handler: function () {
                    if(Ext.History.currentToken != 'C03'){
                        Ext.WindowMgr.hideAll(); // ��������� ��� �������� ����
                        Ext.History.add('C03'); // ������� �� ���� xm727c03
                    }
                }
            }
        ]
    });

    var tb = Ext.create('Ext.toolbar.Toolbar', {});
    tb.add(
        {
            text: '������ �ޣ�� ����������� �������� ��������',
            menu: mainMenu,
        },
        '->',
        {
            text: '����� � ���',
            handler: function () { document.location.href = "http://ksu.p33.st/aa240/ksu_single.php?CurrentNode=4642"; }
        }
    );
    tb.render('toolbar');

    openPageByToken(Ext.History.currentToken);

    Ext.History.on('change', function (token) {
        openPageByToken(Ext.History.currentToken);
    });

    Ext.Ajax.request({
        url: 'phps/check_role.php',
        method: 'post',
        callback: function (opts, suss, resp) {
            var r = Ext.decode(resp.responseText);
            if (r.success) {
                if (r.role == 'NO_ROLE') {
                    msg('� ��� ��� ������� � ���� �����!');
                    return;
                }
                localStorage.setItem('role', r.role);
            } else {
                msg('��������� ������ ��� �������� ����! ���������� � ������ ���������!');
                return;
            }
        }
    });
    Ext.tip.QuickTipManager.init();

    console.log(Ext.History);
});


function openPageByToken(token) {
    var params = localStorage.getItem('params');
    if (params == null) {
        params = {};
    } else {
        params = JSON.parse(params);
        console.log(params);
    }

    switch (token) {
        case 'C01':
            xm727c01(params);
            break;
        case 'C02':
            xm727c02(params);
            break;
        case 'C03':
            xm727c03(params);
            break;
        default:
            Ext.WindowMgr.hideAll(); // ��������� ��� �������� ����
            init();
            break;
    }
}

function init() {
    localStorage.removeItem('params');
    Ext.History.add('MAIN');
}

function getShifr(title, shifr, grif, width = '99%') {
    width = '100%';
    now = new Date;
    str1 = '����: ' + Ext.Date.format(now, 'd.m.Y') + '<br>�����: ' + Ext.Date.format(now, 'H:i:s');
    griftxt = '';
    return '<table class="shifr" border=0 width=' + width + '><col \><col width=160px\><tr><td rowspan="' + (2 + grif) + '" align=center><b>' + title + '</b></td><b>' + griftxt + '</b><td align=right style="font-size:12px;">' + shifr + '</td></tr><tr><td align=right style="font-size:12px;">' + str1 + '</td></tr></table>'
}

function clearDiv(id) {
    var vid = Ext.get(id);
    d = vid.dom.childNodes.length;
    for (i = 0; i < d; i++) {
        vid.dom.removeChild(vid.dom.lastChild);
    }
}

function msg(text, response = null) {
    Ext.Msg.show({
        title: '���������',
        msg: text,
        buttons: Ext.Msg.OK,
        modal: true,
        icon: Ext.MessageBox.INFO
    });
}

function msgToast(title, text, icon) {

    var toast = Ext.Msg.show({
        title: '���������',
        msg: text,
        buttons: Ext.Msg.OK,
        modal: true,
        icon: Ext.MessageBox.INFO
    });

    setTimeout(() => { toast.hide() }, 3000);

    // Ext.MessageBox.show({
    //     msg: 'Saving your data, please wait...',
    //     progressText: 'Saving...',
    //     width:300,
    //     wait:true,
    //     waitConfig: {interval:100},
    //     // icon:'ext-mb-download', //custom class in msg-box.html
    //     animateTarget: 'mb7'
    // });
    // setTimeout(function(){
    //      Ext.MessageBox.hide();
    //     //  Ext.example.msg('Done', 'Your fake data was saved!');
    //  }, 5000);
}

// function on

function isCrorrectRenderer(value) {
    if (value == 1) {
        return '�������������';
    }
    return '���������������';
}

function lineBreak(val) {
    return '<div style="white-space:normal !important;">' + val + '</div>';
}

function toast(title, msg) {
    Ext.example.msg(title, msg);
}

function pdfRenderer(val) {
    if (val == 1) {
        return '<img src="images/accept.png"/>'
    }
    return '';
}

function canThisRoleDoIt(role) {
    if (role == 'MTR_RAZ' || role == 'XM727Y01') {
        return true;
    }
    return false;
}

function msgNotAllowed(action, role) {
    msg(action + '��������� ��� ����: ' + role);
}


/**
    * ���������� ������ {grid} �� ������ � �������� {indexRow}
    * @param {Ext.GridPanel} grid ���� ��� �������� ���������� ������
    * @param {number} indexRow ������ ������ �� ������� ���������� ����������� ������
*/
function scrollToIndex(grid, indexRow) {
    // ���������� �� ����� �������� ���������� ����������� scrollbar,
    // ����� ���������� ������ ���� � ���� ������
    var scrollValue = 0;
    for (var j = 0; j < indexRow; j++) {
        scrollValue += grid.getView().getNode(j).clientHeight;
    }

    // ���� ������� ����� ������ ���� �� � ������ �����
    if (indexRow > 2) {
        scrollValue -= (grid.getView().getNode(indexRow - 1).clientHeight +
            grid.getView().getNode(indexRow - 2).clientHeight);
    }

    grid.getView().scrollBy(0, scrollValue, true); // x, y, ��������=true
    grid.getSelectionModel().select(indexRow); // �������� ������

    // grid.getView().focusRow(indexRow); // ��� ��� ����� ������� �ӣ 1 �������, �� ���������� ������
    // ����� �����, ��� �������� �����
}