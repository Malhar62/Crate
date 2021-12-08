import { put, takeLatest, takeEvery } from "redux-saga/effects";
import { Api } from "./Api";
import { FETCH_SUCCEDED, FETCH_FAILED, FETCH_NEWS } from "../Constants";

function* fetchPosts(action) {
    // try {
    //     const recievedPosts = yield Api.postApi(action.category);//recievedPosts.posts1 and recievedPosts.posts2
    //     yield put({ type: FETCH_SUCCEDED, recievedPosts: recievedPosts });
    // } catch (error) {
    //     yield put({ type: FETCH_FAILED, error });
    // }
    const json = yield fetch(`https://newsapi.org/v2//top-headlines?country=in&apiKey=cab817200f92426bacb4edd2373e82ef&category=${action.category}`)
        .then(response => response.json());
    console.log(json.status)
    yield put({ type: "FETCH_SUCCEDED", recievedPosts: json.articles });
}

export function* watchFetchGet() {
    yield takeLatest(FETCH_NEWS, fetchPosts);
}