//https://financialmodelingprep.com/developer/docs/companies-key-stats-free-api/#Javascript


document.addEventListener("DOMContentLoaded", function () {

    var urlParams = new URLSearchParams(window.location.search);
    let query = urlParams.get('query');

    search.value = query;
    Search();




    function debounce(func, wait) {
        let timer = null;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(func, wait);
        }
    }

    search.addEventListener('input', debounce(function () {
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


                for (const item of list) {
                    rowsStr += `
<tr>
    <td>
        <div class="widget-26-job-title">
            <a href="/company.html?symbol=${item.symbol}">
                ${item.name} (${item.symbol})
            </a>
        </div>
    </td>
</tr>
    `;
                }
                document.querySelector("#tblSearch").innerHTML = rowsStr;

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