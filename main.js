const Apify = require('apify');

const {
    utils: { enqueueLinks },
} = Apify;

const newsTitleStorage = {

};

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: 'https://bbc.com/news' });

    const handlePageFunction = async ({ request, $ }) => {
        // const title = $('title').text();
        // console.log(`The title of "${request.url}" is: ${title}.`);
        if (!request.userData.detailPage) {
            const newTitle = $('.nw-c-top-stories--standard .nw-c-top-stories__secondary-item .gs-o-faux-block-link__overlay-link h3').text();
            console.log(newTitle);
            await enqueueLinks({
                $,
                requestQueue,
                selector: '.nw-c-top-stories--standard .nw-c-top-stories__secondary-item .gs-o-faux-block-link__overlay-link',
                baseUrl: request.loadedUrl,
                transformRequestFunction: (req) => {
                    req.userData.detailPage = true;
                    return req;
                },
            });
        }
    };

    const crawler = new Apify.CheerioCrawler({
        maxRequestsPerCrawl: 20,
        requestQueue,
        handlePageFunction,
    });

    await crawler.run();
});
