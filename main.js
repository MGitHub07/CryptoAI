(() => {
    /*
     * Setup
     */

    // run 10 test while increasing context.sarAccel
    for (let i = 0.001, p = Promise.resolve(); i < 0.01; i += 0.001) {
        p = p.then(_ => {
            setParameterInCode('context.sarAccel', i);
            return runTest();
        });
    }

    /*
     * function definitions
     */

    wait = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

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
                console.log('finished', Math.round((performance.now() - window.startTime) / 1000, 1), /Bot Gewinn_*:.*/.exec(log)[0]);
                return Promise.resolve();
            });
    }
    return;
})();