const Apify = require('apify');

const {
    utils: { enqueueLinks },
} = Apify;

const newsStorage = {};

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: 'https://bbc.com/news' });

    const listTitleWrapClassName = '.nw-c-top-stories--standard .nw-c-top-stories__secondary-item .gs-o-faux-block-link__overlay-link';
    const handlePageFunction = async ({ request, $ }) => {
        if (!request.userData.detailPage) {
            $(listTitleWrapClassName).each(function () {
                let linkUrl = $(this).attr('href');
                linkUrl = linkUrl.indexOf('https') > -1 ? linkUrl : `https://www.bbc.com${linkUrl}`;
                newsStorage[linkUrl] = { title: $(this).find('h3').text() };
            });
            await enqueueLinks({
                $,
                requestQueue,
                selector: listTitleWrapClassName, // TODO 没起作用
                baseUrl: request.loadedUrl,
                transformRequestFunction: (req) => {
                    req.userData.detailPage = true;
                    return req;
                },
            });
        } else {
            newsStorage[request.url].content = $('.ssrcss-pv1rh6-ArticleWrapper').text(); // TODO 仅有文字内容，需要细化文章内容
            console.log(newsStorage);
        }
    };

    const crawler = new Apify.CheerioCrawler({
        maxRequestsPerCrawl: 10,
        requestQueue,
        handlePageFunction,
    });

    await crawler.run();
});
