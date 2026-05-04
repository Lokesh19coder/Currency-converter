document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "02a8a8f2854441cc7813f828";
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    let rates = {};

    const currencyToCountry = {
        USD: "US",
        INR: "IN",
        EUR: "EU",
        GBP: "GB",
        JPY: "JP",
        AUD: "AU",
        CAD: "CA",
        CNY: "CN",
        CHF: "CH"
    };

    async function loadCurrencies() {
        try {
            const res = await fetch(url);
            const data = await res.json();

            rates = data.conversion_rates;

            let from = document.getElementById("fromCurrency");
            let to = document.getElementById("toCurrency");

            for (let currency in rates) {
                from.add(new Option(currency, currency));
                to.add(new Option(currency, currency));
            }

            from.value = "USD";
            to.value = "INR";

            updateFlags();
            convertCurrency();

        } catch (error) {
            console.error("API Error:", error);
        }
    }

    function updateFlags() {
        let from = document.getElementById("fromCurrency").value;
        let to = document.getElementById("toCurrency").value;

        let fromCode = currencyToCountry[from] || "US";
        let toCode = currencyToCountry[to] || "IN";

        document.getElementById("fromFlag").src =
            `https://flagsapi.com/${fromCode}/flat/64.png`;

        document.getElementById("toFlag").src =
            `https://flagsapi.com/${toCode}/flat/64.png`;
    }

    function convertCurrency() {
        let amount = document.getElementById("amount").value;
        let from = document.getElementById("fromCurrency").value;
        let to = document.getElementById("toCurrency").value;

        if (!amount || amount <= 0) {
            document.getElementById("result").innerText = "Enter valid amount";
            return;
        }

        let usd = amount / rates[from];
        let converted = usd * rates[to];

        let resultText = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
        document.getElementById("result").innerText = resultText;

        addToHistory(resultText);
    }

    function addToHistory(text) {
        let historyDiv = document.getElementById("history");
        let entry = document.createElement("div");
        entry.textContent = text;

        historyDiv.prepend(entry);

        if (historyDiv.children.length > 5) {
            historyDiv.removeChild(historyDiv.lastChild);
        }
    }

    function swapCurrencies() {
        let from = document.getElementById("fromCurrency");
        let to = document.getElementById("toCurrency");

        let temp = from.value;
        from.value = to.value;
        to.value = temp;

        updateFlags();
        convertCurrency();
    }

    // Events
    document.getElementById("amount").addEventListener("input", convertCurrency);

    document.getElementById("fromCurrency").addEventListener("change", () => {
        updateFlags();
        convertCurrency();
    });

    document.getElementById("toCurrency").addEventListener("change", () => {
        updateFlags();
        convertCurrency();
    });

    window.swapCurrencies = swapCurrencies;
    window.saveFavorite = function () {
        alert("Favorite saved ⭐");
    };

    loadCurrencies();
});