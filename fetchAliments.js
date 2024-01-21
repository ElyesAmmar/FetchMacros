const axios = require('axios');
const cheerio = require('cheerio');
const csv = require('csv-parser');
const fs = require('fs');

const fetchAlimentsCSV = () => {
    const links = [];
        fs.createReadStream('linksNames.csv')
        .pipe(csv())
        .on('data', (data) => {
            links.push(data.links)})
        .on('end', () => {
            console.log(links);
        });
        return links
}

// console.log(fetchAlimentsCSV());

// const fetchLinks = async() => {
//     let links = fetchAlimentsCSV();
//     try {
//         links.map( async(el)=> {
//             let response = await axios.get(el);
//             let $ = cheerio.load(response.data);
//             $('.odTableAuto ')
//         })
//     } catch (error) {
        
//     }
// }

const fetchLinks = async() => {
    let tab = [];
    try {
        let aliment = {};
        let response = await axios.get('https://sante.journaldesfemmes.fr/calories/accra-de-morue/aliment-25433');
        let $ = cheerio.load(response.data);
        let nameCalories = $('#calorie-accra-de-morue').text();
        const indexOfColon = nameCalories.indexOf(' : ');
        let name = nameCalories.substring(0, indexOfColon);
        let calories = nameCalories.substring(indexOfColon + 3);
        aliment ["Name"] = name;
        aliment ["Calories"] = calories;
        
        $('.odTableAuto tbody tr').each((index, element) => {
            
            let macros = $(element).find('td');
            aliment [$(macros[0]).text()] = $(macros[1]).text();
            // macros.each((index, element) => {
            //     aliment
            //     element.text();
            // })
            // console.log(macros);
            tab.push(aliment)
        })
    } catch (error) {
        console.log(error);
    }
    console.log(tab);
}
fetchLinks();