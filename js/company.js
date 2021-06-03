document.addEventListener("DOMContentLoaded", function () {

    var urlParams = new URLSearchParams(window.location.search);
    let symbol = urlParams.get('symbol');

    loading.innerHTML = "Loading...";

    getRequest(
        `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`,
        (responseText) => {
            let data = JSON.parse(responseText);


            logoImage.setAttribute("src", data.profile.image);

            companyName.innerHTML = data.profile.companyName;
            sector.innerHTML = data.profile.sector;
            description.innerHTML = data.profile.description;

            stockPrice.innerHTML = `Stock Price: ${data.profile.price} <span style="color: ${data.profile.changesPercentage.indexOf("+") ? "green" : "red"}">${data.profile.changesPercentage}</span>`;
        });

    getRequest(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`, (responseText) => {
        let data = JSON.parse(responseText);



        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    data: data.historical.filter(c => c.date.split("-")[0] >= 2020).sort((a, b) => {
                        if (a.date < b.date) {
                            return -1;
                        } else if (a.date > b.date) {
                            return 1;
                        }
                        return 0;
                    })
                }]
            },
            options: {
                parsing: {
                    xAxisKey: 'date',
                    yAxisKey: 'close'
                }
            }
        });

        loading.innerHTML = "";
    })
});




function getRequest(url, success) {
    var req = false;
    try {
        req = new XMLHttpRequest();
    } catch (e) {
        try {
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                return false;
            }
        }
    }
    if (!req) return false;
    if (typeof success != 'function') success = function () { };
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status === 200) {
                success(req.responseText)
            }
        }
    }
    req.open("GET", url, true);
    req.send(null);
    return req;
}