export const Api = {
    postApi
}
function* postApi(category) {
    const res = yield fetch(`https://newsapi.org/v2//top-headlines?country=in&apiKey=cab817200f92426bacb4edd2373e82ef&category=${category}`)
        .then(response => response.json())
    console.log(res.articles)
    const newslist = yield res.articles > 0 ? res.articles : []
    return newslist;
}