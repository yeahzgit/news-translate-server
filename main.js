// This is the main Node.js source code file of your actor.

// Import Apify SDK. For more information, see https://sdk.apify.com/
const Apify = require('apify');

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    // And then we add a request to it.
    await requestQueue.addRequest({ url: 'https://bbc.com/news' });

    const handlePageFunction = async ({ request, $ }) => {
        const title = $('title').text();

        console.log(`The title of "${request.url}" is: ${title}.`);
    };

    // Set up the crawler, passing a single options object as an argument.
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction,
    });

    await crawler.run();
});
