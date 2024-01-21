const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const fetchAlimentsLinks = async() => {
    try {
        
        let p =1;
        let links = [];
        let names = [];
        let table = [];
        let finaltable = [];

        while (true) {
            
            let url = `https://sante.journaldesfemmes.fr/calories/index/aliments?page=${p}`
            let response = await axios.get(url);
            let $ = cheerio.load(response.data);
            $('.list--bullet li a').each((index, element) =>{
                let name = $(element).text();
                if (name.includes(',')) {
                    names.push(name.replace(/,/g, ''));
                } else {
                    names.push(name);
                }
                
            })
            $('.list--bullet li a').each((index,element) => {
                let link = $(element).attr('href');
                links.push(link);
            })
            // console.log(names,links);
            for (let i = 0; i < names.length; i++) {
                table[i] = [names[i],links[i]]
            }
            table.map((el) => {
                finaltable.push(el.join(','))
            });
            
            if (p===15) {
                break; 
            }
            p+=1
        }
        
        finaltable.unshift("names,links");

        return finaltable;
    } catch (error) {
        console.log(error);
    }
}



function createCSV(csvContent) {
    fs.writeFileSync('linksNames.csv', csvContent.join('\n'), 'utf8');
    
}
fetchAlimentsLinks()
    .then(result => {
        createCSV(result)
    })
    .catch(error => {
        console.error(error);
    });