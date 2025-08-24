
function getBathValue() {
    const uiBathrooms = document.getElementsByName("uiBathrooms");
    for (let i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1;
}


function getBHKValue() {
    const uiBHK = document.getElementsByName("uiBHK");
    for (let i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1;
}


async function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    const sqft = document.getElementById("uiSqft");
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = document.getElementById("uiLocations");
    const estPrice = document.getElementById("uiEstimatedPrice");

    const url = "http://127.0.0.1:5000/predict_home_price";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                total_sqft: parseFloat(sqft.value),
                bhk: bhk,
                bath: bathrooms,
                location: location.value
            })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch estimated price");
        }

        const data = await response.json();
        console.log(data.estimated_price);
        estPrice.innerHTML = `<h2>Predicted Price: ${data.estimated_price} Lakh</h2>`;
    } catch (error) {
        console.error("Error fetching price:", error);
        estPrice.innerHTML = "<h2>Something went wrong. Please try again.</h2>";
    }
}


async function onPageLoad() {
    console.log("Document loaded");

    const url = "http://127.0.0.1:5000/get_location_names";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch locations");
        }

        const data = await response.json();
        console.log("Got response for get_location_names request");

        if (data && data.locations) {
            const locations = data.locations;
            const uiLocations = document.getElementById("uiLocations");

            // Clear old options
            uiLocations.innerHTML = "";

            
            locations.forEach(location => {
                const opt = document.createElement("option");
                opt.text = location;
                uiLocations.add(opt);
            });
        }
    } catch (error) {
        console.error("Error fetching locations:", error);
    }
}

window.onload = onPageLoad;
