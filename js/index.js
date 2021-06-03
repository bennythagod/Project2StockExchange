//https://financialmodelingprep.com/developer/docs/companies-key-stats-free-api/#Javascript


document.addEventListener("DOMContentLoaded", function() {

    var urlParams = new URLSearchParams(window.location.search);
    let query = urlParams.get('query');

    search.value = query;
    Search();




    function debounce(func, wait) {
        let timer = null;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(func, wait);
        }
    }

    search.addEventListener('input', debounce(function() {
        Search();
    }, 500));

});


function Search() {
    if (search.value != null && search.value != "") {

        document.querySelector("#tblSearch").innerHTML = `
<tr>
<td>
Loading...
</td>
</tr>
    `;

        getRequest(
            `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${search.value}&limit=10&exchange=NASDAQ`,
            (responseText) => {
                let list = JSON.parse(responseText);


                let rowsStr = "";


                let symbols = list.map(c => c.symbol);

                let temparray, chunk = 3;
                for (let i = 0, j = symbols.length; i < j; i += chunk) {
                    temparray = symbols.slice(i, i + chunk);


                    getRequest(
                        `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${temparray}`,
                        (responseText2) => {
                            let listComplete = JSON.parse(responseText2).companyProfiles || [JSON.parse(responseText2)];



                            for (const item of listComplete) {
                                rowsStr += `
<tr>
<td>
<div class="widget-26-job-emp-img">
<img src="${item.profile.image}"
    alt="Company" />
</div>
</td>
<td>
<div class="widget-26-job-title">
<a href="/company.html?symbol=${item.symbol}">
    ${item.profile.companyName} (${item.symbol}) <span style="color: ${item.profile.changesPercentage.indexOf("+")?"green":"red"}">${item.profile.changesPercentage}</span>
</a>
</div>
</td>
</tr>
`;
                            }
                            document.querySelector("#tblSearch").innerHTML = rowsStr;


                        });
                }
            });

    }
}










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
    if (typeof success != 'function') success = function() {};
    req.onreadystatechange = function() {
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