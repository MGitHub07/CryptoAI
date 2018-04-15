(() => {
    /*
     * Setup
     */

    var startDate = moment('01.01.18', 'DD.MM.YY')

    /*
        //definition for parameter testing
        var baseValue = 0.00580;
        var stepCount = 10;
        var lowValue = baseValue * 0.99;
        var highValue = baseValue * 0.01;
        var stepValue = (highValue - lowValue) / stepCount;

        console.log(baseValue, lowValue, highValue, stepValue);*/

    // run 10 test while increasing context.sarAccel
    for (let dayCount = 0, p = Promise.resolve(); dayCount <= 30; dayCount += 1) {
        p = p.then(_ => {

            $('#date-start input').val(startDate.format('YYYY-MM-DD HH:mm'))
            startDate.add(1, 'days');
            $('#date-end input').val(startDate.format('YYYY-MM-DD HH:mm'))
            return runTest();
        });
    }

    /*
     * function definitions
     */


    setParameterInCode = (parameter, value) => {
        var code = ace.edit('editor').getValue();
        code = code.replace(new RegExp('(' + parameter + ' += +).*'), '$1' + value.toString())
        ace.edit('editor').setValue(code);
        console.log(parameter, value)
    }

    runTest = () => {
        return wait(0)
            .then(() => {
                window.startTime = performance.now()
                $('#backtest-tab a[href="#settings"]').first().click();
                //console.log('go settings')
                return wait(1000);
            }).then(() => {
                $('a.btn.btn-backtest').first().click()
                    //console.log('open backtest settings')
                return wait(1000);
            }).then(() => {
                //console.log('run')
                $('.modal-dialog .btn-run').first().click()
                return wait(1000);

            }).then(() => {
                var loop = () => {
                    //console.log('wait for modal gets closed')
                    $('.modal-dialog .btn-run').first().click()
                    if ($('.modal-dialog').length == 1)
                        return wait(500).then(() => loop());
                    return Promise.resolve()
                }
                return wait(500).then(() => loop());
            }).then(() => {
                var loop = () => {
                    // console.log('wait for log gots filled')
                    window.log = $('#log div.log.scroll').text().trim();
                    if (window.log == "")
                        return wait(500).then(() => loop());
                    return Promise.resolve()
                }
                return wait(500).then(() => loop());
            }).then((a, b) => {
                console.log("\t" + startDate.format() + "\t", /BOT PROFIT SUM__:.*/g.exec(log)[0], "\t", /B&H PROFIT SUM__:.*/g.exec(log)[0]);
                return Promise.resolve();
            });
    }
    return;
})();