import {QueryKeyWord, QueryStringSeparator, SearchEngineName} from "@pages/popup/Types";

class SearchEngineSerpInfo {
    searchEngineName: SearchEngineName;
    queryKeyWord: QueryKeyWord;
    queryStringSeparator: QueryStringSeparator;
    hasPostQuerySymbol: boolean;
    whiteSpace = " ";


    constructor(searchEngineName: SearchEngineName, hasPostQuerySymbol: boolean, queryKeyWord: QueryKeyWord, queryStringSeparator: QueryStringSeparator) {
        this.searchEngineName = searchEngineName;
        this.queryKeyWord = queryKeyWord;
        this.queryStringSeparator = queryStringSeparator;
        this.hasPostQuerySymbol = hasPostQuerySymbol;
    }

    isUrlSERP(url: string): boolean {
        return url.includes(this.searchEngineName) && url.includes(this.queryKeyWord);
    }

    getQuery(url: string): string {
        if (this.hasPostQuerySymbol) {
            const postQuerySymbol = "&";
            const queryWithSeparator = url.split(this.queryKeyWord)[1].split(postQuerySymbol)[0];
            return queryWithSeparator.replace(this.queryStringSeparator, this.whiteSpace);
        } else {
            const queryWithSeparator = url.split(this.queryKeyWord)[1];
            return queryWithSeparator.replace(this.queryStringSeparator, this.whiteSpace);
        }
    }
}


const archiveWayBackMachineInfo = new SearchEngineSerpInfo("archive way back machine", false, "20230000000000*/", "%20");

const archiveIsInfo = new SearchEngineSerpInfo("archive", false, "search?query=", "+");

const wikipediaInfo = new SearchEngineSerpInfo("wikipedia", false, "wiki/", "_");

const googleInfo = new SearchEngineSerpInfo("google", true, "q=", "+");
const bingInfo = new SearchEngineSerpInfo("bing", true, "q=", "+");
const redditInfo = new SearchEngineSerpInfo("reddit", false, "q=", "%20");
const qwantInfo = new SearchEngineSerpInfo("qwant", true, "q=", "+");
const searchInfo = new SearchEngineSerpInfo("search.ch", false, "q=", "+");
const gibiruInfo = new SearchEngineSerpInfo("gibiru", true, "q=", "+");
const braveInfo = new SearchEngineSerpInfo("brave", true, "q=", "+");
const aolInfo = new SearchEngineSerpInfo("aol", true, "q=", "+");
const mojeekInfo = new SearchEngineSerpInfo("mojeek", false, "q=", "+");
const givewaterInfo = new SearchEngineSerpInfo("givewater", false, "q=", "+");
const dogpileInfo = new SearchEngineSerpInfo("dogpile", true, "q=", "+");
const exciteInfo = new SearchEngineSerpInfo("excite", false, "q=", "+");
const metacrawlerInfo = new SearchEngineSerpInfo("metacrawler", true, "q=", "+");
const zooInfo = new SearchEngineSerpInfo("zoo", true, "q=", "+");
const askInfo = new SearchEngineSerpInfo("ask", true, "q=", "%20");
const ecosiaInfo = new SearchEngineSerpInfo("ecosia", false, "q=", "%20");

const yahooInfo = new SearchEngineSerpInfo("yahoo", true, "p=", "+");

const duckduckgoInfo = new SearchEngineSerpInfo("duckduckgo", true, "q=", "+");
const ekoruInfo = new SearchEngineSerpInfo("ekoru", true, "q=", "+");


const yandexInfo = new SearchEngineSerpInfo("yandex", true, "&text=", "+");

const baiduInfo = new SearchEngineSerpInfo("baidu", true, "baidu&wd=", "%20");

const metagerInfo = new SearchEngineSerpInfo("metager", true, "eingabe=", "%20");

const wolframalphaInfo = new SearchEngineSerpInfo("wolframalpha", false, "input?i=", "+");

const youtubeInfo = new SearchEngineSerpInfo("youtube", true, "search_query=", "+");

const sogouInfo = new SearchEngineSerpInfo("sogou", true, "web?query=", "+");
const swisscowsInfo = new SearchEngineSerpInfo("swisscows", false, "web?query=", "+");

export const searchEngineSerpInfos = new Map<QueryKeyWord, SearchEngineSerpInfo[]>([
    ["q=", [googleInfo, bingInfo, redditInfo, qwantInfo, searchInfo, ecosiaInfo, gibiruInfo, braveInfo, aolInfo,
        mojeekInfo, givewaterInfo, dogpileInfo, exciteInfo, metacrawlerInfo, zooInfo, askInfo, ekoruInfo, duckduckgoInfo]],
    ["wiki/", [wikipediaInfo]],
    ["search_query=", [youtubeInfo]],
    ["eingabe=", [metagerInfo]],
    ["&text=", [yandexInfo]],
    ["p=", [yahooInfo]],
    ["20230000000000*/", [archiveWayBackMachineInfo]],
    ["search?query=", [archiveIsInfo]],
    ["baidu&wd=", [baiduInfo]],
    ["web?query=", [sogouInfo, swisscowsInfo]],
    ["input?i=", [wolframalphaInfo]],
]);
export const queryKeyWords = Array.from(searchEngineSerpInfos.keys());
