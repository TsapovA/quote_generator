const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

function showLoader() {
    loader.hidden = false;
    quoteContainer.hidden = true
}

// Hide loader
function hideLoader() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

async function getQuote(attemptNumber) {
    if (attemptNumber >= 3) {
        quoteText.innerText = "Error while trying to fetch data"
        return
    }
    showLoader()
    // used to avoid CORS error while fetching the data from apiUrl
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    let isRu = (new Date()).getMilliseconds() % 2 === 0;
    const lang = isRu? 'ru' : 'en'
    const apiUrl = `http://api.forismatic.com/api/1.0/?method=getQuote&lang=${lang}&format=json`

    try {
        const data = await (await fetch(proxyUrl + apiUrl)).json();
        console.log('Received data: ', data);

        authorText.innerText = getAuthor(data)

        let quote = data.quoteText;
        if (quote.length > 50) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = quote;
        hideLoader()
    } catch(error) {
        getQuote(attemptNumber + 1);
    }

    function getAuthor(data) {
        let author = data.quoteAuthor;
        if (author === '') {
            author = isRu ? "Автор неизвестен" : "Unknown";
        }
        return author;
    }
}

function tweet(quote, author){
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`
    window.open(twitterUrl, '_blank');
}

newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweet)

getQuote(0);