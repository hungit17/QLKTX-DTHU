var sharedController = {
    Init: function () {
        sharedController.RegisterEvent();
        sharedController.parseDate();
    },
    RegisterEvent: function () {
        $('.user-menu').click(function () {
            if ($('.user-menu').hasClass('open')) {
                $('.user-menu').removeClass('open');
            } else {
                $('.user-menu').addClass('open');
            }
        });
    },
    parseDate: function (datetime) {
        var temp_result = moment.utc(datetime, "x").toISOString();
        moment.locale('vi');
        var result = moment(temp_result).format('LL');
        return result;

    },
    standartDate: function (datetime) {
        var result= moment(datetime).format('YYYY-MM-DD');

        return result;

    },
    formatNumber: function (nStr, decSeperate, groupSeperate) {
        nStr += '';
        x = nStr.split(decSeperate);
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
        }
        return x1 + x2+"<sup class='col-pink'> <u>đ</u></sup>";
    }
}
sharedController.Init();